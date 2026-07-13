export {};
const express = require('express');
const request = require('supertest');
const authn = require('../../src/middleware/authn');
const { issueDevToken } = require('../../src/adapters/idpAdapter');

function buildTestApp() {
  const app = express();
  app.get('/protected', authn, (req: any, res: any) => res.json({ ok: true, user: req.user }));
  return app;
}

describe('NFR-03b: fallo del IdP vs token inválido', () => {
  afterEach(() => {
    delete process.env.IDP_SIMULATE_UNAVAILABLE;
  });

  test('token ausente -> 401', async () => {
    const app = buildTestApp();
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  test('token con firma inválida -> 401', async () => {
    const app = buildTestApp();
    const res = await request(app).get('/protected').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  test('token válido -> 200', async () => {
    const token = issueDevToken({ userId: 'user-1', role: 'dispatcher' });
    const app = buildTestApp();
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('dispatcher');
  });

  test('fallo simulado del IdP/JWKS -> 503, nunca 401', async () => {
    process.env.IDP_SIMULATE_UNAVAILABLE = 'true';
    const token = issueDevToken({ userId: 'user-1', role: 'dispatcher' });
    const app = buildTestApp();
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(503);
  });
});
