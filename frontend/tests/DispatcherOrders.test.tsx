import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DispatcherOrders from '../src/pages/DispatcherOrders';

interface OrderItem {
  id: string;
  status: string;
  clientNombre: string;
  technicianNombre: string | null;
  createdAt: string;
}

function mockOrdersResponse(items: OrderItem[], overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify({ items, page: 1, pageSize: 50, total: items.length, ...overrides }),
  };
}

beforeEach(() => {
  globalThis.fetch = jest.fn() as jest.Mock;
});

test('renderiza listado con id/estado/cliente/técnico/fecha', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
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
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  expect(await screen.findByText(/no hay órdenes/i)).toBeInTheDocument();
});

test('aplicar filtro por estado dispara una nueva petición con el query param', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  await screen.findByText(/no hay órdenes/i);

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));
  fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'pendiente_de_revision' } });

  await waitFor(() =>
    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('status=pendiente_de_revision'),
      expect.anything(),
    ),
  );
});

test('botón Refrescar dispara una nueva petición; no hay refetch automático sin click (FR-002)', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  await screen.findByText(/no hay órdenes/i);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));
  fireEvent.click(screen.getByRole('button', { name: /refrescar/i }));

  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));
});
