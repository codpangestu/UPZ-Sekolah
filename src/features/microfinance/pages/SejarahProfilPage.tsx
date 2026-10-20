import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import { useMicrofinanceList, useKategoriPengesahan, useCreateMicrofinance, useUpdateMicrofinance, useDeleteMicrofinance } from '../hooks/useMicrofinance';
import type { SejarahProfilMicrofinance } from '../types';

const emptyForm = {
  judul: '',
  tahun_pengesahan: '',
  tgl_bmfi_sejarah_dan_profil_microfinance: '',
  jumlah_peserta_awal_pengesahan: '',
  nominal_saldo_awal_pengesahan: '',
  nomor_kerangka_acuan_kerja: '',
  id_bmfi_kategori_pengesahan_microfinance: '',
  status_aktif: 1,
  keterangan: '',
};

export default function SejarahProfilPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<SejarahProfilMicrofinance>('sejarah-profil', idMasjid);
  const { data: kategoriRes } = useKategoriPengesahan();
  const createMutation = useCreateMicrofinance('sejarah-profil');
  const updateMutation = useUpdateMicrofinance('sejarah-profil');
  const deleteMutation = useDeleteMicrofinance('sejarah-profil');

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<SejarahProfilMicrofinance | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyForm);

  const data = listRes?.data || [];
  const kategoriOptions = kategoriRes?.data || [];

  const openCreate = () => {
    setEditItem(null);
    setFormData({ ...emptyForm, id_masjid: idMasjid });
    setShowForm(true);
  };

  const openEdit = (item: SejarahProfilMicrofinance) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) {
      await updateMutation.mutateAsync({ id: editItem.id_bmfi_sejarah_dan_profil_microfinance, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setShowForm(false);
  };

  const handleDelete = async (item: SejarahProfilMicrofinance) => {
    if (confirm(`Hapus profil "${item.judul}"?`)) {
      await deleteMutation.mutateAsync(item.id_bmfi_sejarah_dan_profil_microfinance);
    }
  };

  const columns: Column<SejarahProfilMicrofinance>[] = [
    { key: 'judul', label: 'Judul', render: (d) => d.judul || '-' },
    { key: 'tahun_pengesahan', label: 'Tahun Pengesahan', render: (d) => d.tahun_pengesahan || '-' },
    { key: 'jumlah_peserta_awal_pengesahan', label: 'Peserta Awal', render: (d) => d.jumlah_peserta_awal_pengesahan || '-', hideOnMobile: true },
    {
      key: 'status_aktif', label: 'Status',
      render: (d) => (
        <span className={`badge-xs ${d.status_aktif ? 'bg-[#E6F9F0] text-[#006844]' : 'bg-[#F0F4F8] text-[#555]'}`}>
          {d.status_aktif ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
    },
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
          <FileText size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sejarah dan Profil Microfinance</h1>
          <p className="text-sm text-[#555]">Pengesahan program BMM untuk masjid ini</p>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={isLoading}
        onAdd={openCreate}
        addLabel="Tambah"
        emptyMessage="Belum ada data sejarah dan profil microfinance"
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">{editItem ? 'Edit' : 'Tambah'} Sejarah dan Profil Microfinance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Kategori Pengesahan Microfinance</label>
                <select
                  value={formData.id_bmfi_kategori_pengesahan_microfinance || ''}
                  onChange={(e) => setFormData({ ...formData, id_bmfi_kategori_pengesahan_microfinance: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                >
                  <option value="">Pilih</option>
                  {kategoriOptions.map((k: any) => (
                    <option key={k.id_bmfi_kategori_pengesahan_microfinance} value={k.id_bmfi_kategori_pengesahan_microfinance}>
                      {k.nama_bmfi_kategori_pengesahan_microfinance}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Judul</label>
                  <input value={formData.judul || ''} onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Tahun Pengesahan</label>
                  <input value={formData.tahun_pengesahan || ''} onChange={(e) => setFormData({ ...formData, tahun_pengesahan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Jumlah Peserta Awal</label>
                  <input type="number" value={formData.jumlah_peserta_awal_pengesahan || ''} onChange={(e) => setFormData({ ...formData, jumlah_peserta_awal_pengesahan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Tanggal</label>
                  <input type="date" value={formData.tgl_bmfi_sejarah_dan_profil_microfinance || ''} onChange={(e) => setFormData({ ...formData, tgl_bmfi_sejarah_dan_profil_microfinance: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Nominal Saldo Awal</label>
                  <input type="number" value={formData.nominal_saldo_awal_pengesahan || ''} onChange={(e) => setFormData({ ...formData, nominal_saldo_awal_pengesahan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Nomor Kerangka Acuan Kerja</label>
                  <input value={formData.nomor_kerangka_acuan_kerja || ''} onChange={(e) => setFormData({ ...formData, nomor_kerangka_acuan_kerja: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Status</label>
                <select
                  value={formData.status_aktif ?? 1}
                  onChange={(e) => setFormData({ ...formData, status_aktif: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Tidak Aktif</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan</label>
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
