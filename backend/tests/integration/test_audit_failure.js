const { prisma } = require('../../src/db/prismaClient');
const { recordAuditEntry, AuditUnavailableError } = require('../../src/services/auditService');
const { ROLES, ORDER_STATUS, AUDIT_ACTIONS } = require('../../src/constants');

describe('NFR-04b: fallo de auditService -> rollback completo del cambio de estado', () => {
  let client;
  let order;

  beforeEach(async () => {
    client = await prisma.user.create({ data: { role: ROLES.CLIENTE, nombre: 'Cliente Test', email: `c-${Date.now()}@test.dev` } });
    order = await prisma.order.create({ data: { clientId: client.id, status: ORDER_STATUS.SIN_ASIGNAR } });
  });

  afterEach(() => {
    delete process.env.AUDIT_SIMULATE_FAILURE;
  });

  test('audit log en verde -> cambio de estado se aplica', async () => {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: order.id }, data: { status: ORDER_STATUS.PENDIENTE_DE_REVISION } });
      await recordAuditEntry(tx, { orderId: order.id, actorUserId: client.id, action: AUDIT_ACTIONS.ENVIAR_EJECUCION });
    });
    const reloaded = await prisma.order.findUnique({ where: { id: order.id } });
    expect(reloaded.status).toBe(ORDER_STATUS.PENDIENTE_DE_REVISION);
    const entries = await prisma.auditLogEntry.findMany({ where: { orderId: order.id } });
    expect(entries).toHaveLength(1);
  });

  test('fallo simulado de audit log -> transacción completa hace rollback, orden no cambia', async () => {
    process.env.AUDIT_SIMULATE_FAILURE = 'true';

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.order.update({ where: { id: order.id }, data: { status: ORDER_STATUS.PENDIENTE_DE_REVISION } });
        await recordAuditEntry(tx, { orderId: order.id, actorUserId: client.id, action: AUDIT_ACTIONS.ENVIAR_EJECUCION });
      }),
    ).rejects.toThrow(AuditUnavailableError);

    const reloaded = await prisma.order.findUnique({ where: { id: order.id } });
    expect(reloaded.status).toBe(ORDER_STATUS.SIN_ASIGNAR); // sin cambios — rollback completo
    const entries = await prisma.auditLogEntry.findMany({ where: { orderId: order.id } });
    expect(entries).toHaveLength(0);
  });
});
