export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { prisma } = require('../../src/db/prismaClient');
const { createUser, createOrder, fakePngBuffer, ORDER_STATUS } = require('../helpers/fixtures');

describe('US1 escenario 1: envío válido de ejecución', () => {
  test('transiciona a pendiente_de_revision y registra timestamp', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.SIN_ASIGNAR });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/executions`)
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', 'us1-key-1')
      .field('notes', 'Se reemplazó la pieza defectuosa y se probó el equipo.')
      .attach('photos', fakePngBuffer(), 'foto1.png');

    expect(res.status).toBe(201);

    const reloaded = await prisma.order.findUnique({ where: { id: order.id } });
    expect(reloaded.status).toBe(ORDER_STATUS.PENDIENTE_DE_REVISION);
    expect(reloaded.submittedAt).not.toBeNull();

    const entries = await prisma.auditLogEntry.findMany({ where: { orderId: order.id } });
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });
});
