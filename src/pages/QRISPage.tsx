import { useState } from 'react';
import { QrCode, Plus, Trash2, Download, Copy } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const initialQR = [
  { id: 1, nama: 'QRIS Donasi Umum', nominal: 'Rp 0 (bebas)', value: 'https://qris.baznas.go.id/donasi/umum' },
  { id: 2, nama: 'QRIS Zakat Fitrah', nominal: 'Rp 50.000', value: 'https://qris.baznas.go.id/zakat/fitrah' },
];

export default function QRISPage() {
  const [qrList, setQrList] = useState(initialQR);
  const [showForm, setShowForm] = useState(false);
  const [newQR, setNewQR] = useState({ nama: '', value: '' });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newQR.nama.trim() || !newQR.value.trim()) return;
    setQrList([...qrList, { id: Date.now(), nama: newQR.nama, nominal: '-', value: newQR.value }]);
    setNewQR({ nama: '', value: '' });
    setShowForm(false);
  };

  const handleCopy = async (id: number, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
            <QrCode size={20} className="text-[#28A71A]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>QRIS Donasi</h1>
            <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola QR Code untuk donasi masjid</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary-green gap-2 rounded-xl"><Plus size={16} />Tambah QR</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrList.map((qr) => (
          <div key={qr.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 card-hover">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-xl border border-[rgba(0,0,0,0.06)]">
                <QRCodeCanvas value={qr.value} size={140} level="M" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[#303030] text-center mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{qr.nama}</h3>
            <p className="text-xs text-[#555] text-center mb-4">{qr.nominal}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => handleCopy(qr.id, qr.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgba(0,0,0,0.1)] text-[#555] hover:bg-[#F0F4F8] flex items-center gap-1">
                {copiedId === qr.id ? '✅ Tersalin' : <><Copy size={12} />Salin</>}
              </button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgba(0,0,0,0.1)] text-[#555] hover:bg-[#F0F4F8] flex items-center gap-1">
                <Download size={12} />Download
              </button>
              <button onClick={() => setQrList(qrList.filter(x => x.id !== qr.id))}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center gap-1">
                <Trash2 size={12} />Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah QR Code</h3>
            <div className="space-y-3 mb-4">
              <input value={newQR.nama} onChange={(e) => setNewQR({ ...newQR, nama: e.target.value })} placeholder="Nama QR (contoh: QRIS Donasi)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              <input value={newQR.value} onChange={(e) => setNewQR({ ...newQR, value: e.target.value })} placeholder="URL / link tujuan"
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
