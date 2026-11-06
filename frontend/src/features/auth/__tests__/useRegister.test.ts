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
    expect(result.current.formData.idCard).toBe('');
    expect(result.current.formData.address).toBe('');
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

  it('validates optional idCard and address conditionally', () => {
    const { result } = renderHook(() => useRegister());

    // When empty, no errors
    act(() => {
      result.current.handleBlur('idCard');
      result.current.handleBlur('address');
    });
    expect(result.current.errors.idCard).toBeUndefined();
    expect(result.current.errors.address).toBeUndefined();

    // When invalid, shows error
    act(() => {
      result.current.handleChange('idCard', '1234');
      result.current.handleChange('address', 'abc');
    });
    expect(result.current.errors.idCard).toBe('Số CCCD/CMND không hợp lệ (gồm 12 số CCCD hoặc 9 số CMND).');
    expect(result.current.errors.address).toBe('Địa chỉ phải có độ dài từ 5 đến 255 ký tự.');

    // When valid, clears error
    act(() => {
      result.current.handleChange('idCard', '048202001234');
      result.current.handleChange('address', '123 Hải Phòng, Đà Nẵng');
    });
    expect(result.current.errors.idCard).toBeUndefined();
    expect(result.current.errors.address).toBeUndefined();
  });

  it('submits form with optional fields included in payload when provided', async () => {
    vi.mocked(authApi.register).mockResolvedValueOnce({
      code: 200,
      message: 'Đăng ký thành công!',
    });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleChange('username', 'fulluser');
      result.current.handleChange('fullName', 'Trần Thị B');
      result.current.handleChange('email', 'tranb@cinema.com');
      result.current.handleChange('phoneNumber', '0987654321');
      result.current.handleChange('dateOfBirth', '1998-05-15');
      result.current.handleChange('gender', 'FEMALE');
      result.current.handleChange('idCard', '048202001234');
      result.current.handleChange('address', '123 Nguyễn Văn Linh');
      result.current.handleChange('password', 'SecurePass1');
      result.current.handleChange('confirmPassword', 'SecurePass1');
      result.current.handleChange('agreeTerms', true);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(authApi.register).toHaveBeenCalledWith({
      username: 'fulluser',
      fullName: 'Trần Thị B',
      email: 'tranb@cinema.com',
      phoneNumber: '0987654321',
      dateOfBirth: '1998-05-15',
      gender: 'FEMALE',
      password: 'SecurePass1',
      idCard: '048202001234',
      address: '123 Nguyễn Văn Linh',
    });
  });
});

