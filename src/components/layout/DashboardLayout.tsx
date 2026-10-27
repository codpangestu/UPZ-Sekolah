import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  Calendar,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Wallet,
  BarChart3,
  FileText,
  ClipboardCheck,
  HelpCircle,
  UserCog,
  HandCoins,
  GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import type { UserRole } from '../../types';

interface SidebarItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  roles: UserRole[];
}

const sidebarMenu: SidebarItem[] = [
  {
    label: 'Beranda',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['admin-masjid'],
  },
  {
    label: 'Dashboard BAZNAS',
    icon: BarChart3,
    path: '/dashboard-baznas',
    roles: ['admin-baznas'],
  },
  {
    label: 'Dashboard Daerah',
    icon: BarChart3,
    path: '/dashboard-daerah',
    roles: ['admin-daerah'],
  },
  {
    label: 'Dashboard Kab',
    icon: BarChart3,
    path: '/dashboard-kab',
    roles: ['admin-kab'],
  },
  {
    label: 'Dashboard KUA',
    icon: BarChart3,
    path: '/dashboard-kua',
    roles: ['admin-kua'],
  },
  {
    label: 'Profil UPZ Sekolah',
    icon: Building2,
    path: '/data-masjid/profil',
    roles: ['admin-masjid'],
  },
  {
    label: 'Data UPZ Sekolah',
    icon: Building2,
    path: '/data-masjid/daftar',
    roles: ['admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua'],
  },
  {
    label: 'Info UPZ Sekolah',
    icon: FileText,
    path: '/info-masjid/data-pengurus',
    roles: ['admin-masjid'],
  },
  {
    label: 'Menu Publikasi',
    icon: Megaphone,
    path: '/menu-publikasi/postingan',
    roles: ['admin-masjid'],
  },
  {
    label: 'Buku Kas ZIS',
    icon: Wallet,
    path: '/buku-kas/penerimaan',
    roles: ['admin-masjid'],
  },
  {
    label: 'Buku Aset',
    icon: BookOpen,
    path: '/buku-aset',
    roles: ['admin-masjid'],
  },
  {
    label: 'Pengurus & Pembina',
    icon: Users,
    path: '/info-masjid/data-pengurus',
    roles: ['admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua'],
  },
  {
    label: 'Anggota (Siswa/Guru)',
    icon: Users,
    path: '/info-masjid/data-anggota',
    roles: ['admin-masjid'],
  },
  {
    label: 'Kegiatan UPZ Sekolah',
    icon: Calendar,
    path: '/kegiatan-masjid',
    roles: ['admin-masjid'],
  },
  {
    label: 'Microfinance BMM',
    icon: HandCoins,
    path: '/microfinance',
    roles: ['admin-masjid'],
  },
  {
    label: 'Setting Akun',
    icon: Settings,
    path: '/setting-akun',
    roles: ['admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua'],
  },
  {
    label: 'Pengajuan UPZ Sekolah',
    icon: ClipboardCheck,
    path: '/pengajuan-masjid',
    roles: ['admin-baznas'],
  },
  {
    label: 'Kelola Pengguna',
    icon: UserCog,
    path: '/kelola-pengguna',
    roles: ['admin-baznas'],
  },
];

const roleBadgeColors: Record<UserRole, string> = {
  'admin-masjid': 'bg-sky-100 text-sky-700',
  'admin-baznas': 'bg-purple-100 text-purple-700',
  'admin-daerah': 'bg-blue-100 text-blue-700',
  'admin-kab': 'bg-amber-100 text-amber-700',
  'admin-kua': 'bg-pink-100 text-pink-700',
};

const roleBadgeLabels: Record<UserRole, string> = {
  'admin-masjid': 'Admin UPZ Sekolah',
  'admin-baznas': 'Admin BAZNAS',
  'admin-daerah': 'Admin Daerah',
  'admin-kab': 'Admin Kab',
  'admin-kua': 'Admin KUA',
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout: clearAuth } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const filteredMenu = sidebarMenu.filter(
    (item) => role && item.roles.includes(role)
  );

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    navigate('/login');
  };

  const currentPath = location.pathname;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="w-9 h-9 bg-gradient-to-tr from-sky-600 to-sky-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-sky-500/20">
          <GraduationCap size={20} />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800 whitespace-nowrap tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              UPZ Sekolah
            </span>
            <span className="text-[10px] font-semibold text-sky-600 tracking-wider uppercase">
              Panel BAZNAS
            </span>
          </div>
        )}
      </div>

      {/* User Info */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user?.nama || 'Pengguna'}
              </p>
              {role && (
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${roleBadgeColors[role]}`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {roleBadgeLabels[role]}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {filteredMenu.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
          return (
            <Link
              key={`${item.label}-${item.path}`}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-sky-50 text-sky-600 font-semibold border-r-2 border-sky-600 shadow-sm shadow-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <item.icon size={19} className={`flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {!sidebarCollapsed && (
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-100 p-2 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200"
          title={sidebarCollapsed ? 'Kunjungi Portal Publik' : undefined}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <HelpCircle size={19} className="flex-shrink-0 text-slate-400" />
          {!sidebarCollapsed && <span className="text-sm">Portal Publik</span>}
        </Link>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-200"
          title={sidebarCollapsed ? 'Keluar' : undefined}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <LogOut size={19} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 relative ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          {sidebarCollapsed ? <ChevronRight size={14} className="text-slate-600" /> : <ChevronLeft size={14} className="text-slate-600" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl">
            <div className="flex justify-end p-2 border-b border-slate-100">
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                <Menu size={20} className="text-slate-600" />
              </button>
              <h1 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {sidebarMenu.find((item) => currentPath === item.path || currentPath.startsWith(item.path + '/'))
                  ?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {user?.nama_masjid && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
                  <GraduationCap size={14} className="text-sky-600" />
                  <span className="text-xs font-semibold text-sky-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {user.nama_masjid}
                  </span>
                </div>
              )}
              <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 text-sm font-bold">
                {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <LogOut size={22} className="text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Keluar Aplikasi
              </h3>
              <p className="text-sm text-slate-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Apakah Anda yakin ingin keluar dari Portal UPZ Sekolah?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 bg-rose-600 rounded-xl text-sm font-semibold text-white hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
