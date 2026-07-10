import { useState } from 'react';
import { approveOrder, rejectOrder, getOrder, ApiError } from '../services/api.js';

export default function SupervisorReview() {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);

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
        setMessage(`No se pudo aprobar: la orden ya está en estado '${err.body?.status}'.`);
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
        setMessage(`No se pudo rechazar: la orden ya está en estado '${err.body?.status}'.`);
      } else {
        setMessage(err instanceof ApiError ? err.message : 'Error inesperado');
      }
    }
  }

  return (
    <div>
      <h2>Revisión del supervisor</h2>
      <label>
        Orden ID
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
      </label>
      <button type="button" onClick={handleLoad}>Cargar orden</button>

      {orderDetail && (
        <div>
          <h3>Resumen de notas del técnico</h3>
          {orderDetail.summaryUnavailable && <p>Resumen no disponible (el servicio de resumen falló o excedió el tiempo límite).</p>}
          {!orderDetail.summaryUnavailable && orderDetail.summary && <p>{orderDetail.summary}</p>}
          {!orderDetail.summaryUnavailable && !orderDetail.summary && orderDetail.summaryFallbackMessage && (
            <p>{orderDetail.summaryFallbackMessage}</p>
          )}
        </div>
      )}

      <label>
        Motivo de rechazo
        <input value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <button type="button" onClick={handleApprove}>Aprobar</button>
      <button type="button" onClick={handleReject}>Rechazar</button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
