import { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authApi } from '../api/authApi';
import {
  RegisterFormInputs,
  RegisterFormErrors,
  RegisterPayload,
  ApiResponse,
  GenderType,
} from '../types';

const INITIAL_FORM_VALUES: RegisterFormInputs = {
  username: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: 'MALE',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
};

// Regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export const useRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormInputs>(INITIAL_FORM_VALUES);
  const formDataRef = useRef<RegisterFormInputs>(INITIAL_FORM_VALUES);
  formDataRef.current = formData;

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormInputs, boolean>>>({});
  const touchedRef = useRef<Partial<Record<keyof RegisterFormInputs, boolean>>>({});
  touchedRef.current = touched;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Validate a single field
   */
  const validateField = (
    name: keyof RegisterFormInputs,
    value: unknown,
    allValues = formDataRef.current
  ): string | undefined => {
    switch (name) {
      case 'username': {
        const strVal = String(value || '').trim();
        if (!strVal) return 'Vui lòng nhập tên tài khoản.';
        if (!USERNAME_REGEX.test(strVal)) {
          return 'Tài khoản từ 3-30 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới.';
        }
        return undefined;
      }

      case 'fullName': {
        const strVal = String(value || '').trim();
        if (!strVal) return 'Vui lòng nhập họ và tên.';
        if (strVal.length < 2) return 'Họ và tên tối thiểu 2 ký tự.';
        return undefined;
      }

      case 'email': {
        const strVal = String(value || '').trim();
        if (!strVal) return 'Vui lòng nhập email.';
        if (!EMAIL_REGEX.test(strVal)) return 'Email không đúng định dạng (VD: example@email.com).';
        return undefined;
      }

      case 'phoneNumber': {
        const strVal = String(value || '').trim();
        if (!strVal) return 'Vui lòng nhập số điện thoại.';
        if (!PHONE_REGEX.test(strVal)) {
          return 'Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09).';
        }
        return undefined;
      }

      case 'dateOfBirth': {
        const strVal = String(value || '').trim();
        if (!strVal) return 'Vui lòng chọn ngày sinh.';
        const birthDate = new Date(strVal);
        const today = new Date();
        if (isNaN(birthDate.getTime()) || birthDate >= today) {
          return 'Ngày sinh không hợp lệ.';
        }
        return undefined;
      }

      case 'gender': {
        if (!value) return 'Vui lòng chọn giới tính.';
        return undefined;
      }

      case 'password': {
        const strVal = String(value || '');
        if (!strVal) return 'Vui lòng tạo mật khẩu.';
        if (!PASSWORD_REGEX.test(strVal)) {
          return 'Mật khẩu tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số.';
        }
        return undefined;
      }

      case 'confirmPassword': {
        const strVal = String(value || '');
        if (!strVal) return 'Vui lòng nhập lại mật khẩu để xác nhận.';
        if (strVal !== allValues.password) {
          return 'Mật khẩu xác nhận không khớp.';
        }
        return undefined;
      }

      case 'agreeTerms': {
        if (!value) return 'Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật.';
        return undefined;
      }

      default:
        return undefined;
    }
  };

  /**
   * Validate entire form
   */
  const validateForm = (values = formDataRef.current): boolean => {
    const newErrors: RegisterFormErrors = {};
    let isValid = true;

    (Object.keys(values) as Array<keyof RegisterFormInputs>).forEach((field) => {
      const error = validateField(field, values[field], values);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle input change
   */
  const handleChange = (name: keyof RegisterFormInputs, value: string | boolean | GenderType) => {
    formDataRef.current = { ...formDataRef.current, [name]: value };
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear server error when user modifies inputs
    if (serverError) {
      setServerError(null);
    }

    // Realtime validation for touched fields
    if (touchedRef.current[name] || touched[name]) {
      const fieldError = validateField(name, value, formDataRef.current);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));

      // If user is editing password, re-validate confirmPassword if touched
      if (name === 'password' && (touchedRef.current.confirmPassword || touched.confirmPassword)) {
        const confirmErr = validateField(
          'confirmPassword',
          formDataRef.current.confirmPassword,
          formDataRef.current
        );
        setErrors((prev) => ({
          ...prev,
          confirmPassword: confirmErr,
        }));
      }
    }
  };

  /**
   * Handle field blur
   */
  const handleBlur = (name: keyof RegisterFormInputs) => {
    touchedRef.current = { ...touchedRef.current, [name]: true };
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, formDataRef.current[name], formDataRef.current);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const currentValues = formDataRef.current;

    // Mark all as touched
    const allTouched: Partial<Record<keyof RegisterFormInputs, boolean>> = {};
    (Object.keys(currentValues) as Array<keyof RegisterFormInputs>).forEach((key) => {
      allTouched[key] = true;
    });
    touchedRef.current = allTouched;
    setTouched(allTouched);

    if (!validateForm(currentValues)) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    const payload: RegisterPayload = {
      username: currentValues.username.trim(),
      fullName: currentValues.fullName.trim(),
      email: currentValues.email.trim(),
      phoneNumber: currentValues.phoneNumber.trim(),
      dateOfBirth: currentValues.dateOfBirth,
      gender: currentValues.gender,
      password: currentValues.password,
    };

    try {
      const response = await authApi.register(payload);
      setSuccessMessage(response.message || 'Đăng ký tài khoản thành công! Đang chuyển hướng...');

      // Auto navigate to login after brief notification
      setTimeout(() => {
        navigate('/login', {
          state: {
            registeredUsername: payload.username,
            registeredEmail: payload.email,
            message: 'Đăng ký thành công! Vui lòng đăng nhập.',
          },
        });
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      const responseData = error.response?.data;
      const errorMsg =
        responseData?.message ||
        (typeof responseData?.errors === 'string' ? responseData.errors : null) ||
        error.message ||
        'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.';

      setServerError(errorMsg);

      // Map backend duplicate errors to inline input fields if matching
      const lower = errorMsg.toLowerCase();
      if (lower.includes('tài khoản') || lower.includes('username')) {
        setErrors((prev) => ({ ...prev, username: errorMsg }));
      } else if (lower.includes('email')) {
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else if (lower.includes('số điện thoại') || lower.includes('phone')) {
        setErrors((prev) => ({ ...prev, phoneNumber: errorMsg }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,
    successMessage,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData,
    setServerError,
  };
};

export default useRegister;
