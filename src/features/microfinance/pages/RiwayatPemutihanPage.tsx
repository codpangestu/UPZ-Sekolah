import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, History, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import {
  useMicrofinanceList,
  useCreateMicrofinance,
  useUpdateMicrofinance,
  useDeleteMicrofinance,
  useKategoriPemutihan,
} from '../hooks/useMicrofinance';
import type { PemutihanPenghapusbukuan } from '../types';

const formatRupiah = (v: number | string | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;
const formatTanggal = (v: string | null) => (v ? new Date(v + 'T00:00:00').toLocaleDateString('id-ID') : '-');

const STATUS_OPTIONS = ['Belum Selesai', 'Sudah Selesai'];

const emptyForm = {
  tgl_bmfi_pemutihan_penghapusbukuan: '',
  judul: '',
  jumlah_nominal_pemutihan_penghapusbukuan: '',
  id_bmfi_kategori_pemutihan_penghapusbukuan: '',
  status_bmfi_pemutihan_penghapusbukuan: '',
  peserta_program_bmfi_pemutihan_penghapusbukuan: '',
  pendamping_bmfi_pemutihan_penghapusbukuan: '',
  keterangan: '',
};

export default function RiwayatPemutihanPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<PemutihanPenghapusbukuan>('pemutihan', idMasjid);
  const createMutation = useCreateMicrofinance('pemutihan', 'Riwayat pemutihan berhasil dicatat');
  const updateMutation = useUpdateMicrofinance('pemutihan');
  const deleteMutation = useDeleteMicrofinance('pemutihan');
  const { data: kategoriRes } = useKategoriPemutihan();

  const kategoriList = kategoriRes?.data || [];
  const data = listRes?.data || [];

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PemutihanPenghapusbukuan | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyForm);

  const kategoriName = (id: number | null) => {
    const found = kategoriList.find((k) => Number(k.id_bmfi_kategori_pemutihan_penghapusbukuan) === Number(id));
    return found ? found.nama_bmfi_kategori_pemutihan_penghapusbukuan : '-';
  };

  const openCreate = () => {
    setEditItem(null);
    setFormData({ ...emptyForm, id_masjid: idMasjid, id_user: user?.id_user });
    setShowForm(true);
  };

  const openEdit = (item: PemutihanPenghapusbukuan) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) {
      await updateMutation.mutateAsync({ id: editItem.id_bmfi_pemutihan_penghapusbukuan, data: formData });
    } else {
      await createMutation.mutateAsync({ ...formData, id_masjid: idMasjid, id_user: user?.id_user });
    }
    setShowForm(false);
  };

  const handleDelete = async (item: PemutihanPenghapusbukuan) => {
    if (confirm(`Hapus riwayat pemutihan "${item.judul || 'tanpa judul'}"?`)) {
      await deleteMutation.mutateAsync(item.id_bmfi_pemutihan_penghapusbukuan);
    }
  };

  const columns: Column<PemutihanPenghapusbukuan>[] = [
    { key: 'tgl', label: 'Tanggal', render: (d) => formatTanggal(d.tgl_bmfi_pemutihan_penghapusbukuan) },
    { key: 'judul', label: 'Judul', render: (d) => d.judul || '-' },
    { key: 'nominal', label: 'Nominal', render: (d) => formatRupiah(d.jumlah_nominal_pemutihan_penghapusbukuan) },
    { key: 'kategori', label: 'Kategori', render: (d) => kategoriName(d.id_bmfi_kategori_pemutihan_penghapusbukuan) },
    {
      key: 'status', label: 'Status',
      render: (d) => (
        <span className={`badge-xs ${d.status_bmfi_pemutihan_penghapusbukuan === 'Sudah Selesai' ? 'bg-[#E6F9F0] text-[#006844]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
          {d.status_bmfi_pemutihan_penghapusbukuan || '-'}
        </span>
      ),
    },
    { key: 'peserta', label: 'Peserta', render: (d) => d.peserta_program_bmfi_pemutihan_penghapusbukuan || '-', hideOnMobile: true },
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
          <History size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Riwayat Pemutihan / Penghapusbukuan
          </h1>
          <p className="text-sm text-[#555]">Riwayat penghapusan piutang macet program BMM</p>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={isLoading}
        onAdd={openCreate}
        addLabel="Tambah"
        emptyMessage="Belum ada riwayat pemutihan / penghapusbukuan"
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">
              {editItem ? 'Edit' : 'Tambah'} Riwayat Pemutihan
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tgl_bmfi_pemutihan_penghapusbukuan || ''}
                    onChange={(e) => setFormData({ ...formData, tgl_bmfi_pemutihan_penghapusbukuan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Nominal Pemutihan</label>
                  <input
                    type="number"
                    value={formData.jumlah_nominal_pemutihan_penghapusbukuan || ''}
                    onChange={(e) => setFormData({ ...formData, jumlah_nominal_pemutihan_penghapusbukuan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Judul</label>
                <input
                  value={formData.judul || ''}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Kategori</label>
                  <select
                    value={formData.id_bmfi_kategori_pemutihan_penghapusbukuan || ''}
                    onChange={(e) => setFormData({ ...formData, id_bmfi_kategori_pemutihan_penghapusbukuan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  >
                    <option value="">Pilih kategori...</option>
                    {kategoriList.map((k) => (
                      <option key={k.id_bmfi_kategori_pemutihan_penghapusbukuan} value={k.id_bmfi_kategori_pemutihan_penghapusbukuan}>
                        {k.nama_bmfi_kategori_pemutihan_penghapusbukuan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Status</label>
                  <select
                    value={formData.status_bmfi_pemutihan_penghapusbukuan || ''}
                    onChange={(e) => setFormData({ ...formData, status_bmfi_pemutihan_penghapusbukuan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  >
                    <option value="">Pilih status...</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Peserta Program</label>
                  <input
                    value={formData.peserta_program_bmfi_pemutihan_penghapusbukuan || ''}
                    onChange={(e) => setFormData({ ...formData, peserta_program_bmfi_pemutihan_penghapusbukuan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Pendamping</label>
                  <input
                    value={formData.pendamping_bmfi_pemutihan_penghapusbukuan || ''}
                    onChange={(e) => setFormData({ ...formData, pendamping_bmfi_pemutihan_penghapusbukuan: e.target.value })}
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