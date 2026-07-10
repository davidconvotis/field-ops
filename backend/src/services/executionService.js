const crypto = require('crypto');
const { prisma } = require('../db/prismaClient');
const { detectRealMimeType } = require('./fileValidation');
const { encryptBuffer } = require('../adapters/encryptionAdapter');
const storageAdapter = require('../adapters/storageAdapter');
const { recordAuditEntry } = require('./auditService');
const { ORDER_STATUS, TERMINAL_STATUSES, AUDIT_ACTIONS, MAX_PHOTO_SIZE_BYTES, RETENTION_MONTHS, addMonths } = require('../constants');

class HttpError extends Error {
  constructor(status, publicMessage) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

function computePayloadHash({ notes, files }) {
  const hash = crypto.createHash('sha256');
  hash.update(notes);
  for (const f of files) {
    hash.update(crypto.createHash('sha256').update(f.buffer).digest());
  }
  return hash.digest('hex');
}

/**
 * FR-005..FR-012b: registro de ejecución con evidencia.
 * Orquesta: idempotencia -> validaciones (400) -> validación de tipo real (415,
 * todo-o-nada por pre-chequeo antes de persistir nada) -> autorización/estado
 * atómicos en escritura (403/409) -> subida+cifrado de fotos -> transacción
 * DB (ExecutionRecord + EvidencePhoto + transición de estado + audit log).
 */
async function submitExecution({ orderId, technicianId, notes, files, idempotencyKey }) {
  if (!idempotencyKey) throw new HttpError(400, 'Idempotency-Key requerido');

  const existing = await prisma.executionRecord.findUnique({ where: { idempotencyKey } });
  const payloadHash = computePayloadHash({ notes: notes || '', files: files || [] });
  if (existing) {
    if (existing.payloadHash === payloadHash) {
      return { status: 200, body: toExecutionResponse(existing) };
    }
    throw new HttpError(409, 'idempotency key ya usado con payload distinto');
  }

  const trimmedNotes = (notes || '').trim();
  if (!trimmedNotes) throw new HttpError(400, 'notas obligatorias, no pueden estar vacías');
  if (!files || files.length === 0) throw new HttpError(400, 'se requiere al menos 1 foto de evidencia');
  for (const f of files) {
    if (f.buffer.length > MAX_PHOTO_SIZE_BYTES) throw new HttpError(400, `foto excede tamaño máximo permitido (${MAX_PHOTO_SIZE_BYTES} bytes)`);
  }

  // Validación de tipo real ANTES de persistir nada: todo-o-nada por diseño (FR-009),
  // nunca se sube ninguna foto si alguna falla, en vez de subir y luego revertir.
  const detectedTypes = files.map((f) => detectRealMimeType(f.buffer));
  if (detectedTypes.some((t) => t === null)) {
    throw new HttpError(415, 'al menos un archivo no es una imagen válida (jpg/png/heic) por contenido');
  }

  // Chequeo atómico de asignación y estado en el momento de escritura (FR-010/FR-011).
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new HttpError(404, 'orden no encontrada');
  if (order.technicianId !== technicianId) {
    throw new HttpError(403, 'la orden no está asignada a este técnico (o fue reasignada)');
  }
  if (TERMINAL_STATUSES.includes(order.status)) {
    throw new HttpError(409, 'orden en estado terminal');
  }

  // Subida + cifrado (NFR-02/02b/06b) — fuera de la transacción DB porque son I/O externo.
  const uploaded = [];
  try {
    for (let i = 0; i < files.length; i += 1) {
      const key = `${orderId}/${idempotencyKey}/${i}-${crypto.randomUUID()}`;
      const encrypted = encryptBuffer(files[i].buffer);
      await storageAdapter.put(key, encrypted);
      uploaded.push({ key, mimeType: detectedTypes[i], sizeBytes: files[i].buffer.length });
    }
  } catch (err) {
    // best-effort cleanup de blobs ya subidos si alguno posterior falla
    await Promise.all(uploaded.map((u) => storageAdapter.remove(u.key).catch(() => {})));
    if (err.name === 'StorageTimeoutError') throw new HttpError(504, 'timeout del almacenamiento de fotos excedido');
    if (err.name === 'StorageUnavailableError') throw new HttpError(502, 'almacenamiento de fotos no disponible');
    if (err.name === 'EncryptionUnavailableError') throw new HttpError(503, 'servicio de cifrado no disponible');
    throw err;
  }

  try {
    const record = await prisma.$transaction(async (tx) => {
      const created = await tx.executionRecord.create({
        data: {
          orderId,
          technicianId,
          notes: trimmedNotes,
          idempotencyKey,
          payloadHash,
          photos: {
            create: uploaded.map((u) => ({
              mimeType: u.mimeType,
              storageKey: u.key,
              sizeBytes: u.sizeBytes,
              retentionExpiresAt: addMonths(new Date(), RETENTION_MONTHS),
            })),
          },
        },
        include: { photos: true },
      });
      await tx.order.update({
        where: { id: orderId },
        data: { status: ORDER_STATUS.PENDIENTE_DE_REVISION, submittedAt: new Date(), version: { increment: 1 } },
      });
      await recordAuditEntry(tx, {
        orderId,
        actorUserId: technicianId,
        action: AUDIT_ACTIONS.ENVIAR_EJECUCION,
        metadata: { executionRecordId: created.id, photoCount: uploaded.length },
      });
      return created;
    });
    return { status: 201, body: toExecutionResponse(record) };
  } catch (err) {
    await Promise.all(uploaded.map((u) => storageAdapter.remove(u.key).catch(() => {})));
    if (err.name === 'AuditUnavailableError') throw new HttpError(503, 'servicio de auditoría no disponible');
    throw err;
  }
}

function toExecutionResponse(record) {
  return {
    id: record.id,
    orderId: record.orderId,
    notes: record.notes,
    submittedAt: record.submittedAt,
    photoCount: record.photos ? record.photos.length : undefined,
  };
}

module.exports = { submitExecution, HttpError };
