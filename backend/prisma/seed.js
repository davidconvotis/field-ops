const { prisma } = require('../src/db/prismaClient');
const { issueDevToken } = require('../src/adapters/idpAdapter');
const { ROLES } = require('../src/constants');

async function main() {
  const users = await Promise.all(
    Object.values(ROLES).map((role) =>
      prisma.user.upsert({
        where: { email: `${role}@fieldops.dev` },
        update: {},
        create: { role, nombre: `Usuario ${role}`, email: `${role}@fieldops.dev` },
      }),
    ),
  );

  // eslint-disable-next-line no-console
  console.log('Seed completo. Tokens de dev (12h):');
  users.forEach((u) => {
    const token = issueDevToken({ userId: u.id, role: u.role });
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
