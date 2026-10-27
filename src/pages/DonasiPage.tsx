import { useState } from 'react';
import { Heart, Gift, GraduationCap } from 'lucide-react';

const donationPrograms = [
  {
    id: 1,
    title: 'Beasiswa Siswa Dhuafa',
    description: 'Bantu biaya SPP, seragam, dan perlengkapan sekolah bagi siswa prasejahtera binaan UPZ Sekolah.',
    target: 'Rp 250.000.000',
    collected: 'Rp 185.000.000',
    percentage: 74,
    image: '🎓',
  },
  {
    id: 2,
    title: 'Bantuan Sarana Belajar & Lab',
    description: 'Dukung pengadaan komputer, buku referensi, dan media pembelajaran di madrasah & sekolah pelosok.',
    target: 'Rp 300.000.000',
    collected: 'Rp 210.000.000',
    percentage: 70,
    image: '💻',
  },
  {
    id: 3,
    title: 'Gerakan Infak Jumat Siswa',
    description: 'Program infak rutin untuk melatih empati dan literasi filantropi Islam sejak bangku sekolah.',
    target: 'Rp 100.000.000',
    collected: 'Rp 82.500.000',
    percentage: 82,
    image: '🪙',
  },
  {
    id: 4,
    title: 'Santunan Yatim & Piatu Sekolah',
    description: 'Bantuan uang saku dan kebutuhan sekolah berkelanjutan untuk siswa yatim/piatu binaan sekolah.',
    target: 'Rp 150.000.000',
    collected: 'Rp 115.000.000',
    percentage: 76,
    image: '🤲',
  },
  {
    id: 5,
    title: 'Nutrisi & Sarapan Sehat Siswa',
    description: 'Penyaluran paket sarapan sehat dan susu untuk menjaga gizi serta fokus belajar peserta didik.',
    target: 'Rp 80.000.000',
    collected: 'Rp 52.000.000',
    percentage: 65,
    image: '🥛',
  },
  {
    id: 6,
    title: 'Renovasi Musholla Sekolah',
    description: 'Perbaikan tempat wudhu, sarana sanitasi higienis, dan musala ibadah civitas sekolah binaan UPZ.',
    target: 'Rp 200.000.000',
    collected: 'Rp 135.000.000',
    percentage: 67,
    image: '🏫',
  },
];

const nominalDonasi = [20000, 50000, 100000, 250000, 500000, 1000000];

export default function DonasiPage() {
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState('');

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero */}
      <section className="hero-section">
        <div className="badge-blue mx-auto mb-6 w-fit flex items-center gap-2">
          <GraduationCap size={15} />
          <span>Donasi & ZIS Pendidikan</span>
        </div>
        <h1 className="text-slate-800">
          Dukung Pendidikan Lewat <span className="text-gradient-blue">UPZ Sekolah</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Salurkan Zakat, Infak, dan Sedekah Anda untuk beasiswa siswa, sarana belajar, dan pemberdayaan generasi masa depan
        </p>
      </section>

      {/* Programs */}
      <section className="page-section">
        <div className="page-section-inner">
          <div className="text-center mb-12">
            <h2 className="section-title">
              Pilih Program <span className="text-gradient-blue">ZIS Pendidikan</span>
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Setiap donasi Anda akan tercatat dalam sistem dan disalurkan secara transparan ke sekolah binaan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationPrograms.map((program) => (
              <div key={program.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-hover shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{program.image}</span>
                    <span className="badge-xs bg-[#E0F2FE] text-[#0369A1] font-semibold text-xs px-2.5 py-1 rounded-full">
                      {program.percentage}% Terkumpul
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{program.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{program.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                      <span>Terkumpul: <strong className="text-slate-800">{program.collected}</strong></span>
                      <span>Target: <strong className="text-slate-800">{program.target}</strong></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full transition-all duration-500"
                        style={{ width: `${program.percentage}%` }}
                      />
                    </div>
                  </div>

                  <button className="btn-primary-blue w-full justify-center rounded-full py-2.5 text-sm font-semibold flex items-center gap-2">
                    <Heart size={15} />
                    Donasi Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Donate */}
      <section className="page-section bg-white">
        <div className="page-section-inner max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="badge-blue mx-auto mb-4 w-fit flex items-center gap-2">
              <Gift size={15} />
              <span>Donasi Cepat</span>
            </div>
            <h2 className="section-title">
              Donasi <span className="text-gradient-blue">Cepat & Aman</span>
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Pilih nominal donasi atau masukkan jumlah sesuai ketulusan hati Anda
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {/* Nominal Pills */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {nominalDonasi.map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => {
                    setSelectedNominal(nominal);
                    setCustomNominal('');
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 font-sans ${
                    selectedNominal === nominal
                      ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                      : 'border-slate-200 text-slate-600 hover:border-[#0284C7]/50 hover:text-[#0284C7]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Rp {nominal.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Atau masukkan nominal sendiri
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
                <input
                  type="text"
                  placeholder="0"
                  value={customNominal}
                  onChange={(e) => {
                    setCustomNominal(e.target.value.replace(/[^0-9]/g, ''));
                    setSelectedNominal(null);
                  }}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#0284C7] focus:outline-none text-lg font-semibold text-slate-800"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
            </div>

            {/* Donate Button */}
            <button className="btn-primary-blue w-full justify-center text-base py-4 rounded-xl flex items-center gap-2 font-semibold">
              <Heart size={18} />
              Salurkan Donasi Sekarang
            </button>

            <p className="text-center text-xs text-slate-400 mt-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Donasi Anda dikelola dengan pengawasan BAZNAS RI. Seluruh transaksi tercatat otomatis di buku kas digital UPZ Sekolah.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Metode Pembayaran Resmi</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'GoPay', 'OVO', 'Dana', 'LinkAja', 'QRIS'].map((method) => (
                <span
                  key={method}
                  className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 shadow-xs"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

