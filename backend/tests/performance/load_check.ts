export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

/**
 * Verificación básica de NFR-05 (P95 CRUD órdenes) / NFR-06 (subida de fotos).
 * No sustituye una prueba de carga real (100 req/s sostenidos) — sirve como smoke
 * check de que las operaciones responden en un orden de magnitud razonable en CI.
 */
describe('Performance smoke check (NFR-05/NFR-06)', () => {
  test('GET /orders responde en tiempo razonable bajo N requests secuenciales', async () => {
    const { token } = await createUser('dispatcher');
    const { user: client } = await createUser('cliente');
    await Promise.all(Array.from({ length: 20 }, () => createOrder({ clientId: client.id })));

    const start = Date.now();
    const N = 30;
    for (let i = 0; i < N; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    }
    const elapsedMs = Date.now() - start;
    const avgMs = elapsedMs / N;

    // Umbral generoso para smoke-test en CI (NFR-05 real: P95<=300ms bajo 100 req/s con Postgres real).
    expect(avgMs).toBeLessThan(300);
  });
});
