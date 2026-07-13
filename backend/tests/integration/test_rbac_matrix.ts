export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

const ALL_ROLES = ['cliente', 'tecnico', 'dispatcher', 'supervisor'];

describe('FR-000/NFR-03/SC-006: matriz RBAC — 4 roles x endpoints restringidos por rol', () => {
  test('sin token -> 401 en cada endpoint restringido', async () => {
    const { user: client } = await createUser('cliente');
    const order = await createOrder({ clientId: client.id });

    const calls = [
      request(app).post('/api/v1/orders').send({ clientId: client.id }),
      request(app).patch(`/api/v1/orders/${order.id}/assign`).send({}),
      request(app).patch(`/api/v1/technicians/x/activo`).send({}),
      request(app).post(`/api/v1/orders/${order.id}/executions`),
      request(app).post(`/api/v1/orders/${order.id}/approve`).send({}),
      request(app).post(`/api/v1/orders/${order.id}/reject`).send({}),
      request(app).get('/api/v1/orders'),
      request(app).get(`/api/v1/orders/${order.id}`),
    ];
    const results = await Promise.all(calls);
    results.forEach((res) => expect(res.status).toBe(401));
  });

  test('rol incorrecto -> 403 en cada endpoint restringido por rol', async () => {
    const restrictedEndpoints: { allowedRole: string; build: (orderId?: string) => (req: any) => any }[] = [
      { allowedRole: 'dispatcher', build: (orderId?: string) => (req: any) => req.post('/api/v1/orders').send({ clientId: 'x' }) },
      { allowedRole: 'dispatcher', build: (orderId?: string) => (req: any) => req.patch(`/api/v1/orders/${orderId}/assign`).send({ technicianId: 'x', expectedVersion: 0 }) },
      { allowedRole: 'dispatcher', build: () => (req: any) => req.patch('/api/v1/technicians/x/activo').send({ activo: false }) },
      { allowedRole: 'tecnico', build: (orderId?: string) => (req: any) => req.post(`/api/v1/orders/${orderId}/executions`).field('notes', 'x') },
      { allowedRole: 'supervisor', build: (orderId?: string) => (req: any) => req.post(`/api/v1/orders/${orderId}/approve`).send({}) },
      { allowedRole: 'supervisor', build: (orderId?: string) => (req: any) => req.post(`/api/v1/orders/${orderId}/reject`).send({ reason: 'x' }) },
    ];

    const { user: client } = await createUser('cliente');
    const order = await createOrder({ clientId: client.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });

    for (const endpoint of restrictedEndpoints) {
      const wrongRoles = ALL_ROLES.filter((r) => r !== endpoint.allowedRole);
      for (const role of wrongRoles) {
        // eslint-disable-next-line no-await-in-loop
        const { token } = await createUser(role);
        // eslint-disable-next-line no-await-in-loop
        const res = await endpoint.build(order.id)(request(app)).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(403);
      }
    }
  });
});
