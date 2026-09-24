import axios from 'axios';

const TOKEN_KEY = 'velmora_token';

// Production safety: never let a misconfigured build silently point at the
// developer's machine. Resolution order:
//   1. VITE_API_URL baked in at build time (the correct approach for Render).
//   2. window.__VELMORA_API__ runtime override (set manually via the browser
//      console if you need to point at a different API without rebuilding).
//   3. Same-origin `/api` for local development (Vite proxy).
const LOCAL_API = 'http://localhost:5000/api';
const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const baseApiUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.__VELMORA_API__ : undefined) ||
  (isLocalHost ? LOCAL_API : '');

const api = axios.create({
  baseURL: baseApiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Attach the JWT automatically once authentication is available.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Requests that can legitimately fail with 401 without meaning "session gone".
const isCredentialRequest = (url = '') =>
  url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/users/password');

// Reduce any axios failure to a single human-readable message.
const extractMessage = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }

  const { response } = error;
  if (!response) {
    return 'Unable to reach the server. Please check your connection and try again.';
  }

  const data = response.data;
  if (data) {
    if (Array.isArray(data.errors) && data.errors.length) {
      return String(data.errors[0]);
    }
    if (data.errors && typeof data.errors === 'object') {
      const first = Object.values(data.errors)[0];
      if (first) return String(first);
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  }

  if (response.status >= 500) {
    return 'Something went wrong on our side. Please try again.';
  }

  return error.message || 'Something went wrong. Please try again.';
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = Boolean(localStorage.getItem(TOKEN_KEY));

    // An authenticated request was rejected: the session is no longer valid.
    if (status === 401 && hadToken && !isCredentialRequest(error.config?.url)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('velmora:unauthorized'));
    }

    const normalized = new Error(extractMessage(error));
    normalized.status = status;
    normalized.code = error.code;
    return Promise.reject(normalized);
  }
);

export default api;
