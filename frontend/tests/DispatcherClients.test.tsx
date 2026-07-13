import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DispatcherClients from '../src/pages/DispatcherClients';

interface ClientItem {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

function mockClientsResponse(items: ClientItem[]) {
  return { ok: true, status: 200, text: async () => JSON.stringify({ items, page: 1, pageSize: 50, total: items.length }) };
}

beforeEach(() => {
  globalThis.fetch = jest.fn() as jest.Mock;
});

test('renderiza listado de clientes', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockClientsResponse([{ id: 'c1', nombre: 'Cliente Uno', email: 'uno@test.dev', activo: true }]),
  );

  render(<DispatcherClients />);

  expect(await screen.findByText('Cliente Uno')).toBeInTheDocument();
  expect(screen.getByText('uno@test.dev')).toBeInTheDocument();
});

test('estado vacío cuando no hay clientes', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockClientsResponse([]));

  render(<DispatcherClients />);

  expect(await screen.findByText(/no hay clientes/i)).toBeInTheDocument();
});

test('crea un cliente nuevo', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockClientsResponse([]));
  render(<DispatcherClients />);
  await screen.findByText(/no hay clientes/i);

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 201,
    text: async () => JSON.stringify({ id: 'c2', nombre: 'Cliente Nuevo', email: 'nuevo@test.dev', activo: true }),
  });
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockClientsResponse([{ id: 'c2', nombre: 'Cliente Nuevo', email: 'nuevo@test.dev', activo: true }]),
  );

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Cliente Nuevo' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nuevo@test.dev' } });
  fireEvent.click(screen.getByRole('button', { name: /crear/i }));

  expect(await screen.findByText('Cliente Nuevo')).toBeInTheDocument();
});

test('muestra error 409 al crear con email duplicado', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockClientsResponse([]));
  render(<DispatcherClients />);
  await screen.findByText(/no hay clientes/i);

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 409,
    text: async () => JSON.stringify({ error: 'email ya registrado por otro usuario' }),
  });

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Dup' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dup@test.dev' } });
  fireEvent.click(screen.getByRole('button', { name: /crear/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/email ya registrado/i);
});

test('da de baja un cliente (activo -> false)', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockClientsResponse([{ id: 'c1', nombre: 'Cliente Uno', email: 'uno@test.dev', activo: true }]),
  );
  render(<DispatcherClients />);
  await screen.findByText('Cliente Uno');

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    text: async () => JSON.stringify({ id: 'c1', nombre: 'Cliente Uno', email: 'uno@test.dev', activo: false }),
  });
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockClientsResponse([{ id: 'c1', nombre: 'Cliente Uno', email: 'uno@test.dev', activo: false }]),
  );

  fireEvent.click(screen.getByRole('button', { name: /desactivar/i }));

  await waitFor(() => expect(screen.getByText('inactivo')).toBeInTheDocument());
});
