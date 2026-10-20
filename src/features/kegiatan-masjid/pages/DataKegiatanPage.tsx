import { useState } from 'react';
import { Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column, TableFilter } from '../../buku-kas/components/DataTable';
import { useKegiatanList, useCreateKegiatan, useUpdateKegiatan, useDeleteKegiatan } from '../hooks/useKegiatanMasjid';
import type { Kegiatan, KegiatanFormData } from '../types';
import { JENIS_KEGIATAN_OPTIONS, JENIS_KEGIATAN_COLOR } from '../types';

export default function DataKegiatanPage() {
  const { data: kegiatanList, isLoading } = useKegiatanList();
  const createMutation = useCreateKegiatan();
  const updateMutation = useUpdateKegiatan();
  const deleteMutation = useDeleteKegiatan();
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Kegiatan | null>(null);
  const [formData, setFormData] = useState<KegiatanFormData>({ nama_kegiatan: '', jenis: 'rutin', keterangan: '' });

  const openCreate = () => {
    setEditItem(null);
    setFormData({ nama_kegiatan: '', jenis: 'rutin', keterangan: '' });
    setShowForm(true);
  };

  const openEdit = (item: Kegiatan) => {
    setEditItem(item);
    setFormData({ nama_kegiatan: item.nama_kegiatan, jenis: item.jenis, keterangan: item.keterangan || '' });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) {
      await updateMutation.mutateAsync({ id: editItem.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setShowForm(false);
  };

  const handleDelete = async (item: Kegiatan) => {
    if (confirm(`Hapus kegiatan "${item.nama_kegiatan}"?`)) {
      await deleteMutation.mutateAsync(item.id);
    }
  };

  // Filter client-side: jenis + search
  const filteredKegiatan = (kegiatanList || []).filter((k) => {
    const matchJenis = !jenisFilter || k.jenis === jenisFilter;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || k.nama_kegiatan.toLowerCase().includes(q) || (k.keterangan || '').toLowerCase().includes(q);
    return matchJenis && matchSearch;
  });

  const filters: TableFilter[] = [
    {
      key: 'jenis',
      label: 'Jenis',
      placeholder: 'Semua Jenis',
      options: JENIS_KEGIATAN_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      value: jenisFilter,
      onChange: setJenisFilter,
    },
  ];

  const columns: Column<Kegiatan>[] = [
    { key: 'nama_kegiatan', label: 'Nama Kegiatan', render: (k) => k.nama_kegiatan },
    {
      key: 'jenis',
      label: 'Jenis',
      render: (k) => (
        <span className={`badge-xs ${JENIS_KEGIATAN_COLOR[k.jenis]}`}>
          {k.jenis === 'rutin' ? 'Rutin' : 'Tertentu'}
        </span>
      ),
    },
    { key: 'keterangan', label: 'Keterangan', render: (k) => k.keterangan || '-', hideOnMobile: true },
    {
      key: 'status',
      label: 'Status',
      render: (k) => (
        <span className={`badge-xs ${k.status_aktif ? 'bg-[#E6F9F0] text-[#006844]' : 'bg-red-50 text-red-600'}`}>
          {k.status_aktif ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (k) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(k)} className="p-1.5 rounded-lg hover:bg-[#F0F4F8] text-[#555] hover:text-[#2B7FFF] transition-colors"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(k)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#555] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <Calendar size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Data Kegiatan Masjid</h1>
          <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kelola kegiatan rutin dan khusus masjid</p>
        </div>
      </div>

      <DataTable
        data={filteredKegiatan}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Cari nama kegiatan..."
        searchQuery={search}
        onSearch={setSearch}
        filters={filters}
        onAdd={openCreate}
        addLabel="Tambah Kegiatan"
        emptyMessage={search || jenisFilter ? 'Tidak ada kegiatan yang cocok' : 'Belum ada data kegiatan'}
      />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {editItem ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Kegiatan</label>
                <input value={formData.nama_kegiatan} onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Jenis</label>
                <select value={formData.jenis} onChange={(e) => setFormData({ ...formData, jenis: e.target.value as 'rutin' | 'tertentu' })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] bg-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {JENIS_KEGIATAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan</label>
                <textarea value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] resize-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-xl text-sm text-[#303030] hover:bg-[#F0F4F8]">Batal</button>
              <button onClick={handleSubmit} className="btn-primary-green rounded-xl">
                <Plus size={16} />
                {editItem ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
