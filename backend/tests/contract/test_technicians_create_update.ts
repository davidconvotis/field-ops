export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser } = require('../helpers/fixtures');

describe('Contract: POST/PATCH /technicians (003-dispatcher-orders-ui FR-019/FR-020)', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher crea técnico -> 201 activo por defecto', async () => {
    const { token } = await createUser('dispatcher');
    const email = `tec-nuevo-${Date.now()}@test.dev`;

    const res = await request(app)
      .post('/api/v1/technicians')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Tecnico Nuevo', email });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ nombre: 'Tecnico Nuevo', email, activo: true }));
    expectDocumentedStatus(doc, 'createTechnician', 201);
  });

  test('email duplicado -> 409', async () => {
    const { token } = await createUser('dispatcher');
    const { user: existing } = await createUser('tecnico');

    const res = await request(app)
      .post('/api/v1/technicians')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Otro', email: existing.email });

    expect(res.status).toBe(409);
    expectDocumentedStatus(doc, 'createTechnician', 409);
  });

  test('dispatcher edita técnico -> 200', async () => {
    const { token } = await createUser('dispatcher');
    const { user: tech } = await createUser('tecnico');

    const res = await request(app)
      .patch(`/api/v1/technicians/${tech.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Nombre Editado' });

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Nombre Editado');
    expectDocumentedStatus(doc, 'updateTechnician', 200);
  });

  test('editar técnico inexistente -> 404', async () => {
    const { token } = await createUser('dispatcher');
    const res = await request(app)
      .patch('/api/v1/technicians/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'X' });
    expect(res.status).toBe(404);
  });

  test('rol no-dispatcher -> 403', async () => {
    const { token } = await createUser('tecnico');
    const res = await request(app)
      .post('/api/v1/technicians')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'X', email: 'x@test.dev' });
    expect(res.status).toBe(403);
  });

  test('sin token -> 401', async () => {
    const res = await request(app).post('/api/v1/technicians').send({ nombre: 'X', email: 'x@test.dev' });
    expect(res.status).toBe(401);
  });
});
