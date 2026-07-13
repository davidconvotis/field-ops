import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

test('editar cliente de una orden no terminal (reutiliza ClientSearchSelect)', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockOrdersResponse([
      { id: 'o1', status: 'sin_asignar', clientNombre: 'Cliente Uno', technicianNombre: null, createdAt: '2026-07-13T00:00:00.000Z' },
    ]),
  );

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  const row = (await screen.findByText('o1')).closest('tr') as HTMLElement;
  fireEvent.click(within(row).getByRole('button', { name: /editar cliente/i }));

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    text: async () => JSON.stringify({ items: [{ id: 'c2', nombre: 'Cliente Dos', email: 'dos@test.dev', activo: true }], page: 1, pageSize: 50, total: 1 }),
  });
  fireEvent.change(within(row).getByPlaceholderText(/buscar cliente/i), { target: { value: 'Dos' } });

  const resultButton = await within(row).findByRole('button', { name: /Cliente Dos/ });

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, text: async () => JSON.stringify({ id: 'o1' }) });
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));
  fireEvent.click(resultButton);

  await waitFor(() =>
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/v1/orders/o1',
      expect.objectContaining({ method: 'PATCH' }),
    ),
  );
});

test('cancelar orden exige motivo antes de confirmar', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockOrdersResponse([
      { id: 'o1', status: 'sin_asignar', clientNombre: 'Cliente Uno', technicianNombre: null, createdAt: '2026-07-13T00:00:00.000Z' },
    ]),
  );

  render(
    <MemoryRouter>
      <DispatcherOrders />
    </MemoryRouter>,
  );

  await screen.findByText('o1');
  fireEvent.click(screen.getByRole('button', { name: /^cancelar$/i }));

  const confirmButton = screen.getByRole('button', { name: /confirmar cancelación/i });
  expect(confirmButton).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/motivo/i), { target: { value: 'Ya no se necesita' } });
  expect(confirmButton).not.toBeDisabled();

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, text: async () => JSON.stringify({ id: 'o1', status: 'cancelada' }) });
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockOrdersResponse([]));
  fireEvent.click(confirmButton);

  await waitFor(() =>
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/v1/orders/o1/cancel',
      expect.objectContaining({ method: 'POST' }),
    ),
  );
});
