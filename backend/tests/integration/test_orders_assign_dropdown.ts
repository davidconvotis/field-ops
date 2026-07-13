export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US2: desplegable de asignación — edge cases', () => {
  test('desplegable (GET /technicians?activo=true) excluye técnicos inactivos', async () => {
    const { user: active } = await createUser('tecnico', { activo: true });
    await createUser('tecnico', { activo: false });
    const { token } = await createUser('dispatcher');

    const res = await request(app).get('/api/v1/technicians?activo=true').set('Authorization', `Bearer ${token}`);
    const ids = res.body.items.map((t: any) => t.id);
    expect(ids).toContain(active.id);
    expect(ids.length).toBe(res.body.items.filter((t: any) => t.activo).length);
  });

  test('asignación sobre orden en estado terminal -> 422 (FR-006)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'aprobada' });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 0 });

    expect(res.status).toBe(422);
  });

  test('técnico desactivado entre carga del desplegable y confirmación -> 422 (edge case spec.md)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico', { activo: false });
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id });

    const res = await request(app)
      .patch(`/api/v1/orders/${order.id}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ technicianId: tech.id, expectedVersion: 0 });

    expect(res.status).toBe(422);
  });
});
