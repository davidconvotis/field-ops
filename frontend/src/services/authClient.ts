import { setSession, clearSession } from './session';

const BASE = '/api/v1/auth';

class AuthError extends Error {
  status: number;

  constructor(status: number, body: any) {
    super(body?.error || `error HTTP ${status}`);
    this.status = status;
  }
}

async function post(path: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}

// FR-001..FR-005: credenciales -> cookies httpOnly (access_token/refresh_token)
// emitidas por el backend; aquí solo se guarda role/userId (no el token) para UI.
export async function login(email: string, password: string): Promise<any> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new AuthError(res.status, body);

  setSession({ role: body.role, userId: body.userId });
  return body;
}

// FR-002a: renovación silenciosa del access_token vía refresh_token.
export async function refresh(): Promise<any> {
  const res = await post('/refresh');
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    clearSession();
    throw new AuthError(res.status, body);
  }
  setSession({ role: body.role, userId: body.userId });
  return body;
}

// FR-009: revoca el refresh token en el servidor (denylist) y limpia la sesión local.
export async function logout(): Promise<void> {
  await post('/logout');
  clearSession();
}

export { AuthError };
