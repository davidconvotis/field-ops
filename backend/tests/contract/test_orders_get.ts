export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('Contract: GET /orders/{orderId}', () => {
  const doc = loadOpenApiDoc();

  test('dueño consulta su orden -> 200', async () => {
    const { user: client, token } = await createUser('cliente');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app).get(`/api/v1/orders/${order.id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expectDocumentedStatus(doc, 'getOrder', 200);
  });

  test('orderId inexistente -> 404 (FR-019, uniforme, no filtra existencia)', async () => {
    const { token } = await createUser('cliente');
    const res = await request(app).get('/api/v1/orders/no-existe-id').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expectDocumentedStatus(doc, 'getOrder', 404);
  });
});
