import { NavLink } from 'react-router-dom';

// FR-008/FR-009: menú lateral persistente, resalta la sección activa.
export default function DispatcherSidebar() {
  const linkClass = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`;

  return (
    <nav className="w-48 shrink-0 space-y-1 border-r border-slate-200 bg-white p-4">
      <NavLink to="/dispatcher/orders" className={linkClass}>
        Órdenes
      </NavLink>
      <NavLink to="/dispatcher/technicians" className={linkClass}>
        Técnicos
      </NavLink>
    </nav>
  );
}
