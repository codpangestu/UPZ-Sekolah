import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Wallet, GraduationCap, Megaphone, BookOpen, Users, Calendar, Settings, TrendingUp, TrendingDown, MapPin, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { masjidService } from '../../services/masjidService';
import GrafikKasBulanan from '../../components/shared/GrafikKasBulanan';

const quickLinks = [
  {
    label: 'Buku Kas ZIS',
    icon: Wallet,
    path: '/buku-kas/penerimaan',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    description: 'Penerimaan & penyaluran ZIS',
  },
  {
    label: 'Data UPZ Sekolah',
    icon: GraduationCap,
    path: '/data-masjid/profil',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    description: 'Profil & SK legalitas UPZ',
  },
  {
    label: 'Publikasi & Kabar',
    icon: Megaphone,
    path: '/menu-publikasi/postingan',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    description: 'Literasi zakat & agenda sekolah',
  },
  {
    label: 'Pengurus & Pembina',
    icon: Users,
    path: '/info-masjid/data-pengurus',
    color: '#D97706',
    bgColor: '#FFFBEB',
    description: 'Struktur guru & komite UPZ',
  },
  {
    label: 'Kegiatan UPZ',
    icon: Calendar,
    path: '/kegiatan-masjid',
    color: '#E11D48',
    bgColor: '#FFF1F2',
    description: 'Santunan & program ZIS siswa',
  },
  {
    label: 'Buku Aset & Sarana',
    icon: BookOpen,
    path: '/buku-aset',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    description: 'Pencatatan sarana & fasilitas',
  },
  {
    label: 'Setting Akun',
    icon: Settings,
    path: '/setting-akun',
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: 'Pengaturan profil & kata sandi',
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
      <div className="bg-gradient-to-r from-[#0369A1] to-[#0284C7] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Selamat Datang, {user?.nama || 'Admin UPZ'}!
            </h1>
            <p className="text-sm text-sky-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Anda login sebagai <span className="font-semibold text-white">Admin UPZ Sekolah</span>
            </p>
          </div>
          {masjidLoading ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-right flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-white" />
              <span className="text-sm">Memuat data...</span>
            </div>
          ) : namaMasjid ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-right border border-white/20">
              <p className="text-xs text-sky-100">UPZ Sekolah</p>
              <p className="text-sm font-semibold">{namaMasjid}</p>
            </div>
          ) : (
            <Link
              to="/data-masjid/profil"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-right transition-colors border border-white/20"
            >
              <p className="text-xs text-sky-100">UPZ Sekolah</p>
              <p className="text-sm font-medium">Lengkapi profil →</p>
            </Link>
          )}
        </div>
        {/* Alamat sekolah dari API */}
        {alamatMasjid && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
            className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md hover:border-[#0284C7]/40 transition-all duration-200 group"
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
            </div>
          </Link>
        ))}
      </div>

      {/* Grafik Penerimaan vs Pengeluaran per Bulan */}
      <GrafikKasBulanan idMasjid={idMasjid} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Penerimaan ZIS</p>
            <TrendingUp size={16} className="text-[#0284C7]" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(totalPenerimaan)}
          </p>
          <span className="badge-xs mt-2 inline-flex bg-[#E0F2FE] text-[#0369A1] font-semibold px-2 py-0.5 rounded-full text-[10px]">Seluruh waktu</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Penyaluran / Beasiswa</p>
            <TrendingDown size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(totalPengeluaran)}
          </p>
          <span className="badge-xs mt-2 inline-flex bg-rose-50 text-rose-600 font-semibold px-2 py-0.5 rounded-full text-[10px]">Seluruh waktu</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Saldo Kas ZIS Tersedia</p>
            <Wallet size={16} className="text-[#0284C7]" />
          </div>
          <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(saldo)}
          </p>
          <span className="badge-xs mt-2 inline-flex bg-[#E0F2FE] text-[#0369A1] font-semibold px-2 py-0.5 rounded-full text-[10px]">Saldo Aktif</span>
        </div>
      </div>
    </div>
  );
}

