const request = require('supertest');
const { app } = require('../contract/setup');
const { prisma } = require('../../src/db/prismaClient');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

describe('FR-004d: desactivar técnico con órdenes en curso -> auto-reasignación', () => {
  test('órdenes sin_asignar/pendiente_de_revision vuelven a sin_asignar sin técnico', async () => {
    const { user: client } = await createUser('cliente');
    const { user: tech } = await createUser('tecnico');
    const { token } = await createUser('dispatcher');

    const order1 = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.SIN_ASIGNAR });
    const order2 = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });
    const approvedOrder = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.APROBADA });

    const res = await request(app)
      .patch(`/api/v1/technicians/${tech.id}/activo`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activo: false });

    expect(res.status).toBe(200);

    const reloaded1 = await prisma.order.findUnique({ where: { id: order1.id } });
    const reloaded2 = await prisma.order.findUnique({ where: { id: order2.id } });
    const reloadedApproved = await prisma.order.findUnique({ where: { id: approvedOrder.id } });

    expect(reloaded1.status).toBe(ORDER_STATUS.SIN_ASIGNAR);
    expect(reloaded1.technicianId).toBeNull();
    expect(reloaded2.status).toBe(ORDER_STATUS.SIN_ASIGNAR);
    expect(reloaded2.technicianId).toBeNull();
    // Órdenes terminales (aprobada) no se tocan.
    expect(reloadedApproved.technicianId).toBe(tech.id);

    const entries = await prisma.auditLogEntry.findMany({ where: { action: 'desactivar_tecnico_reasigna' } });
    expect(entries.length).toBeGreaterThanOrEqual(2);
  });
});
