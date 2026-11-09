import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import { useAuth } from '../../../context/AuthContext';
import { GoogleLoginButton } from './GoogleLoginButton';
import { roleHome } from '../pages/AccountPage';
import { errorMessage as apiErrorMessage } from '../../../services/api';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let hasError = false;
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email.');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;

    setLoading(true);

    try {
      const data = await loginApi({ email: email.trim(), password, rememberMe });
      login(data, rememberMe);
      navigate(roleHome(data.user.role), { replace: true });
    } catch (err: unknown) {
      setErrorMessage(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Kích hoạt đăng nhập Google qua backend endpoint hoặc Google SDK
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Header section */}
      <div className="mb-4">
        <span className="text-[#e50914] text-[11px] font-bold tracking-[0.2em] uppercase block mb-1.5">
          THÀNH VIÊN GALAXY
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1.5">
          Chào mừng trở lại.
        </h1>
        <p className="text-[#8e95a5] text-xs leading-relaxed">
          Đăng nhập để tiếp tục hành trình điện ảnh của bạn.
        </p>
      </div>

      {errorMessage && (
        <div role="alert" className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5" aria-busy={loading}>
        {/* Email / Username field */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-[#c5c9d3] mb-1.5 tracking-wide">
            Email/ Tên đăng nhập
          </label>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${emailError ? 'text-[#e50914]' : 'text-[#5e6678] group-focus-within:text-[#e50914]'}`}>
              <Mail size={17} strokeWidth={1.8} />
            </div>
            <input
              id="login-email"
              name="email"
              autoComplete="username"
              maxLength={255}
              disabled={loading}
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              placeholder="Nhập địa chỉ email hoặc tên đăng nhập của bạn"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#131720] border rounded-xl text-white placeholder-[#4d5668] text-sm focus:outline-none transition-all ${
                emailError 
                  ? 'border-[#e50914] focus:ring-1 focus:ring-[#e50914]' 
                  : 'border-[#232936] focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]'
              }`}
            />
          </div>
          {emailError && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#e50914]">
              <AlertCircle size={13} className="shrink-0" />
              <span>{emailError}</span>
            </div>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="login-password" className="block text-xs font-semibold text-[#c5c9d3] mb-1.5 tracking-wide">
            Mật khẩu
          </label>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${passwordError ? 'text-[#e50914]' : 'text-[#5e6678] group-focus-within:text-[#e50914]'}`}>
              <Lock size={17} strokeWidth={1.8} />
            </div>
            <input
              id="login-password"
              name="password"
              autoComplete="current-password"
              maxLength={72}
              disabled={loading}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder="Nhập mật khẩu"
              className={`w-full pl-10 pr-10 py-2.5 bg-[#131720] border rounded-xl text-white placeholder-[#4d5668] text-sm focus:outline-none transition-all ${
                passwordError 
                  ? 'border-[#e50914] focus:ring-1 focus:ring-[#e50914]' 
                  : 'border-[#232936] focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]'
              }`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5e6678] hover:text-[#c5c9d3] transition-colors"
            >
              {showPassword ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
            </button>
          </div>
          {passwordError && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#e50914]">
              <AlertCircle size={13} className="shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={loading}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#131720] border-[#2b3342] text-[#e50914] focus:ring-0 focus:ring-offset-0 accent-[#e50914]"
            />
            <span className="text-xs text-[#a4abb8]">Ghi nhớ đăng nhập</span>
          </label>

          <button
            type="button"
            className="text-xs text-[#717b8c] hover:text-[#9aa2b1] transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#e50914] hover:bg-[#c90812] active:scale-[0.99] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          {!loading && <ArrowRight size={17} strokeWidth={2.2} />}
        </button>

        {/* Divider */}
        <div className="relative py-2.5 flex items-center justify-center">
          <div className="border-t border-[#1c222e] w-full absolute"></div>
          <span className="bg-[#0b0e14] px-3 text-[11px] text-[#555e70] tracking-normal relative z-10">
            hoặc tiếp tục với
          </span>
        </div>

        {/* Google Login Component */}
        <div className="w-full">
          <GoogleLoginButton
            rememberMe={rememberMe}
            disabled={loading}
            onSuccess={(data) => {
              login(data, rememberMe);
              navigate(roleHome(data.user.role), { replace: true });
            }}
            onError={setErrorMessage}
            onBusyChange={setLoading}
          />
        </div>

        {/* Register link */}
        <div className="text-center pt-3">
          <p className="text-xs text-[#7d8697]">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="text-[#e50914] hover:text-[#f43f5e] font-semibold transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
