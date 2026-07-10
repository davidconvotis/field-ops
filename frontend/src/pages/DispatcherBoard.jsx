import { useState } from 'react';
import { createOrder, assignOrder, setTechnicianActive, ApiError } from '../services/api.js';

export default function DispatcherBoard() {
  const [clientId, setClientId] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [expectedVersion, setExpectedVersion] = useState(0);
  const [technicianToToggle, setTechnicianToToggle] = useState('');
  const [message, setMessage] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const order = await createOrder(clientId);
      setLastOrder(order);
      setMessage(`Orden creada: ${order.id} (${order.status})`);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  async function handleAssign(e) {
    e.preventDefault();
    try {
      const order = await assignOrder(orderId, { technicianId, expectedVersion: Number(expectedVersion) });
      setMessage(`Orden ${order.id} asignada a ${order.technicianId}`);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  async function handleToggleActive(activo) {
    try {
      await setTechnicianActive(technicianToToggle, activo);
      setMessage(`Técnico ${technicianToToggle} ahora activo=${activo}`);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  return (
    <div>
      <h2>Panel de Dispatcher</h2>

      <form onSubmit={handleCreate}>
        <h3>Crear orden</h3>
        <label>
          Cliente ID
          <input value={clientId} onChange={(e) => setClientId(e.target.value)} required />
        </label>
        <button type="submit">Crear</button>
      </form>

      <form onSubmit={handleAssign}>
        <h3>(Re)asignar técnico</h3>
        <label>
          Orden ID
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
        </label>
        <label>
          Técnico ID
          <input value={technicianId} onChange={(e) => setTechnicianId(e.target.value)} required />
        </label>
        <label>
          Versión esperada
          <input type="number" value={expectedVersion} onChange={(e) => setExpectedVersion(e.target.value)} />
        </label>
        <button type="submit">Asignar</button>
      </form>

      <div>
        <h3>Activar / desactivar técnico</h3>
        <input placeholder="Técnico ID" value={technicianToToggle} onChange={(e) => setTechnicianToToggle(e.target.value)} />
        <button type="button" onClick={() => handleToggleActive(true)}>Activar</button>
        <button type="button" onClick={() => handleToggleActive(false)}>Desactivar</button>
      </div>

      {message && <p role="status">{message}</p>}
      {lastOrder && <pre>{JSON.stringify(lastOrder, null, 2)}</pre>}
    </div>
  );
}
