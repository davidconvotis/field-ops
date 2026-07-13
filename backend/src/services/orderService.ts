import type { PrismaClient, Order, User, UserRole, OrderStatus } from '@prisma/client';

const { prisma } = require('../db/prismaClient') as { prisma: PrismaClient };
const { optimisticUpdateOrder } = require('./orderLock');
const { recordAuditEntry } = require('./auditService');
const { ROLES, ORDER_STATUS, TERMINAL_STATUSES, AUDIT_ACTIONS } = require('../constants');

class HttpError extends Error {
  status: number;
  publicMessage: string;
  currentStatus?: OrderStatus;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

interface CreateOrderParams {
  clientId: string;
  dispatcherId: string;
}

interface AssignTechnicianParams {
  orderId: string;
  technicianId: string;
  expectedVersion?: number;
  dispatcherId: string;
}

interface ListForRoleParams {
  role: UserRole;
  userId: string;
  status?: OrderStatus;
  technicianId?: string;
  page?: number;
}

interface GetByIdForRoleParams {
  orderId: string;
  role: UserRole;
  userId: string;
}

interface OrderSummary extends Order {
  clientNombre: string;
  technicianNombre: string | null;
}

interface PaginatedOrders {
  items: OrderSummary[];
  page: number;
  pageSize: number;
  total: number;
}

// FR-001
async function createOrder({ clientId, dispatcherId }: CreateOrderParams): Promise<Order> {
  const client = await prisma.user.findUnique({ where: { id: clientId } });
  if (!client || client.role !== ROLES.CLIENTE) throw new HttpError(422, 'clientId inexistente o no es un cliente');

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: { clientId, status: ORDER_STATUS.SIN_ASIGNAR } });
    await recordAuditEntry(tx, { orderId: order.id, actorUserId: dispatcherId, action: AUDIT_ACTIONS.CREAR });
    return order;
  });
}

// FR-002/FR-003/FR-004/FR-003 (carrera, ver Research §6)
async function assignTechnician({ orderId, technicianId, expectedVersion, dispatcherId }: AssignTechnicianParams): Promise<Order | null> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new HttpError(404, 'orden no encontrada');

  if (TERMINAL_STATUSES.includes(order.status)) {
    throw new HttpError(422, 'orden en estado terminal, no se puede reasignar');
  }

  const technician = await prisma.user.findUnique({ where: { id: technicianId } });
  if (!technician || technician.role !== ROLES.TECNICO || !technician.activo) {
    throw new HttpError(422, 'tecnicoId inexistente o inactivo');
  }

  const previousTechnicianId = order.technicianId;
  const action = previousTechnicianId ? AUDIT_ACTIONS.REASIGNAR : AUDIT_ACTIONS.ASIGNAR;

  try {
    return await prisma.$transaction(async (tx) => {
      const applied = await optimisticUpdateOrder(tx, {
        orderId,
        expectedVersion: expectedVersion ?? order.version,
        data: { technicianId, assignedAt: new Date() },
      });
      if (!applied) {
        const current = await tx.order.findUnique({ where: { id: orderId } });
        const err = new HttpError(409, 'la orden cambió de estado entre la lectura y el intento de reasignación');
        err.currentStatus = current!.status;
        throw err;
      }
      await recordAuditEntry(tx, {
        orderId,
        actorUserId: dispatcherId,
        action,
        metadata: { technicianAnterior: previousTechnicianId, technicianNuevo: technicianId },
      });
      return tx.order.findUnique({ where: { id: orderId } });
    });
  } catch (err: unknown) {
    if ((err as Error).name === 'AuditUnavailableError') throw new HttpError(503, 'servicio de auditoría no disponible');
    throw err;
  }
}

const ORDERS_PAGE_SIZE = 50;

// FR-017/FR-018 + 003-dispatcher-orders-ui FR-001/FR-002a/FR-014: scope por rol
// PRIMERO, luego filtro opcional status/technicianId (AND), paginado (tamaño fijo),
// con nombre de cliente/técnico incluido para listados legibles (research.md §3).
async function listForRole({ role, userId, status, technicianId, page }: ListForRoleParams): Promise<PaginatedOrders> {
  const scopeWhere =
    role === ROLES.CLIENTE ? { clientId: userId } : role === ROLES.TECNICO ? { technicianId: userId } : {};

  const where: Record<string, unknown> = { ...scopeWhere };
  if (status) where.status = status;
  if (technicianId) where.technicianId = technicianId;

  const currentPage = Number.isInteger(page) && (page as number) >= 1 ? (page as number) : 1;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { client: true, technician: true },
      skip: (currentPage - 1) * ORDERS_PAGE_SIZE,
      take: ORDERS_PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items: items.map(({ client, technician, ...order }: Order & { client: User; technician: User | null }) => ({
      ...order,
      clientNombre: client.nombre,
      technicianNombre: technician ? technician.nombre : null,
    })),
    page: currentPage,
    pageSize: ORDERS_PAGE_SIZE,
    total,
  };
}

// FR-019: verificación consistente de autorización + existencia (no filtra existencia)
async function getByIdForRole({ orderId, role, userId }: GetByIdForRoleParams) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { executionRecord: true } });
  const hasBroadAccess = role === ROLES.DISPATCHER || role === ROLES.SUPERVISOR;
  const hasNarrowAccess =
    (role === ROLES.CLIENTE && order && order.clientId === userId) ||
    (role === ROLES.TECNICO && order && order.technicianId === userId);

  if (!order) {
    // El rol podría en teoría acceder a este tipo de ruta -> 404 (no revela más).
    throw new HttpError(404, 'orden no encontrada');
  }
  if (!hasBroadAccess && !hasNarrowAccess) {
    // Un cliente/técnico sin relación con esta orden: mismo 404 que "no existe" para
    // no filtrar existencia (FR-019). Dispatcher/supervisor con acceso amplio ya pasaron arriba.
    throw new HttpError(404, 'orden no encontrada');
  }
  return order;
}

export = { createOrder, assignTechnician, listForRole, getByIdForRole, HttpError };
