export {};
const request = require('supertest');
const { app } = require('../contract/setup');
const { createUser } = require('../helpers/fixtures');

describe('003-dispatcher-orders-ui US5: búsqueda de clientes por cualquier campo', () => {
  test('encuentra por fragmento de nombre', async () => {
    const { user: client } = await createUser('cliente', { nombre: 'Fulano Perez', email: `fulano-${Date.now()}@test.dev` });
    const { token } = await createUser('dispatcher');

    const res = await request(app).get('/api/v1/clients?q=Fulano').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items.some((c: any) => c.id === client.id)).toBe(true);
  });

  test('encuentra por fragmento de email', async () => {
    const email = `zorro-${Date.now()}@test.dev`;
    const { user: client } = await createUser('cliente', { nombre: 'Otro Nombre', email });
    const { token } = await createUser('dispatcher');

    const res = await request(app).get(`/api/v1/clients?q=zorro-${email.split('@')[0].split('-')[1]}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items.some((c: any) => c.id === client.id)).toBe(true);
  });

  test('encuentra por id exacto (uuid)', async () => {
    const { user: client } = await createUser('cliente');
    const { token } = await createUser('dispatcher');

    const res = await request(app).get(`/api/v1/clients?q=${client.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].id).toBe(client.id);
  });

  test('sin coincidencias -> items vacío, no error', async () => {
    const { token } = await createUser('dispatcher');
    const res = await request(app).get('/api/v1/clients?q=xxxxxNoExistexxxxx').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
  });

  test('sin q devuelve listado completo paginado (page/pageSize/total)', async () => {
    const { token } = await createUser('dispatcher');
    await createUser('cliente');
    await createUser('cliente');

    const res = await request(app).get('/api/v1/clients?page=1').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(50);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
  });
});
