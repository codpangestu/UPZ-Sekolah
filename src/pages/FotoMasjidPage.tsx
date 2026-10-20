import { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';

const images = [
  { id: 1, label: 'Tampak Depan', emoji: '🕌' },
  { id: 2, label: 'Tampak Samping', emoji: '🏛️' },
  { id: 3, label: 'Mihrab', emoji: '🕋' },
  { id: 4, label: 'Area Wudhu', emoji: '🚿' },
  { id: 5, label: 'Taman Masjid', emoji: '🌴' },
  { id: 6, label: 'Parkir', emoji: '🚗' },
];

export default function FotoMasjidPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <Image size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Foto Masjid</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola galeri foto masjid</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl overflow-hidden group card-hover">
            <div className="h-40 bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] flex items-center justify-center text-5xl relative">
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
        <div className="border-2 border-dashed border-[rgba(0,0,0,0.15)] rounded-2xl flex flex-col items-center justify-center gap-3 p-8 cursor-pointer hover:border-[#28A71A] hover:bg-[#EAF6E8]/50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#F0F4F8] flex items-center justify-center group-hover:bg-white transition-colors">
            <Upload size={20} className="text-[#555] group-hover:text-[#28A71A]" />
          </div>
          <p className="text-sm text-[#555] group-hover:text-[#28A71A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upload Foto Baru</p>
        </div>
      </div>
    </div>
  );
}
