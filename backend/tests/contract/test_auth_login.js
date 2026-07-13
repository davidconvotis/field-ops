const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser, TEST_PASSWORD } = require('../helpers/fixtures');

describe('Contract: POST /auth/login', () => {
  const doc = loadOpenApiDoc();

  test('credenciales válidas -> 200, cookies httpOnly, body con userId/role (FR-002/FR-004/FR-005)', async () => {
    const { user } = await createUser('dispatcher');

    const res = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: user.id, role: 'dispatcher' });
    expectDocumentedStatus(doc, 'login', 200);

    const cookies = res.headers['set-cookie'].join(';');
    expect(cookies).toMatch(/access_token=/);
    expect(cookies).toMatch(/refresh_token=/);
    expect(cookies).toMatch(/HttpOnly/i);
  });

  test('password incorrecta -> 401 genérico (FR-003)', async () => {
    const { user } = await createUser('supervisor');

    const res = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Credenciales inválidas' });
    expectDocumentedStatus(doc, 'login', 401);
  });

  test('email inexistente -> mismo 401 genérico (FR-003/SC-003)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'no-existe@fieldops.dev', password: 'cualquiera' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Credenciales inválidas' });
  });

  test('rol cliente -> 401 (login fuera de scope para clientes, spec Assumptions)', async () => {
    const { user } = await createUser('cliente');

    const res = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: TEST_PASSWORD });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Credenciales inválidas' });
  });
});
