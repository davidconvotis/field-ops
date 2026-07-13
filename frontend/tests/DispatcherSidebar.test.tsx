import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DispatcherSidebar from '../src/components/DispatcherSidebar';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DispatcherSidebar />
      <Routes>
        <Route path="/dispatcher/orders" element={<div>Vista Órdenes</div>} />
        <Route path="/dispatcher/technicians" element={<div>Vista Técnicos</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

test('resalta la sección activa según la ruta', () => {
  renderAt('/dispatcher/orders');
  expect(screen.getByRole('link', { name: /órdenes/i })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: /técnicos/i })).not.toHaveAttribute('aria-current');
});

test('navega al hacer click en Técnicos', () => {
  renderAt('/dispatcher/orders');
  fireEvent.click(screen.getByRole('link', { name: /técnicos/i }));
  expect(screen.getByText('Vista Técnicos')).toBeInTheDocument();
});
