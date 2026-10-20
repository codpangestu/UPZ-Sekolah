import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator } from 'lucide-react';

type SkemaWaktu = '' | 'hari' | 'minggu' | 'bulan' | 'tahun';

const SKEMA_LABEL: Record<Exclude<SkemaWaktu, ''>, string> = {
  hari: 'hari', minggu: 'minggu', bulan: 'bulan', tahun: 'tahun',
};

export default function KalkulatorPinjamanPage() {
  const [jumlahPinjaman, setJumlahPinjaman] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('');
  const [skemaWaktu, setSkemaWaktu] = useState<SkemaWaktu>('');
  const [jumlahPeriode, setJumlahPeriode] = useState('');
  const [hasil, setHasil] = useState<{ angsuran: number; orang: number; periode: number; satuan: string } | null>(null);

  const handleHitung = () => {
    const pinjaman = Number(jumlahPinjaman);
    const orang = Number(jumlahOrang);
    const periode = Number(jumlahPeriode);
    if (!pinjaman || !orang || !periode || !skemaWaktu) {
      setHasil(null);
      return;
    }
    // Formula dikonfirmasi lewat uji langsung di menara.baznas.go.id:
    // angsuran = round(jumlah_pinjaman / jumlah_orang / jumlah_periode)
    const angsuran = Math.round(pinjaman / orang / periode);
    setHasil({ angsuran, orang, periode, satuan: SKEMA_LABEL[skemaWaktu] });
  };

  return (
    <div className="min-h-[70vh] flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-6">
        <Link
          to="/microfinance"
          className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#28A71A] transition-colors mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ArrowLeft size={16} />
          Kembali ke Menu Microfinance
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
            <Calculator size={20} className="text-[#28A71A]" />
          </div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kalkulator Skema Pinjaman
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Jumlah Pinjaman (Rp)</label>
            <input type="number" value={jumlahPinjaman} onChange={(e) => setJumlahPinjaman(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Jumlah Orang Ikut Meminjam</label>
            <input type="number" min={1} value={jumlahOrang} onChange={(e) => setJumlahOrang(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Skema Waktu</label>
            <select value={skemaWaktu} onChange={(e) => setSkemaWaktu(e.target.value as SkemaWaktu)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]">
              <option value="">Pilih</option>
              <option value="hari">Hari</option>
              <option value="minggu">Minggu</option>
              <option value="bulan">Bulan</option>
              <option value="tahun">Tahun</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Jumlah Batas {skemaWaktu ? SKEMA_LABEL[skemaWaktu] : 'Periode'}</label>
            <input type="number" min={1} value={jumlahPeriode} onChange={(e) => setJumlahPeriode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
          </div>

          <button onClick={handleHitung} className="w-full btn-primary-green rounded-xl justify-center">
            Hitung Target Angsuran Pengembalian
          </button>

          {hasil && (
            <div className="text-center pt-2 space-y-1">
              <p className="text-sm text-[#555]">Jumlah Perkiraan:</p>
              <p className="text-2xl font-semibold text-[#28A71A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Rp {hasil.angsuran.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-[#555]">per 1 Orang per {hasil.satuan}</p>
              <p className="text-sm text-[#555]">untuk Target {hasil.periode} {hasil.satuan}</p>
              <p className="text-sm text-[#555]">Kontribusi Pengembalian {hasil.orang} Orang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
