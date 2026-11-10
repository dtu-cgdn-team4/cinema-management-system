import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Phone, Mail, Clock, Facebook, Instagram, Youtube, Smartphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080B12] border-t border-[#1C2638] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Brand info */}
          <div className="space-y-4">
            <Link to="/movies" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-galaxy-red to-orange-500 flex items-center justify-center shadow-lg shadow-galaxy-red/20">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white">
                  GALAXY <span className="text-galaxy-red text-xs font-bold px-1.5 py-0.5 rounded bg-galaxy-red/10 border border-galaxy-red/30">CINEMA</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-medium">
                  ENTERTAINMENT
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang đến trải nghiệm nghe nhìn sống động cùng dịch vụ giải trí chuẩn quốc tế.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-galaxy-red hover:text-white flex items-center justify-center transition-colors text-slate-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-galaxy-red hover:text-white flex items-center justify-center transition-colors text-slate-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-galaxy-red hover:text-white flex items-center justify-center transition-colors text-slate-300">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cột 2: Góc điện ảnh */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-galaxy-red rounded-sm"></span>
              Góc Điện Ảnh
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/movies" className="hover:text-galaxy-red transition-colors">
                  Phim đang chiếu
                </Link>
              </li>
              <li>
                <Link to="/movies?status=coming_soon" className="hover:text-galaxy-red transition-colors">
                  Phim sắp chiếu
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Bình luận & Đánh giá phim
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Blog điện ảnh Galaxy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Phim hay trong tháng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-galaxy-red rounded-sm"></span>
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Góp ý & Khiếu nại
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Rạp & Giá vé tiêu chuẩn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Tuyển dụng nhân sự
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-galaxy-red transition-colors">
                  Hướng dẫn đặt vé online
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Chăm sóc & Ứng dụng */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-galaxy-red rounded-sm"></span>
              Kết Nối Với Chúng Tôi
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-galaxy-red shrink-0" />
                <span>Hotline: <strong className="text-white">1900 2224</strong> (24/7)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-galaxy-red shrink-0" />
                <span>cskh@galaxycinema.vn</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-galaxy-red shrink-0" />
                <span>8:00 - 22:00 tất cả các ngày</span>
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-galaxy-red" />
                Tải ứng dụng Galaxy Cinema
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-galaxy-red/50 text-[11px] text-slate-300 hover:text-white flex flex-col items-start leading-tight"
                >
                  <span className="text-[9px] text-slate-400">Tải về trên</span>
                  <span className="font-semibold text-white">App Store</span>
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-galaxy-red/50 text-[11px] text-slate-300 hover:text-white flex flex-col items-start leading-tight"
                >
                  <span className="text-[9px] text-slate-400">Tải về trên</span>
                  <span className="font-semibold text-white">Google Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-12 pt-6 border-t border-[#1C2638] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2024 Galaxy Cinema. Toàn bộ bản quyền thuộc về Công ty Cổ phần Phim Galaxy.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-galaxy-red transition-colors">Chính sách bảo mật</a>
            <span>•</span>
            <a href="#" className="hover:text-galaxy-red transition-colors">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="#" className="hover:text-galaxy-red transition-colors">Quy chế hoạt động</a>
            <span>•</span>
            <a href="#" className="hover:text-galaxy-red transition-colors">Chính sách thanh toán</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

