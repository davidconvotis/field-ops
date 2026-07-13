const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US1: filtro combinado y paginación de GET /orders', () => {
  test('filtro status + technicianId combinado (AND)', async () => {
    const { user: client } = await createUser('cliente');
    const { user: techA } = await createUser('tecnico');
    const { user: techB } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');

    await createOrder({ clientId: client.id, technicianId: techA.id, status: 'pendiente_de_revision' });
    await createOrder({ clientId: client.id, technicianId: techA.id, status: 'sin_asignar' });
    await createOrder({ clientId: client.id, technicianId: techB.id, status: 'pendiente_de_revision' });

    const res = await request(app)
      .get(`/api/v1/orders?status=pendiente_de_revision&technicianId=${techA.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].technicianId).toBe(techA.id);
    expect(res.body.items[0].status).toBe('pendiente_de_revision');
  });

  test('paginación: >50 órdenes -> primera página trae 50, total refleja el conteo real', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    await Promise.all(Array.from({ length: 55 }, () => createOrder({ clientId: client.id })));

    const page1 = await request(app).get('/api/v1/orders?page=1').set('Authorization', `Bearer ${token}`);
    expect(page1.status).toBe(200);
    expect(page1.body.items).toHaveLength(50);
    expect(page1.body.total).toBeGreaterThanOrEqual(55);
    expect(page1.body.page).toBe(1);
    expect(page1.body.pageSize).toBe(50);

    const page2 = await request(app).get('/api/v1/orders?page=2').set('Authorization', `Bearer ${token}`);
    expect(page2.status).toBe(200);
    expect(page2.body.page).toBe(2);
    expect(page2.body.items.length).toBeGreaterThanOrEqual(5);
  });

  test('pageSize enviado por el cliente se ignora (siempre 50, FR-014)', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    await createOrder({ clientId: client.id });

    const res = await request(app).get('/api/v1/orders?pageSize=5').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.pageSize).toBe(50);
  });

  test('respuesta incluye clientNombre/technicianNombre legibles (research.md §3)', async () => {
    const { user: client } = await createUser('cliente', { nombre: 'Cliente Legible' });
    const { user: tech } = await createUser('tecnico', { nombre: 'Tecnico Legible' });
    const { token } = await createUser('dispatcher');
    await createOrder({ clientId: client.id, technicianId: tech.id });

    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${token}`);
    const found = res.body.items.find((o) => o.clientId === client.id);
    expect(found.clientNombre).toBe('Cliente Legible');
    expect(found.technicianNombre).toBe('Tecnico Legible');
  });
});
