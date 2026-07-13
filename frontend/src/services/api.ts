import { clearSession } from './session';

const BASE = '/api/v1';

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: any) {
    super(body?.error || `error HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

// El JWT viaja en cookies httpOnly (credentials:'include'); nunca en un header
// leído desde JS (Research §1, FR-007).
async function request(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { ...options, credentials: 'include' });
  if (res.status === 401) clearSession();

  let body: any = null;
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

function generateIdempotencyKey(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export async function submitExecution(
  orderId: string,
  { notes, photos }: { notes: string; photos: File[] },
): Promise<any> {
  const form = new FormData();
  form.append('notes', notes);
  photos.forEach((file) => form.append('photos', file));

  return request(`/orders/${orderId}/executions`, {
    method: 'POST',
    headers: { 'Idempotency-Key': generateIdempotencyKey() },
    body: form,
  });
}

export async function createOrder(clientId: string): Promise<any> {
  return request('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  });
}

export async function assignOrder(
  orderId: string,
  { technicianId, expectedVersion }: { technicianId: string; expectedVersion: number },
): Promise<any> {
  return request(`/orders/${orderId}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ technicianId, expectedVersion }),
  });
}

export async function setTechnicianActive(technicianId: string, activo: boolean): Promise<any> {
  return request(`/technicians/${technicianId}/activo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activo }),
  });
}

export async function approveOrder(orderId: string): Promise<any> {
  return request(`/orders/${orderId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}

export async function rejectOrder(orderId: string, reason: string): Promise<any> {
  return request(`/orders/${orderId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
}

// 003-dispatcher-orders-ui FR-002a/FR-014: filtro combinable status/technicianId + paginación.
// Devuelve PaginatedOrders { items, page, pageSize, total }.
export async function listOrders({
  status,
  technicianId,
  page,
}: { status?: string; technicianId?: string; page?: number } = {}): Promise<any> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (technicianId) params.set('technicianId', technicianId);
  if (page) params.set('page', String(page));
  const qs = params.toString();
  return request(`/orders${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

// 003-dispatcher-orders-ui FR-003/FR-004 (desplegable, activo=true) / FR-011/FR-012 (listado).
// Devuelve PaginatedTechnicians { items, page, pageSize, total }.
export async function listTechnicians({
  activo,
  page,
}: { activo?: boolean; page?: number } = {}): Promise<any> {
  const params = new URLSearchParams();
  if (typeof activo === 'boolean') params.set('activo', String(activo));
  if (page) params.set('page', String(page));
  const qs = params.toString();
  return request(`/technicians${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function getOrder(orderId: string): Promise<any> {
  return request(`/orders/${orderId}`, { method: 'GET' });
}

// 003-dispatcher-orders-ui FR-021: búsqueda de clientes por cualquier campo.
// Devuelve PaginatedClients { items, page, pageSize, total }.
export async function searchClients({ q, page }: { q?: string; page?: number } = {}): Promise<any> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page) params.set('page', String(page));
  const qs = params.toString();
  return request(`/clients${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

// FR-015
export async function createClient({ nombre, email }: { nombre: string; email: string }): Promise<any> {
  return request('/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email }),
  });
}

// FR-016
export async function updateClient(clientId: string, { nombre, email }: { nombre?: string; email?: string }): Promise<any> {
  return request(`/clients/${clientId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email }),
  });
}

// FR-017
export async function setClientActive(clientId: string, activo: boolean): Promise<any> {
  return request(`/clients/${clientId}/activo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activo }),
  });
}

// FR-019
export async function createTechnician({ nombre, email }: { nombre: string; email: string }): Promise<any> {
  return request('/technicians', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email }),
  });
}

// FR-020
export async function updateTechnician(
  technicianId: string,
  { nombre, email }: { nombre?: string; email?: string },
): Promise<any> {
  return request(`/technicians/${technicianId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email }),
  });
}

// FR-023
export async function editOrderClient(
  orderId: string,
  { clientId, expectedVersion }: { clientId: string; expectedVersion: number },
): Promise<any> {
  return request(`/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, expectedVersion }),
  });
}

// FR-025
export async function cancelOrder(
  orderId: string,
  { reason, expectedVersion }: { reason: string; expectedVersion: number },
): Promise<any> {
  return request(`/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason, expectedVersion }),
  });
}

export { ApiError, generateIdempotencyKey };
