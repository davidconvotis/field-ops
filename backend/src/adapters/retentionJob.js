const cron = require('node-cron');
const { prisma } = require('../db/prismaClient');
const storageAdapter = require('./storageAdapter');

/**
 * NFR-04c: retención de 12 meses para fotos de evidencia, con borrado automático
 * posterior. El blob se purga (storageKey -> null); la fila de AuditLogEntry y de
 * EvidencePhoto en sí NO se borran — conservan la traza de que la transición/evidencia
 * existió, per NFR-04 (retención mínima de auditoría), solo el contenido sensible se elimina.
 */
async function purgeExpiredPhotos(now = new Date()) {
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

function scheduleRetentionJob() {
  return cron.schedule('0 3 * * *', () => {
    purgeExpiredPhotos().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('retentionJob falló:', err);
    });
  });
}

module.exports = { purgeExpiredPhotos, scheduleRetentionJob };
