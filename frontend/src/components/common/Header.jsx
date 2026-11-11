import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Film, Ticket, MapPin, Gift } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Trang chủ', path: '/home', icon: Film },
    { name: 'Phim', path: '/movies', icon: Film },
    { name: 'Rạp/Giá vé', path: '/cinemas', icon: MapPin },
    { name: 'Ưu đãi', path: '/promotions', icon: Gift },
  ];

  const handleSearchClick = () => {
    if (location.pathname === '/movies') {
      const input = document.querySelector('input[placeholder*="Tìm theo tên phim"]');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate('/movies?focus=search');
    }
  };

  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearchTerm.trim()) {
      navigate(`/movies?q=${encodeURIComponent(headerSearchTerm.trim())}`);
      setHeaderSearchTerm('');
      setHeaderSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#222E42]/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/movies" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-galaxy-red to-orange-500 flex items-center justify-center shadow-lg shadow-galaxy-red/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-white flex items-center gap-1.5">
                GALAXY
                <span className="text-galaxy-red text-xs font-bold tracking-widest px-1.5 py-0.5 rounded bg-galaxy-red/10 border border-galaxy-red/30">
                  CINEMA
                </span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-medium">
                ENTERTAINMENT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 relative py-2 ${
                    isActive
                      ? 'text-galaxy-red font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-galaxy-red after:rounded-full'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Quick Header Search input toggle or direct focus */}
            <div className="relative">
              {headerSearchOpen ? (
                <form
                  onSubmit={handleHeaderSearchSubmit}
                  className="hidden sm:flex items-center relative"
                >
                  <input
                    type="text"
                    autoFocus
                    value={headerSearchTerm}
                    onChange={(e) => setHeaderSearchTerm(e.target.value)}
                    placeholder="Tìm tên phim..."
                    className="w-48 lg:w-60 bg-slate-900 text-xs text-white placeholder-slate-400 pl-8 pr-7 py-2 rounded-full border border-galaxy-red focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setHeaderSearchOpen(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={handleSearchClick}
                  className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-galaxy-red/40"
                  title="Tìm kiếm phim"
                  aria-label="Tìm kiếm phim"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-galaxy-red/40"
            >
              <User className="w-4 h-4 text-slate-300" />
              <span>Đăng nhập</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#222E42] bg-[#0B0F19]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-galaxy-red/10 text-galaxy-red border border-galaxy-red/20'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
