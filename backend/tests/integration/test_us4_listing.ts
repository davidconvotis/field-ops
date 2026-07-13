export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder } = require('../helpers/fixtures');

describe('US4 escenarios 1-4: listado por rol', () => {
  test('escenario 1: cliente ve solo sus órdenes', async () => {
    const { user: clientA, token: tokenA } = await createUser('cliente');
    const { user: clientB } = await createUser('cliente');
    await createOrder({ clientId: clientA.id });
    await createOrder({ clientId: clientB.id });

    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.items.every((o: any) => o.clientId === clientA.id)).toBe(true);
  });

  test('escenario 2: técnico ve solo las asignadas a él', async () => {
    const { user: client } = await createUser('cliente');
    const { user: techA, token: tokenA } = await createUser('tecnico');
    const { user: techB } = await createUser('tecnico');
    await createOrder({ clientId: client.id, technicianId: techA.id });
    await createOrder({ clientId: client.id, technicianId: techB.id });

    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.items.every((o: any) => o.technicianId === techA.id)).toBe(true);
  });

  test('escenario 3: dispatcher y supervisor ven todas', async () => {
    const { user: client } = await createUser('cliente');
    const { token: dispatcherToken } = await createUser('dispatcher');
    await createOrder({ clientId: client.id });
    await createOrder({ clientId: client.id });

    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${dispatcherToken}`);
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
  });

  test('escenario 4: orderId inexistente -> 404 uniforme para cliente sin relación', async () => {
    const { token } = await createUser('cliente');
    const res = await request(app).get('/api/v1/orders/orden-inexistente-xyz').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  test('escenario 4b: cliente no puede ver orden de otro cliente -> 404 (no revela existencia)', async () => {
    const { user: ownerClient } = await createUser('cliente');
    const { token: otherClientToken } = await createUser('cliente');
    const order = await createOrder({ clientId: ownerClient.id });

    const res = await request(app).get(`/api/v1/orders/${order.id}`).set('Authorization', `Bearer ${otherClientToken}`);
    expect(res.status).toBe(404);
  });
});
