import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/session';
import { logout } from '../services/authClient';

// FR-009 (logout) + FR-006 (la ausencia de esta barra en rutas no permitidas para
// el rol activo ya la impone RequireRole en App.jsx; aquí solo se muestra el rol
// activo y la acción de cerrar sesión).
export default function NavBar() {
  const session = getSession();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="flex items-center justify-between bg-slate-800 px-4 py-3 text-white">
      <span className="font-medium">FieldOps</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">Rol: {session?.role ?? 'sin sesión'}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
