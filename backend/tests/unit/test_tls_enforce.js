const express = require('express');
const request = require('supertest');
const tlsEnforce = require('../../src/middleware/tlsEnforce');

describe('NFR-01: TLS enforcement', () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('en producción, sin X-Forwarded-Proto https -> 400', async () => {
    process.env.NODE_ENV = 'production';
    const app = express();
    app.use(tlsEnforce);
    app.get('/x', (req, res) => res.json({ ok: true }));

    const res = await request(app).get('/x');
    expect(res.status).toBe(400);
  });

  test('en producción, con X-Forwarded-Proto https -> pasa', async () => {
    process.env.NODE_ENV = 'production';
    const app = express();
    app.use(tlsEnforce);
    app.get('/x', (req, res) => res.json({ ok: true }));

    const res = await request(app).get('/x').set('X-Forwarded-Proto', 'https');
    expect(res.status).toBe(200);
  });

  test('fuera de producción, se omite la verificación', async () => {
    process.env.NODE_ENV = 'test';
    const app = express();
    app.use(tlsEnforce);
    app.get('/x', (req, res) => res.json({ ok: true }));

    const res = await request(app).get('/x');
    expect(res.status).toBe(200);
  });
});
