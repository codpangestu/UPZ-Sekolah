import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HandCoins, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import { useMicrofinanceList, useCreateMicrofinance, useUpdateMicrofinance, useDeleteMicrofinance } from '../hooks/useMicrofinance';
import type { PilihanSkemaPinjaman } from '../types';

const MAX_NOMINAL = 3_000_000;
const formatRupiah = (v: string | number | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

const emptyForm = { nama_pilihan_skema_pinjaman: '', jumlah_nominal: '', keterangan: '' };

export default function PilihanSkemaPinjamanPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<PilihanSkemaPinjaman>('pilihan-skema-pinjaman', idMasjid);
  const createMutation = useCreateMicrofinance('pilihan-skema-pinjaman');
  const updateMutation = useUpdateMicrofinance('pilihan-skema-pinjaman');
  const deleteMutation = useDeleteMicrofinance('pilihan-skema-pinjaman');

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PilihanSkemaPinjaman | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyForm);

  const data = listRes?.data || [];

  const openCreate = () => {
    setEditItem(null);
    setFormData({ ...emptyForm, parent_id: idMasjid });
    setShowForm(true);
  };

  const openEdit = (item: PilihanSkemaPinjaman) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (Number(formData.jumlah_nominal) > MAX_NOMINAL) {
      toast.error(`Jumlah nominal pinjaman maksimal ${formatRupiah(MAX_NOMINAL)}`);
      return;
    }
    if (editItem) await updateMutation.mutateAsync({ id: editItem.id_pilihan_skema_pinjaman, data: formData });
    else await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleDelete = async (item: PilihanSkemaPinjaman) => {
    if (confirm(`Hapus pilihan "${item.nama_pilihan_skema_pinjaman}"?`)) {
      await deleteMutation.mutateAsync(item.id_pilihan_skema_pinjaman);
    }
  };

  const columns: Column<PilihanSkemaPinjaman>[] = [
    { key: 'nama_pilihan_skema_pinjaman', label: 'Nama Pilihan Pinjaman', render: (d) => d.nama_pilihan_skema_pinjaman || '-' },
    { key: 'jumlah_nominal', label: 'Jumlah Nominal', render: (d) => formatRupiah(d.jumlah_nominal) },
    {
      key: 'aksi', label: 'Aksi',
      render: (d) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-[#F0F4F8] text-[#555] hover:text-[#2B7FFF]"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(d)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#555] hover:text-red-500"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        to="/microfinance"
        className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#28A71A] transition-colors"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Menu Microfinance
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <HandCoins size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pilihan Jumlah Pinjaman</h1>
          <p className="text-sm text-[#555]">Skema nominal pinjaman BMM — maksimal {formatRupiah(MAX_NOMINAL)} per skema</p>
        </div>
      </div>

      <DataTable data={data} columns={columns} loading={isLoading} onAdd={openCreate} addLabel="Tambah Pilihan Pinjaman" emptyMessage="Belum ada pilihan skema pinjaman" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">{editItem ? 'Edit' : 'Tambah'} Pilihan Jumlah Pinjaman</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Pilihan Pinjaman</label>
                <input value={formData.nama_pilihan_skema_pinjaman || ''} onChange={(e) => setFormData({ ...formData, nama_pilihan_skema_pinjaman: e.target.value })}
                  placeholder="mis. Pinjaman Kecil, Pinjaman Sedang"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Jumlah Nominal (maks {formatRupiah(MAX_NOMINAL)})</label>
                <input type="number" max={MAX_NOMINAL} value={formData.jumlah_nominal || ''} onChange={(e) => setFormData({ ...formData, jumlah_nominal: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan (opsional)</label>
                <textarea value={formData.keterangan || ''} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-xl text-sm text-[#303030] hover:bg-[#F0F4F8]">Batal</button>
              <button onClick={handleSubmit} className="btn-primary-green rounded-xl"><Plus size={16} />{editItem ? 'Simpan' : 'Tambah'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
