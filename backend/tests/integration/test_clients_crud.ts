export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US6: CRUD de clientes — reglas de negocio', () => {
  test('baja de cliente NO altera sus órdenes existentes (a diferencia de baja de técnico)', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');
    const order = await createOrder({ clientId: client.id, status: 'sin_asignar' });

    const res = await request(app)
      .patch(`/api/v1/clients/${client.id}/activo`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activo: false });
    expect(res.status).toBe(200);

    const orderRes = await request(app).get(`/api/v1/orders/${order.id}`).set('Authorization', `Bearer ${token}`);
    expect(orderRes.status).toBe(200);
    expect(orderRes.body.status).toBe('sin_asignar');
    expect(orderRes.body.clientId).toBe(client.id);
  });

  test('email duplicado entre cliente y técnico también rechazado (unicidad global)', async () => {
    const { token } = await createUser('dispatcher');
    const { user: tech } = await createUser('tecnico');

    const res = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Cliente X', email: tech.email });

    expect(res.status).toBe(409);
  });

  test('cliente recién creado queda inmediatamente buscable (US5)', async () => {
    const { token } = await createUser('dispatcher');
    const email = `recien-creado-${Date.now()}@test.dev`;

    const createRes = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Recien Creado', email });
    expect(createRes.status).toBe(201);

    const searchRes = await request(app).get('/api/v1/clients?q=Recien').set('Authorization', `Bearer ${token}`);
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.items.some((c: any) => c.id === createRes.body.id)).toBe(true);
  });
});
