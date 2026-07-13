import { useEffect, useState } from 'react';
import { listOrders, ApiError } from '../services/api.js';

export default function OrdersList() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listOrders()
      .then((result) => setOrders(result.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Error inesperado'));
  }, []);

  if (error) return <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (!orders) return <p className="text-sm text-slate-500">Cargando…</p>;
  if (orders.length === 0) return <p className="text-sm text-slate-500">No hay órdenes para mostrar.</p>;

  return (
    <ul className="space-y-2">
      {orders.map((order) => (
        <li key={order.id} className="rounded-md bg-white p-3 shadow-sm">
          {order.id} — {order.status}
        </li>
      ))}
    </ul>
  );
}
