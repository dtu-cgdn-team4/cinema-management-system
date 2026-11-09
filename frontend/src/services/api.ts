import axios from 'axios';
import { getSession, clearSession } from './authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getSession()?.token;
  const isPublic = ['/auth/login', '/auth/google', '/auth/config'].includes(config.url || '');
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(response => response, error => {
  const current = getSession()?.token;
  if (error.response?.status === 401 && current && error.config?.headers?.Authorization === `Bearer ${current}`) {
    clearSession(); window.dispatchEvent(new Event('cinema:session-expired'));
  }
  return Promise.reject(error);
});
export function errorMessage(error: unknown, fallback = 'Không kết nối được máy chủ. Vui lòng thử lại.'): string {
  return axios.isAxiosError(error) && typeof error.response?.data?.message === 'string' ? error.response.data.message : fallback;
}

export default api;

