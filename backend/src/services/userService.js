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

const TECHNICIANS_PAGE_SIZE = 50;

// 003-dispatcher-orders-ui FR-011/FR-012/FR-014: listado paginado de técnicos con
// activeOrderCount derivado (agregación, sin N+1 — research.md §4).
async function listTechnicians({ activo, page }) {
  const where = { role: ROLES.TECNICO };
  if (typeof activo === 'boolean') where.activo = activo;

  const currentPage = Number.isInteger(page) && page >= 1 ? page : 1;

  const [technicians, total, counts] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (currentPage - 1) * TECHNICIANS_PAGE_SIZE,
      take: TECHNICIANS_PAGE_SIZE,
      orderBy: { nombre: 'asc' },
    }),
    prisma.user.count({ where }),
    prisma.order.groupBy({
      by: ['technicianId'],
      where: { status: ORDER_STATUS.PENDIENTE_DE_REVISION, technicianId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const countByTechnicianId = new Map(counts.map((c) => [c.technicianId, c._count._all]));

  return {
    items: technicians.map((tech) => ({
      id: tech.id,
      nombre: tech.nombre,
      activo: tech.activo,
      activeOrderCount: countByTechnicianId.get(tech.id) || 0,
    })),
    page: currentPage,
    pageSize: TECHNICIANS_PAGE_SIZE,
    total,
  };
}

module.exports = { setTechnicianActive, listTechnicians, HttpError };
