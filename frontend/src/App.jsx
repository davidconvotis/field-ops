import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getSession } from './services/session.js';
import Login from './pages/Login.jsx';
import NavBar from './components/NavBar.jsx';
import DispatcherLayout from './pages/DispatcherLayout.jsx';
import DispatcherOrders from './pages/DispatcherOrders.jsx';
import DispatcherTechnicians from './pages/DispatcherTechnicians.jsx';
import TechnicianExecutionForm from './pages/TechnicianExecutionForm.jsx';
import SupervisorReview from './pages/SupervisorReview.jsx';
import ClientOrders from './pages/ClientOrders.jsx';

// FR-006: oculta rutas de rol no permitido para la sesión activa (capa UI —
// el backend sigue siendo la verificación real vía 401/403, Principio I).
function RequireRole({ role, children }) {
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
