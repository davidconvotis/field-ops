import { render, screen } from '@testing-library/react';
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
