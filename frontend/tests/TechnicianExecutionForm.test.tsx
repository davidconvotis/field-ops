import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TechnicianExecutionForm from '../src/pages/TechnicianExecutionForm';

test('renderiza el formulario de ejecución con campos requeridos', () => {
  render(
    <MemoryRouter>
      <TechnicianExecutionForm />
    </MemoryRouter>,
  );

  expect(screen.getByText(/Registrar ejecución/i)).toBeInTheDocument();
  expect(screen.getByText(/Orden ID/i)).toBeInTheDocument();
  expect(screen.getByText(/Notas/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Enviar ejecución/i })).toBeInTheDocument();
});
