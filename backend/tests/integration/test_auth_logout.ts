export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, TEST_PASSWORD } = require('../helpers/fixtures');

describe('US3 FR-009: logout revoca el refresh token vía denylist', () => {
  test('refresh tras logout -> 401 (jti revocado, no solo cookie borrada)', async () => {
    const { user } = await createUser('supervisor');
    const agent = request.agent(app);

    const loginRes = await agent.post('/api/v1/auth/login').send({ email: user.email, password: TEST_PASSWORD });
    expect(loginRes.status).toBe(200);
    const refreshCookie = loginRes.headers['set-cookie'].find((c: string) => c.startsWith('refresh_token='));

    const logoutRes = await agent.post('/api/v1/auth/logout').send();
    expect(logoutRes.status).toBe(200);

    // Reenviar manualmente la cookie de refresh capturada ANTES del logout —
    // simula un atacante que robó el token; debe seguir revocado aunque el
    // agente ya haya borrado su propia cookie local.
    const res = await request(app).post('/api/v1/auth/refresh').set('Cookie', refreshCookie).send();
    expect(res.status).toBe(401);
  });

  test('logout sin sesión -> 401 (authn requiere access_token válido)', async () => {
    const res = await request(app).post('/api/v1/auth/logout').send();
    expect(res.status).toBe(401);
  });
});
