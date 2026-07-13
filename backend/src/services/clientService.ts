import type { PrismaClient, User } from '@prisma/client';

const { prisma } = require('../db/prismaClient') as { prisma: PrismaClient };
const { ROLES } = require('../constants');

class HttpError extends Error {
  status: number;
  publicMessage: string;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

// Duck-typed en vez de `instanceof Prisma.PrismaClientKnownRequestError`: el cliente
// de test (SQLite, src/generated/prisma-test-client) y el de producción (@prisma/client)
// son paquetes generados por separado — sus clases de error no comparten identidad, por
// lo que `instanceof` contra el import de '@prisma/client' falla en el entorno de test.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002';
}

function handleEmailConflict(err: unknown): never {
  if (isUniqueConstraintError(err)) {
    throw new HttpError(409, 'email ya registrado por otro usuario');
  }
  throw err;
}

interface CreateClientParams {
  nombre: string;
  email: string;
}

interface UpdateClientParams {
  clientId: string;
  nombre?: string;
  email?: string;
}

interface SetClientActiveParams {
  clientId: string;
  activo: boolean;
}

interface SearchClientsParams {
  q?: string;
  page?: number;
}

interface ClientSummary {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

interface PaginatedClients {
  items: ClientSummary[];
  page: number;
  pageSize: number;
  total: number;
}

const CLIENTS_PAGE_SIZE = 50;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toClientSummary(user: User): ClientSummary {
  return { id: user.id, nombre: user.nombre, email: user.email, activo: user.activo };
}

// FR-015
async function createClient({ nombre, email }: CreateClientParams): Promise<ClientSummary> {
  try {
    const user = await prisma.user.create({
      data: { role: ROLES.CLIENTE, nombre, email, activo: true, passwordHash: '' },
    });
    return toClientSummary(user);
  } catch (err: unknown) {
    return handleEmailConflict(err);
  }
}

// FR-016
async function updateClient({ clientId, nombre, email }: UpdateClientParams): Promise<ClientSummary> {
  const client = await prisma.user.findUnique({ where: { id: clientId } });
  if (!client || client.role !== ROLES.CLIENTE) throw new HttpError(404, 'cliente no encontrado');

  try {
    const data: Record<string, unknown> = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (email !== undefined) data.email = email;
    const updated = await prisma.user.update({ where: { id: clientId }, data });
    return toClientSummary(updated);
  } catch (err: unknown) {
    return handleEmailConflict(err);
  }
}

// FR-017: baja lógica, sin excepción (clarify ronda 2) — no altera órdenes existentes del cliente.
async function setClientActive({ clientId, activo }: SetClientActiveParams): Promise<ClientSummary> {
  const client = await prisma.user.findUnique({ where: { id: clientId } });
  if (!client || client.role !== ROLES.CLIENTE) throw new HttpError(404, 'cliente no encontrado');

  const updated = await prisma.user.update({ where: { id: clientId }, data: { activo } });
  return toClientSummary(updated);
}

// FR-021: búsqueda por cualquier campo (nombre/email/id). research.md §6 — mode:'insensitive'
// no existe en el provider SQLite de test; se condiciona por NODE_ENV.
async function searchClients({ q, page }: SearchClientsParams): Promise<PaginatedClients> {
  const caseInsensitive = process.env.NODE_ENV !== 'test';
  const textMatch = (value: string) =>
    caseInsensitive ? { contains: value, mode: 'insensitive' as const } : { contains: value };

  const where: Record<string, unknown> = { role: ROLES.CLIENTE };
  if (q) {
    const or: Record<string, unknown>[] = [{ nombre: textMatch(q) }, { email: textMatch(q) }];
    if (UUID_RE.test(q)) or.push({ id: q });
    where.OR = or;
  }

  const currentPage = Number.isInteger(page) && (page as number) >= 1 ? (page as number) : 1;

  const [clients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (currentPage - 1) * CLIENTS_PAGE_SIZE,
      take: CLIENTS_PAGE_SIZE,
      orderBy: { nombre: 'asc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: clients.map(toClientSummary),
    page: currentPage,
    pageSize: CLIENTS_PAGE_SIZE,
    total,
  };
}

export = { createClient, updateClient, setClientActive, searchClients, HttpError };
