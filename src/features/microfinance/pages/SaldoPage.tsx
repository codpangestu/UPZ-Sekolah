import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import { useMicrofinanceList, useCreateMicrofinance, useUpdateMicrofinance, useDeleteMicrofinance } from '../hooks/useMicrofinance';
import type { SaldoMicrofinance } from '../types';

const formatRupiah = (v: string | number | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

const emptyForm = {
  nama_bmfi_saldo_microfinance: '',
  nominal_saldo_microfinance: '',
  saldo_awal_penerimaan: '',
  pemberian_saldo_awal: '',
  keterangan: '',
};

export default function SaldoPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<SaldoMicrofinance>('saldo', idMasjid);
  const createMutation = useCreateMicrofinance('saldo');
  const updateMutation = useUpdateMicrofinance('saldo');
  const deleteMutation = useDeleteMicrofinance('saldo');

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<SaldoMicrofinance | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyForm);

  const data = listRes?.data || [];

  const openCreate = () => {
    setEditItem(null);
    setFormData({ ...emptyForm, parent_id: idMasjid });
    setShowForm(true);
  };

  const openEdit = (item: SaldoMicrofinance) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) await updateMutation.mutateAsync({ id: editItem.id_bmfi_saldo_microfinance, data: formData });
    else await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleDelete = async (item: SaldoMicrofinance) => {
    if (confirm(`Hapus saldo "${item.nama_bmfi_saldo_microfinance}"?`)) {
      await deleteMutation.mutateAsync(item.id_bmfi_saldo_microfinance);
    }
  };

  const columns: Column<SaldoMicrofinance>[] = [
    { key: 'nama_bmfi_saldo_microfinance', label: 'Nama Saldo', render: (d) => d.nama_bmfi_saldo_microfinance || '-' },
    { key: 'nominal_saldo_microfinance', label: 'Saldo Saat Ini', render: (d) => formatRupiah(d.nominal_saldo_microfinance) },
    { key: 'saldo_awal_penerimaan', label: 'Saldo Awal', render: (d) => formatRupiah(d.saldo_awal_penerimaan), hideOnMobile: true },
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
          <Wallet size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Saldo Microfinance</h1>
          <p className="text-sm text-[#555]">Dana bergulir program BMM masjid ini</p>
        </div>
      </div>

      <DataTable data={data} columns={columns} loading={isLoading} onAdd={openCreate} addLabel="Tambah" emptyMessage="Belum ada data saldo microfinance" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">{editItem ? 'Edit' : 'Tambah'} Saldo Microfinance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Saldo</label>
                <input value={formData.nama_bmfi_saldo_microfinance || ''} onChange={(e) => setFormData({ ...formData, nama_bmfi_saldo_microfinance: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Saldo Awal Penerimaan</label>
                  <input type="number" value={formData.saldo_awal_penerimaan || ''} onChange={(e) => setFormData({ ...formData, saldo_awal_penerimaan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Nominal Saldo Saat Ini</label>
                  <input type="number" value={formData.nominal_saldo_microfinance || ''} onChange={(e) => setFormData({ ...formData, nominal_saldo_microfinance: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
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
