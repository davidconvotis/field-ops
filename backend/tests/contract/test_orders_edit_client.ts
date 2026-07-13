export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('Contract: PATCH /orders/:orderId (003-dispatcher-orders-ui FR-023/FR-024)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher edita cliente de orden no terminal -> 200', async () => {
    const { user: client1 } = await createUser('cliente');
    const { user: client2 } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client1.id, status: 'sin_asignar' });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId: client2.id, expectedVersion: 0 });

    expect(res.status).toBe(200);
    expect(res.body.clientId).toBe(client2.id);
    expectDocumentedStatus(doc, 'editOrderClient', 200);
  });

  test('orderId inexistente -> 404', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');

    const res = await request(app)
      .patch('/api/v1/orders/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId: client.id, expectedVersion: 0 });

    expect(res.status).toBe(404);
  });

  test('clientId inexistente -> 404', async () => {
    const { user: client1 } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client1.id, status: 'sin_asignar' });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId: '00000000-0000-0000-0000-000000000000', expectedVersion: 0 });

    expect(res.status).toBe(404);
  });

  test('orden en estado terminal -> 422', async () => {
    const { user: client1 } = await createUser('cliente');
    const { user: client2 } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client1.id, status: 'aprobada' });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId: client2.id, expectedVersion: 0 });

    expect(res.status).toBe(422);
    expectDocumentedStatus(doc, 'editOrderClient', 422);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).patch('/api/v1/orders/x').send({});
    expect(res.status).toBe(401);
  });
});
