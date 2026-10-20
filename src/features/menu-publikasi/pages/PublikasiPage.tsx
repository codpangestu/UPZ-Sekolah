import { useState, useCallback } from 'react';
import { Megaphone, Pencil, Trash2, FileText, BookOpen, Video, Image, Calendar, Heart, Gift, MapPin, Clock, User } from 'lucide-react';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column, TableFilter } from '../../buku-kas/components/DataTable';
import FormModal from '../components/FormModal';
import { usePublikasiList, useCreatePublikasi, useUpdatePublikasi, useDeletePublikasi } from '../hooks/usePublikasi';
import { PUBLIKASI_LABELS, STATUS_AKTIF_OPTIONS } from '../types';
import type { JenisPublikasi, PublikasiItem } from '../types';

const TAB_CONFIG: { id: JenisPublikasi; label: string; icon: typeof FileText }[] = [
  { id: 'postingan', label: 'Postingan', icon: FileText },
  { id: 'materi-khutbah', label: 'Khutbah', icon: BookOpen },
  { id: 'media-info', label: 'Media Info', icon: Image },
  { id: 'jadwal-kajian', label: 'Jadwal Kajian', icon: Calendar },
  { id: 'video-kajian', label: 'Video Kajian', icon: Video },
  { id: 'cerita', label: 'Cerita', icon: Heart },
  { id: 'donasi', label: 'Donasi', icon: Gift },
  { id: 'acara', label: 'Acara', icon: MapPin },
];

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PublikasiPage() {
  const [jenis, setJenis] = useState<JenisPublikasi>('postingan');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PublikasiItem | null>(null);

  const { data: listData, isLoading: listLoading } = usePublikasiList(jenis, {
    page, per_page: perPage, search: search || undefined,
  });

  const createMutation = useCreatePublikasi(jenis);
  const updateMutation = useUpdatePublikasi(jenis);
  const deleteMutation = useDeletePublikasi(jenis);

  const items = listData?.data || [];
  const pagination = listData?.pagination;

  const handleSearch = useCallback((q: string) => { setSearch(q); setPage(1); }, []);
  const handleAdd = useCallback(() => { setEditItem(null); setModalOpen(true); }, []);
  const handleEdit = useCallback((item: PublikasiItem) => { setEditItem(item); setModalOpen(true); }, []);

  // Filter client-side atas data halaman aktif (list dipaginasi server-side)
  const filteredItems = items.filter(
    (item) => !statusFilter || String(item.status_aktif ?? 1) === statusFilter
  );

  const filters: TableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      placeholder: 'Semua Status',
      options: STATUS_AKTIF_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v);
        setPage(1);
      },
    },
  ];

  const handleDelete = useCallback(
    (item: PublikasiItem) => {
      if (confirm(`Hapus ${PUBLIKASI_LABELS[jenis]} ini?`)) {
        if (item.id) deleteMutation.mutate(item.id);
      }
    },
    [deleteMutation, jenis]
  );

  const handleSubmit = useCallback(
    async (formData: any) => {
      const payload: Partial<PublikasiItem> = {
        judul: formData.judul,
        keterangan: formData.keterangan || '',
        status_aktif: Number(formData.status_aktif),
        jenis,
      };

      // Type-specific fields
      if (['postingan', 'materi-khutbah', 'cerita'].includes(jenis)) {
        payload.konten = formData.konten;
      }
      if (['postingan', 'cerita'].includes(jenis)) {
        payload.gambar = formData.gambar || undefined;
      }
      if (jenis === 'postingan') payload.kategori = formData.kategori;
      if (jenis === 'materi-khutbah') {
        payload.pemateri = formData.pemateri;
        payload.tanggal = formData.tanggal;
      }
      if (jenis === 'media-info') {
        payload.url = formData.url;
        payload.tipe_media = formData.tipe_media;
      }
      if (jenis === 'jadwal-kajian') {
        payload.hari = formData.hari;
        payload.jam = formData.jam;
        payload.pemateri = formData.pemateri;
        payload.lokasi = formData.lokasi;
      }
      if (jenis === 'video-kajian') {
        payload.video_url = formData.video_url;
        payload.pemateri = formData.pemateri;
      }
      if (jenis === 'cerita') payload.penulis = formData.penulis;
      if (jenis === 'donasi') {
        payload.target_dana = Number(formData.target_dana);
        payload.tanggal_berakhir = formData.tanggal_berakhir;
      }
      if (jenis === 'acara') {
        payload.tanggal_mulai = formData.tanggal_mulai;
        payload.tanggal_selesai = formData.tanggal_selesai;
        payload.lokasi = formData.lokasi;
      }

      try {
        if (editItem?.id) {
          await updateMutation.mutateAsync({ id: editItem.id, data: payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        setModalOpen(false);
      } catch { /* handled by mutation */ }
    },
    [editItem, createMutation, updateMutation, jenis]
  );

  const handleTabChange = (newJenis: JenisPublikasi) => {
    setJenis(newJenis);
    setSearch(''); setPage(1); setEditItem(null); setModalOpen(false);
  };

  // Dynamic columns based on jenis
  const dynamicColumns = (): Column<PublikasiItem>[] => {
    switch (jenis) {
      case 'postingan':
        return [{ key: 'kategori', label: 'Kategori', render: (item) => (
          <span className="text-xs font-medium bg-[#EAF6E8] text-[#28A71A] px-2 py-0.5 rounded-full">{item.kategori || '-'}</span>
        )}];
      case 'materi-khutbah':
        return [
          { key: 'pemateri', label: 'Pemateri', render: (item) => <span className="text-sm text-text-gray">{item.pemateri || '-'}</span>, hideOnMobile: true },
          { key: 'tanggal', label: 'Tanggal', render: (item) => <span className="text-sm text-text-gray">{formatDate(item.tanggal)}</span>, hideOnMobile: true },
        ];
      case 'media-info':
        return [
          { key: 'tipe_media', label: 'Tipe', render: (item) => (
            <span className="badge-xs">{item.tipe_media || '-'}</span>
          )},
          { key: 'url', label: 'URL', render: (item) => (
            <span className="text-sm text-text-gray truncate max-w-[200px] block">{item.url || '-'}</span>
          ), hideOnMobile: true },
        ];
      case 'jadwal-kajian':
        return [
          { key: 'hari', label: 'Hari', render: (item) => <span className="text-sm font-medium">{item.hari || '-'}</span> },
          { key: 'jam', label: 'Jam', render: (item) => <span className="text-sm text-text-gray flex items-center gap-1"><Clock size={12} />{item.jam || '-'}</span>, hideOnMobile: true },
          { key: 'pemateri', label: 'Pemateri', render: (item) => <span className="text-sm text-text-gray">{item.pemateri || '-'}</span>, hideOnMobile: true },
          { key: 'lokasi', label: 'Lokasi', render: (item) => <span className="text-sm text-text-gray">{item.lokasi || '-'}</span>, hideOnMobile: true },
        ];
      case 'video-kajian':
        return [
          { key: 'pemateri', label: 'Pemateri', render: (item) => (
            <span className="text-sm text-text-gray flex items-center gap-1"><User size={12} />{item.pemateri || '-'}</span>
          )},
          { key: 'video_url', label: 'Video', render: (item) => (
            <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#28A71A] hover:underline truncate max-w-[200px] block">{item.video_url ? '🔗 Tonton' : '-'}</a>
          ), hideOnMobile: true },
        ];
      case 'cerita':
        return [
          { key: 'penulis', label: 'Penulis', render: (item) => <span className="text-sm text-text-gray">{item.penulis || '-'}</span>, hideOnMobile: true },
        ];
      case 'donasi':
        return [
          { key: 'target_dana', label: 'Target', render: (item) => (
            <span className="text-sm font-semibold text-emerald-600">Rp {(item.target_dana || 0).toLocaleString('id-ID')}</span>
          )},
          { key: 'dana_terkumpul', label: 'Terkumpul', render: (item) => (
            <span className="text-sm text-text-gray">Rp {(item.dana_terkumpul || 0).toLocaleString('id-ID')}</span>
          ), hideOnMobile: true },
          { key: 'tanggal_berakhir', label: 'Berakhir', render: (item) => (
            <span className="text-sm text-text-gray">{formatDate(item.tanggal_berakhir)}</span>
          ), hideOnMobile: true },
        ];
      case 'acara':
        return [
          { key: 'lokasi', label: 'Lokasi', render: (item) => (
            <span className="text-sm text-text-gray flex items-center gap-1"><MapPin size={12} />{item.lokasi || '-'}</span>
          )},
          { key: 'tanggal_mulai', label: 'Mulai', render: (item) => <span className="text-sm text-text-gray">{formatDate(item.tanggal_mulai)}</span>, hideOnMobile: true },
          { key: 'tanggal_selesai', label: 'Selesai', render: (item) => <span className="text-sm text-text-gray">{formatDate(item.tanggal_selesai)}</span>, hideOnMobile: true },
        ];
      default: return [];
    }
  };

  const columns: Column<PublikasiItem>[] = [
    {
      key: 'judul', label: 'Judul',
      render: (item) => (
        <div>
          <span className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.judul}</span>
          {item.keterangan && <span className="text-xs text-text-gray block truncate max-w-[250px]">{item.keterangan}</span>}
        </div>
      ),
    },
    ...dynamicColumns(),
    {
      key: 'status_aktif', label: 'Status',
      render: (item) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status_aktif ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-text-gray'}`}>
          {item.status_aktif ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'created_at', label: 'Dibuat',
      render: (item) => <span className="text-sm text-text-gray">{formatDate(item.created_at)}</span>,
      hideOnMobile: true,
    },
    {
      key: 'aksi', label: 'Aksi', className: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg text-text-gray hover:bg-[#F0F4F8] hover:text-[#28A71A] transition-colors" title="Edit"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg text-text-gray hover:bg-red-50 hover:text-red-500 transition-colors" title="Hapus"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <Megaphone size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Menu Publikasi
          </h2>
          <p className="text-sm text-text-gray">Kelola konten publikasi masjid</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto border-b border-[#F0F4F8] pb-0">
        {TAB_CONFIG.map((tab) => {
          const isActive = jenis === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all flex-shrink-0 ${
                isActive ? 'text-[#28A71A] border-[#28A71A]' : 'text-text-gray border-transparent hover:text-[#303030] hover:border-[#D4D4D4]'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredItems}
        loading={listLoading}
        searchPlaceholder={`Cari ${PUBLIKASI_LABELS[jenis]}...`}
        searchQuery={search}
        onSearch={handleSearch}
        filters={filters}
        onAdd={handleAdd}
        addLabel={`Tambah ${PUBLIKASI_LABELS[jenis]}`}
        page={page}
        totalPages={pagination?.total_pages || 1}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={(val) => { setPerPage(val); setPage(1); }}
        emptyMessage={search ? 'Tidak ada hasil pencarian' : `Belum ada ${PUBLIKASI_LABELS[jenis]}`}
      />

      {/* Form Modal */}
      <FormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending || updateMutation.isPending}
        editItem={editItem}
        jenis={jenis}
      />
    </div>
  );
}
