import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowLeft, Check, Mail, Lock, Building2, Landmark, MapPin, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService, type LoginableRole } from '../services/authService';
import { ROLE_DASHBOARD_ROUTES } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, isLoading, setLoading } = useAuthStore();
  // Prefill email setelah sukses registrasi (RegisterPage mengirim state.email)
  const [email, setEmail] = useState(() => (location.state as { email?: string } | null)?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<LoginableRole>('admin-masjid');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Definisikan di dalam komponen (lesson learned: hindari definisi module-level)
  // Catatan: opsi "Admin BAZNAS" mencakup tiga tingkat sekaligus — Pusat
  // (nasional), Provinsi (Admin Daerah) dan Kabupaten/Kota (Admin Kab) — karena
  // ketiganya login lewat endpoint yang sama dan scope wilayahnya ditentukan
  // server dari id_level akun. Hanya Admin KUA (kecamatan) yang dipisah.
  const ROLE_OPTIONS: { role: LoginableRole; label: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { role: 'admin-masjid', label: 'Admin Masjid', desc: 'Kelola masjid Anda', icon: Building2 },
    { role: 'admin-baznas', label: 'Admin BAZNAS', desc: 'Pusat, daerah & kabupaten/kota', icon: Landmark },
    { role: 'admin-kua', label: 'Admin KUA', desc: 'Kelola data tingkat kecamatan', icon: MapPin },
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
      // Jika user diarahkan ke /login oleh ProtectedRoute (mis. klik link
      // "Microfinance" di navbar publik saat belum login), kembalikan ke
      // halaman yang tadinya dituju (bukan selalu dashboard default) —
      // ProtectedRoute tetap akan cek allowedRoles ulang di halaman tsb.
      const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from;
      if (from?.pathname && from.pathname !== '/login') {
        navigate(from.pathname + (from.search || ''));
      } else {
        navigate(ROLE_DASHBOARD_ROUTES[userRole]);
      }
    } catch (err: any) {
      // FastAPI HTTPException -> { detail }; register custom -> { status }
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Email atau password salah';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* ===== LEFT SIDE - Login Form (50%) ===== */}
      <div className="w-1/2 flex flex-col h-full bg-[#FAFAFA] relative">
        {/* Logo & Back Link */}
        <div className="flex-shrink-0 flex items-center justify-between px-[120px] pt-[60px]">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/images/logo-menara.svg"
                alt="MENARA Masjid Logo"
                className="w-[30px] h-[30px] object-contain"
              />
            </div>
            <span
              className="text-base font-bold text-[#303030] tracking-wide"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              MENARA Masjid
            </span>
          </Link>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#28A71A] transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Kembali
          </Link>
        </div>

        {/* Form Area - Centered */}
        <div className="flex-1 flex items-center justify-center px-[120px] pb-8 overflow-y-auto">
          <div className="w-full max-w-[420px]">
            {/* Mobile Back Link */}
            <Link
              to="/"
              className="sm:hidden inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#28A71A] transition-colors mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ArrowLeft size={14} />
              Kembali ke Beranda
            </Link>

            {/* Welcome Header */}
            <div className="mb-6">
              <h1
                className="text-[28px] font-bold text-[#303030] mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Selamat Datang
              </h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            {/* Role Dropdown - Login Sebagai */}
            <div className="mb-6">
              <span className="block text-sm font-semibold text-[#303030] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Login sebagai
              </span>
              <div ref={roleMenuRef} className="relative">
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen((v) => !v)}
                  className={`w-full flex items-center gap-3 p-3 bg-white border rounded-xl transition-all duration-200 text-left ${
                    roleMenuOpen
                      ? 'border-[#28A71A] ring-2 ring-[#28A71A]/20'
                      : 'border-gray-200 hover:border-[#28A71A]/50 hover:bg-[#FAFFFA]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="w-9 h-9 rounded-lg bg-[#EAF6E8] flex items-center justify-center flex-shrink-0">
                    <ActiveIcon size={18} className="text-[#28A71A]" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-[#303030]">{activeRole.label}</span>
                    <span className="block text-xs text-gray-500">{activeRole.desc}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Menu */}
                {roleMenuOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/5 py-1.5 animate-[fadeIn_0.15s_ease-out]">
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
                            active ? 'bg-[#EAF6E8]' : 'hover:bg-[#FAFAFA]'
                          }`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              active ? 'bg-[#28A71A] text-white' : 'bg-[#EAF6E8] text-[#28A71A]'
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-[#303030]">{label}</span>
                            <span className="block text-xs text-gray-500">{desc}</span>
                          </span>
                          {active && <Check size={16} className="text-[#28A71A] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Pilih <span className="font-semibold text-gray-500">Admin BAZNAS</span> untuk akun Admin Pusat, Admin
                Daerah (provinsi) maupun Admin Kabupaten/Kota.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white focus:bg-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white focus:bg-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#303030] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${rememberMe
                        ? 'bg-[#28A71A] border-[#28A71A]'
                        : 'border-gray-300 group-hover:border-[#28A71A]'
                      }`}
                  >
                    {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-[#303030] transition-colors select-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Ingat saya
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[#28A71A] hover:text-[#1C7712] font-medium transition-colors"
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
                className="w-full py-3 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#28A71A]/25 hover:shadow-[#28A71A]/40 disabled:shadow-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-[#28A71A] hover:text-[#1C7712] font-semibold transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-8 text-xs text-center text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              &copy; 2024 Menara Masjid BAZNAS. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Banner Login (570x904, radius 40px) ===== */}
      <div className="w-1/2 h-full flex items-center justify-center bg-[#FAFAFA] overflow-hidden">
        <div className="w-[570px] h-[904px] max-h-[90vh] rounded-[40px] overflow-hidden shadow-xl bg-[#D9D9D9]">
          <img
            src="/images/banner-login.svg"
            alt="MENARA Masjid Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
