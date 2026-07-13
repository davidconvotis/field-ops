export {};
const request = require('supertest');
const { app, loadOpenApiDoc, expectDocumentedStatus } = require('./setup');
const { createUser } = require('../helpers/fixtures');

describe('Contract: PATCH /technicians/{technicianId}/activo', () => {
  const doc = loadOpenApiDoc();

  test('dispatcher desactiva técnico -> 200', async () => {
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');

    const res = await request(app)
      .patch(`/api/v1/technicians/${tech.id}/activo`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activo: false });

    expect(res.status).toBe(200);
    expect(res.body.activo).toBe(false);
    expectDocumentedStatus(doc, 'setTechnicianActive', 200);
  });
});
