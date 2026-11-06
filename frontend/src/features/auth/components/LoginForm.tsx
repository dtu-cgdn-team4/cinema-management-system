import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import { useAuth } from '../../../context/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const data = await loginApi({ email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint or trigger Google SDK
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <span className="text-[#e50914] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
          THÀNH VIÊN GALAXY
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Chào mừng trở lại.
        </h1>
        <p className="text-[#8e95a5] text-sm leading-relaxed">
          Đăng nhập để tiếp tục hành trình điện ảnh của bạn.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div>
          <label className="block text-xs font-semibold text-[#c5c9d3] mb-2 tracking-wide">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5e6678] group-focus-within:text-[#e50914] transition-colors">
              <Mail size={18} strokeWidth={1.8} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn"
              required
              className="w-full pl-11 pr-4 py-3 bg-[#131720] border border-[#232936] rounded-xl text-white placeholder-[#4d5668] text-sm focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label className="block text-xs font-semibold text-[#c5c9d3] mb-2 tracking-wide">
            Mật khẩu
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5e6678] group-focus-within:text-[#e50914] transition-colors">
              <Lock size={18} strokeWidth={1.8} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className="w-full pl-11 pr-11 py-3 bg-[#131720] border border-[#232936] rounded-xl text-white placeholder-[#4d5668] text-sm focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5e6678] hover:text-[#c5c9d3] transition-colors"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#131720] border-[#2b3342] text-[#e50914] focus:ring-0 focus:ring-offset-0 accent-[#e50914]"
            />
            <span className="text-xs text-[#a4abb8]">Ghi nhớ đăng nhập</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs text-[#e50914] hover:text-[#f43f5e] transition-colors font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#e50914] hover:bg-[#c90812] active:scale-[0.99] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          {!loading && <ArrowRight size={17} />}
        </button>

        {/* Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="border-t border-[#1c222e] w-full absolute"></div>
          <span className="bg-[#0b0e14] px-3 text-[11px] text-[#555e70] uppercase tracking-wider relative z-10">
            hoặc tiếp tục với
          </span>
        </div>

        {/* Google Login button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 bg-[#131720] hover:bg-[#1a202c] border border-[#232936] text-[#e1e4ea] font-medium text-sm rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-xs font-semibold">Tiếp tục với Google</span>
        </button>

        {/* Register link */}
        <div className="text-center pt-2">
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

