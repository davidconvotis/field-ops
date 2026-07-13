export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('Contract: POST /orders/:orderId/cancel (003-dispatcher-orders-ui FR-025/FR-026)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher cancela orden no terminal con motivo -> 200 cancelada', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'sin_asignar' });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Cliente canceló el pedido', expectedVersion: 0 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelada');
    expect(res.body.cancellationReason).toBe('Cliente canceló el pedido');
    expectDocumentedStatus(doc, 'cancelOrder', 200);
  });

  test('sin motivo -> 400', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'sin_asignar' });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: '   ', expectedVersion: 0 });

    expect(res.status).toBe(400);
    expectDocumentedStatus(doc, 'cancelOrder', 400);
  });

  test('orden ya en estado terminal -> 422', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'rechazada' });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'motivo', expectedVersion: 0 });

    expect(res.status).toBe(422);
    expectDocumentedStatus(doc, 'cancelOrder', 422);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).post('/api/v1/orders/x/cancel').send({ reason: 'x' });
    expect(res.status).toBe(401);
  });
});
