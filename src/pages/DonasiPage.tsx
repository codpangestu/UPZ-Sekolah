import { useState } from 'react';
import { Heart, Gift } from 'lucide-react';

const donationPrograms = [
  {
    id: 1,
    title: 'Pembangunan Masjid',
    description: 'Bantu pembangunan dan renovasi masjid di daerah yang membutuhkan.',
    target: 'Rp 500.000.000',
    collected: 'Rp 325.000.000',
    percentage: 65,
    image: '🕌',
  },
  {
    id: 2,
    title: 'Program Beasiswa Santri',
    description: 'Dukung pendidikan santri berprestasi dari keluarga kurang mampu.',
    target: 'Rp 250.000.000',
    collected: 'Rp 180.000.000',
    percentage: 72,
    image: '📚',
  },
  {
    id: 3,
    title: 'Bantuan Air Bersih',
    description: 'Salurkan air bersih untuk masjid di daerah kekeringan.',
    target: 'Rp 150.000.000',
    collected: 'Rp 97.500.000',
    percentage: 65,
    image: '💧',
  },
  {
    id: 4,
    title: 'Paket Sembako Marbot',
    description: 'Bantu kebutuhan sehari-hari para marbot masjid.',
    target: 'Rp 100.000.000',
    collected: 'Rp 75.000.000',
    percentage: 75,
    image: '🎁',
  },
  {
    id: 5,
    title: 'Program Dakwah Digital',
    description: 'Dukung penyebaran dakwah Islam melalui platform digital.',
    target: 'Rp 200.000.000',
    collected: 'Rp 110.000.000',
    percentage: 55,
    image: '📱',
  },
  {
    id: 6,
    title: 'Kurban Berkualitas',
    description: 'Salurkan hewan kurban ke masjid-masjid di pelosok negeri.',
    target: 'Rp 350.000.000',
    collected: 'Rp 245.000.000',
    percentage: 70,
    image: '🐄',
  },
];

const nominalDonasi = [50000, 100000, 250000, 500000, 1000000, 2500000];

export default function DonasiPage() {
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState('');

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero */}
      <section className="hero-section">
        <div className="badge-green mx-auto mb-6 w-fit">
          <Heart size={14} />
          <span>Donasi</span>
        </div>
        <h1>
          Donasi <span className="text-gradient-green">Sekarang</span>
        </h1>
        <p className="text-lg text-[#555] max-w-2xl mx-auto">
          Salurkan Zakat, Infak, dan Sedekah Anda melalui program-program terpercaya
        </p>
      </section>

      {/* Programs */}
      <section className="page-section">
        <div className="page-section-inner">
          <div className="text-center mb-12">
            <h2 className="section-title">
              Pilih Program <span className="text-gradient-green">Donasi</span>
            </h2>
            <p className="text-base text-[#555] mt-3">
              Setiap donasi Anda akan tersalurkan dengan transparan dan tepat sasaran
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationPrograms.map((program) => (
              <div key={program.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl overflow-hidden card-hover">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{program.image}</span>
                    <span className="badge-xs bg-[#E6F9F0] text-[#006844] text-xs">
                      {program.percentage}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#303030] mb-2">{program.title}</h3>
                  <p className="text-sm text-[#555] mb-4">{program.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#555] mb-2">
                      <span>Terkumpul: <strong className="text-[#303030]">{program.collected}</strong></span>
                      <span>Target: <strong className="text-[#303030]">{program.target}</strong></span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#28A71A] to-[#6FC466] rounded-full transition-all duration-500"
                        style={{ width: `${program.percentage}%` }}
                      />
                    </div>
                  </div>

                  <button className="btn-primary-green w-full justify-center rounded-full">
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
            <div className="badge-green mx-auto mb-4 w-fit">
              <Gift size={14} />
              <span>Donasi Cepat</span>
            </div>
            <h2 className="section-title">
              Donasi <span className="text-gradient-green">Cepat</span>
            </h2>
            <p className="text-base text-[#555] mt-3">
              Pilih nominal donasi atau masukkan jumlah sesuai keinginan Anda
            </p>
          </div>

          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8">
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
                      ? 'border-[#28A71A] bg-[#EAF6E8] text-[#28A71A]'
                      : 'border-gray-200 text-[#555] hover:border-[#28A71A]/50 hover:text-[#28A71A]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Rp {nominal.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#303030] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Atau masukkan nominal sendiri
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                <input
                  type="text"
                  placeholder="0"
                  value={customNominal}
                  onChange={(e) => {
                    setCustomNominal(e.target.value.replace(/[^0-9]/g, ''));
                    setSelectedNominal(null);
                  }}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#28A71A] focus:outline-none text-lg font-semibold text-[#303030]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
            </div>

            {/* Donate Button */}
            <button className="btn-primary-green w-full justify-center text-base py-4 rounded-xl">
              <Heart size={18} />
              Donasi Sekarang
            </button>

            <p className="text-center text-xs text-gray-400 mt-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Donasi Anda akan disalurkan melalui BAZNAS RI. Semua transaksi tercatat dan dapat dilacak.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#555] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Metode Pembayaran</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['BCA', 'Mandiri', 'BNI', 'BRI', 'GoPay', 'OVO', 'Dana', 'LinkAja'].map((method) => (
                <span
                  key={method}
                  className="px-4 py-2 bg-white rounded-lg border border-[rgba(0,0,0,0.1)] text-sm font-medium text-[#555]"
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
