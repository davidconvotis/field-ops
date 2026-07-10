import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { getSession } from './services/session.js';
import DispatcherBoard from './pages/DispatcherBoard.jsx';
import TechnicianExecutionForm from './pages/TechnicianExecutionForm.jsx';
import SupervisorReview from './pages/SupervisorReview.jsx';
import ClientOrders from './pages/ClientOrders.jsx';

function Home() {
  const session = getSession();
  return (
    <div>
      <h1>FieldOps</h1>
      <p>Rol activo: {session?.role ?? 'sin sesión'}</p>
      <nav>
        <ul>
          <li><Link to="/dispatcher">Dispatcher</Link></li>
          <li><Link to="/technician">Técnico</Link></li>
          <li><Link to="/supervisor">Supervisor</Link></li>
          <li><Link to="/client">Cliente</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dispatcher" element={<DispatcherBoard />} />
        <Route path="/technician" element={<TechnicianExecutionForm />} />
        <Route path="/supervisor" element={<SupervisorReview />} />
        <Route path="/client" element={<ClientOrders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
