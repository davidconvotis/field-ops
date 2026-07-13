import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getSession } from './services/session';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import DispatcherLayout from './pages/DispatcherLayout';
import DispatcherOrders from './pages/DispatcherOrders';
import DispatcherTechnicians from './pages/DispatcherTechnicians';
import TechnicianExecutionForm from './pages/TechnicianExecutionForm';
import SupervisorReview from './pages/SupervisorReview';
import ClientOrders from './pages/ClientOrders';

// FR-006: oculta rutas de rol no permitido para la sesión activa (capa UI —
// el backend sigue siendo la verificación real vía 401/403, Principio I).
function RequireRole({ role, children }: { role: string; children: ReactNode }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to="/login" replace />;
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dispatcher"
          element={(
            <RequireRole role="dispatcher">
              <DispatcherLayout />
            </RequireRole>
          )}
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<DispatcherOrders />} />
          <Route path="technicians" element={<DispatcherTechnicians />} />
        </Route>
        <Route
          path="/technician"
          element={(
            <RequireRole role="tecnico">
              <TechnicianExecutionForm />
            </RequireRole>
          )}
        />
        <Route
          path="/supervisor"
          element={(
            <RequireRole role="supervisor">
              <SupervisorReview />
            </RequireRole>
          )}
        />
        <Route
          path="/client"
          element={(
            <RequireRole role="cliente">
              <ClientOrders />
            </RequireRole>
          )}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
