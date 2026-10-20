import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LogIn,
  X,
  Heart,
  HandCoins,
  ChevronDown,
} from 'lucide-react';
const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang Kami', path: '/tentang' },
  { name: 'Masjid', path: '/masjid' },
  { name: 'Publikasi', path: '/kajian' },
];

const navSecondaryLinks = [
  { name: 'Tools', path: '/tools' },
  { name: 'Ajukan Masjid', path: '/ajukan-masjid' },
  { name: 'Microfinance', path: '/microfinance' },
  { name: 'Donasi', path: '/donasi' },
  { name: 'Kontak', path: '/kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  /**
   * Microfinance dilindungi ProtectedRoute (admin-masjid). Kalau belum login,
   * arahkan LANGSUNG ke /login dengan state.from → setelah login user mendarat
   * di /microfinance; ProtectedRoute tetap mem-validasi role (role lain →
   * dashboard default masing-masing). Fix #48.
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
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]'
            : 'bg-white'
          }`}
      >
        <div
          className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-[120px]"
          style={{
            height: isScrolled ? '76px' : '76px',
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
            <div className="relative w-9 h-9 flex-shrink-0">
              <img
                src="/images/logo-menara.svg"
                alt="MENARA Masjid Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Brand Name */}
            <div className="flex flex-col">
              <span
                className="font-semibold leading-tight text-[#303030] group-hover:text-[#28A71A] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px' }}
              >
                Menara Masjid
              </span>
              <span
                className="text-[10px] leading-tight text-[#767676] hidden sm:block"
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
                    className="relative px-3 py-2 group"
                  >
                    <span
                      className={`relative z-10 text-sm font-medium transition-colors duration-200 ${active
                          ? 'text-[#28A71A]'
                          : 'text-[#555555] group-hover:text-[#303030]'
                        }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {link.name}
                    </span>
                    {/* Active indicator */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#28A71A] rounded-full transition-all duration-300 ${active
                          ? 'w-5 opacity-100'
                          : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-50'
                        }`}
                    />
                  </Link>
                );
              })}

              {/* More dropdown for secondary links */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#555555] hover:text-[#303030] transition-colors duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Lainnya
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform duration-200"
                  />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-[rgba(0,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                  {navSecondaryLinks.map((link) => {
                    const target = linkTarget(link);
                    return (
                    <Link
                      key={link.path}
                      to={target.to}
                      state={target.state}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-150 ${isActive(link.path)
                          ? 'text-[#28A71A] bg-[#EAF6E8]'
                          : 'text-[#555555] hover:bg-[#F0F4F8] hover:text-[#303030]'
                        }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {link.name === 'Donasi' && <Heart size={14} />}
                      {link.name === 'Microfinance' && <HandCoins size={14} />}
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
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#28A71A] text-[#28A71A] text-sm font-medium hover:bg-[#EAF6E8] transition-all duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Heart size={15} className="fill-[#28A71A]" />
              Donasi
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#28A71A] text-white text-sm font-medium hover:bg-[#1C7712] hover:shadow-lg hover:shadow-[#28A71A]/25 active:scale-95 transition-all duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <LogIn size={15} />
              Login
            </Link>
          </div>

          {/* ===== MOBILE: HAMBURGER ===== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F0F4F8] transition-colors duration-200"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <div className="relative w-5 h-5">
              <span
                className={`absolute left-0 block h-0.5 bg-[#303030] rounded-full transition-all duration-300 ${isOpen
                    ? 'top-1/2 w-5 -translate-y-1/2 rotate-45'
                    : 'top-0 w-5'
                  }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 bg-[#303030] rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : 'opacity-100 w-4'
                  }`}
              />
              <span
                className={`absolute left-0 block h-0.5 bg-[#303030] rounded-full transition-all duration-300 ${isOpen
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
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F0F4F8] transition-colors"
              aria-label="Tutup menu"
            >
              <X size={20} className="text-[#555]" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 pb-6">
            <div className="space-y-1">
              <p
                className="text-xs font-semibold text-[#767676] uppercase tracking-wider px-4 mb-2"
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                        ? 'bg-[#EAF6E8] text-[#28A71A]'
                        : 'text-[#555] hover:bg-[#F0F4F8] hover:text-[#303030]'
                      }`}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      animation: isOpen
                        ? `slideIn 0.3s ease-out ${index * 0.05}s both`
                        : 'none',
                    }}
                  >
                    {link.name === 'Donasi' && <Heart size={16} />}
                    {link.name === 'Microfinance' && <HandCoins size={16} />}
                    {link.name}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#28A71A]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-4 mx-4 border-t border-[rgba(0,0,0,0.08)]" />

            {/* Login CTA */}
            <div className="px-4 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#28A71A] text-white text-sm font-medium hover:bg-[#1C7712] active:scale-[0.98] transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <LogIn size={16} />
                Login
              </Link>
              <Link
                to="/donasi"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-[#28A71A] text-[#28A71A] text-sm font-medium hover:bg-[#EAF6E8] active:scale-[0.98] transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Heart size={16} />
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
