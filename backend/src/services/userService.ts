import type { PrismaClient, User } from '@prisma/client';

const { prisma } = require('../db/prismaClient') as { prisma: PrismaClient };
const { recordAuditEntry } = require('./auditService');
const { ROLES, ORDER_STATUS, AUDIT_ACTIONS } = require('../constants');

class HttpError extends Error {
  status: number;
  publicMessage: string;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

interface SetTechnicianActiveParams {
  technicianId: string;
  activo: boolean;
  dispatcherId: string;
}

interface CreateTechnicianParams {
  nombre: string;
  email: string;
}

interface UpdateTechnicianParams {
  technicianId: string;
  nombre?: string;
  email?: string;
}

// Duck-typed en vez de `instanceof Prisma.PrismaClientKnownRequestError`: el cliente
// de test (SQLite, src/generated/prisma-test-client) y el de producción (@prisma/client)
// son paquetes generados por separado — ver misma nota en clientService.ts.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002';
}

function handleEmailConflict(err: unknown): never {
  if (isUniqueConstraintError(err)) {
    throw new HttpError(409, 'email ya registrado por otro usuario');
  }
  throw err;
}

// FR-019
async function createTechnician({ nombre, email }: CreateTechnicianParams): Promise<User> {
  try {
    return await prisma.user.create({
      data: { role: ROLES.TECNICO, nombre, email, activo: true, passwordHash: '' },
    });
  } catch (err: unknown) {
    return handleEmailConflict(err);
  }
}

// FR-020
async function updateTechnician({ technicianId, nombre, email }: UpdateTechnicianParams): Promise<User> {
  const technician = await prisma.user.findUnique({ where: { id: technicianId } });
  if (!technician || technician.role !== ROLES.TECNICO) throw new HttpError(404, 'técnico no encontrado');

  try {
    const data: Record<string, unknown> = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (email !== undefined) data.email = email;
    return await prisma.user.update({ where: { id: technicianId }, data });
  } catch (err: unknown) {
    return handleEmailConflict(err);
  }
}

interface ListTechniciansParams {
  activo?: boolean;
  page?: number;
}

interface TechnicianSummary {
  id: string;
  nombre: string;
  activo: boolean;
  activeOrderCount: number;
}

interface PaginatedTechnicians {
  items: TechnicianSummary[];
  page: number;
  pageSize: number;
  total: number;
}

// FR-004d: al desactivar un técnico, sus órdenes en curso vuelven a sin_asignar.
async function setTechnicianActive({ technicianId, activo, dispatcherId }: SetTechnicianActiveParams): Promise<User> {
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
  } catch (err: unknown) {
    if ((err as Error).name === 'AuditUnavailableError') throw new HttpError(503, 'servicio de auditoría no disponible');
    throw err;
  }
}

const TECHNICIANS_PAGE_SIZE = 50;

// 003-dispatcher-orders-ui FR-011/FR-012/FR-014: listado paginado de técnicos con
// activeOrderCount derivado (agregación, sin N+1 — research.md §4).
async function listTechnicians({ activo, page }: ListTechniciansParams): Promise<PaginatedTechnicians> {
  const where: Record<string, unknown> = { role: ROLES.TECNICO };
  if (typeof activo === 'boolean') where.activo = activo;

  const currentPage = Number.isInteger(page) && (page as number) >= 1 ? (page as number) : 1;

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

export = { setTechnicianActive, listTechnicians, createTechnician, updateTechnician, HttpError };
