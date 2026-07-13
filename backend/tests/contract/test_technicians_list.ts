export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser } = require('../helpers/fixtures');

describe('Contract: GET /technicians (003-dispatcher-orders-ui FR-003/FR-004/FR-011/FR-012)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher lista técnicos activos -> 200 PaginatedTechnicians, solo activo=true', async () => {
    await createUser('tecnico', { activo: true });
    await createUser('tecnico', { activo: false });
    const { token } = await createUser('dispatcher');

    const res = await request(app).get('/api/v1/technicians?activo=true').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items.every((t: any) => t.activo === true)).toBe(true);
    expect(res.body).toEqual(expect.objectContaining({ page: 1, pageSize: 50 }));
    expectDocumentedStatus(doc, 'listTechnicians', 200);
  });

  test('sin filtro activo -> incluye activos e inactivos', async () => {
    await createUser('tecnico', { activo: true });
    await createUser('tecnico', { activo: false });
    const { token } = await createUser('dispatcher');

    const res = await request(app).get('/api/v1/technicians').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items.some((t: any) => t.activo === true)).toBe(true);
    expect(res.body.items.some((t: any) => t.activo === false)).toBe(true);
  });

  test('rol no-dispatcher -> 403', async () => {
    const { token } = await createUser('tecnico');
    const res = await request(app).get('/api/v1/technicians').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expectDocumentedStatus(doc, 'listTechnicians', 403);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).get('/api/v1/technicians');
    expect(res.status).toBe(401);
    expectDocumentedStatus(doc, 'listTechnicians', 401);
  });
});
