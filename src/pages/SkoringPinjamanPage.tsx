import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, Printer } from 'lucide-react';

interface Question {
  key: string;
  label: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { key: 'experience_in_proposed_business', label: '1. Pengalaman dalam usaha yang diusulkan', options: ['> 2 tahun', '1-2 tahun', '< 1 tahun'] },
  { key: 'growth_potential', label: '2. Potensi usaha untuk tumbuh dan berkembang', options: ['Besar', 'Sedang', 'Tidak ada'] },
  { key: 'monthly_saving_capacity', label: '3. Kemampuan menabung setiap bulan', options: ['> 500.000', '100.000 – 500.000', '< 100.000'] },
  { key: 'capital_turnover', label: '4. Perputaran modal usaha', options: ['Harian', '7 – 15 hari', '> 15 hari'] },
  { key: 'payment_technique', label: '5. Teknik pembayaran produk/bahan baku utama dari sumber barang', options: ['Tunda bayar > 5 hari', 'Tunda bayar 1-5 hari', 'Tunai'] },
  { key: 'sales_payment_facility', label: '6. Fasilitas pembayaran hasil penjualan', options: ['Tunai: 1 – 3 hari', 'Tunai: 4 – 7 hari', 'Tunai > 7 hari'] },
  { key: 'average_revenue', label: '7. Rerata omset usaha dalam satu putaran modal', options: ['> 100%', '51% – 100%', '< 50%'] },
  { key: 'consumer_demand_level', label: '8. Tingkat kebutuhan konsumen terhadap produk/jasa', options: ['Primer: < 10 hari', 'Primer: 10 – 20 hari', 'Primer: > 20 hari'] },
  { key: 'sales_reach', label: '9. Jangkauan penjualan rutin', options: ['Desa/Kel. Sendiri', 'Antar Desa/Kel.', 'Antar Kota/Kab.'] },
  { key: 'pendidikan', label: '10. Pendidikan terakhir', options: ['SMA/Sederajat ke atas', 'SMP/Sederajat', 'SD/Tidak Sekolah'] },
  { key: 'usia', label: '11. Usia', options: ['25 – 50 tahun', '18 – 24 tahun / 51 – 60 tahun', '< 18 tahun / > 60 tahun'] },
];

export default function SkoringPinjamanPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [totalSkor, setTotalSkor] = useState('');
  const [hasilKeterangan, setHasilKeterangan] = useState('');
  const [rekomendasiPlafon, setRekomendasiPlafon] = useState('');

  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-[70vh] max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-6">
        <Link
          to="/microfinance"
          className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#28A71A] transition-colors mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ArrowLeft size={16} />
          Kembali ke Menu Microfinance
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
            <ClipboardCheck size={20} className="text-[#28A71A]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Skoring Penilaian Pinjaman
            </h1>
            <p className="text-xs text-[#555]">BMM — BAZNAS Microfinance Masjid</p>
          </div>
        </div>
        <p className="text-xs text-[#555] bg-[#F0F4F8] rounded-lg p-3 mb-6">
          Isi asesmen ini bersama calon peminjam, lalu catat hasilnya secara manual
          (Total Skor, Keterangan, dan Rekomendasi Plafon) berdasarkan penilaian
          Pendamping/Admin Masjid. Hasil di halaman ini bersifat catatan kerja —
          simpan datanya ke menu &quot;Peserta Program&quot; di dashboard.
        </p>

        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.key}>
              <p className="text-sm font-medium text-[#303030] mb-2">{q.label}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                    <input
                      type="radio"
                      name={q.key}
                      checked={answers[q.key] === idx}
                      onChange={() => setAnswers({ ...answers, [q.key]: idx })}
                      className="accent-[#28A71A]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#555] mt-4">Pertanyaan yang sudah diisi: {answered} dari {QUESTIONS.length}</p>

        <div className="border-t border-[rgba(0,0,0,0.08)] mt-6 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#303030]">Hasil Asesmen (diisi manual)</h3>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Total Skor</label>
            <input value={totalSkor} onChange={(e) => setTotalSkor(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan (mis. Prospek / Kurang Prospek)</label>
            <input value={hasilKeterangan} onChange={(e) => setHasilKeterangan(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1.5">Rekomendasi Plafon (Rp, maks 3.000.000)</label>
            <input type="number" max={3_000_000} value={rekomendasiPlafon} onChange={(e) => setRekomendasiPlafon(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
          </div>

          <button onClick={() => window.print()} className="w-full btn-primary-green rounded-xl justify-center">
            <Printer size={16} /> Cetak Hasil Asesmen
          </button>
        </div>
      </div>
    </div>
  );
}
