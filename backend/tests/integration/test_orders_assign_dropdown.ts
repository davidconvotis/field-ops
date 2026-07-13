export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

// Busca un técnico por id recorriendo todas las páginas de ?activo=true — con
// muchos técnicos activos acumulados en la suite completa (US6/US7 crean varios),
// el técnico recién creado por este test puede caer fuera de la página 1
// (orderBy nombre asc), ya que el endpoint no soporta filtro por id.
async function findActiveTechnicianAcrossPages(token: string, technicianId: string): Promise<any> {
  let page = 1;
  for (;;) {
    const res = await request(app).get(`/api/v1/technicians?activo=true&page=${page}`).set('Authorization', `Bearer ${token}`);
    const found = res.body.items.find((t: any) => t.id === technicianId);
    if (found) return { found, res };
    if (page * res.body.pageSize >= res.body.total) return { found: undefined, res };
    page += 1;
  }
}

describe('003-dispatcher-orders-ui US2: desplegable de asignación — edge cases', () => {
  test('desplegable (GET /technicians?activo=true) excluye técnicos inactivos', async () => {
    const { user: active } = await createUser('tecnico', { activo: true });
    const { user: inactive } = await createUser('tecnico', { activo: false });
    const { token } = await createUser('dispatcher');

    const { found } = await findActiveTechnicianAcrossPages(token, active.id);
    expect(found).toBeDefined();

    const { found: foundInactive } = await findActiveTechnicianAcrossPages(token, inactive.id);
    expect(foundInactive).toBeUndefined();
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
