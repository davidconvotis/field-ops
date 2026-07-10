// Constitución: los tokens NUNCA se almacenan en localStorage.
// Usamos sessionStorage (se limpia al cerrar la pestaña) en vez de localStorage.
const KEY = 'fieldops.session';

export function getSession() {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession({ token, role, userId }) {
  sessionStorage.setItem(KEY, JSON.stringify({ token, role, userId }));
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}
