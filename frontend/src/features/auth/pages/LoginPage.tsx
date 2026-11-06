import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, ChevronDown } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { CinemaHeroBanner } from '../components/CinemaHeroBanner';

export const LoginPage: React.FC = () => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0b0e14] flex flex-col lg:flex-row overflow-x-hidden">
      {/* LEFT SIDE: Cinema Mood Visual Banner */}
      <div className="w-full lg:w-1/2 hidden md:block relative">
        <CinemaHeroBanner />
      </div>

      {/* RIGHT SIDE: Auth Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-20 min-h-screen">
        {/* Top Navigation Bar: Back & Language Switcher */}
        <div className="flex items-center justify-between w-full max-w-[460px] mx-auto mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-[#7d8697] hover:text-white transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Về trang chủ</span>
          </Link>

          {/* Language dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 text-xs text-[#7d8697] hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
            >
              <Globe size={14} />
              <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
              <ChevronDown size={13} />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-[#161b24] border border-[#232936] rounded-xl shadow-xl py-1 z-30">
                <button
                  onClick={() => {
                    setLanguage('vi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1f2633] transition-colors ${
                    language === 'vi' ? 'text-[#e50914] font-semibold' : 'text-[#c5c9d3]'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1f2633] transition-colors ${
                    language === 'en' ? 'text-[#e50914] font-semibold' : 'text-[#c5c9d3]'
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Main Form */}
        <div className="my-auto py-4">
          <LoginForm />
        </div>

        {/* Bottom Footer Links */}
        <div className="w-full max-w-[460px] mx-auto pt-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-[11px] text-[#636c7e] mb-2">
            <Link to="/help" className="hover:text-[#9ba3b2] transition-colors">
              Trợ giúp
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#9ba3b2] transition-colors">
              Điều khoản sử dụng
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#9ba3b2] transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
          <p className="text-[11px] text-[#4d5668] text-center sm:text-left">
            © 2026 Galaxy Cinema. Mọi quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
};

