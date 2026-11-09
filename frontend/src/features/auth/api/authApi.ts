import api from '../../../services/api';
import { AuthConfig, AuthResponse, LoginFormData, User } from '../types';

export const loginApi = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const googleLoginApi = async (token: string, rememberMe: boolean): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/google', { token, rememberMe });
  return response.data;
};

export const getAuthConfig = async () => (await api.get<AuthConfig>('/auth/config')).data;
export const getCurrentUser = async () => (await api.get<User>('/auth/me')).data;
export const logoutApi = async () => { await api.post('/auth/logout'); };

