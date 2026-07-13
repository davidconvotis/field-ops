import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientSearchSelect from '../src/components/ClientSearchSelect';

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

test('busca con debounce (300ms) y muestra resultados clicables', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockClientsResponse([{ id: 'c1', nombre: 'Cliente Uno', email: 'uno@test.dev', activo: true }]),
  );

  const onSelect = jest.fn();
  render(<ClientSearchSelect onSelect={onSelect} />);

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Uno' } });

  expect(globalThis.fetch).not.toHaveBeenCalled();

  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('q=Uno'), expect.anything()), {
    timeout: 1000,
  });

  const resultButton = await screen.findByRole('button', { name: /Cliente Uno/ });
  expect(resultButton).toBeInTheDocument();

  fireEvent.click(resultButton);
  expect(onSelect).toHaveBeenCalledWith('c1');
});

test('sin coincidencias ofrece crear cliente nuevo', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockClientsResponse([]));

  const onCreateNew = jest.fn();
  render(<ClientSearchSelect onSelect={() => {}} onCreateNew={onCreateNew} />);

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'NoExiste' } });

  const createButton = await screen.findByRole('button', { name: /crear cliente/i }, { timeout: 1000 });
  fireEvent.click(createButton);
  expect(onCreateNew).toHaveBeenCalledWith('NoExiste');
});
