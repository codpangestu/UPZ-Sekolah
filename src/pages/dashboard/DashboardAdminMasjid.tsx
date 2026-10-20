import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Wallet, Building2, Megaphone, BookOpen, Users, Calendar, Settings, TrendingUp, TrendingDown, MapPin, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { masjidService } from '../../services/masjidService';
import GrafikKasBulanan from '../../components/shared/GrafikKasBulanan';

const quickLinks = [
  {
    label: 'Buku Kas',
    icon: Wallet,
    path: '/buku-kas/penerimaan',
    color: '#28A71A',
    bgColor: '#EAF6E8',
    description: 'Kelola penerimaan & pengeluaran',
  },
  {
    label: 'Data Masjid',
    icon: Building2,
    path: '/data-masjid/profil',
    color: '#2B7FFF',
    bgColor: '#EAF2FF',
    description: 'Profil & detail masjid',
  },
  {
    label: 'Menu Publikasi',
    icon: Megaphone,
    path: '/menu-publikasi/postingan',
    color: '#7C3AED',
    bgColor: '#F3E8FF',
    description: 'Postingan, kajian, acara',
  },
  {
    label: 'Data Pengurus',
    icon: Users,
    path: '/info-masjid/data-pengurus',
    color: '#D97706',
    bgColor: '#FFFBEB',
    description: 'Kelola pengurus masjid',
  },
  {
    label: 'Kegiatan',
    icon: Calendar,
    path: '/kegiatan-masjid',
    color: '#E11D48',
    bgColor: '#FFF1F2',
    description: 'Data kegiatan masjid',
  },
  {
    label: 'Buku Aset',
    icon: BookOpen,
    path: '/buku-aset',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    description: 'Pencatatan aset masjid',
  },
  {
    label: 'Setting Akun',
    icon: Settings,
    path: '/setting-akun',
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: 'Pengaturan profil & password',
  },
];

function formatCurrency(val: number | undefined | null): string {
  if (val == null || Number.isNaN(Number(val))) return 'Rp 0';
  return `Rp ${Number(val).toLocaleString('id-ID')}`;
}

export default function DashboardAdminMasjid() {
  const { user } = useAuthStore();
  // id masjid user: login admin-masjid mengisi id_jalur_akses = id_masjid (kode org)
  const idMasjid = user?.id_jalur_akses || user?.id_masjid;

  const { data: masjidData, isLoading: masjidLoading } = useQuery({
    queryKey: ['dashboard-masjid-detail', idMasjid],
    queryFn: async () => {
      if (!idMasjid) return null;
      const res = await masjidService.getMasjidDetail(idMasjid);
      return res?.data ?? null;
    },
    enabled: !!idMasjid,
  });

  const { data: rekapData } = useQuery({
    queryKey: ['dashboard-masjid-rekap', idMasjid],
    queryFn: async () => {
      if (!idMasjid) return null;
      const res = await masjidService.getRekapByMasjid(idMasjid);
      return res?.data ?? null;
    },
    enabled: !!idMasjid,
  });

  const masjid = masjidData as (typeof masjidData & { nama_masjid?: string; alamat_masjid?: string }) | null;
  const namaMasjid = masjid?.nama_masjid || user?.nama_masjid || '';
  const alamatMasjid = masjid?.alamat_masjid || '';
  const totalPenerimaan = rekapData?.total_penerimaan;
  const totalPengeluaran = rekapData?.total_pengeluaran;
  const saldo =
    totalPenerimaan != null && totalPengeluaran != null
      ? Number(totalPenerimaan) - Number(totalPengeluaran)
      : null;

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
              Anda login sebagai <span className="font-medium text-white">Admin Masjid</span>
            </p>
          </div>
          {masjidLoading ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-right flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-sm">Memuat...</span>
            </div>
          ) : namaMasjid ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-right">
              <p className="text-xs text-white/70">Masjid</p>
              <p className="text-sm font-medium">{namaMasjid}</p>
            </div>
          ) : (
            <Link
              to="/data-masjid/profil"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-right transition-colors"
            >
              <p className="text-xs text-white/70">Masjid</p>
              <p className="text-sm font-medium">Lengkapi profil →</p>
            </Link>
          )}
        </div>
        {/* Alamat masjid dari API */}
        {alamatMasjid && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <MapPin size={13} />
            <span className="line-clamp-1">{alamatMasjid}</span>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)] hover:shadow-md hover:border-[#28A71A]/30 transition-all duration-200 group"
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
            </div>
          </Link>
        ))}
      </div>

      {/* Grafik Penerimaan vs Pengeluaran per Bulan (FR-2.5–2.7) */}
      <GrafikKasBulanan idMasjid={idMasjid} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Penerimaan</p>
            <TrendingUp size={16} className="text-[#28A71A]" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(totalPenerimaan)}
          </p>
          <span className="badge-xs mt-2 inline-flex bg-[#E6F9F0] text-[#006844]">Seluruh waktu</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Pengeluaran</p>
            <TrendingDown size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(totalPengeluaran)}
          </p>
          <span className="badge-xs mt-2 inline-flex bg-red-50 text-red-600">Seluruh waktu</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Saldo Akhir</p>
            <Wallet size={16} className="text-[#28A71A]" />
          </div>
          <p className="text-2xl font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(saldo)}
          </p>
          <span className="badge-xs mt-2 inline-flex bg-[#EAF6E8] text-[#1C7712]">Tersedia</span>
        </div>
      </div>
    </div>
  );
}
