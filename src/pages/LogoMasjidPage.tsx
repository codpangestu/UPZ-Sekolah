import { Upload, GraduationCap } from 'lucide-react';

const logos = [
  { id: 1, nama: 'Logo BAZNAS RI', emoji: '🏛️' },
  { id: 2, nama: 'Logo Sekolah', emoji: '🏫' },
  { id: 3, nama: 'Logo UPZ Sekolah', emoji: '🎓' },
  { id: 4, nama: 'Logo Kemenag', emoji: '📜' },
];

export default function LogoMasjidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
          <GraduationCap size={20} className="text-[#0284C7]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Logo UPZ Sekolah</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola logo identitas UPZ Sekolah dan kemitraan</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {logos.map((logo) => (
          <div key={logo.id} className="bg-white border border-[#BAE6FD]/60 rounded-2xl p-6 flex flex-col items-center gap-3 card-hover shadow-xs">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] rounded-2xl flex items-center justify-center text-3xl">
              {logo.emoji}
            </div>
            <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{logo.nama}</p>
          </div>
        ))}
        <div className="border-2 border-dashed border-[#BAE6FD] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0284C7] hover:bg-[#F0F9FF]/50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#F0F9FF] flex items-center justify-center group-hover:bg-white transition-colors">
            <Upload size={20} className="text-[#555] group-hover:text-[#0284C7]" />
          </div>
          <p className="text-sm text-[#555] group-hover:text-[#0284C7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upload Logo</p>
        </div>
      </div>
    </div>
  );
}
