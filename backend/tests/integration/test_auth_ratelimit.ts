export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser } = require('../helpers/fixtures');
const loginRateLimit = require('../../src/middleware/loginRateLimit');

describe('US2 FR-010: rate limit de intentos de login', () => {
  beforeEach(() => loginRateLimit._resetForTests());

  test('6º intento fallido en la ventana -> 429', async () => {
    const { user } = await createUser('dispatcher');

    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: 'wrong' });
      expect(res.status).toBe(401);
    }

    const sixth = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: 'wrong' });
    expect(sixth.status).toBe(429);
  });

  test('límite es por email — otro email no afectado', async () => {
    const { user: userA } = await createUser('dispatcher');
    const { user: userB } = await createUser('supervisor');

    for (let i = 0; i < 6; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await request(app).post('/api/v1/auth/login').send({ email: userA.email, password: 'wrong' });
    }

    const res = await request(app).post('/api/v1/auth/login').send({ email: userB.email, password: 'wrong' });
    expect(res.status).toBe(401); // no 429 — límite no cruza emails
  });
});
