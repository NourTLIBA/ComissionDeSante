// Tiny client for the Expert Visiteur backend (see /backend).
// The address comes from VITE_API_URL (.env.development / .env.production).
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const TOKEN_KEY = 'expertVisiteur_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
};
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Serveur injoignable. Vérifiez votre connexion.');
  }
  return res;
}

export async function api(path, opts) {
  const res = await request(path, opts);
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    // An expired session on a protected call sends the user back to the login page.
    // (A wrong password on /auth/login is also a 401 but there is no session to end.)
    if (res.status === 401 && getToken() && path !== '/auth/login') {
      window.dispatchEvent(new Event('auth-expired'));
    }
    throw new ApiError(res.status, data?.error || `Erreur ${res.status}`);
  }
  return data;
}

// Admin: download all visits as a CSV file.
export async function downloadEvaluationsCsv() {
  const res = await request('/evaluations/export.csv');
  if (!res.ok) throw new ApiError(res.status, 'Export impossible');
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url;
  a.download = 'evaluations.csv';
  a.click();
  URL.revokeObjectURL(url);
}
