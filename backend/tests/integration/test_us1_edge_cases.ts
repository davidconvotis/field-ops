export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder, fakePngBuffer, fakeInvalidBuffer, ORDER_STATUS } = require('../helpers/fixtures');

function submit(
  token: string,
  orderId: string,
  {
    idempotencyKey,
    notes,
    attachInvalid = false,
    noPhoto = false,
  }: { idempotencyKey?: string; notes?: string; attachInvalid?: boolean; noPhoto?: boolean } = {},
) {
  let req = request(app)
    .post(`/api/v1/orders/${orderId}/executions`)
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', idempotencyKey)
    .field('notes', notes ?? 'notas válidas de prueba');
  if (!noPhoto) {
    req = attachInvalid ? req.attach('photos', fakeInvalidBuffer(), 'x.jpg') : req.attach('photos', fakePngBuffer(), 'foto.png');
  }
  return req;
}

describe('US1 escenarios 2-7: edge cases', () => {
  test('escenario 2: sin foto -> 400', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });
    const res = await submit(token, order.id, { idempotencyKey: 'e2', noPhoto: true });
    expect(res.status).toBe(400);
  });

  test('escenario 3: archivo no es imagen real -> 415, rollback todo-o-nada', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });
    const res = await submit(token, order.id, { idempotencyKey: 'e3', attachInvalid: true });
    expect(res.status).toBe(415);
  });

  test('escenario 4: notas vacías -> 400', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });
    const res = await submit(token, order.id, { idempotencyKey: 'e4', notes: '   ' });
    expect(res.status).toBe(400);
  });

  test('escenario 5: orden en estado terminal -> 409', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.APROBADA });
    const res = await submit(token, order.id, { idempotencyKey: 'e5' });
    expect(res.status).toBe(409);
  });

  test('escenario 6: orden no asignada a este técnico -> 403', async () => {
    const { user: client } = await createUser('cliente');
    const { user: otherTech } = await createUser('tecnico');
    const { token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: otherTech.id });
    const res = await submit(token, order.id, { idempotencyKey: 'e6' });
    expect(res.status).toBe(403);
  });

  test('escenario 7a: reintento idempotente exitoso -> 200 sin duplicar', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });

    const first = await submit(token, order.id, { idempotencyKey: 'e7a', notes: 'mismas notas' });
    expect(first.status).toBe(201);

    const second = await submit(token, order.id, { idempotencyKey: 'e7a', notes: 'mismas notas' });
    expect(second.status).toBe(200);
    expect(second.body.id).toBe(first.body.id);
  });

  test('escenario 7b: idempotencyKey con payload distinto -> 409', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech, token } = await createUser('tecnico');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id });

    const first = await submit(token, order.id, { idempotencyKey: 'e7b', notes: 'notas originales' });
    expect(first.status).toBe(201);

    const second = await submit(token, order.id, { idempotencyKey: 'e7b', notes: 'notas DISTINTAS' });
    expect(second.status).toBe(409);
  });
});
