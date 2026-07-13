import { render, screen, fireEvent } from '@testing-library/react';
import ReassignConfirmModal from '../src/components/ReassignConfirmModal.jsx';

test('muestra técnico anterior y confirma/cancela', () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  render(
    <ReassignConfirmModal previousTechnicianNombre="Tecnico Anterior" onConfirm={onConfirm} onCancel={onCancel} />,
  );

  expect(screen.getByText(/Tecnico Anterior/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onConfirm).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
  expect(onConfirm).toHaveBeenCalledTimes(1);
});
