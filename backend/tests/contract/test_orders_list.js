const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('Contract: GET /orders', () => {
  const doc = loadOpenApiDoc();

  test('cliente lista solo sus órdenes -> 200', async () => {
    const { user: client, token } = await createUser('cliente');
    await createOrder({ clientId: client.id });

    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toEqual(expect.objectContaining({ page: 1, pageSize: 50 }));
    expectDocumentedStatus(doc, 'listOrders', 200);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).get('/api/v1/orders');
    expect(res.status).toBe(401);
    expectDocumentedStatus(doc, 'listOrders', 401);
  });
});
