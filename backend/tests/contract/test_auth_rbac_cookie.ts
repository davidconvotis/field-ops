export {};
const request = require('supertest');
const { app } = require('./setup');
const { createUser, createOrder, TEST_PASSWORD, ORDER_STATUS } = require('../helpers/fixtures');

describe('Contract: RBAC de doble capa con sesión por cookie (US3, FR-008)', () => {
  test('cookie access_token de rol tecnico -> 403 en POST /orders/{id}/approve (reservado a supervisor)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    const agent = request.agent(app);
    const loginRes = await agent.post('/api/v1/auth/login').send({ email: tech.email, password: TEST_PASSWORD });
    expect(loginRes.status).toBe(200);

    const res = await agent.post(`/api/v1/orders/${order.id}/approve`).send({});
    expect(res.status).toBe(403);
  });

  test('sin cookie/header -> 401 en endpoint protegido', async () => {
    const { user: client } = await createUser('cliente');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app).get(`/api/v1/orders/${order.id}`);
    expect(res.status).toBe(401);
  });
});
