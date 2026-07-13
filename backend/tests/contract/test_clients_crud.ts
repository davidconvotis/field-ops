export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser } = require('../helpers/fixtures');

describe('Contract: POST/PATCH /clients, PATCH /clients/:id/activo (003-dispatcher-orders-ui FR-015..FR-017)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher crea cliente -> 201 ClientSummary', async () => {
    const { token } = await createUser('dispatcher');
    const email = `nuevo-${Date.now()}@test.dev`;

    const res = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Cliente Nuevo', email });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ nombre: 'Cliente Nuevo', email, activo: true }));
    expectDocumentedStatus(doc, 'createClient', 201);
  });

  test('email duplicado -> 409', async () => {
    const { token } = await createUser('dispatcher');
    const { user: existing } = await createUser('cliente');

    const res = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Otro', email: existing.email });

    expect(res.status).toBe(409);
    expectDocumentedStatus(doc, 'createClient', 409);
  });

  test('dispatcher edita cliente -> 200', async () => {
    const { token } = await createUser('dispatcher');
    const { user: client } = await createUser('cliente');

    const res = await request(app)
      .patch(`/api/v1/clients/${client.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Nombre Editado' });

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Nombre Editado');
    expectDocumentedStatus(doc, 'updateClient', 200);
  });

  test('editar cliente inexistente -> 404', async () => {
    const { token } = await createUser('dispatcher');
    const res = await request(app)
      .patch('/api/v1/clients/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'X' });
    expect(res.status).toBe(404);
  });

  test('dispatcher da de baja cliente -> 200 activo=false', async () => {
    const { token } = await createUser('dispatcher');
    const { user: client } = await createUser('cliente');

    const res = await request(app)
      .patch(`/api/v1/clients/${client.id}/activo`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activo: false });

    expect(res.status).toBe(200);
    expect(res.body.activo).toBe(false);
    expectDocumentedStatus(doc, 'setClientActive', 200);
  });

  test('rol no-dispatcher -> 403', async () => {
    const { token } = await createUser('tecnico');
    const res = await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`).send({ nombre: 'X', email: 'x@test.dev' });
    expect(res.status).toBe(403);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).post('/api/v1/clients').send({ nombre: 'X', email: 'x@test.dev' });
    expect(res.status).toBe(401);
  });
});
