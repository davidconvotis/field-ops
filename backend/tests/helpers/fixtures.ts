import type { User } from '@prisma/client';

const bcrypt = require('bcrypt');
const { prisma } = require('../../src/db/prismaClient');
const { issueDevToken } = require('../../src/adapters/idpAdapter');
const { ROLES, ORDER_STATUS } = require('../../src/constants');

let counter = 0;
function uniqueEmail(role: string): string {
  counter += 1;
  return `${role}-${Date.now()}-${counter}@test.dev`;
}

// Contraseña fija de fixtures (002-login-rbac) — hasheada una sola vez y reutilizada
// para no pagar el costo de bcrypt en cada createUser() de las suites de 001.
const TEST_PASSWORD = 'Test1234!';
const TEST_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 10);

async function createUser(
  role: string,
  overrides: Record<string, unknown> = {},
): Promise<{ user: User; token: string }> {
  const user: User = await prisma.user.create({
    data: {
      role,
      nombre: `Test ${role}`,
      email: uniqueEmail(role),
      activo: true,
      passwordHash: TEST_PASSWORD_HASH,
      ...overrides,
    },
  });
  const token = issueDevToken({ userId: user.id, role });
  return { user, token };
}

async function createOrder({
  clientId,
  technicianId = null,
  status = ORDER_STATUS.SIN_ASIGNAR,
}: {
  clientId: string;
  technicianId?: string | null;
  status?: string;
}): Promise<any> {
  return prisma.order.create({ data: { clientId, technicianId, status } });
}

// PNG mínimo válido (8 bytes de firma + resto arbitrario) — suficiente para pasar detectRealMimeType.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
function fakePngBuffer(sizeBytes = 100): Buffer {
  return Buffer.concat([PNG_SIGNATURE, Buffer.alloc(Math.max(0, sizeBytes - PNG_SIGNATURE.length))]);
}

function fakeInvalidBuffer(): Buffer {
  return Buffer.from('esto no es una imagen real');
}

module.exports = {
  createUser,
  createOrder,
  fakePngBuffer,
  fakeInvalidBuffer,
  ROLES,
  ORDER_STATUS,
  TEST_PASSWORD,
  TEST_PASSWORD_HASH,
};
