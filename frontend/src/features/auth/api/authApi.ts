import apiClient from '@/services/apiClient';
import { RegisterPayload, RegisterResponse } from '../types';

export const authApi = {
  /**
   * Send user registration request to backend API (POST /api/v1/auth/register)
   * @param payload User registration payload
   * @returns ApiResponse with registered user information
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
    return response.data;
  },
};

export default authApi;

