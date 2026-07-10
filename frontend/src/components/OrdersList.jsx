import { useEffect, useState } from 'react';
import { listOrders, ApiError } from '../services/api.js';

export default function OrdersList() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Error inesperado'));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!orders) return <p>Cargando…</p>;
  if (orders.length === 0) return <p>No hay órdenes para mostrar.</p>;

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.id} — {order.status}
        </li>
      ))}
    </ul>
  );
}
