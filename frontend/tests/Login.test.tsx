import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/Login';

beforeEach(() => {
  sessionStorage.clear();
  globalThis.fetch = jest.fn() as jest.Mock;
});

test('renderiza formulario email/password con clases Tailwind', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/contraseña/i);
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(emailInput.className).toMatch(/rounded-md/);
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
});

test('submit con credenciales válidas llama al backend y no muestra error', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ userId: 'u1', role: 'dispatcher' }),
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secret' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledWith(
    '/api/v1/auth/login',
    expect.objectContaining({ credentials: 'include' }),
  ));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('submit con credenciales inválidas muestra mensaje genérico (FR-003)', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: async () => ({ error: 'Credenciales inválidas' }),
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas');
});
