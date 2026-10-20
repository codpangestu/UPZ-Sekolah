import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_KEY = 'menara23apikey';

// Service-specific base URLs
export const AUTH_URL = 'http://localhost:8001';
export const MASJID_URL = 'http://localhost:8002';
export const CONTENT_URL = 'http://localhost:8003';
export const TRANSACTION_URL = 'http://localhost:8004';
export const ADMIN_URL = 'http://localhost:8005';

interface CreateApiClientOptions {
  /** Sertakan header x-api-key (diperlukan hampir semua endpoint privat). */
  withApiKey?: boolean;
}

function createApiClient(baseURL: string, options: CreateApiClientOptions = {}) {
  const client = axios.create({
    baseURL,
    timeout: 15000, // cegah request menggantung → UI loading stuck (mis. backend mati)
    headers: {
      'Content-Type': 'application/json',
      ...(options.withApiKey ? { 'x-api-key': API_KEY } : {}),
    },
  });

  // Request interceptor: pasang Authorization Bearer dari authStore secara
  // real-time ke SEMUA instance — token selalu terbaca walau halaman di-refresh.
  // Store adalah single source of truth: jika token kosong, header dihapus
  // eksplisit agar token lama tidak bocor (mis. setelah auto-logout 401).
  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });

  // Response interceptor: 401 (token invalid/expired) → bersihkan sesi & arahkan ke login.
  // Endpoint auth publik (login/register/logout) dikecualikan karena 401 di sana
  // adalah error normal (mis. password salah) yang ditangani halaman login.
  const AUTH_PUBLIC_PATHS = [
    '/api/v1/login',
    '/api/v1/login/admin-masjid',
    '/api/v1/login/admin-pusat',
    '/api/v1/login/admin-kua',
    '/api/v1/register/user',
    '/api/v1/logout',
  ];
  client.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      const url: string = error?.config?.url || '';
      // Gunakan daftar eksak (bukan regex) agar /users/register tidak terkecualikan
      const isAuthPublicEndpoint = AUTH_PUBLIC_PATHS.some((p) => url.endsWith(p));
      if (status === 401 && !isAuthPublicEndpoint) {
        const { isAuthenticated, token, logout } = useAuthStore.getState();
        if (isAuthenticated || token) {
          logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

// 5 instance Axios — satu per microservice
export const authApi = createApiClient(AUTH_URL, { withApiKey: true });
export const masjidApi = createApiClient(MASJID_URL, { withApiKey: true });
export const contentApi = createApiClient(CONTENT_URL);
export const transactionApi = createApiClient(TRANSACTION_URL, { withApiKey: true });
export const adminApi = createApiClient(ADMIN_URL, { withApiKey: true });

// Set/bersihkan Authorization header pada semua instance (backward compat —
// interceptor request di atas sudah otomatis membaca token dari store).
export const setAuthToken = (token: string | null) => {
  const header = token ? `Bearer ${token}` : undefined;
  [authApi, masjidApi, contentApi, transactionApi, adminApi].forEach((instance) => {
    if (header) {
      instance.defaults.headers.common['Authorization'] = header;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }
  });
};
