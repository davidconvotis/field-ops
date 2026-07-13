import { useState } from 'react';
import { approveOrder, rejectOrder, getOrder, ApiError } from '../services/api';

interface OrderDetail {
  id: string;
  summaryUnavailable?: boolean;
  summary?: string;
  summaryFallbackMessage?: string;
  [key: string]: unknown;
}

export default function SupervisorReview() {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  async function handleLoad() {
    try {
      const order = await getOrder(orderId);
      setOrderDetail(order);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  async function handleApprove() {
    try {
      const order = await approveOrder(orderId);
      setMessage(`Orden ${order.id} aprobada.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setMessage(`No se pudo aprobar: la orden ya está en estado '${(err.body as any)?.status}'.`);
      } else {
        setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
      }
    }
  }

  async function handleReject() {
    try {
      const order = await rejectOrder(orderId, reason);
      setMessage(`Orden ${order.id} rechazada.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setMessage('Debes indicar un motivo de rechazo.');
      } else if (err instanceof ApiError && err.status === 409) {
        setMessage(`No se pudo rechazar: la orden ya está en estado '${(err.body as any)?.status}'.`);
      } else {
        setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
      }
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h2 className="text-2xl font-semibold text-slate-800">Revisión del supervisor</h2>

      <div className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm text-slate-600">
          Orden ID
          <input
            value={orderId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderId(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="button"
          onClick={handleLoad}
          className="rounded-md bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
        >
          Cargar orden
        </button>

        {orderDetail && (
          <div className="rounded-md bg-slate-50 p-3">
            <h3 className="font-medium text-slate-700">Resumen de notas del técnico</h3>
            {orderDetail.summaryUnavailable && (
              <p className="text-sm text-amber-700">
                Resumen no disponible (el servicio de resumen falló o excedió el tiempo límite).
              </p>
            )}
            {!orderDetail.summaryUnavailable && orderDetail.summary && (
              <p className="text-sm text-slate-700">{orderDetail.summary}</p>
            )}
            {!orderDetail.summaryUnavailable && !orderDetail.summary && orderDetail.summaryFallbackMessage && (
              <p className="text-sm text-slate-700">{orderDetail.summaryFallbackMessage}</p>
            )}
          </div>
        )}

        <label className="block text-sm text-slate-600">
          Motivo de rechazo
          <input
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApprove}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Aprobar
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Rechazar
          </button>
        </div>
      </div>

      {message && (
        <p role="status" className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}
