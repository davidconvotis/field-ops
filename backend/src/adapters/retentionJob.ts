export {};

const cron = require('node-cron');
const { prisma } = require('../db/prismaClient');
const storageAdapter = require('./storageAdapter');

/**
 * NFR-04c: retención de 12 meses para fotos de evidencia, con borrado automático
 * posterior. El blob se purga (storageKey -> null); la fila de AuditLogEntry y de
 * EvidencePhoto en sí NO se borran — conservan la traza de que la transición/evidencia
 * existió, per NFR-04 (retención mínima de auditoría), solo el contenido sensible se elimina.
 */
async function purgeExpiredPhotos(now: Date = new Date()): Promise<number> {
  const expired = await prisma.evidencePhoto.findMany({
    where: { retentionExpiresAt: { lte: now }, storageKey: { not: null } },
  });

  let purged = 0;
  for (const photo of expired) {
    await storageAdapter.remove(photo.storageKey).catch(() => {});
    await prisma.evidencePhoto.update({ where: { id: photo.id }, data: { storageKey: null } });
    purged += 1;
  }
  return purged;
}

// 002-login-rbac Research §3: filas de RevokedRefreshToken solo necesitan existir
// mientras el refresh token que denegarían pudiera seguir siendo válido; una vez
// vencido (expiresAt <= now) el propio JWT ya sería rechazado por firma/expiración,
// así que la fila de denylist puede purgarse sin perder cobertura de seguridad.
async function purgeExpiredRevokedTokens(now: Date = new Date()): Promise<number> {
  const { count } = await prisma.revokedRefreshToken.deleteMany({ where: { expiresAt: { lte: now } } });
  return count;
}

function scheduleRetentionJob() {
  return cron.schedule('0 3 * * *', () => {
    purgeExpiredPhotos().catch((err: Error) => {
      // eslint-disable-next-line no-console
      console.error('retentionJob falló:', err);
    });
    purgeExpiredRevokedTokens().catch((err: Error) => {
      // eslint-disable-next-line no-console
      console.error('purgeExpiredRevokedTokens falló:', err);
    });
  });
}

module.exports = { purgeExpiredPhotos, purgeExpiredRevokedTokens, scheduleRetentionJob };
