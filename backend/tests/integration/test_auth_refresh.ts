export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, TEST_PASSWORD } = require('../helpers/fixtures');

describe('US1 FR-002a: renovación silenciosa vía refresh_token', () => {
  test('refresh válido emite nuevo access_token utilizable', async () => {
    const { user } = await createUser('dispatcher');
    const agent = request.agent(app);

    const loginRes = await agent.post('/api/v1/auth/login').send({ email: user.email, password: TEST_PASSWORD });
    expect(loginRes.status).toBe(200);

    const refreshRes = await agent.post('/api/v1/auth/refresh').send();
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toEqual({ userId: user.id, role: 'dispatcher' });

    const res = await agent.get('/api/v1/orders');
    expect(res.status).toBe(200);
  });

  test('refresh sin cookie -> 401', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send();
    expect(res.status).toBe(401);
  });
});
