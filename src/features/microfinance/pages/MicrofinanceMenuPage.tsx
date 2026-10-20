import { Link } from 'react-router-dom';
import {
  FileText, Wallet, HandCoins, Users, UserRound, Receipt,
  Calculator, ClipboardCheck, MapPin, Landmark, History,
} from 'lucide-react';

interface MenuCard {
  label: string;
  description: string;
  icon: typeof FileText;
  path?: string;
  external?: boolean;
  available: boolean;
}

const menuItems: MenuCard[] = [
  { label: 'Sejarah dan Profil Microfinance', description: 'Pengesahan program BMM masjid', icon: FileText, path: '/microfinance/sejarah-profil', available: true },
  { label: 'Saldo Microfinance', description: 'Dana bergulir program BMM', icon: Wallet, path: '/microfinance/saldo', available: true },
  { label: 'Pilihan Jumlah Pinjaman', description: 'Skema nominal pinjaman (maks Rp3.000.000)', icon: HandCoins, path: '/microfinance/pilihan-skema-pinjaman', available: true },
  { label: 'Pendamping', description: 'Data pendamping program BMM', icon: UserRound, path: '/microfinance/pendamping', available: true },
  { label: 'Peserta Program dan Transaksi', description: 'Data mitra pinjaman, pencairan & cicilan', icon: Users, path: '/microfinance/peserta-program', available: true },
  { label: 'Mutasi Transaksi Microfinance', description: 'Ringkasan saldo & riwayat ledger', icon: Receipt, path: '/microfinance/mutasi-transaksi', available: true },
  { label: 'Kalkulator Skema Pinjaman', description: 'Simulasi target angsuran (alat publik)', icon: Calculator, path: '/kalkulator-pinjaman', available: true },
  { label: 'Skoring Penilaian Pinjaman', description: 'Asesmen kelayakan calon peminjam', icon: ClipboardCheck, path: '/skoring-pinjaman', available: true },
  { label: 'Peta Sebaran Geografis', description: 'Persebaran peserta program', icon: MapPin, path: '/microfinance/peta-sebaran', available: true },
  { label: 'Operasional Kas Penerimaan & Pengeluaran', description: 'Kas operasional terpisah dari dana bergulir', icon: Landmark, path: '/microfinance/operasional-kas', available: true },
  { label: 'Riwayat Pemutihan/Penghapusbukuan', description: 'Riwayat penghapusan piutang macet', icon: History, path: '/microfinance/riwayat-pemutihan', available: true },
];

export default function MicrofinanceMenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <HandCoins size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Microfinance
          </h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            BMM — BAZNAS Microfinance Masjid: layanan pinjaman modal usaha tanpa bunga (qardhul hasan) untuk jamaah masjid
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Content = (
            <div
              className={`h-full bg-white rounded-2xl border p-5 transition-all ${
                item.available
                  ? 'border-[rgba(0,0,0,0.1)] hover:border-[#28A71A] hover:shadow-md cursor-pointer'
                  : 'border-[rgba(0,0,0,0.06)] opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
                  <item.icon size={18} className="text-[#28A71A]" />
                </div>
                {!item.available && (
                  <span className="badge-xs bg-[#F0F4F8] text-[#555]">Segera Hadir</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {item.label}
              </h3>
              <p className="text-xs text-[#555]">{item.description}</p>
            </div>
          );

          if (!item.available || !item.path) {
            return <div key={item.label}>{Content}</div>;
          }
          return (
            <Link key={item.label} to={item.path}>
              {Content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
