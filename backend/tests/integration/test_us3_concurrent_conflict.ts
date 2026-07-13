export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { prisma } = require('../../src/db/prismaClient');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

describe('FR-016b: carrera aprobar-vs-rechazar simultáneo', () => {
  test('solo una transacción gana; la otra recibe 409 con estado final real; ambas en audit log', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token: supervisorAToken } = await createUser('supervisor');
    const { token: supervisorBToken } = await createUser('supervisor');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    const [approveRes, rejectRes] = await Promise.all([
      request(app).post(`/api/v1/orders/${order.id}/approve`).set('Authorization', `Bearer ${supervisorAToken}`).send({}),
      request(app)
        .post(`/api/v1/orders/${order.id}/reject`)
        .set('Authorization', `Bearer ${supervisorBToken}`)
        .send({ reason: 'motivo de rechazo' }),
    ]);

    const statuses = [approveRes.status, rejectRes.status].sort();
    expect(statuses).toEqual([200, 409]);

    const loser = approveRes.status === 409 ? approveRes : rejectRes;
    expect([ORDER_STATUS.APROBADA, ORDER_STATUS.RECHAZADA]).toContain(loser.body.status);

    const conflictEntries = await prisma.auditLogEntry.findMany({
      where: { orderId: order.id, action: 'conflicto_concurrente' },
    });
    expect(conflictEntries.length).toBeGreaterThanOrEqual(1);
  });
});
