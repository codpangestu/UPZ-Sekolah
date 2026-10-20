import { useState, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Pencil, Trash2, Printer } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import FormModal from '../components/FormModal';
import {
  useBukuKasPenerimaanList,
  useCommandCenter,
  useMasterData,
  useCreateBukuKasPenerimaan,
  useUpdateBukuKasPenerimaan,
  useDeleteBukuKasPenerimaan,
} from '../hooks/useBukuKasPenerimaan';
import type { TableFilter } from '../../buku-kas/components/DataTable';
import type { BukuKasPenerimaan } from '../types';
import { generateKuitansiPDF } from '../components/KuitansiPDF';
import { useAuthStore } from '../../../store/authStore';

function formatCurrency(val: number | undefined | null): string {
  if (val == null) return 'Rp 0';
  return `Rp ${val.toLocaleString('id-ID')}`;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BukuKasPenerimaanPage() {
  const [search, setSearch] = useState('');
  const [jenisDanaFilter, setJenisDanaFilter] = useState('');
  const [labelInfoDanaFilter, setLabelInfoDanaFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BukuKasPenerimaan | null>(null);
  const { user } = useAuthStore();

  const { data: listData, isLoading: listLoading } = useBukuKasPenerimaanList({
    page,
    per_page: perPage,
    search: search || undefined,
    id_jenis_dana: jenisDanaFilter ? Number(jenisDanaFilter) : undefined,
    id_label_info_dana: labelInfoDanaFilter ? Number(labelInfoDanaFilter) : undefined,
    start_date: startDateFilter || undefined,
    end_date: endDateFilter || undefined,
  });

  const { data: masterData } = useMasterData();
  const { data: ccData } = useCommandCenter();
  const createMutation = useCreateBukuKasPenerimaan();
  const updateMutation = useUpdateBukuKasPenerimaan();
  const deleteMutation = useDeleteBukuKasPenerimaan();

  const transactions = listData?.data || [];
  const pagination = listData?.pagination;
  const cc = ccData?.data;

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const filters: TableFilter[] = [
    {
      key: 'jenis_dana',
      label: 'Jenis Dana',
      placeholder: 'Semua Jenis Dana',
      options: (masterData?.jenisDana || []).map((d) => ({ value: String(d.id), label: d.nama })),
      value: jenisDanaFilter,
      onChange: (v) => {
        setJenisDanaFilter(v);
        setPage(1);
      },
    },
    {
      key: 'label_info_dana',
      label: 'Label Info Dana',
      placeholder: 'Semua Label Info Dana',
      options: (masterData?.labelInfoDana || []).map((d) => ({ value: String(d.id), label: d.nama })),
      value: labelInfoDanaFilter,
      onChange: (v) => {
        setLabelInfoDanaFilter(v);
        setPage(1);
      },
    },
  ];

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: BukuKasPenerimaan) => {
    setEditItem(item);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (item: BukuKasPenerimaan) => {
      if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        if (item.id) deleteMutation.mutate(item.id);
      }
    },
    [deleteMutation]
  );

  const handleCetak = useCallback(
    (item: BukuKasPenerimaan) => {
      generateKuitansiPDF({
        type: 'penerimaan',
        tanggal: item.tanggal,
        nominal: item.nominal,
        detail1Label: 'Jumlah Donatur',
        detail1Value: String(item.jumlah_donatur ?? '-'),
        keterangan: item.keterangan || '',
        nama_jenis_dana: item.nama_jenis_dana,
        nama_jenis_harta: item.nama_jenis_harta,
        nama_label_info_dana: item.nama_label_info_dana,
        namaMasjid: user?.nama_masjid,
        kodeMasjid: user?.id_jalur_akses,
        id: item.id,
      });
    },
    [user]
  );

  const handleSubmit = useCallback(
    async (formData: { tanggal: string; id_jenis_dana: string; id_jenis_harta: string; id_label_info_dana: string; nominal: string; jumlah_donatur: string; keterangan?: string }) => {
      const payload = {
        tanggal: formData.tanggal,
        id_jenis_dana: Number(formData.id_jenis_dana),
        id_jenis_harta: Number(formData.id_jenis_harta),
        id_label_info_dana: Number(formData.id_label_info_dana),
        nominal: Number(formData.nominal),
        jumlah_donatur: Number(formData.jumlah_donatur),
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

  const columns: Column<BukuKasPenerimaan>[] = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (item) => (
        <span className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {formatDate(item.tanggal)}
        </span>
      ),
    },
    {
      key: 'nama_jenis_dana',
      label: 'Jenis Dana',
      render: (item) => (
        <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.nama_jenis_dana || '-'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'nominal',
      label: 'Nominal',
      render: (item) => (
        <span className="text-sm font-semibold text-emerald-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {formatCurrency(item.nominal)}
        </span>
      ),
    },
    {
      key: 'jumlah_donatur',
      label: 'Donatur',
      render: (item) => (
        <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.jumlah_donatur ?? '-'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (item) => (
        <span className="text-sm text-text-gray truncate max-w-[200px] block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.keterangan || '-'}
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
            onClick={() => handleCetak(item)}
            className="p-1.5 rounded-lg text-text-gray hover:bg-[#EAF6E8] hover:text-[#28A71A] transition-colors"
            title="Cetak Kuitansi"
          >
            <Printer size={15} />
          </button>
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
          <Wallet size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Buku Kas Penerimaan
          </h2>
          <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kelola pencatatan penerimaan ZIS DSKL
          </p>
        </div>
      </div>

      {/* Command Center / Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Penerimaan</p>
            <TrendingUp size={18} className="text-white/70" />
          </div>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(cc?.total_nominal_masuk)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Pengeluaran</p>
            <TrendingDown size={18} className="text-white/70" />
          </div>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(cc?.total_nominal_keluar)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#28A71A] to-[#1C7712] rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Saldo Akhir</p>
            <DollarSign size={18} className="text-white/70" />
          </div>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatCurrency(cc?.saldo)}
          </p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={transactions}
        loading={listLoading}
        searchPlaceholder="Cari berdasarkan keterangan..."
        searchQuery={search}
        onSearch={handleSearch}
        filters={filters}
        dateRange={{
          startValue: startDateFilter,
          endValue: endDateFilter,
          onStartChange: (v) => {
            setStartDateFilter(v);
            setPage(1);
          },
          onEndChange: (v) => {
            setEndDateFilter(v);
            setPage(1);
          },
        }}
        onAdd={handleAdd}
        addLabel="Tambah Penerimaan"
        page={page}
        totalPages={pagination?.total_pages || 1}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
        emptyMessage={search ? 'Tidak ada hasil pencarian' : 'Belum ada transaksi penerimaan'}
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
