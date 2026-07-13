const { prisma } = require('../src/db/prismaClient');

// Borra todos los datos de la BD de dev (respeta FKs: hijos antes que padres).
// No toca el schema/migraciones — solo filas. Usar seed.js después para repoblar.
async function main(): Promise<void> {
  await prisma.revokedRefreshToken.deleteMany();
  await prisma.evidencePhoto.deleteMany();
  await prisma.auditLogEntry.deleteMany();
  await prisma.executionRecord.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // eslint-disable-next-line no-console
  console.log('BD limpia.');
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
