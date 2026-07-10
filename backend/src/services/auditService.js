const { addMonths, RETENTION_MONTHS } = require('../constants');

class AuditUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuditUnavailableError';
  }
}

/**
 * NFR-04/04b: escribe la entrada de auditoría DENTRO de la misma transacción `tx`
 * que el cambio de estado que registra. Si esto falla, el caller debe dejar que
 * la transacción completa haga rollback (nunca aplicar el cambio sin su auditoría).
 */
async function recordAuditEntry(tx, { orderId, actorUserId, action, metadata }) {
  if (process.env.AUDIT_SIMULATE_FAILURE === 'true') {
    throw new AuditUnavailableError('audit log no disponible (simulado)');
  }
  return tx.auditLogEntry.create({
    data: {
      orderId,
      actorUserId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
      retentionExpiresAt: addMonths(new Date(), RETENTION_MONTHS),
    },
  });
}

module.exports = { recordAuditEntry, AuditUnavailableError };
