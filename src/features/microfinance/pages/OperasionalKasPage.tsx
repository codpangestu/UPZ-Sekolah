import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Landmark, TrendingUp, TrendingDown, Wallet, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import {
  useMicrofinanceList,
  useCreateMicrofinance,
  useUpdateMicrofinance,
  useDeleteMicrofinance,
  useLabelInfoDanaKasOperasional,
  useLabelPenggunaanKasOperasional,
} from '../hooks/useMicrofinance';
import type { OperasionalKasPenerimaan, OperasionalKasPengeluaran, MasterDataItem } from '../types';

const formatRupiah = (v: string | number | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;
const formatTanggal = (v: string | null) => (v ? new Date(v + 'T00:00:00').toLocaleDateString('id-ID') : '-');

type Tab = 'penerimaan' | 'pengeluaran';

const emptyPenerimaan = {
  tanggal: '',
  nominal_masuk: '',
  jumlah_donatur: '',
  keterangan: '',
  id_bmm_label_info_dana_kas_operasional: '',
};

const emptyPengeluaran = {
  tanggal: '',
  nominal_keluar: '',
  jumlah_penerima_manfaat: '',
  keterangan: '',
  id_bmm_label_penggunaan_kas_operasional: '',
};

export default function OperasionalKasPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const [tab, setTab] = useState<Tab>('penerimaan');

  const { data: listMasuk, isLoading: loadingMasuk } = useMicrofinanceList<OperasionalKasPenerimaan>('operasional-kas-penerimaan', idMasjid);
  const { data: listKeluar, isLoading: loadingKeluar } = useMicrofinanceList<OperasionalKasPengeluaran>('operasional-kas-pengeluaran', idMasjid);
  const createMasuk = useCreateMicrofinance('operasional-kas-penerimaan', 'Penerimaan kas operasional berhasil dicatat');
  const updateMasuk = useUpdateMicrofinance('operasional-kas-penerimaan');
  const deleteMasuk = useDeleteMicrofinance('operasional-kas-penerimaan');
  const createKeluar = useCreateMicrofinance('operasional-kas-pengeluaran', 'Pengeluaran kas operasional berhasil dicatat');
  const updateKeluar = useUpdateMicrofinance('operasional-kas-pengeluaran');
  const deleteKeluar = useDeleteMicrofinance('operasional-kas-pengeluaran');

  const { data: labelInfoRes } = useLabelInfoDanaKasOperasional();
  const { data: labelPenggunaanRes } = useLabelPenggunaanKasOperasional();

  const labelInfoDana = labelInfoRes?.data || [];
  const labelPenggunaan = labelPenggunaanRes?.data || [];

  const dataMasuk = listMasuk?.data || [];
  const dataKeluar = listKeluar?.data || [];

  const totalMasuk = dataMasuk.reduce((acc, d) => acc + Number(d.nominal_masuk || 0), 0);
  const totalKeluar = dataKeluar.reduce((acc, d) => acc + Number(d.nominal_keluar || 0), 0);
  const saldo = totalMasuk - totalKeluar;

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<OperasionalKasPenerimaan | OperasionalKasPengeluaran | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyPenerimaan);

  const labelName = (id: number | null, list: MasterDataItem[], keyId: string, keyName: string) => {
    const found = list.find((l) => Number(l[keyId]) === Number(id));
    return found ? found[keyName] : '-';
  };

  const openCreate = () => {
    setEditItem(null);
    const base = { ...(tab === 'penerimaan' ? emptyPenerimaan : emptyPengeluaran) };
    setFormData({
      ...base,
      id_jalur_akses: idMasjid,
      jalur_akses: 'Masjid',
    });
    setShowForm(true);
  };

  const openEdit = (item: OperasionalKasPenerimaan | OperasionalKasPengeluaran) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (tab === 'penerimaan') {
      const payload = { ...formData, id_jalur_akses: idMasjid, jalur_akses: 'Masjid' };
      if (editItem) {
        await updateMasuk.mutateAsync({ id: (editItem as OperasionalKasPenerimaan).id_bmfi_bmm_operasional_kas_penerimaan, data: payload });
      } else {
        await createMasuk.mutateAsync(payload);
      }
    } else {
      const payload = { ...formData, id_jalur_akses: idMasjid, jalur_akses: 'Masjid' };
      if (editItem) {
        await updateKeluar.mutateAsync({ id: (editItem as OperasionalKasPengeluaran).id_bmfi_bmm_operasional_kas_pengeluaran, data: payload });
      } else {
        await createKeluar.mutateAsync(payload);
      }
    }
    setShowForm(false);
  };

  const handleDelete = async (item: OperasionalKasPenerimaan | OperasionalKasPengeluaran) => {
    const label =
      tab === 'penerimaan'
        ? `penerimaan ${(item as OperasionalKasPenerimaan).nominal_masuk || ''}`
        : `pengeluaran ${(item as OperasionalKasPengeluaran).nominal_keluar || ''}`;
    if (confirm(`Hapus catatan ${label}?`)) {
      if (tab === 'penerimaan') {
        await deleteMasuk.mutateAsync((item as OperasionalKasPenerimaan).id_bmfi_bmm_operasional_kas_penerimaan);
      } else {
        await deleteKeluar.mutateAsync((item as OperasionalKasPengeluaran).id_bmfi_bmm_operasional_kas_pengeluaran);
      }
    }
  };

  const columnsMasuk: Column<OperasionalKasPenerimaan>[] = [
    { key: 'tanggal', label: 'Tanggal', render: (d) => formatTanggal(d.tanggal) },
    {
      key: 'label', label: 'Sumber Dana',
      render: (d) => labelName(d.id_bmm_label_info_dana_kas_operasional, labelInfoDana, 'id_bmm_label_info_dana_kas_operasional', 'nama_bmm_label_info_dana_kas_operasional'),
    },
    { key: 'nominal_masuk', label: 'Nominal Masuk', render: (d) => formatRupiah(d.nominal_masuk) },
    { key: 'jumlah_donatur', label: 'Jml Donatur', render: (d) => d.jumlah_donatur || '-', hideOnMobile: true },
    { key: 'keterangan', label: 'Keterangan', render: (d) => d.keterangan || '-', hideOnMobile: true },
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

  const columnsKeluar: Column<OperasionalKasPengeluaran>[] = [
    { key: 'tanggal', label: 'Tanggal', render: (d) => formatTanggal(d.tanggal) },
    {
      key: 'label', label: 'Penggunaan',
      render: (d) => labelName(d.id_bmm_label_penggunaan_kas_operasional, labelPenggunaan, 'id_bmm_label_penggunaan_kas_operasional', 'nama_bmm_label_penggunaan_kas_operasional'),
    },
    { key: 'nominal_keluar', label: 'Nominal Keluar', render: (d) => formatRupiah(d.nominal_keluar) },
    { key: 'jumlah_penerima_manfaat', label: 'Jml Penerima', render: (d) => d.jumlah_penerima_manfaat || '-', hideOnMobile: true },
    { key: 'keterangan', label: 'Keterangan', render: (d) => d.keterangan || '-', hideOnMobile: true },
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
          <Landmark size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Operasional Kas Penerimaan & Pengeluaran
          </h1>
          <p className="text-sm text-[#555]">Kas operasional terpisah dari dana bergulir program BMM</p>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <TrendingUp size={14} className="text-[#28A71A]" /> Total Penerimaan
          </div>
          <p className="text-xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {loadingMasuk ? '...' : formatRupiah(totalMasuk)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <TrendingDown size={14} className="text-[#EF4444]" /> Total Pengeluaran
          </div>
          <p className="text-xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {loadingKeluar ? '...' : formatRupiah(totalKeluar)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <Wallet size={14} className="text-[#28A71A]" /> Saldo Kas Operasional
          </div>
          <p className="text-xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {loadingMasuk || loadingKeluar ? '...' : formatRupiah(saldo)}
          </p>
        </div>
      </div>

      {/* Tab */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setTab('penerimaan'); setShowForm(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'penerimaan' ? 'bg-[#28A71A] text-white' : 'bg-white border border-[rgba(0,0,0,0.1)] text-[#555] hover:border-[#28A71A]'}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Penerimaan
        </button>
        <button
          onClick={() => { setTab('pengeluaran'); setShowForm(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pengeluaran' ? 'bg-[#28A71A] text-white' : 'bg-white border border-[rgba(0,0,0,0.1)] text-[#555] hover:border-[#28A71A]'}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Pengeluaran
        </button>
      </div>

      {tab === 'penerimaan' ? (
        <DataTable
          data={dataMasuk}
          columns={columnsMasuk}
          loading={loadingMasuk}
          onAdd={openCreate}
          addLabel="Tambah"
          emptyMessage="Belum ada catatan penerimaan kas operasional"
        />
      ) : (
        <DataTable
          data={dataKeluar}
          columns={columnsKeluar}
          loading={loadingKeluar}
          onAdd={openCreate}
          addLabel="Tambah"
          emptyMessage="Belum ada catatan pengeluaran kas operasional"
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">
              {editItem ? 'Edit' : 'Tambah'} {tab === 'penerimaan' ? 'Penerimaan' : 'Pengeluaran'} Kas Operasional
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal || ''}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">
                  {tab === 'penerimaan' ? 'Sumber Dana' : 'Penggunaan Dana'}
                </label>
                <select
                  value={formData[tab === 'penerimaan' ? 'id_bmm_label_info_dana_kas_operasional' : 'id_bmm_label_penggunaan_kas_operasional'] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [tab === 'penerimaan' ? 'id_bmm_label_info_dana_kas_operasional' : 'id_bmm_label_penggunaan_kas_operasional']: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                >
                  <option value="">Pilih label...</option>
                  {(tab === 'penerimaan' ? labelInfoDana : labelPenggunaan).map((l) => (
                    <option
                      key={l.id_bmm_label_info_dana_kas_operasional ?? l.id_bmm_label_penggunaan_kas_operasional}
                      value={l.id_bmm_label_info_dana_kas_operasional ?? l.id_bmm_label_penggunaan_kas_operasional}
                    >
                      {l.nama_bmm_label_info_dana_kas_operasional ?? l.nama_bmm_label_penggunaan_kas_operasional}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">
                    {tab === 'penerimaan' ? 'Nominal Masuk' : 'Nominal Keluar'}
                  </label>
                  <input
                    type="number"
                    value={formData[tab === 'penerimaan' ? 'nominal_masuk' : 'nominal_keluar'] || ''}
                    onChange={(e) => setFormData({ ...formData, [tab === 'penerimaan' ? 'nominal_masuk' : 'nominal_keluar']: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">
                    {tab === 'penerimaan' ? 'Jumlah Donatur' : 'Jumlah Penerima Manfaat'}
                  </label>
                  <input
                    type="number"
                    value={formData[tab === 'penerimaan' ? 'jumlah_donatur' : 'jumlah_penerima_manfaat'] || ''}
                    onChange={(e) => setFormData({ ...formData, [tab === 'penerimaan' ? 'jumlah_donatur' : 'jumlah_penerima_manfaat']: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan</label>
                <textarea
                  value={formData.keterangan || ''}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-xl text-sm text-[#303030] hover:bg-[#F0F4F8]">Batal</button>
              <button onClick={handleSubmit} className="btn-primary-green rounded-xl">
                <Plus size={16} />{editItem ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}