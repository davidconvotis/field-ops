import type { User } from '@prisma/client';

const bcrypt = require('bcrypt');
const { prisma } = require('../src/db/prismaClient');
const { issueDevToken } = require('../src/adapters/idpAdapter');
const { ROLES } = require('../src/constants');

const SEED_PASSWORD = 'Seed1234!';

async function main(): Promise<void> {
  const passwordHash: string = await bcrypt.hash(SEED_PASSWORD, 10);

  const users: User[] = await Promise.all(
    Object.values(ROLES as Record<string, string>).map((role: string) =>
      prisma.user.upsert({
        where: { email: `${role}@fieldops.dev` },
        update: {},
        create: { role, nombre: `Usuario ${role}`, email: `${role}@fieldops.dev`, passwordHash },
      }),
    ),
  );

  // 003-dispatcher-orders-ui quickstart.md Escenario 1: datos suficientes para
  // validar manualmente la paginación (>50 órdenes, ≥3 técnicos con uno inactivo).
  const client = users.find((u) => u.role === ROLES.CLIENTE);
  const technicians: User[] = await Promise.all(
    Array.from({ length: 3 }, (_, i) =>
      prisma.user.upsert({
        where: { email: `tecnico-demo-${i}@fieldops.dev` },
        update: {},
        create: {
          role: ROLES.TECNICO,
          nombre: `Técnico Demo ${i}`,
          email: `tecnico-demo-${i}@fieldops.dev`,
          passwordHash,
          activo: i !== 2, // el tercero queda inactivo
        },
      }),
    ),
  );

  const existingOrders: number = await prisma.order.count();
  if (existingOrders < 55) {
    await Promise.all(
      Array.from({ length: 55 - existingOrders }, (_, i) =>
        prisma.order.create({
          data: {
            clientId: client!.id,
            technicianId: i % 3 === 0 ? technicians[0].id : null,
            status: i % 3 === 0 ? 'pendiente_de_revision' : 'sin_asignar',
          },
        }),
      ),
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seed completo. Password de login para todos: ${SEED_PASSWORD}`);
  // eslint-disable-next-line no-console
  console.log('Tokens de dev (12h, uso interno/API directa):');
  users.forEach((u) => {
    const token: string = issueDevToken({ userId: u.id, role: u.role });
    // eslint-disable-next-line no-console
    console.log(`  ${u.role.padEnd(11)} -> ${token}`);
  });
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
