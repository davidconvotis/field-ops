export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder, fakePngBuffer, ORDER_STATUS } = require('../helpers/fixtures');

describe('Contract: POST /orders/{orderId}/executions', () => {
  const doc = loadOpenApiDoc();

  test('envío válido documentado como 201 en el contrato y responde 201', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.SIN_ASIGNAR });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/executions`)
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', 'key-contract-1')
      .field('notes', 'Reparación completada sin incidentes.')
      .attach('photos', fakePngBuffer(), 'foto1.png');

    expect(res.status).toBe(201);
    expectDocumentedStatus(doc, 'submitExecution', 201);
  });

  test('sin foto -> 400 documentado en el contrato', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/executions`)
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', 'key-contract-2')
      .field('notes', 'notas válidas');

    expect(res.status).toBe(400);
    expectDocumentedStatus(doc, 'submitExecution', 400);
  });
});
