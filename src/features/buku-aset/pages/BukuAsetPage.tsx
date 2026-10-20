import { useState } from 'react';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column, TableFilter } from '../../buku-kas/components/DataTable';
import { useAsetList, useCreateAset, useUpdateAset, useDeleteAset } from '../hooks/useBukuAset';
import type { Aset, AsetFormData } from '../types';
import { KONDISI_OPTIONS, KONDISI_COLOR } from '../types';

export default function BukuAsetPage() {
  const { data: asetList, isLoading } = useAsetList();
  const createMutation = useCreateAset();
  const updateMutation = useUpdateAset();
  const deleteMutation = useDeleteAset();
  const [search, setSearch] = useState('');
  const [kondisiFilter, setKondisiFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Aset | null>(null);
  const [formData, setFormData] = useState<AsetFormData>({ nama_aset: '', jumlah: 1, kondisi: 'baik', keterangan: '' });

  const openCreate = () => {
    setEditItem(null);
    setFormData({ nama_aset: '', jumlah: 1, kondisi: 'baik', keterangan: '' });
    setShowForm(true);
  };

  const openEdit = (item: Aset) => {
    setEditItem(item);
    setFormData({ nama_aset: item.nama_aset, jumlah: item.jumlah, kondisi: item.kondisi, keterangan: item.keterangan || '' });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) await updateMutation.mutateAsync({ id: editItem.id, data: formData });
    else await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleDelete = async (item: Aset) => {
    if (confirm(`Hapus aset "${item.nama_aset}"?`)) await deleteMutation.mutateAsync(item.id);
  };

  // Filter client-side: kondisi + search
  const filteredAset = (asetList || []).filter((a) => {
    const matchKondisi = !kondisiFilter || a.kondisi === kondisiFilter;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || a.nama_aset.toLowerCase().includes(q) || (a.keterangan || '').toLowerCase().includes(q);
    return matchKondisi && matchSearch;
  });

  const filters: TableFilter[] = [
    {
      key: 'kondisi',
      label: 'Kondisi',
      placeholder: 'Semua Kondisi',
      options: KONDISI_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      value: kondisiFilter,
      onChange: setKondisiFilter,
    },
  ];

  const columns: Column<Aset>[] = [
    { key: 'nama_aset', label: 'Nama Aset', render: (a) => a.nama_aset },
    { key: 'jumlah', label: 'Jumlah', render: (a) => `${a.jumlah} unit` },
    {
      key: 'kondisi',
      label: 'Kondisi',
      render: (a) => (
        <span className={`badge-xs ${KONDISI_COLOR[a.kondisi]}`}>
          {KONDISI_OPTIONS.find(o => o.value === a.kondisi)?.label}
        </span>
      ),
    },
    { key: 'keterangan', label: 'Keterangan', render: (a) => a.keterangan || '-', hideOnMobile: true },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (a) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-[#F0F4F8] text-[#555] hover:text-[#2B7FFF]"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#555] hover:text-red-500"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <Package size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Buku Aset</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pencatatan inventaris dan aset masjid</p>
        </div>
      </div>

      <DataTable
        data={filteredAset}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Cari nama aset..."
        searchQuery={search}
        onSearch={setSearch}
        filters={filters}
        onAdd={openCreate}
        addLabel="Tambah Aset"
        emptyMessage={search || kondisiFilter ? 'Tidak ada aset yang cocok' : 'Belum ada data aset'}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {editItem ? 'Edit Aset' : 'Tambah Aset'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Aset</label>
                <input value={formData.nama_aset} onChange={(e) => setFormData({ ...formData, nama_aset: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Jumlah</label>
                  <input type="number" min={1} value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Kondisi</label>
                  <select value={formData.kondisi} onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as AsetFormData['kondisi'] })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] bg-white">
                    {KONDISI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan</label>
                <textarea value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} rows={3}
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
