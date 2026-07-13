export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { prisma } = require('../../src/db/prismaClient');
const { createUser, createOrder, fakePngBuffer, ORDER_STATUS } = require('../helpers/fixtures');

describe('NFR-06b: fallo/timeout del storageAdapter durante subida de foto', () => {
  afterEach(() => {
    delete process.env.STORAGE_SIMULATE_FAILURE;
  });

  test('storage no disponible -> 502, orden nunca marcada pendiente_de_revision', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });

    process.env.STORAGE_SIMULATE_FAILURE = 'true';
    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/executions`)
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', 'storage-fail-1')
      .field('notes', 'notas válidas')
      .attach('photos', fakePngBuffer(), 'foto.png');

    expect(res.status).toBe(502);
    const reloaded = await prisma.order.findUnique({ where: { id: order.id } });
    expect(reloaded.status).toBe(ORDER_STATUS.SIN_ASIGNAR);
    const records = await prisma.executionRecord.findMany({ where: { orderId: order.id } });
    expect(records).toHaveLength(0);
  });
});
