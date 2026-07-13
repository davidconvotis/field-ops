export {};
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../contract/setup');
const { createUser, TEST_PASSWORD } = require('../helpers/fixtures');

describe('US1: login válido emite JWT con rol correcto para los 3 roles', () => {
  test.each(['dispatcher', 'tecnico', 'supervisor'])('rol %s', async (role: string) => {
    const { user } = await createUser(role);

    const res = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe(role);

    const setCookie = res.headers['set-cookie'];
    const accessCookie = setCookie.find((c: string) => c.startsWith('access_token='));
    const token = accessCookie.split(';')[0].split('=')[1];
    const payload = jwt.verify(token, process.env.JWT_DEV_SECRET);
    expect(payload.role).toBe(role);
    expect(payload.sub).toBe(user.id);
  });
});
