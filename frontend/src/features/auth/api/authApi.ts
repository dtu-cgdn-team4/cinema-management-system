import api from '../../../services/api';
import { AuthResponse, LoginFormData } from '../types';

export const loginApi = async (data: Omit<LoginFormData, 'rememberMe'>): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const googleLoginApi = async (token: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/google', { token });
  return response.data;
};

