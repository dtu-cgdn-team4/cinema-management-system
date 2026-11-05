import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, ChevronDown } from 'lucide-react';
import RegisterForm from '../components/RegisterForm';
import cinemaHallImg from '@/assets/auth/cinema-hall.png';
import apertureSvg from '@/assets/auth/aperture.svg';
import ticketSvg from '@/assets/auth/ticket.svg';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0d0e10] text-[#f5f2ed] selection:bg-[#ca3538] selection:text-white">
      {/* ======================================================== */}
      {/* Left Column: Cinema Branding & Visual Space             */}
      {/* ======================================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 xl:p-14 overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={cinemaHallImg}
            alt="Galaxy Cinema Auditorium"
            className="w-full h-full object-cover object-center pointer-events-none brightness-90"
          />
          {/* Contrast & Vignette Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8, 9, 11, 0.45) 0%, rgba(8, 9, 11, 0.05) 35%, rgba(8, 9, 11, 0.5) 65%, rgba(8, 9, 11, 0.96) 100%)',
            }}
          />
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-lg bg-[#ca3538] flex items-center justify-center shadow-lg shadow-[#ca3538]/30">
            <img src={apertureSvg} alt="Galaxy Logo" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-normal tracking-[4px] text-[#f5f2ed] leading-none">
              GALAXY
            </span>
            <span className="text-[9px] font-medium tracking-[2.3px] text-[#f5f2ed]/80 mt-1">
              HƠN CẢ ĐIỆN ẢNH
            </span>
          </div>
        </div>

        {/* Bottom Hero Message */}
        <div className="relative z-10 flex flex-col gap-7 max-w-[560px]">
          <div className="flex flex-col gap-4">
            {/* Tagline Badge */}
            <div className="flex items-center gap-3">
              <span className="w-7 h-[2px] bg-[#e04445]" />
              <span className="text-[11px] font-semibold tracking-[2.3px] uppercase text-[#f5f2ed]">
                ĐIỆN ẢNH, THEO CÁCH CỦA BẠN
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-5xl xl:text-6xl font-semibold tracking-[-2px] text-[#f5f2ed] leading-[1.12]">
              Mọi cảm xúc.
              <br />
              Một màn ảnh.
            </h2>

            {/* Subtitle */}
            <p className="text-base text-[#c3c1c2] leading-relaxed max-w-[520px]">
              Từ những thước phim đầu tiên đến dư âm cuối cùng. Khám phá, đặt vé
              và tận hưởng thế giới điện ảnh cùng Lumière.
            </p>
          </div>

          {/* Social Proof / Heritage Separator */}
          <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-[#c6c3c3]">
              <img src={ticketSvg} alt="Ticket" className="w-4 h-4 opacity-80" />
              <span>Màn ảnh lớn. Trải nghiệm khác biệt.</span>
            </div>
            <span className="text-[10px] font-medium tracking-[1.6px] text-[#9d9ea5]">
              TỪ NĂM 2024
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Right Column: Registration Form Container               */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-between items-center min-h-screen px-6 py-8 sm:px-10 lg:px-12 xl:px-14 bg-[#0d0e10]">
        {/* Top Header Navigation */}
        <div className="w-full max-w-[504px] flex items-center justify-between py-2 text-xs text-[#9d9ea5]">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-[#f5f2ed] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Về trang chủ</span>
          </Link>

          <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5f2ed] transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>Tiếng Việt</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* Center: Register Form */}
        <div className="w-full my-auto py-8 flex justify-center">
          <RegisterForm />
        </div>

        {/* Bottom Footer */}
        <div className="w-full max-w-[504px] flex flex-col items-center gap-2 pt-4 pb-2 text-[#9d9ea5] text-[11px]">
          <div className="flex items-center gap-3">
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#f5f2ed] transition-colors"
            >
              Trợ giúp
            </a>
            <span className="w-1 h-1 rounded-full bg-[#74767e]" />
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#f5f2ed] transition-colors"
            >
              Điều khoản sử dụng
            </a>
            <span className="w-1 h-1 rounded-full bg-[#74767e]" />
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#f5f2ed] transition-colors"
            >
              Chính sách bảo mật
            </a>
          </div>
          <p className="text-[10px] text-[#74767e]">
            © 2026 Galaxy Cinema. Mọi quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

