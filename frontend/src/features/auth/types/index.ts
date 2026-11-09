export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  role: 'ROLE_USER' | 'ROLE_STAFF' | 'ROLE_ADMIN';
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface AuthConfig {
  googleClientId: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

