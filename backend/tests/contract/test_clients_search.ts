export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser } = require('../helpers/fixtures');

describe('Contract: GET /clients (003-dispatcher-orders-ui FR-021)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher busca por fragmento de nombre -> 200 PaginatedClients', async () => {
    const { user: client } = await createUser('cliente', { nombre: 'Cliente Buscable', email: `buscable-${Date.now()}@test.dev` });
    const { token } = await createUser('dispatcher');

    const res = await request(app).get('/api/v1/clients?q=Buscable').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items.some((c: any) => c.id === client.id)).toBe(true);
    expect(res.body).toEqual(expect.objectContaining({ page: 1, pageSize: 50 }));
    expectDocumentedStatus(doc, 'searchClients', 200);
  });

  test('sin q -> listado completo paginado', async () => {
    const { token } = await createUser('dispatcher');
    await createUser('cliente');

    const res = await request(app).get('/api/v1/clients').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('rol no-dispatcher -> 403', async () => {
    const { token } = await createUser('tecnico');
    const res = await request(app).get('/api/v1/clients').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expectDocumentedStatus(doc, 'searchClients', 403);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).get('/api/v1/clients');
    expect(res.status).toBe(401);
    expectDocumentedStatus(doc, 'searchClients', 401);
  });
});
