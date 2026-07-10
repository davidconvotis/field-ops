import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';

test('renderiza la home con navegación a las 4 vistas por rol', () => {
  render(<App />);
  expect(screen.getByText('FieldOps')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Dispatcher' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Técnico' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Supervisor' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Cliente' })).toBeInTheDocument();
});
