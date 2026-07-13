export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

describe('Contract: POST /orders/{orderId}/approve', () => {
  const doc = loadOpenApiDoc();

  test('supervisor aprueba orden pendiente_de_revision -> 200', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('supervisor');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    const res = await request(app).post(`/api/v1/orders/${order.id}/approve`).set('Authorization', `Bearer ${token}`).send({});

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(ORDER_STATUS.APROBADA);
    expectDocumentedStatus(doc, 'approveOrder', 200);
  });
});
