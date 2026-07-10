const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, ORDER_STATUS } = require('../helpers/fixtures');

describe('Contract: POST /orders', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher crea orden -> 201, sin_asignar', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');

    const res = await request(app).post('/api/v1/orders').set('Authorization', `Bearer ${token}`).send({ clientId: client.id });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe(ORDER_STATUS.SIN_ASIGNAR);
    expectDocumentedStatus(doc, 'createOrder', 201);
  });

  test('técnico intenta crear orden -> 403', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('tecnico');

    const res = await request(app).post('/api/v1/orders').set('Authorization', `Bearer ${token}`).send({ clientId: client.id });

    expect(res.status).toBe(403);
    expectDocumentedStatus(doc, 'createOrder', 403);
  });
});
