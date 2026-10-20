import { Upload } from 'lucide-react';

const logos = [
  { id: 1, nama: 'Logo BAZNAS', emoji: '🏛️' },
  { id: 2, nama: 'Logo DKM', emoji: '🕌' },
  { id: 3, nama: 'Logo UPZ', emoji: '📋' },
  { id: 4, nama: 'Logo PHBI', emoji: '☪️' },
];

export default function LogoMasjidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A71A" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 14"/></svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Logo Masjid</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola logo organisasi masjid</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {logos.map((logo) => (
          <div key={logo.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 flex flex-col items-center gap-3 card-hover">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] rounded-2xl flex items-center justify-center text-3xl">
              {logo.emoji}
            </div>
            <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{logo.nama}</p>
          </div>
        ))}
        <div className="border-2 border-dashed border-[rgba(0,0,0,0.15)] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#28A71A] hover:bg-[#EAF6E8]/50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#F0F4F8] flex items-center justify-center group-hover:bg-white transition-colors">
            <Upload size={20} className="text-[#555] group-hover:text-[#28A71A]" />
          </div>
          <p className="text-sm text-[#555] group-hover:text-[#28A71A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upload Logo</p>
        </div>
      </div>
    </div>
  );
}
