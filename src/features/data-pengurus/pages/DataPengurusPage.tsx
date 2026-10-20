import { useState, useCallback } from 'react';
import { Users, Pencil, Trash2, Shield, Calendar } from 'lucide-react';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column, TableFilter } from '../../buku-kas/components/DataTable';
import FormModal from '../components/FormModal';
import { useDataPengurusList, useCreatePengurus, useUpdatePengurus, useDeletePengurus } from '../hooks/useDataPengurus';
import { GENDER_LABEL, JABATAN_OPTIONS } from '../types';
import type { Pengurus } from '../types';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DataPengurusPage() {
  const [search, setSearch] = useState('');
  const [jabatanFilter, setJabatanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Pengurus | null>(null);

  const { data: listData, isLoading: listLoading } = useDataPengurusList({
    page,
    per_page: perPage,
    search: search || undefined,
  });

  const createMutation = useCreatePengurus();
  const updateMutation = useUpdatePengurus();
  const deleteMutation = useDeletePengurus();

  const pengurusList = listData?.data || [];
  const pagination = listData?.pagination;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  // Filter client-side atas data halaman aktif (list dipaginasi server-side)
  const filteredPengurus = pengurusList.filter(
    (p) => !jabatanFilter || p.jabatan === jabatanFilter
  );

  const filters: TableFilter[] = [
    {
      key: 'jabatan',
      label: 'Jabatan',
      placeholder: 'Semua Jabatan',
      options: JABATAN_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      value: jabatanFilter,
      onChange: (v) => {
        setJabatanFilter(v);
        setPage(1);
      },
    },
  ];

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: Pengurus) => {
    setEditItem(item);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (item: Pengurus) => {
      if (confirm(`Apakah Anda yakin ingin menghapus ${item.nama} dari daftar pengurus?`)) {
        if (item.id) deleteMutation.mutate(item.id);
      }
    },
    [deleteMutation]
  );

  const handleSubmit = useCallback(
    async (formData: any) => {
      const payload: Partial<Pengurus> = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        nohp: formData.nohp,
        alamat: formData.alamat,
        jenis_kelamin: formData.jenis_kelamin,
        masa_jabatan_mulai: formData.masa_jabatan_mulai || undefined,
        masa_jabatan_selesai: formData.masa_jabatan_selesai || undefined,
        keterangan: formData.keterangan || '',
      };

      try {
        if (editItem?.id) {
          await updateMutation.mutateAsync({ id: editItem.id, data: payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        setModalOpen(false);
      } catch {
        // Error handled by mutation's onError
      }
    },
    [editItem, createMutation, updateMutation]
  );

  const columns: Column<Pengurus>[] = [
    {
      key: 'nama',
      label: 'Nama',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EAF6E8] flex items-center justify-center text-[#28A71A] text-sm font-semibold flex-shrink-0">
            {item.nama?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <span className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {item.nama}
            </span>
            <span className="text-xs text-text-gray block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {item.nohp || ''}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'jabatan',
      label: 'Jabatan',
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-[#303030] bg-[#F0F4F8] px-2.5 py-1 rounded-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Shield size={12} className="text-[#28A71A]" />
          {item.jabatan || '-'}
        </span>
      ),
    },
    {
      key: 'jenis_kelamin',
      label: 'Jenis Kelamin',
      render: (item) => (
        <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {GENDER_LABEL[item.jenis_kelamin] || item.jenis_kelamin || '-'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'alamat',
      label: 'Alamat',
      render: (item) => (
        <span className="text-sm text-text-gray truncate max-w-[180px] block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.alamat || '-'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'masa_jabatan',
      label: 'Masa Jabatan',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Calendar size={12} />
          <span>
            {formatDate(item.masa_jabatan_mulai)} — {formatDate(item.masa_jabatan_selesai)}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: 'aksi',
      label: 'Aksi',
      className: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 rounded-lg text-text-gray hover:bg-[#F0F4F8] hover:text-[#28A71A] transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-1.5 rounded-lg text-text-gray hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Hapus"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <Users size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Data Pengurus Masjid
          </h2>
          <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kelola data pengurus kepengurusan masjid
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pengurus', value: pagination?.total || 0, color: 'bg-emerald-500' },
          { label: 'Per Halaman', value: perPage, color: 'bg-blue-500' },
          { label: 'Halaman Aktif', value: page, color: 'bg-purple-500' },
          { label: 'Total Halaman', value: pagination?.total_pages || 1, color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-[#F0F4F8]">
            <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
              <Users size={14} className="text-white" />
            </div>
            <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.label}</p>
            <p className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredPengurus}
        loading={listLoading}
        searchPlaceholder="Cari pengurus..."
        searchQuery={search}
        onSearch={handleSearch}
        filters={filters}
        onAdd={handleAdd}
        addLabel="Tambah Pengurus"
        page={page}
        totalPages={pagination?.total_pages || 1}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
        emptyMessage={search ? 'Tidak ada hasil pencarian' : 'Belum ada data pengurus'}
      />

      {/* Form Modal */}
      <FormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending || updateMutation.isPending}
        editItem={editItem}
      />
    </div>
  );
}
