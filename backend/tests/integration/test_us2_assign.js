const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

describe('US2 escenarios 1-4', () => {
  test('escenario 1: crear orden -> sin_asignar sin técnico', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');

    const res = await request(app).post('/api/v1/orders').set('Authorization', `Bearer ${token}`).send({ clientId: client.id });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe(ORDER_STATUS.SIN_ASIGNAR);
    expect(res.body.technicianId).toBeNull();
  });

  test('escenario 2: reasignar a técnico activo existente', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech1 } = await createUser('tecnico');
    const { user: tech2 } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, technicianId: tech1.id });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech2.id, expectedVersion: 0 });

    expect(res.status).toBe(200);
    expect(res.body.technicianId).toBe(tech2.id);
  });

  test('escenario 3: bloqueo de reasignación en estado terminal -> 422', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: ORDER_STATUS.APROBADA });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 0 });

    expect(res.status).toBe(422);
  });

  test('escenario 3b: carrera — version desactualizada -> 409', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 99 });

    expect(res.status).toBe(409);
  });

  test('escenario 4: tecnicoId inexistente -> 422', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: 'no-existe', expectedVersion: 0 });

    expect(res.status).toBe(422);
  });

  test('escenario 4b: técnico inactivo -> 422', async () => {
    const { user: client } = await createUser('cliente');
    const { user: inactiveTech } = await createUser('tecnico', { activo: false });
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: inactiveTech.id, expectedVersion: 0 });

    expect(res.status).toBe(422);
  });
});
