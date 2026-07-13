import { render, screen, fireEvent } from '@testing-library/react';
import DispatcherTechnicians from '../src/pages/DispatcherTechnicians';

interface TechnicianItem {
  id: string;
  nombre: string;
  activo: boolean;
  activeOrderCount: number;
}

function mockTechniciansResponse(items: TechnicianItem[]) {
  return { ok: true, status: 200, text: async () => JSON.stringify({ items, page: 1, pageSize: 50, total: items.length }) };
}

beforeEach(() => {
  globalThis.fetch = jest.fn() as jest.Mock;
});

test('renderiza listado con estado y conteo de órdenes activas', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockTechniciansResponse([
      { id: 't1', nombre: 'Tecnico Uno', activo: true, activeOrderCount: 3 },
      { id: 't2', nombre: 'Tecnico Dos', activo: false, activeOrderCount: 0 },
    ]),
  );

  render(<DispatcherTechnicians />);

  expect(await screen.findByText('Tecnico Uno')).toBeInTheDocument();
  expect(screen.getByText('Tecnico Dos')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('estado vacío cuando no hay técnicos', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockTechniciansResponse([]));

  render(<DispatcherTechnicians />);

  expect(await screen.findByText(/no hay técnicos/i)).toBeInTheDocument();
});

test('crea un técnico nuevo', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockTechniciansResponse([]));
  render(<DispatcherTechnicians />);
  await screen.findByText(/no hay técnicos/i);

  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 201,
    text: async () => JSON.stringify({ id: 't2', nombre: 'Tecnico Nuevo', email: 'nuevo@test.dev', activo: true }),
  });
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockTechniciansResponse([{ id: 't2', nombre: 'Tecnico Nuevo', activo: true, activeOrderCount: 0 }]),
  );

  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Tecnico Nuevo' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nuevo@test.dev' } });
  fireEvent.click(screen.getByRole('button', { name: /crear/i }));

  expect(await screen.findByText('Tecnico Nuevo')).toBeInTheDocument();
});

test('muestra error 409 al crear con email duplicado', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockTechniciansResponse([]));
  render(<DispatcherTechnicians />);
  await screen.findByText(/no hay técnicos/i);

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
