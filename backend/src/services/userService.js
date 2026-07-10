const { prisma } = require('../db/prismaClient');
const { recordAuditEntry } = require('./auditService');
const { ROLES, ORDER_STATUS, AUDIT_ACTIONS } = require('../constants');

class HttpError extends Error {
  constructor(status, publicMessage) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

// FR-004d: al desactivar un técnico, sus órdenes en curso vuelven a sin_asignar.
async function setTechnicianActive({ technicianId, activo, dispatcherId }) {
  const technician = await prisma.user.findUnique({ where: { id: technicianId } });
  if (!technician || technician.role !== ROLES.TECNICO) throw new HttpError(404, 'técnico no encontrado');

  try {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({ where: { id: technicianId }, data: { activo } });

      if (activo === false) {
        const affectedOrders = await tx.order.findMany({
          where: {
            technicianId,
            status: { in: [ORDER_STATUS.SIN_ASIGNAR, ORDER_STATUS.PENDIENTE_DE_REVISION] },
          },
        });
        for (const order of affectedOrders) {
          await tx.order.update({
            where: { id: order.id },
            data: { technicianId: null, status: ORDER_STATUS.SIN_ASIGNAR, version: { increment: 1 } },
          });
          await recordAuditEntry(tx, {
            orderId: order.id,
            actorUserId: dispatcherId,
            action: AUDIT_ACTIONS.DESACTIVAR_TECNICO_REASIGNA,
            metadata: { technicianId },
          });
        }
      }
      return updated;
    });
  } catch (err) {
    if (err.name === 'AuditUnavailableError') throw new HttpError(503, 'servicio de auditoría no disponible');
    throw err;
  }
}

module.exports = { setTechnicianActive, HttpError };
