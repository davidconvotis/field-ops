export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US4: activeOrderCount por técnico', () => {
  test('activeOrderCount solo cuenta pendiente_de_revision, no sin_asignar ni terminales', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');

    await createOrder({ clientId: client.id, technicianId: tech.id, status: 'pendiente_de_revision' });
    await createOrder({ clientId: client.id, technicianId: tech.id, status: 'pendiente_de_revision' });
    await createOrder({ clientId: client.id, technicianId: tech.id, status: 'aprobada' });
    await createOrder({ clientId: client.id, technicianId: tech.id, status: 'rechazada' });
    await createOrder({ clientId: client.id }); // sin_asignar, sin técnico

    const res = await request(app).get('/api/v1/technicians').set('Authorization', `Bearer ${token}`);
    const found = res.body.items.find((t: any) => t.id === tech.id);

    expect(found.activeOrderCount).toBe(2);
  });

  test('técnico sin órdenes asignadas -> activeOrderCount 0', async () => {
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');

    const res = await request(app).get('/api/v1/technicians').set('Authorization', `Bearer ${token}`);
    const found = res.body.items.find((t: any) => t.id === tech.id);

    expect(found.activeOrderCount).toBe(0);
  });
});
