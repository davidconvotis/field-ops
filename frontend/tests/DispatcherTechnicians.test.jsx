import { render, screen } from '@testing-library/react';
import DispatcherTechnicians from '../src/pages/DispatcherTechnicians.jsx';

function mockTechniciansResponse(items) {
  return { ok: true, status: 200, text: async () => JSON.stringify({ items, page: 1, pageSize: 50, total: items.length }) };
}

beforeEach(() => {
  global.fetch = jest.fn();
});

test('renderiza listado con estado y conteo de órdenes activas', async () => {
  global.fetch.mockResolvedValueOnce(
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
  global.fetch.mockResolvedValueOnce(mockTechniciansResponse([]));

  render(<DispatcherTechnicians />);

  expect(await screen.findByText(/no hay técnicos/i)).toBeInTheDocument();
});
