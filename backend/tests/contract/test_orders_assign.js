const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('Contract: PATCH /orders/{orderId}/assign', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher asigna técnico activo -> 200', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 0 });

    expect(res.status).toBe(200);
    expect(res.body.technicianId).toBe(tech.id);
    expectDocumentedStatus(doc, 'assignOrder', 200);
  });
});
