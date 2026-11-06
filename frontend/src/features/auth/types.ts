export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface RegisterFormInputs {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: GenderType;
  idCard: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface RegisterPayload {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: GenderType;
  password: string;
  idCard?: string;
  address?: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string> | string[];
}

export interface RegisterResponseData {
  id?: number | string;
  username: string;
  email: string;
  fullName: string;
  role?: string;
  createdAt?: string;
}

export type RegisterResponse = ApiResponse<RegisterResponseData>;

export type RegisterFormErrors = Partial<Record<keyof RegisterFormInputs, string>>;

