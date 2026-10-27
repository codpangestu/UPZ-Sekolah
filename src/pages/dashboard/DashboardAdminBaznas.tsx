import { Link } from 'react-router-dom';
import { GraduationCap, Users, ClipboardCheck, Settings, UserCog, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const quickLinks = [
  {
    label: 'Pengajuan UPZ Sekolah',
    icon: ClipboardCheck,
    path: '/pengajuan-masjid',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    description: 'Approval UPZ sekolah baru & terbitkan SK',
    badge: '0',
  },
  {
    label: 'Data UPZ Sekolah',
    icon: GraduationCap,
    path: '/data-masjid/daftar',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    description: 'Data seluruh UPZ sekolah terdaftar',
  },
  {
    label: 'Data Pembina & Pengurus',
    icon: Users,
    path: '/info-masjid/data-pengurus',
    color: '#D97706',
    bgColor: '#FFFBEB',
    description: 'Pengurus & guru pembina lintas sekolah',
  },
  {
    label: 'Kelola Pengguna',
    icon: UserCog,
    path: '/kelola-pengguna',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    description: 'Kelola akun admin UPZ sekolah',
  },
  {
    label: 'Setting Akun',
    icon: Settings,
    path: '/setting-akun',
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: 'Profil & kata sandi BAZNAS',
  },
  {
    label: 'Kunjungi Website',
    icon: Globe,
    path: '/',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    description: 'Lihat portal publik UPZ Sekolah',
  },
];

export default function DashboardAdminBaznas() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#0369A1] to-[#0284C7] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Selamat Datang, {user?.nama || 'Admin'}!
            </h1>
            <p className="text-sm text-sky-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Anda login sebagai <span className="font-semibold text-white">Admin BAZNAS (Pembina UPZ Sekolah)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md hover:border-[#0284C7]/40 transition-all duration-200 group relative"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: link.bgColor, color: link.color }}
              >
                <link.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-800 mb-0.5 group-hover:text-[#0284C7] transition-colors">{link.label}</h3>
                <p className="text-xs text-slate-500">{link.description}</p>
              </div>
              {link.badge !== undefined && (
                <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-white">{link.badge}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total UPZ Sekolah</p>
            <GraduationCap size={18} className="text-[#0284C7]" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>0</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={14} className="text-[#0284C7]" />
            <span className="badge-xs bg-[#E0F2FE] text-[#0369A1] font-semibold px-2 py-0.5 rounded-full text-[10px]">Terdaftar</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Penerimaan ZIS</p>
            <TrendingUp size={16} className="text-[#0284C7]" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp 0</p>
          <span className="badge-xs bg-[#E0F2FE] text-[#0369A1] font-semibold px-2 py-0.5 rounded-full text-[10px]">Nasional</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Penyaluran / Beasiswa</p>
            <TrendingDown size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp 0</p>
          <span className="badge-xs bg-rose-50 text-rose-600 font-semibold px-2 py-0.5 rounded-full text-[10px]">Nasional</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pengajuan Baru</p>
            <ClipboardCheck size={16} className="text-[#D97706]" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>0</p>
          <Link
            to="/pengajuan-masjid"
            className="text-[11px] text-[#0284C7] font-semibold hover:underline inline-block mt-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Lihat pengajuan UPZ →
          </Link>
        </div>
      </div>
    </div>
  );
}

