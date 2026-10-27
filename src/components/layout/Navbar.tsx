import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LogIn,
  X,
  Heart,
  HandCoins,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang Kami', path: '/tentang' },
  { name: 'UPZ Sekolah', path: '/masjid' },
  { name: 'Publikasi', path: '/kajian' },
];

const navSecondaryLinks = [
  { name: 'Tools', path: '/tools' },
  { name: 'Ajukan UPZ Sekolah', path: '/ajukan-masjid' },
  { name: 'Microfinance', path: '/microfinance' },
  { name: 'Donasi', path: '/donasi' },
  { name: 'Kontak', path: '/kontak' },
  { name: 'Kebijakan Privasi', path: '/kebijakan-privasi' },
  { name: 'Disclaimer', path: '/disclaimer' },
  { name: 'Syarat & Ketentuan', path: '/syarat-ketentuan' },
  { name: 'Founder', path: '/founder' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  /**
   * Microfinance dilindungi ProtectedRoute (admin-masjid/admin-sekolah). Kalau belum login,
   * arahkan LANGSUNG ke /login dengan state.from.
   */
  const linkTarget = (link: { name: string; path: string }) =>
    link.name === 'Microfinance' && !isAuthenticated
      ? { to: '/login', state: { from: { pathname: link.path } } as { from: { pathname: string } } }
      : { to: link.path, state: undefined };

  // Throttled scroll handler via requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  return (
    <>
      {/* ===== MAIN NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(2,132,199,0.08)] border-b border-sky-100'
            : 'bg-white border-b border-slate-100'
          }`}
      >
        <div
          className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-[120px]"
          style={{
            height: isScrolled ? '72px' : '76px',
            maxWidth: '1440px',
            transition: 'height 0.3s ease',
          }}
        >
          {/* ===== LEFT: LOGO ===== */}
          <Link
            to="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            {/* Logo Icon */}
            <div className="relative w-10 h-10 flex-shrink-0 bg-gradient-to-tr from-sky-600 via-sky-500 to-sky-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap size={22} className="text-white drop-shadow-sm" />
            </div>

            {/* Brand Name */}
            <div className="flex flex-col">
              <span
                className="font-bold leading-tight text-slate-800 group-hover:text-sky-600 transition-colors duration-200 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px' }}
              >
                UPZ Sekolah
              </span>
              <span
                className="text-[10px] font-semibold leading-tight text-sky-600 hidden sm:block tracking-wider uppercase"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                BAZNAS RI
              </span>
            </div>
          </Link>

          {/* ===== CENTER: NAV LINKS (Desktop) ===== */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-3.5 py-2 group"
                  >
                    <span
                      className={`relative z-10 text-sm font-medium transition-colors duration-200 ${active
                          ? 'text-sky-600 font-semibold'
                          : 'text-slate-600 group-hover:text-slate-900'
                        }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {link.name}
                    </span>
                    {/* Active indicator */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-sky-500 rounded-full transition-all duration-300 ${active
                          ? 'w-6 opacity-100'
                          : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-50'
                        }`}
                    />
                  </Link>
                );
              })}

              {/* More dropdown for secondary links */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Lainnya
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform duration-200 text-slate-400 group-hover:text-sky-600"
                  />
                </button>
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-sky-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                  {navSecondaryLinks.map((link) => {
                    const target = linkTarget(link);
                    return (
                      <Link
                        key={link.path}
                        to={target.to}
                        state={target.state}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 ${isActive(link.path)
                            ? 'text-sky-600 bg-sky-50 font-medium'
                            : 'text-slate-600 hover:bg-sky-50/60 hover:text-slate-900'
                          }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {link.name === 'Donasi' && <Heart size={15} className="text-sky-500" />}
                        {link.name === 'Microfinance' && <HandCoins size={15} className="text-sky-500" />}
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: ACTIONS (Desktop) ===== */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Donasi Button */}
            <Link
              to="/donasi"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-sky-500 text-sky-600 text-sm font-medium hover:bg-sky-50 transition-all duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Heart size={15} className="fill-sky-500 text-sky-500" />
              Donasi
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-sky-600 to-sky-500 text-white text-sm font-medium hover:from-sky-700 hover:to-sky-600 shadow-md shadow-sky-500/25 active:scale-95 transition-all duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <LogIn size={15} />
              Login Portal
            </Link>
          </div>

          {/* ===== MOBILE: HAMBURGER ===== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 transition-colors duration-200"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <div className="relative w-5 h-5">
              <span
                className={`absolute left-0 block h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isOpen
                    ? 'top-1/2 w-5 -translate-y-1/2 rotate-45'
                    : 'top-0 w-5'
                  }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : 'opacity-100 w-4'
                  }`}
              />
              <span
                className={`absolute left-0 block h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isOpen
                    ? 'top-1/2 w-5 -translate-y-1/2 -rotate-45'
                    : 'bottom-0 w-5'
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU (Slide-in from right) ===== */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden transition-opacity duration-300 ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[310px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-slate-800 text-sm">UPZ Sekolah</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Tutup menu"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-4 flex-1 overflow-y-auto">
            <div className="space-y-1">
              <p
                className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Navigasi
              </p>
              {[...navLinks, ...navSecondaryLinks].map((link, index) => {
                const active = isActive(link.path);
                const target = linkTarget(link);
                return (
                  <Link
                    key={link.path}
                    to={target.to}
                    state={target.state}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                        ? 'bg-sky-50 text-sky-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      animation: isOpen
                        ? `slideIn 0.3s ease-out ${index * 0.04}s both`
                        : 'none',
                    }}
                  >
                    {link.name === 'Donasi' && <Heart size={16} className="text-sky-500" />}
                    {link.name === 'Microfinance' && <HandCoins size={16} className="text-sky-500" />}
                    {link.name}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-4 mx-2 border-t border-slate-100" />

            {/* Login CTA */}
            <div className="space-y-2.5">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-gradient-to-r from-sky-600 to-sky-500 text-white text-sm font-medium hover:from-sky-700 hover:to-sky-600 shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <LogIn size={16} />
                Login Portal
              </Link>
              <Link
                to="/donasi"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-sky-500 text-sky-600 text-sm font-medium hover:bg-sky-50 active:scale-[0.98] transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Heart size={16} className="text-sky-500" />
                Donasi
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
