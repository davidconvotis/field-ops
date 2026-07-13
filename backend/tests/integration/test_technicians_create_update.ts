export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US7: técnico creado disponible para asignación (US2)', () => {
  test('técnico recién creado aparece en GET /technicians?activo=true', async () => {
    const { token } = await createUser('dispatcher');
    const email = `tec-disponible-${Date.now()}@test.dev`;

    const createRes = await request(app)
      .post('/api/v1/technicians')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Tecnico Disponible', email });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/v1/technicians?activo=true').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.items.some((t: any) => t.id === createRes.body.id)).toBe(true);
  });

  test('email duplicado entre técnico y cliente también rechazado (unicidad global)', async () => {
    const { token } = await createUser('dispatcher');
    const { user: client } = await createUser('cliente');

    const res = await request(app)
      .post('/api/v1/technicians')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Tecnico X', email: client.email });

    expect(res.status).toBe(409);
  });
});
