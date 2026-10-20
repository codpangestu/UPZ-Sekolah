import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserRound, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import { useMicrofinanceList, useCreateMicrofinance, useUpdateMicrofinance, useDeleteMicrofinance } from '../hooks/useMicrofinance';
import type { Pendamping } from '../types';

const emptyForm = {
  nama_pendamping_bmfi_asesmen: '',
  jenis_kelamin: 'Laki-laki',
  no_ktp: '',
  no_hp: '',
  tempat_tanggal_lahir: '',
  alamat: '',
  keterangan: '',
};

export default function PendampingPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<Pendamping>('pendamping', idMasjid);
  const createMutation = useCreateMicrofinance('pendamping');
  const updateMutation = useUpdateMicrofinance('pendamping');
  const deleteMutation = useDeleteMicrofinance('pendamping');

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Pendamping | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyForm);

  const data = listRes?.data || [];

  const openCreate = () => {
    setEditItem(null);
    setFormData({ ...emptyForm, parent_id: idMasjid });
    setShowForm(true);
  };

  const openEdit = (item: Pendamping) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) await updateMutation.mutateAsync({ id: editItem.id_pendamping_bmfi_asesmen, data: formData });
    else await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleDelete = async (item: Pendamping) => {
    if (confirm(`Hapus pendamping "${item.nama_pendamping_bmfi_asesmen}"?`)) {
      await deleteMutation.mutateAsync(item.id_pendamping_bmfi_asesmen);
    }
  };

  const columns: Column<Pendamping>[] = [
    { key: 'nama_pendamping_bmfi_asesmen', label: 'Nama', render: (d) => d.nama_pendamping_bmfi_asesmen || '-' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin', render: (d) => d.jenis_kelamin || '-' },
    { key: 'no_hp', label: 'No. HP', render: (d) => d.no_hp || '-', hideOnMobile: true },
    { key: 'alamat', label: 'Alamat', render: (d) => d.alamat || '-', hideOnMobile: true },
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
          <UserRound size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pendamping</h1>
          <p className="text-sm text-[#555]">Data pendamping program BMM masjid ini</p>
        </div>
      </div>

      <DataTable data={data} columns={columns} loading={isLoading} onAdd={openCreate} addLabel="Tambah Pendamping" emptyMessage="Belum ada data pendamping" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">{editItem ? 'Edit' : 'Tambah'} Pendamping</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Lengkap</label>
                <input value={formData.nama_pendamping_bmfi_asesmen || ''} onChange={(e) => setFormData({ ...formData, nama_pendamping_bmfi_asesmen: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Jenis Kelamin</label>
                  <select value={formData.jenis_kelamin || 'Laki-laki'} onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">No. HP</label>
                  <input value={formData.no_hp || ''} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">No. KTP</label>
                  <input value={formData.no_ktp || ''} onChange={(e) => setFormData({ ...formData, no_ktp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Tempat, Tanggal Lahir</label>
                  <input value={formData.tempat_tanggal_lahir || ''} onChange={(e) => setFormData({ ...formData, tempat_tanggal_lahir: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Alamat</label>
                <textarea value={formData.alamat || ''} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan</label>
                <textarea value={formData.keterangan || ''} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} rows={2}
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
