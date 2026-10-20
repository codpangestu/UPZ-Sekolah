import { useState, useCallback } from 'react';
import { Users, Pencil, Trash2, GraduationCap, Wrench, Heart } from 'lucide-react';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column, TableFilter } from '../../buku-kas/components/DataTable';
import FormModal from '../components/FormModal';
import { useDataAnggotaList, useCreateAnggota, useUpdateAnggota, useDeleteAnggota } from '../hooks/useDataAnggota';
import { ANGGOTA_LABELS, JENIS_KELAMIN_OPTIONS } from '../types';
import type { JenisAnggota, Anggota, AnggotaListItem } from '../types';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const GENDER_LABEL: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' };

export default function DataAnggotaPage() {
  const [jenis, setJenis] = useState<JenisAnggota>('ustadz');
  const [search, setSearch] = useState('');
  const [jkFilter, setJkFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Anggota | null>(null);

  const { data: listData, isLoading: listLoading } = useDataAnggotaList(jenis, {
    page,
    per_page: perPage,
    search: search || undefined,
  });

  const createMutation = useCreateAnggota(jenis);
  const updateMutation = useUpdateAnggota(jenis);
  const deleteMutation = useDeleteAnggota(jenis);

  const anggotaList = listData?.data || [];
  const pagination = listData?.pagination;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  // Filter client-side atas data halaman aktif (list dipaginasi server-side)
  const filteredAnggota = anggotaList.filter(
    (a) => !jkFilter || a.jenis_kelamin === jkFilter
  );

  const filters: TableFilter[] = [
    {
      key: 'jenis_kelamin',
      label: 'Jenis Kelamin',
      placeholder: 'Semua Jenis Kelamin',
      options: JENIS_KELAMIN_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      value: jkFilter,
      onChange: (v) => {
        setJkFilter(v);
        setPage(1);
      },
    },
  ];

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: AnggotaListItem) => {
    setEditItem(item as Anggota);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (item: AnggotaListItem) => {
      if (confirm(`Apakah Anda yakin ingin menghapus ${ANGGOTA_LABELS[jenis]} ini?`)) {
        if (item.id) deleteMutation.mutate(item.id);
      }
    },
    [deleteMutation, jenis]
  );

  const handleSubmit = useCallback(
    async (formData: any) => {
      const payload: Partial<Anggota> = {
        nama: formData.nama,
        nohp: formData.nohp,
        alamat: formData.alamat,
        jenis_kelamin: formData.jenis_kelamin,
        jenis_anggota: jenis,
        keterangan: formData.keterangan || '',
      };

      if (jenis === 'ustadz') payload.bidang_keahlian = formData.bidang_keahlian;
      if (jenis === 'marbot') payload.tugas = formData.tugas;
      if (jenis === 'jamaah') payload.status_keaktifan = formData.status_keaktifan;

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
    [editItem, createMutation, updateMutation, jenis]
  );

  const handleTabChange = (newJenis: JenisAnggota) => {
    setJenis(newJenis);
    setSearch('');
    setPage(1);
    setEditItem(null);
    setModalOpen(false);
  };

  const specificColumn = (): Column<AnggotaListItem>[] => {
    if (jenis === 'ustadz') {
      return [{
        key: 'bidang_keahlian',
        label: 'Bidang Keahlian',
        render: (item) => (
          <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {item.bidang_keahlian || '-'}
          </span>
        ),
        hideOnMobile: true,
      }];
    }
    if (jenis === 'marbot') {
      return [{
        key: 'tugas',
        label: 'Tugas',
        render: (item) => (
          <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {item.tugas || '-'}
          </span>
        ),
        hideOnMobile: true,
      }];
    }
    // jamaah
    return [{
      key: 'status_keaktifan',
      label: 'Status',
      render: (item) => {
        const colors: Record<string, string> = {
          'Aktif': 'text-emerald-600 bg-emerald-50',
          'Kurang Aktif': 'text-amber-600 bg-amber-50',
          'Tidak Aktif': 'text-red-600 bg-red-50',
          'Pindah': 'text-blue-600 bg-blue-50',
        };
        const cls = colors[item.status_keaktifan || ''] || 'text-text-gray bg-gray-50';
        return (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {item.status_keaktifan || '-'}
          </span>
        );
      },
      hideOnMobile: true,
    }];
  };

  const columns: Column<AnggotaListItem>[] = [
    {
      key: 'nama',
      label: 'Nama',
      render: (item) => (
        <span className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.nama}
        </span>
      ),
    },
    {
      key: 'nohp',
      label: 'No. HP',
      render: (item) => (
        <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.nohp || '-'}
        </span>
      ),
      hideOnMobile: true,
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
    ...specificColumn(),
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
      key: 'created_at',
      label: 'Tgl Daftar',
      render: (item) => (
        <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {formatDate(item.created_at)}
        </span>
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

  const tabs: { id: JenisAnggota; label: string; icon: typeof GraduationCap }[] = [
    { id: 'ustadz', label: 'Ustadz', icon: GraduationCap },
    { id: 'marbot', label: 'Marbot', icon: Wrench },
    { id: 'jamaah', label: 'Jamaah', icon: Heart },
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
            Data Anggota
          </h2>
          <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kelola data Ustadz, Marbot, dan Jamaah masjid
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#F0F4F8]">
        {tabs.map((tab) => {
          const isActive = jenis === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                isActive
                  ? 'text-[#28A71A] border-[#28A71A]'
                  : 'text-text-gray border-transparent hover:text-[#303030] hover:border-[#D4D4D4]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <tab.icon size={16} />
              {tab.label}
              {isActive && (
                <span className="text-[10px] bg-[#28A71A]/10 text-[#28A71A] px-2 py-0.5 rounded-full font-medium">
                  {pagination?.total || anggotaList.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredAnggota}
        loading={listLoading}
        searchPlaceholder={`Cari ${ANGGOTA_LABELS[jenis]}...`}
        searchQuery={search}
        onSearch={handleSearch}
        filters={filters}
        onAdd={handleAdd}
        addLabel={`Tambah ${ANGGOTA_LABELS[jenis]}`}
        page={page}
        totalPages={pagination?.total_pages || 1}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
        emptyMessage={search ? 'Tidak ada hasil pencarian' : `Belum ada data ${ANGGOTA_LABELS[jenis]}`}
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
        jenis={jenis}
      />
    </div>
  );
}
