import { Users } from 'lucide-react';

const strukturData = [
  { level: 1, nama: 'Ketua DKM', jabatan: 'Dr. H. Ahmad Syarif', color: '#28A71A' },
  { level: 2, nama: 'Sekretaris', jabatan: 'H. M. Yusuf', color: '#2B7FFF' },
  { level: 2, nama: 'Bendahara', jabatan: 'H. Abdurrahman', color: '#2B7FFF' },
  { level: 3, nama: 'Seksi Dakwah', jabatan: 'Ust. Faisal Rahman', color: '#7C3AED' },
  { level: 3, nama: 'Seksi Pendidikan', jabatan: 'Dr. Hj. Siti Nurhayati', color: '#7C3AED' },
  { level: 3, nama: 'Seksi Sosial', jabatan: 'H. Bambang Suprapto', color: '#7C3AED' },
  { level: 3, nama: 'Seksi Pembangunan', jabatan: 'Ir. H. Dedi Kusnadi', color: '#7C3AED' },
  { level: 3, nama: 'Seksi Humas', jabatan: 'Drs. H. Taufik Hidayat', color: '#7C3AED' },
];

export default function StrukturMasjidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <Users size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Struktur Masjid</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Struktur organisasi kepengurusan masjid</p>
        </div>
      </div>

      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 md:p-8">
        {/* Level 1 - Ketua */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#28A71A] flex items-center justify-center text-white text-lg font-semibold mx-auto mb-2">
              {strukturData[0].jabatan.charAt(0)}
            </div>
            <p className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{strukturData[0].nama}</p>
            <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{strukturData[0].jabatan}</p>
          </div>
        </div>

        {/* Connector line */}
        <div className="w-px h-8 bg-[#D4D4D4] mx-auto mb-8" />

        {/* Level 2 - Sekretaris & Bendahara */}
        <div className="flex justify-center gap-8 mb-8">
          {strukturData.slice(1, 3).map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#2B7FFF] flex items-center justify-center text-white text-lg font-semibold mx-auto mb-2">
                {item.jabatan.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.nama}</p>
              <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.jabatan}</p>
            </div>
          ))}
        </div>

        {/* Connector */}
        <div className="w-px h-8 bg-[#D4D4D4] mx-auto mb-8" />

        {/* Level 3 - Seksi-seksi */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {strukturData.slice(3).map((item, i) => (
            <div key={i} className="text-center p-3 bg-[#FAFAFA] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-sm font-semibold mx-auto mb-2">
                {item.jabatan.charAt(0)}
              </div>
              <p className="text-xs font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.nama}</p>
              <p className="text-[10px] text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.jabatan}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
