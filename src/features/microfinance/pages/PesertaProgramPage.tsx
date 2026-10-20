import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Pencil, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import {
  useMicrofinanceList, useCreateMicrofinance, useUpdateMicrofinance, useDeleteMicrofinance,
} from '../hooks/useMicrofinance';
import type { PesertaProgram, Pendamping } from '../types';

const formatRupiah = (v: string | number | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

const emptyForm = {
  nama_peserta_program_bmfi_asesmen: '',
  no_ktp: '',
  no_hp: '',
  jenis_kelamin: 'Laki-laki',
  alamat_rumah: '',
  nama_usaha: '',
  lokasi_usaha: '',
  no_rekening: '',
  atas_nama_rekening: '',
  nama_bank: '',
  id_pendamping_bmfi_asesmen: '',
  keterangan: '',
};

type TransaksiMode = 'pencairan' | 'pengembalian';

export default function PesertaProgramPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<PesertaProgram>('peserta-program', idMasjid);
  const { data: pendampingRes } = useMicrofinanceList<Pendamping>('pendamping', idMasjid);
  const createMutation = useCreateMicrofinance('peserta-program');
  const updateMutation = useUpdateMicrofinance('peserta-program');
  const deleteMutation = useDeleteMicrofinance('peserta-program');
  const createTransaksi = useCreateMicrofinance('transaksi', 'Transaksi berhasil dicatat');

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PesertaProgram | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(emptyForm);

  const [txModal, setTxModal] = useState<{ mode: TransaksiMode; peserta: PesertaProgram } | null>(null);
  const [txForm, setTxForm] = useState({ tanggal: new Date().toISOString().slice(0, 10), nominal: '', infak: '', keterangan: '' });

  const data = listRes?.data || [];
  const pendampingList = pendampingRes?.data || [];

  const openCreate = () => {
    setEditItem(null);
    setFormData({ ...emptyForm, parent_id: idMasjid, kode_org_baznas: idMasjid });
    setShowForm(true);
  };

  const openEdit = (item: PesertaProgram) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (editItem) await updateMutation.mutateAsync({ id: editItem.id_peserta_program_bmfi_asesmen, data: formData });
    else await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleDelete = async (item: PesertaProgram) => {
    if (confirm(`Hapus peserta "${item.nama_peserta_program_bmfi_asesmen}"?`)) {
      await deleteMutation.mutateAsync(item.id_peserta_program_bmfi_asesmen);
    }
  };

  const openTransaksi = (mode: TransaksiMode, peserta: PesertaProgram) => {
    setTxForm({ tanggal: new Date().toISOString().slice(0, 10), nominal: '', infak: '', keterangan: '' });
    setTxModal({ mode, peserta });
  };

  const submitTransaksi = async () => {
    if (!txModal) return;
    const nominal = Number(txForm.nominal || 0);
    if (nominal <= 0) {
      toast.error('Nominal harus diisi');
      return;
    }
    if (txModal.mode === 'pencairan' && nominal > 3_000_000) {
      toast.error('Nominal peminjaman maksimal Rp3.000.000');
      return;
    }
    await createTransaksi.mutateAsync({
      tanggal: txForm.tanggal,
      keterangan_transaksi: txForm.keterangan,
      id_bmfi_peserta_program: txModal.peserta.id_peserta_program_bmfi_asesmen,
      id_bmfi_pendamping: txModal.peserta.id_pendamping_bmfi_asesmen,
      id_jalur_akses: idMasjid,
      ...(txModal.mode === 'pencairan'
        ? { nominal_peminjaman: txForm.nominal }
        : { nominal_pengembalian: txForm.nominal, infak_peserta: txForm.infak || '0' }),
    });
    setTxModal(null);
  };

  const columns: Column<PesertaProgram>[] = [
    { key: 'nama_peserta_program_bmfi_asesmen', label: 'Nama Peserta', render: (d) => d.nama_peserta_program_bmfi_asesmen || '-' },
    { key: 'nama_usaha', label: 'Nama Usaha', render: (d) => d.nama_usaha || '-', hideOnMobile: true },
    { key: 'jumlah_pinjaman', label: 'Jumlah Pinjaman', render: (d) => formatRupiah(d.jumlah_pinjaman) },
    { key: 'sisa_dana_pengembalian', label: 'Sisa Pengembalian', render: (d) => formatRupiah(d.sisa_dana_pengembalian) },
    {
      key: 'aksi', label: 'Aksi',
      render: (d) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openTransaksi('pencairan', d)} title="Pencairan Pinjaman" className="p-1.5 rounded-lg hover:bg-[#EAF6E8] text-[#555] hover:text-[#28A71A]"><ArrowUpCircle size={15} /></button>
          <button onClick={() => openTransaksi('pengembalian', d)} title="Pengembalian/Cicilan" className="p-1.5 rounded-lg hover:bg-blue-50 text-[#555] hover:text-blue-500"><ArrowDownCircle size={15} /></button>
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
          <Users size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Peserta Program dan Transaksi</h1>
          <p className="text-sm text-[#555]">Data mitra pinjaman BMM — gunakan ikon panah untuk mencatat pencairan/pengembalian</p>
        </div>
      </div>

      <DataTable data={data} columns={columns} loading={isLoading} onAdd={openCreate} addLabel="Tambah Peserta Program" emptyMessage="Belum ada data peserta program" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#303030] mb-4">{editItem ? 'Edit' : 'Tambah'} Peserta Program</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Lengkap</label>
                <input value={formData.nama_peserta_program_bmfi_asesmen || ''} onChange={(e) => setFormData({ ...formData, nama_peserta_program_bmfi_asesmen: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Jenis Kelamin</label>
                  <select value={formData.jenis_kelamin || 'Laki-laki'} onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">No. HP</label>
                  <input value={formData.no_hp || ''} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">No. KTP</label>
                  <input value={formData.no_ktp || ''} onChange={(e) => setFormData({ ...formData, no_ktp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Pendamping</label>
                  <select value={formData.id_pendamping_bmfi_asesmen || ''} onChange={(e) => setFormData({ ...formData, id_pendamping_bmfi_asesmen: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]">
                    <option value="">--Pilih--</option>
                    {pendampingList.map((p: any) => (
                      <option key={p.id_pendamping_bmfi_asesmen} value={p.id_pendamping_bmfi_asesmen}>{p.nama_pendamping_bmfi_asesmen}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Usaha</label>
                  <input value={formData.nama_usaha || ''} onChange={(e) => setFormData({ ...formData, nama_usaha: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Lokasi Usaha</label>
                  <input value={formData.lokasi_usaha || ''} onChange={(e) => setFormData({ ...formData, lokasi_usaha: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Nama Bank</label>
                  <input value={formData.nama_bank || ''} onChange={(e) => setFormData({ ...formData, nama_bank: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">No. Rekening</label>
                  <input value={formData.no_rekening || ''} onChange={(e) => setFormData({ ...formData, no_rekening: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Alamat Rumah</label>
                <textarea value={formData.alamat_rumah || ''} onChange={(e) => setFormData({ ...formData, alamat_rumah: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan</label>
                <textarea value={formData.keterangan || ''} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} rows={2}
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

      {txModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setTxModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#303030] mb-1">
              {txModal.mode === 'pencairan' ? 'Pencairan Pinjaman' : 'Pengembalian / Cicilan'}
            </h3>
            <p className="text-sm text-[#555] mb-4">{txModal.peserta.nama_peserta_program_bmfi_asesmen}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Tanggal</label>
                <input type="date" value={txForm.tanggal} onChange={(e) => setTxForm({ ...txForm, tanggal: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Nominal {txModal.mode === 'pencairan' && '(maks Rp3.000.000)'}</label>
                <input type="number" value={txForm.nominal} onChange={(e) => setTxForm({ ...txForm, nominal: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
              </div>
              {txModal.mode === 'pengembalian' && (
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5">Infak (opsional)</label>
                  <input type="number" value={txForm.infak} onChange={(e) => setTxForm({ ...txForm, infak: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5">Keterangan Transaksi</label>
                <textarea value={txForm.keterangan} onChange={(e) => setTxForm({ ...txForm, keterangan: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setTxModal(null)} className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-xl text-sm text-[#303030] hover:bg-[#F0F4F8]">Batal</button>
              <button onClick={submitTransaksi} className="btn-primary-green rounded-xl">Simpan Transaksi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
