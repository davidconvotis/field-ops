import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DispatcherOrders from '../src/pages/DispatcherOrders.jsx';

function mockOrdersResponse(items, overrides = {}) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify({ items, page: 1, pageSize: 50, total: items.length, ...overrides }),
  };
}

beforeEach(() => {
  global.fetch = jest.fn();
});

test('renderiza listado con id/estado/cliente/técnico/fecha', async () => {
  global.fetch.mockResolvedValueOnce(
    mockOrdersResponse([
      {
        id: 'o1',
        status: 'sin_asignar',
        clientNombre: 'Cliente Uno',
        technicianNombre: null,
        createdAt: '2026-07-13T00:00:00.000Z',
      },
    ]),
  );

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  const row = (await screen.findByText('o1')).closest('tr');
  expect(row).toHaveTextContent('Cliente Uno');
  expect(row).toHaveTextContent('sin_asignar');
  expect(row).toHaveTextContent(/sin asignar/i);
});

test('estado vacío cuando no hay órdenes', async () => {
  global.fetch.mockResolvedValueOnce(mockOrdersResponse([]));

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  expect(await screen.findByText(/no hay órdenes/i)).toBeInTheDocument();
});

test('aplicar filtro por estado dispara una nueva petición con el query param', async () => {
  global.fetch.mockResolvedValueOnce(mockOrdersResponse([]));

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  await screen.findByText(/no hay órdenes/i);

  global.fetch.mockResolvedValueOnce(mockOrdersResponse([]));
  fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'pendiente_de_revision' } });

  await waitFor(() =>
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('status=pendiente_de_revision'),
      expect.anything(),
    ),
  );
});

test('botón Refrescar dispara una nueva petición; no hay refetch automático sin click (FR-002)', async () => {
  global.fetch.mockResolvedValueOnce(mockOrdersResponse([]));

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  await screen.findByText(/no hay órdenes/i);
  expect(global.fetch).toHaveBeenCalledTimes(1);

  global.fetch.mockResolvedValueOnce(mockOrdersResponse([]));
  fireEvent.click(screen.getByRole('button', { name: /refrescar/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
});
