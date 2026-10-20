import { useState } from 'react';
import { Handshake, Plus, Trash2 } from 'lucide-react';

const initialMitra = [
  { id: 1, nama: 'BAZNAS RI', bidang: 'Mitra Utama', icon: '🏛️' },
  { id: 2, nama: 'Kementerian Agama', bidang: 'Pemerintah', icon: '🏢' },
  { id: 3, nama: 'Bank Syariah Indonesia', bidang: 'Perbankan', icon: '🏦' },
  { id: 4, nama: 'Dompet Dhuafa', bidang: 'Lembaga Sosial', icon: '🤝' },
];

export default function MitraKerjasamaPage() {
  const [mitra, setMitra] = useState(initialMitra);
  const [showForm, setShowForm] = useState(false);
  const [newMitra, setNewMitra] = useState({ nama: '', bidang: '' });

  const handleAdd = () => {
    if (!newMitra.nama.trim()) return;
    setMitra([...mitra, { id: Date.now(), ...newMitra, icon: '🤝' }]);
    setNewMitra({ nama: '', bidang: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
            <Handshake size={20} className="text-[#28A71A]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Mitra Kerjasama</h1>
            <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daftar mitra dan kerjasama masjid</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary-green gap-2 rounded-xl"><Plus size={16} />Tambah</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mitra.map((m) => (
          <div key={m.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-5 flex items-center gap-4 card-hover group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.nama}</p>
              <p className="text-xs text-[#555] mt-0.5">{m.bidang}</p>
            </div>
            <button onClick={() => setMitra(mitra.filter(x => x.id !== m.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-[#555] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah Mitra</h3>
            <div className="space-y-3 mb-4">
              <input value={newMitra.nama} onChange={(e) => setNewMitra({ ...newMitra, nama: e.target.value })} placeholder="Nama mitra/lembaga"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              <input value={newMitra.bidang} onChange={(e) => setNewMitra({ ...newMitra, bidang: e.target.value })} placeholder="Bidang kerjasama"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-xl text-sm text-[#303030] hover:bg-[#F0F4F8]">Batal</button>
              <button onClick={handleAdd} className="btn-primary-green rounded-xl"><Plus size={16} />Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
