export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US8: editar cliente y cancelar orden — reglas de negocio', () => {
  test('cancelar desde sin_asignar', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'sin_asignar' });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'motivo', expectedVersion: 0 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelada');
  });

  test('cancelar desde pendiente_de_revision (a diferencia de approve/reject, que solo aplican ahí)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: 'pendiente_de_revision' });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'motivo', expectedVersion: 0 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelada');
  });

  test('orden cancelada rechaza asignar/editar/cancelar de nuevo (mismo trato que aprobada/rechazada)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: client2 } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'sin_asignar' });

    const cancelRes = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'motivo', expectedVersion: 0 });
    expect(cancelRes.status).toBe(200);

    const assignRes = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 1 });
    expect(assignRes.status).toBe(422);

    const editRes = await request(app)
      .patch(`/api/v1/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId: client2.id, expectedVersion: 1 });
    expect(editRes.status).toBe(422);

    const cancelAgainRes = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'otro motivo', expectedVersion: 1 });
    expect(cancelAgainRes.status).toBe(422);
  });

  test('carrera de cancelación concurrente (expectedVersion obsoleto) -> 409', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'sin_asignar' });

    // Asignar primero para que version avance a 1, dejando expectedVersion=0 obsoleto.
    await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 0 });

    const res = await request(app)
      .post(`/api/v1/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'motivo', expectedVersion: 0 });

    expect(res.status).toBe(409);
    expect(res.body.status).toBe('sin_asignar');
  });
});
