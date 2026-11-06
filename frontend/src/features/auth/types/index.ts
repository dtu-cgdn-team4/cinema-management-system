export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_STAFF' | 'ROLE_ADMIN';
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

