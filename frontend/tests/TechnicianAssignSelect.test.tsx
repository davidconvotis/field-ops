import { render, screen, waitFor } from '@testing-library/react';
import TechnicianAssignSelect from '../src/components/TechnicianAssignSelect';

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

test('solo lista técnicos activos', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockTechniciansResponse([{ id: 't1', nombre: 'Tecnico Activo', activo: true, activeOrderCount: 0 }]),
  );

  render(<TechnicianAssignSelect onSelect={() => {}} />);

  expect(await screen.findByText('Tecnico Activo')).toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('activo=true'), expect.anything());
});

test('muestra mensaje si no hay técnicos activos disponibles (FR-007)', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockTechniciansResponse([]));

  render(<TechnicianAssignSelect onSelect={() => {}} />);

  await waitFor(() => expect(screen.getByText(/no hay técnicos disponibles/i)).toBeInTheDocument());
});
