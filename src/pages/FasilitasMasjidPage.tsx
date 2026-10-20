import { useState } from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react';

const initialFasilitas = [
  { id: 1, nama: 'Taman', icon: '🌴' },
  { id: 2, nama: 'Parkir Luas', icon: '🚗' },
  { id: 3, nama: 'Perpustakaan', icon: '📚' },
  { id: 4, nama: 'Kantin', icon: '🍽️' },
  { id: 5, nama: 'AC', icon: '❄️' },
  { id: 6, nama: 'WiFi', icon: '📶' },
  { id: 7, nama: 'Kursi Difabilitas', icon: '♿' },
  { id: 8, nama: 'Ruang Serbaguna', icon: '🏠' },
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
          <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-[#28A71A]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Fasilitas Masjid</h1>
            <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola daftar fasilitas masjid</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary-green gap-2 rounded-xl"><Plus size={16} />Tambah</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {fasilitas.map((f) => (
          <div key={f.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 flex items-center gap-3 group card-hover">
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
            <h3 className="text-lg font-semibold text-[#303030] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah Fasilitas</h3>
            <input value={newNama} onChange={(e) => setNewNama(e.target.value)} placeholder="Nama fasilitas"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] mb-4" />
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
