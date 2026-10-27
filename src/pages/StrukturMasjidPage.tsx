import { GraduationCap } from 'lucide-react';

const strukturData = [
  { level: 1, nama: 'Ketua UPZ Sekolah', jabatan: 'Drs. H. Ahmad Syarif, M.Pd.', color: '#0284C7' },
  { level: 2, nama: 'Sekretaris UPZ', jabatan: 'H. M. Yusuf, S.Pd.', color: '#0369A1' },
  { level: 2, nama: 'Bendahara UPZ', jabatan: 'Hj. Siti Nurhaliza, S.E.', color: '#0369A1' },
  { level: 3, nama: 'Bid. Penghimpunan ZIS', jabatan: 'Ust. Faisal Rahman, S.Ag.', color: '#0284C7' },
  { level: 3, nama: 'Bid. Penyaluran Beasiswa', jabatan: 'Dra. Hj. Siti Nurhayati', color: '#0284C7' },
  { level: 3, nama: 'Bid. Edukasi ZIS', jabatan: 'Bambang Suprapto, S.Pd.', color: '#0284C7' },
  { level: 3, nama: 'Bid. Relawan Kesiswaan', jabatan: 'Dedi Kusnadi, M.Pd.', color: '#0284C7' },
  { level: 3, nama: 'Bid. Humas & Publikasi', jabatan: 'Taufik Hidayat, S.Kom.', color: '#0284C7' },
];

export default function StrukturMasjidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
          <GraduationCap size={20} className="text-[#0284C7]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Struktur UPZ Sekolah</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bagan susunan kepengurusan dan pembina UPZ Sekolah</p>
        </div>
      </div>

      <div className="bg-white border border-[#BAE6FD]/60 rounded-2xl p-6 md:p-8 shadow-xs">
        {/* Level 1 - Ketua */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0284C7] flex items-center justify-center text-white text-lg font-semibold mx-auto mb-2 shadow-sm">
              {strukturData[0].jabatan.charAt(0)}
            </div>
            <p className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{strukturData[0].nama}</p>
            <p className="text-xs text-[#0284C7] font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{strukturData[0].jabatan}</p>
          </div>
        </div>

        {/* Connector line */}
        <div className="w-px h-8 bg-[#BAE6FD] mx-auto mb-8" />

        {/* Level 2 - Sekretaris & Bendahara */}
        <div className="flex justify-center gap-8 mb-8">
          {strukturData.slice(1, 3).map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#0369A1] flex items-center justify-center text-white text-lg font-semibold mx-auto mb-2 shadow-xs">
                {item.jabatan.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.nama}</p>
              <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.jabatan}</p>
            </div>
          ))}
        </div>

        {/* Connector */}
        <div className="w-px h-8 bg-[#BAE6FD] mx-auto mb-8" />

        {/* Level 3 - Seksi-seksi */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {strukturData.slice(3).map((item, i) => (
            <div key={i} className="text-center p-3 bg-[#F0F9FF] rounded-xl border border-[#BAE6FD]/50">
              <div className="w-10 h-10 rounded-full bg-[#0284C7] flex items-center justify-center text-white text-sm font-semibold mx-auto mb-2 shadow-xs">
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
