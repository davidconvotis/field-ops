const request = require('supertest');
const { app } = require('../contract/setup');
const { prisma } = require('../../src/db/prismaClient');
const { createUser, createOrder, ORDER_STATUS } = require('../helpers/fixtures');

async function createOrderWithNotes(notes) {
  const { user: client } = await createUser('cliente');
  const { user: tech } = await createUser('tecnico');
  const order = await createOrder({ clientId: client.id, technicianId: tech.id, status: ORDER_STATUS.PENDIENTE_DE_REVISION });
  await prisma.executionRecord.create({
    data: { orderId: order.id, technicianId: tech.id, notes, idempotencyKey: `seed-${order.id}`, payloadHash: 'seed-hash' },
  });
  return { order, client };
}

describe('US5 escenarios 1-2: resumen automático', () => {
  afterEach(() => {
    delete process.env.SUMMARY_SIMULATE_FAILURE;
    delete process.env.SUMMARY_SIMULATE_TIMEOUT;
  });

  test('escenario 1: notas suficientes -> summary presente', async () => {
    const notes =
      'Se detectó una fuga en la válvula principal del sistema de calefacción. Se reemplazó la junta tórica deteriorada y se purgó el aire del circuito. Se probó el sistema durante quince minutos sin nuevas fugas.';
    const { order, client } = await createOrderWithNotes(notes);
    const { issueDevToken } = require('../../src/adapters/idpAdapter');
    const clientToken = issueDevToken({ userId: client.id, role: 'cliente' });

    const res = await request(app).get(`/api/v1/orders/${order.id}`).set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeTruthy();
    expect(res.body.summaryUnavailable).toBe(false);
  });

  test('notas insuficientes (<20 palabras) -> fallback explícito, nunca inventado', async () => {
    const { order, client } = await createOrderWithNotes('Listo, todo ok.');
    const { issueDevToken } = require('../../src/adapters/idpAdapter');
    const token = issueDevToken({ userId: client.id, role: 'cliente' });

    const res = await request(app).get(`/api/v1/orders/${order.id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeNull();
    expect(res.body.summaryFallbackMessage).toBe('Evidencia insuficiente para generar resumen');
  });

  test('escenario 2: servicio de resumen falla -> 200 con summaryUnavailable=true, no bloquea la vista', async () => {
    const { order, client } = await createOrderWithNotes(
      'Notas suficientemente largas para pasar el umbral de veinte palabras y activar el intento de generación de resumen automático.',
    );
    const { issueDevToken } = require('../../src/adapters/idpAdapter');
    const token = issueDevToken({ userId: client.id, role: 'cliente' });

    process.env.SUMMARY_SIMULATE_FAILURE = 'true';
    const res = await request(app).get(`/api/v1/orders/${order.id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.summaryUnavailable).toBe(true);
  });
});
