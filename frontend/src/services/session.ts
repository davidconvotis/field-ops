// 002-login-rbac: el JWT vive únicamente en cookies httpOnly (invisibles a JS,
// gestionadas por el navegador — Research §1). Aquí solo guardamos metadata NO
// sensible (role/userId) para render de UI (ej. redirect guard), nunca el token.
const KEY = 'fieldops.session';

export interface Session {
  role: string;
  userId: string;
}

export function getSession(): Session | null {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession({ role, userId }: Session): void {
  sessionStorage.setItem(KEY, JSON.stringify({ role, userId }));
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY);
}
