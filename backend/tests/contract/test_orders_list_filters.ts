export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('Contract: GET /orders — filtros y paginación (003-dispatcher-orders-ui FR-002a/FR-014)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher filtra por status -> 200 PaginatedOrders', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    await createOrder({ clientId: client.id, status: 'sin_asignar' });

    const res = await request(app)
      .get('/api/v1/orders?status=sin_asignar')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items.every((o: any) => o.status === 'sin_asignar')).toBe(true);
    expect(res.body).toEqual(expect.objectContaining({ page: 1, pageSize: 50 }));
    expectDocumentedStatus(doc, 'listOrders', 200);
  });

  test('dispatcher filtra por technicianId -> solo órdenes de ese técnico', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');
    await createOrder({ clientId: client.id, technicianId: tech.id, status: 'pendiente_de_revision' });
    await createOrder({ clientId: client.id });

    const res = await request(app)
      .get(`/api/v1/orders?technicianId=${tech.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items.every((o: any) => o.technicianId === tech.id)).toBe(true);
  });

  test('status inválido -> 400', async () => {
    const { token } = await createUser('dispatcher');
    const res = await request(app).get('/api/v1/orders?status=no_existe').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expectDocumentedStatus(doc, 'listOrders', 400);
  });

  test('technicianId con formato inválido -> 400', async () => {
    const { token } = await createUser('dispatcher');
    const res = await request(app).get('/api/v1/orders?technicianId=no-es-uuid').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).get('/api/v1/orders?status=sin_asignar');
    expect(res.status).toBe(401);
    expectDocumentedStatus(doc, 'listOrders', 401);
  });
});
