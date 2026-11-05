import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegister } from '../hooks/useRegister';
import { authApi } from '../api/authApi';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock authApi
vi.mock('../api/authApi', () => ({
  authApi: {
    register: vi.fn(),
  },
  default: {
    register: vi.fn(),
  },
}));

describe('useRegister hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.formData.username).toBe('');
    expect(result.current.formData.fullName).toBe('');
    expect(result.current.formData.email).toBe('');
    expect(result.current.formData.gender).toBe('MALE');
    expect(result.current.formData.phoneNumber).toBe('');
    expect(result.current.formData.password).toBe('');
    expect(result.current.formData.confirmPassword).toBe('');
    expect(result.current.formData.agreeTerms).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.serverError).toBeNull();
  });

  it('updates form fields via handleChange', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleChange('username', 'cinema_lover');
      result.current.handleChange('gender', 'FEMALE');
      result.current.handleChange('agreeTerms', true);
    });

    expect(result.current.formData.username).toBe('cinema_lover');
    expect(result.current.formData.gender).toBe('FEMALE');
    expect(result.current.formData.agreeTerms).toBe(true);
  });

  it('validates invalid email format', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleBlur('email');
      result.current.handleChange('email', 'not-an-email');
    });

    expect(result.current.errors.email).toBe('Email không đúng định dạng (VD: example@email.com).');
  });

  it('validates invalid phone number', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleBlur('phoneNumber');
      result.current.handleChange('phoneNumber', '12345');
    });

    expect(result.current.errors.phoneNumber).toBe('Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09).');
  });

  it('validates password requirement and matching confirmation', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleBlur('password');
      result.current.handleChange('password', 'Simple1'); // 7 chars, less than 8
    });

    expect(result.current.errors.password).toBe('Mật khẩu tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số.');

    act(() => {
      result.current.handleChange('password', 'ValidPassword1');
      result.current.handleBlur('confirmPassword');
      result.current.handleChange('confirmPassword', 'ValidPassword2');
    });

    expect(result.current.errors.password).toBeUndefined();
    expect(result.current.errors.confirmPassword).toBe('Mật khẩu xác nhận không khớp.');

    act(() => {
      result.current.handleChange('confirmPassword', 'ValidPassword1');
    });

    expect(result.current.errors.confirmPassword).toBeUndefined();
  });

  it('submits form successfully when all valid', async () => {
    vi.mocked(authApi.register).mockResolvedValueOnce({
      code: 200,
      message: 'Đăng ký thành công!',
      data: {
        username: 'validuser',
        email: 'user@cinema.com',
        fullName: 'Nguyễn Văn A',
      },
    });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleChange('username', 'validuser');
      result.current.handleChange('fullName', 'Nguyễn Văn A');
      result.current.handleChange('email', 'user@cinema.com');
      result.current.handleChange('phoneNumber', '0912345678');
      result.current.handleChange('dateOfBirth', '2000-01-01');
      result.current.handleChange('gender', 'MALE');
      result.current.handleChange('password', 'SecurePass1');
      result.current.handleChange('confirmPassword', 'SecurePass1');
      result.current.handleChange('agreeTerms', true);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(authApi.register).toHaveBeenCalledWith({
      username: 'validuser',
      fullName: 'Nguyễn Văn A',
      email: 'user@cinema.com',
      phoneNumber: '0912345678',
      dateOfBirth: '2000-01-01',
      gender: 'MALE',
      password: 'SecurePass1',
    });
    expect(result.current.successMessage).toBe('Đăng ký thành công!');
  });
});

