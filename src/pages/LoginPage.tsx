import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowLeft, Check, Mail, Lock, Landmark, MapPin, ChevronDown, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService, type LoginableRole } from '../services/authService';
import { ROLE_DASHBOARD_ROUTES } from '../types';
import bannerLogin from '../assets/illustrations/bannerLogin.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, isLoading, setLoading } = useAuthStore();
  // Prefill email setelah sukses registrasi
  const [email, setEmail] = useState(() => (location.state as { email?: string } | null)?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<LoginableRole>('admin-masjid');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const roleMenuRef = useRef<HTMLDivElement>(null);

  const ROLE_OPTIONS: { role: LoginableRole; label: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { role: 'admin-masjid', label: 'Admin UPZ Sekolah', desc: 'Pengelola UPZ di tingkat sekolah', icon: GraduationCap },
    { role: 'admin-baznas', label: 'Admin BAZNAS', desc: 'Pusat, daerah & kabupaten/kota', icon: Landmark },
    { role: 'admin-kua', label: 'Admin KUA', desc: 'Tingkat kecamatan pengawas', icon: MapPin },
  ];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeRole = ROLE_OPTIONS.find((o) => o.role === selectedRole) ?? ROLE_OPTIONS[0];
  const ActiveIcon = activeRole.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password }, selectedRole);
      const userRole = response.role;
      authLogin(response.user, response.access_token, userRole);
      const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from;
      if (from?.pathname && from.pathname !== '/login') {
        navigate(from.pathname + (from.search || ''));
      } else {
        navigate(ROLE_DASHBOARD_ROUTES[userRole]);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Email atau kata sandi tidak sesuai';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* ===== LEFT SIDE - Login Form (50%) ===== */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative">
        {/* Logo & Back Link */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-12 lg:px-16 pt-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} />
            </div>
            <div className="flex flex-col">
              <span
                className="text-base font-bold text-slate-800 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                UPZ Sekolah
              </span>
              <span className="text-[10px] font-semibold text-sky-600 tracking-wider uppercase">
                BAZNAS RI
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Kembali ke Portal
          </Link>
        </div>

        {/* Form Area - Centered */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 pb-8 overflow-y-auto">
          <div className="w-full max-w-[420px] my-auto py-6">
            {/* Welcome Header */}
            <div className="mb-6">
              <div className="badge-blue mb-3">
                <span>Portal Resmi Pengelola</span>
              </div>
              <h1
                className="text-[28px] font-bold text-slate-800 mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Selamat Datang
              </h1>
              <p className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Masuk ke panel manajemen UPZ Sekolah untuk melanjutkan
              </p>
            </div>

            {/* Role Dropdown - Login Sebagai */}
            <div className="mb-5">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Peran Pengguna
              </span>
              <div ref={roleMenuRef} className="relative">
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen((v) => !v)}
                  className={`w-full flex items-center gap-3 p-3 bg-white border rounded-xl transition-all duration-200 text-left ${
                    roleMenuOpen
                      ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/20'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                    <ActiveIcon size={18} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-slate-800">{activeRole.label}</span>
                    <span className="block text-xs text-slate-500 truncate">{activeRole.desc}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180 text-sky-600' : ''}`}
                  />
                </button>

                {/* Menu */}
                {roleMenuOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-sky-100 rounded-xl shadow-xl py-1.5 animate-[fadeIn_0.15s_ease-out]">
                    {ROLE_OPTIONS.map(({ role, label, desc, icon: Icon }) => {
                      const active = selectedRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                            active ? 'bg-sky-50' : 'hover:bg-slate-50'
                          }`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              active ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600'
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-semibold text-slate-800">{label}</span>
                            <span className="block text-xs text-slate-500">{desc}</span>
                          </span>
                          {active && <Check size={16} className="text-sky-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sekolah.sch.id"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400 bg-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    required
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400 bg-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${rememberMe
                        ? 'bg-sky-600 border-sky-600'
                        : 'border-slate-300 group-hover:border-sky-500'
                      }`}
                  >
                    {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Ingat saya
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onClick={() => { }}
                >
                  Lupa kata sandi?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 disabled:shadow-none mt-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses Autentikasi...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Masuk ke Panel UPZ
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sekolah Anda belum memiliki akun?{' '}
              <Link
                to="/register"
                className="text-sky-600 hover:text-sky-700 font-bold transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-8 text-xs text-center text-slate-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              &copy; 2026 UPZ Sekolah - BAZNAS RI. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Banner Login ===== */}
      <div className="hidden lg:flex w-1/2 h-full p-6 lg:p-8 xl:p-10 items-center justify-center bg-white relative">
        <div className="w-full h-full rounded-[36px] overflow-hidden shadow-2xl shadow-sky-950/10 border border-slate-100 relative group">
          <img
            src={bannerLogin}
            alt="UPZ Sekolah BAZNAS"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
