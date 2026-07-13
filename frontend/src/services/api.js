import { clearSession } from './session.js';

const BASE = '/api/v1';

class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `error HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

// El JWT viaja en cookies httpOnly (credentials:'include'); nunca en un header
// leído desde JS (Research §1, FR-007).
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { ...options, credentials: 'include' });
  if (res.status === 401) clearSession();

  let body = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  if (!res.ok) throw new ApiError(res.status, body);
  return body;
}

function generateIdempotencyKey() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export async function submitExecution(orderId, { notes, photos }) {
  const form = new FormData();
  form.append('notes', notes);
  photos.forEach((file) => form.append('photos', file));

  return request(`/orders/${orderId}/executions`, {
    method: 'POST',
    headers: { 'Idempotency-Key': generateIdempotencyKey() },
    body: form,
  });
}

export async function createOrder(clientId) {
  return request('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  });
}

export async function assignOrder(orderId, { technicianId, expectedVersion }) {
  return request(`/orders/${orderId}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ technicianId, expectedVersion }),
  });
}

export async function setTechnicianActive(technicianId, activo) {
  return request(`/technicians/${technicianId}/activo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activo }),
  });
}

export async function approveOrder(orderId) {
  return request(`/orders/${orderId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}

export async function rejectOrder(orderId, reason) {
  return request(`/orders/${orderId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
}

// 003-dispatcher-orders-ui FR-002a/FR-014: filtro combinable status/technicianId + paginación.
// Devuelve PaginatedOrders { items, page, pageSize, total }.
export async function listOrders({ status, technicianId, page } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (technicianId) params.set('technicianId', technicianId);
  if (page) params.set('page', page);
  const qs = params.toString();
  return request(`/orders${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

// 003-dispatcher-orders-ui FR-003/FR-004 (desplegable, activo=true) / FR-011/FR-012 (listado).
// Devuelve PaginatedTechnicians { items, page, pageSize, total }.
export async function listTechnicians({ activo, page } = {}) {
  const params = new URLSearchParams();
  if (typeof activo === 'boolean') params.set('activo', String(activo));
  if (page) params.set('page', page);
  const qs = params.toString();
  return request(`/technicians${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function getOrder(orderId) {
  return request(`/orders/${orderId}`, { method: 'GET' });
}

export { ApiError, generateIdempotencyKey };
