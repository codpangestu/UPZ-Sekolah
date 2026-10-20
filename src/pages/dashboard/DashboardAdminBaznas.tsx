import { Link } from 'react-router-dom';
import { Building2, Users, ClipboardCheck, Settings, UserCog, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const quickLinks = [
  {
    label: 'Pengajuan Masjid',
    icon: ClipboardCheck,
    path: '/pengajuan-masjid',
    color: '#28A71A',
    bgColor: '#EAF6E8',
    description: 'Approval masjid baru & terbitkan kode masjid',
    badge: '0',
  },
  {
    label: 'Data Masjid',
    icon: Building2,
    path: '/data-masjid/daftar',
    color: '#7C3AED',
    bgColor: '#F3E8FF',
    description: 'Data seluruh masjid terdaftar',
  },
  {
    label: 'Data Pengurus',
    icon: Users,
    path: '/info-masjid/data-pengurus',
    color: '#D97706',
    bgColor: '#FFFBEB',
    description: 'Pengurus lintas masjid',
  },
  {
    label: 'Kelola Pengguna',
    icon: UserCog,
    path: '/kelola-pengguna',
    color: '#2B7FFF',
    bgColor: '#EAF2FF',
    description: 'Kelola akun admin masjid',
  },
  {
    label: 'Setting Akun',
    icon: Settings,
    path: '/setting-akun',
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: 'Profil & password',
  },
  {
    label: 'Kunjungi Website',
    icon: Globe,
    path: '/',
    color: '#28A71A',
    bgColor: '#EAF6E8',
    description: 'Lihat portal publik MENARA',
  },
];

export default function DashboardAdminBaznas() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#1C7712] to-[#28A71A] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Selamat Datang, {user?.nama || 'Admin'}!
            </h1>
            <p className="text-sm text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Anda login sebagai <span className="font-medium text-white">Admin BAZNAS</span>
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
            className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)] hover:shadow-md hover:border-[#28A71A]/30 transition-all duration-200 group relative"
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
                <h3 className="text-sm font-semibold text-[#303030] mb-0.5">{link.label}</h3>
                <p className="text-xs text-[#555]">{link.description}</p>
              </div>
              {link.badge !== undefined && (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-white">{link.badge}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Masjid</p>
            <Building2 size={16} className="text-[#28A71A]" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>0</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={14} className="text-[#28A71A]" />
            <span className="badge-xs bg-[#E6F9F0] text-[#006844]">Terdaftar</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Penerimaan</p>
            <TrendingUp size={16} className="text-[#28A71A]" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp 0</p>
          <span className="badge-xs bg-[#E6F9F0] text-[#006844]">Nasional</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Pengeluaran</p>
            <TrendingDown size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp 0</p>
          <span className="badge-xs bg-red-50 text-red-600">Nasional</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pengajuan Baru</p>
            <ClipboardCheck size={16} className="text-[#D97706]" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>0</p>
          <Link
            to="/pengajuan-masjid"
            className="text-[10px] text-[#2B7FFF] hover:underline inline-block mt-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Lihat pengajuan →
          </Link>
        </div>
      </div>
    </div>
  );
}
