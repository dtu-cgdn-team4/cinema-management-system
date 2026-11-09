import type { AuthResponse } from '../features/auth/types';
const KEY = 'cinema.session';
export function getSession(): AuthResponse | null {
  try {
    const raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthResponse;
    if (!session.token || !session.user || !Number.isFinite(Date.parse(session.expiresAt)) || Date.parse(session.expiresAt) <= Date.now()) {
      clearSession(); return null;
    }
    return session;
  } catch { clearSession(); return null; }
}
export function clearSession() {
  localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
  localStorage.removeItem('token'); localStorage.removeItem('user');
}
export function saveSession(session: AuthResponse, remember: boolean) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(session));
}
