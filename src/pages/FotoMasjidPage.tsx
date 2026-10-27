import { Image, Upload, X } from 'lucide-react';

const images = [
  { id: 1, label: 'Posko Layanan UPZ', emoji: '🏫' },
  { id: 2, label: 'Penyaluran Beasiswa Siswa', emoji: '🎓' },
  { id: 3, label: 'Sosialisasi Literasi ZIS', emoji: '📖' },
  { id: 4, label: 'Kotak Infak Kesiswaan', emoji: '📦' },
  { id: 5, label: 'Kantor Sekretariat UPZ', emoji: '🏢' },
  { id: 6, label: 'Santunan Yatim & Dhuafa', emoji: '🤲' },
];

export default function FotoMasjidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
          <Image size={20} className="text-[#0284C7]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dokumentasi & Foto UPZ Sekolah</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola galeri kegiatan, posko UPZ, dan penyaluran ZIS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white border border-[#BAE6FD]/60 rounded-2xl overflow-hidden group card-hover shadow-xs">
            <div className="h-40 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] flex items-center justify-center text-5xl relative">
              <span>{img.emoji}</span>
              <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <X size={14} className="text-red-500" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{img.label}</p>
            </div>
          </div>
        ))}

        {/* Upload Card */}
        <div className="border-2 border-dashed border-[#BAE6FD] rounded-2xl flex flex-col items-center justify-center gap-3 p-8 cursor-pointer hover:border-[#0284C7] hover:bg-[#F0F9FF]/50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#F0F9FF] flex items-center justify-center group-hover:bg-white transition-colors">
            <Upload size={20} className="text-[#555] group-hover:text-[#0284C7]" />
          </div>
          <p className="text-sm text-[#555] group-hover:text-[#0284C7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upload Foto Baru</p>
        </div>
      </div>
    </div>
  );
}
