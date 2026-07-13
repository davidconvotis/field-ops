export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

describe('US3 escenarios 1-3', () => {
  test('escenario 1: aprobar registra supervisor y timestamp', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { user: supervisor, token } = await createUser('supervisor');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    const res = await request(app).post(`/api/v1/orders/${order.id}/approve`).set('Authorization', `Bearer ${token}`).send({});

    expect(res.status).toBe(200);
    expect(res.body.resolvedByUserId).toBe(supervisor.id);
    expect(res.body.resolvedAt).not.toBeNull();
  });

  test('escenario 2: rechazar con motivo válido (trim)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('supervisor');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/reject`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: '  motivo con espacios  ' });

    expect(res.status).toBe(200);
    expect(res.body.rejectionReason).toBe('motivo con espacios');
  });

  test('escenario 3a: motivo solo espacios -> 400', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('supervisor');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/reject`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: '    ' });

    expect(res.status).toBe(400);
  });

  test('escenario 3b: no-op sobre orden ya resuelta -> 409', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('supervisor');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.APROBADA });

    const res = await request(app).post(`/api/v1/orders/${order.id}/approve`).set('Authorization', `Bearer ${token}`).send({});

    expect(res.status).toBe(409);
    expect(res.body.status).toBe(ORDER_STATUS.APROBADA);
  });
});
