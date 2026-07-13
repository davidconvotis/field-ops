import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import { setSession } from '../src/services/session.js';

beforeEach(() => {
  sessionStorage.clear();
  global.fetch = jest.fn();
});

test('sin sesión, cualquier ruta redirige al login', () => {
  window.history.pushState({}, '', '/dispatcher');
  render(<App />);
  expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('raíz sin sesión renderiza el login', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('rol distinto de dispatcher no accede a /dispatcher/orders (FR-010)', () => {
  setSession({ role: 'tecnico', userId: 'u1' });
  window.history.pushState({}, '', '/dispatcher/orders');
  render(<App />);
  expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('rol distinto de dispatcher no accede a /dispatcher/technicians (FR-010)', () => {
  setSession({ role: 'cliente', userId: 'u1' });
  window.history.pushState({}, '', '/dispatcher/technicians');
  render(<App />);
  expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
});
