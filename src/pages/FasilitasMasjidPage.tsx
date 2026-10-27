import { useState } from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const initialFasilitas = [
  { id: 1, nama: 'Posko Layanan ZIS', icon: '🏫' },
  { id: 2, nama: 'Kotak Infak Kesiswaan', icon: '📦' },
  { id: 3, nama: 'Ruang Konsultasi Mustahik', icon: '🤝' },
  { id: 4, nama: 'Display Informasi Digital', icon: '🖥️' },
  { id: 5, nama: 'Komputer Administrasi', icon: '💻' },
  { id: 6, nama: 'Pojok Literasi ZIS', icon: '📚' },
  { id: 7, nama: 'Akses WiFi Posko', icon: '📶' },
  { id: 8, nama: 'Gudang Logistik Bantuan', icon: '📦' },
];

export default function FasilitasMasjidPage() {
  const [fasilitas, setFasilitas] = useState(initialFasilitas);
  const [showForm, setShowForm] = useState(false);
  const [newNama, setNewNama] = useState('');

  const handleAdd = () => {
    if (!newNama.trim()) return;
    setFasilitas([...fasilitas, { id: Date.now(), nama: newNama, icon: '✅' }]);
    setNewNama('');
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setFasilitas(fasilitas.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-[#0284C7]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sarana & Fasilitas UPZ</h1>
            <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola sarana dan fasilitas layanan UPZ di sekolah</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary-blue gap-2 rounded-xl flex items-center"><Plus size={16} />Tambah</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {fasilitas.map((f) => (
          <div key={f.id} className="bg-white border border-[#BAE6FD]/60 rounded-xl p-4 flex items-center gap-3 group card-hover shadow-xs">
            <span className="text-2xl">{f.icon}</span>
            <span className="text-sm font-medium text-[#303030] flex-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.nama}</span>
            <button onClick={() => handleDelete(f.id)} className="p-1 rounded-lg hover:bg-red-50 text-[#555] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah Fasilitas UPZ</h3>
            <input value={newNama} onChange={(e) => setNewNama(e.target.value)} placeholder="Nama sarana/fasilitas..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-xl text-sm text-[#303030] hover:bg-[#F0F4F8]">Batal</button>
              <button onClick={handleAdd} className="btn-primary-blue rounded-xl flex items-center gap-1"><Plus size={16} />Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
