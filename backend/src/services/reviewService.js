const { prisma } = require('../db/prismaClient');
const { optimisticUpdateOrder } = require('./orderLock');
const { recordAuditEntry } = require('./auditService');
const { ORDER_STATUS, AUDIT_ACTIONS } = require('../constants');

class HttpError extends Error {
  constructor(status, publicMessage, extra) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
    Object.assign(this, extra);
  }
}

/**
 * FR-016/FR-016b: intenta la transición con optimistic lock. Si pierde la carrera
 * (0 filas afectadas), registra `conflicto_concurrente` para la transacción
 * perdedora y responde 409 con el estado final real. Compartido por approve/reject
 * porque ambos son "resolver" una orden pendiente_de_revision con acciones opuestas.
 */
async function resolveOrder({ orderId, supervisorId, targetStatus, action, extraData = {} }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new HttpError(404, 'orden no encontrada');

  if (order.status !== ORDER_STATUS.PENDIENTE_DE_REVISION) {
    throw new HttpError(409, 'orden ya no está en pendiente_de_revision (no-op)', { currentStatus: order.status });
  }

  let conflict = null;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const applied = await optimisticUpdateOrder(tx, {
        orderId,
        expectedVersion: order.version,
        data: { status: targetStatus, resolvedAt: new Date(), resolvedByUserId: supervisorId, ...extraData },
      });

      if (!applied) {
        // No throw aquí: lanzar dentro de $transaction revertiría también el audit
        // log del conflicto. Se registra fuera, en su propia transacción atómica.
        const current = await tx.order.findUnique({ where: { id: orderId } });
        conflict = current;
        return null;
      }

      await recordAuditEntry(tx, { orderId, actorUserId: supervisorId, action });
      return tx.order.findUnique({ where: { id: orderId } });
    });

    if (conflict) {
      await prisma.$transaction(async (tx) => {
        await recordAuditEntry(tx, {
          orderId,
          actorUserId: supervisorId,
          action: AUDIT_ACTIONS.CONFLICTO_CONCURRENTE,
          metadata: { intento: action, estadoFinal: conflict.status },
        });
      });
      throw new HttpError(409, 'orden ya no está en pendiente_de_revision (no-op)', { currentStatus: conflict.status });
    }

    return result;
  } catch (err) {
    if (err.name === 'AuditUnavailableError') throw new HttpError(503, 'servicio de auditoría no disponible');
    throw err;
  }
}

// FR-013/FR-016/FR-016b
async function approve({ orderId, supervisorId }) {
  return resolveOrder({ orderId, supervisorId, targetStatus: ORDER_STATUS.APROBADA, action: AUDIT_ACTIONS.APROBAR });
}

// FR-014/FR-015/FR-016/FR-016b
async function reject({ orderId, supervisorId, reason }) {
  const trimmedReason = (reason || '').trim();
  if (!trimmedReason) throw new HttpError(400, 'motivo de rechazo obligatorio y no vacío');

  return resolveOrder({
    orderId,
    supervisorId,
    targetStatus: ORDER_STATUS.RECHAZADA,
    action: AUDIT_ACTIONS.RECHAZAR,
    extraData: { rejectionReason: trimmedReason },
  });
}

module.exports = { approve, reject, HttpError };
