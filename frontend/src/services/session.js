// 002-login-rbac: el JWT vive únicamente en cookies httpOnly (invisibles a JS,
// gestionadas por el navegador — Research §1). Aquí solo guardamos metadata NO
// sensible (role/userId) para render de UI (ej. redirect guard), nunca el token.
const KEY = 'fieldops.session';

export function getSession() {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession({ role, userId }) {
  sessionStorage.setItem(KEY, JSON.stringify({ role, userId }));
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}
