import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { bukuKasPenerimaanSchema, type BukuKasPenerimaanFormValues } from '../schema';
import { useMasterData } from '../hooks/useBukuKasPenerimaan';
import type { BukuKasPenerimaan, MasterDataItem } from '../types';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BukuKasPenerimaanFormValues) => void;
  submitting?: boolean;
  editItem?: BukuKasPenerimaan | null;
}

export default function FormModal({ open, onClose, onSubmit, submitting, editItem }: FormModalProps) {
  const { data: masterData, isLoading: loadingMaster } = useMasterData();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BukuKasPenerimaanFormValues>({
    resolver: zodResolver(bukuKasPenerimaanSchema),
    defaultValues: {
      tanggal: new Date().toISOString().split('T')[0],
      id_jenis_dana: '',
      id_jenis_harta: '',
      id_label_info_dana: '',
      nominal: '',
      jumlah_donatur: '0',
      keterangan: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editItem) {
      reset({
        tanggal: editItem.tanggal ? editItem.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
        id_jenis_dana: String(editItem.id_jenis_dana || ''),
        id_jenis_harta: String(editItem.id_jenis_harta || ''),
        id_label_info_dana: String(editItem.id_label_info_dana || ''),
        nominal: String(editItem.nominal || ''),
        jumlah_donatur: String(editItem.jumlah_donatur || '0'),
        keterangan: editItem.keterangan || '',
      });
    } else {
      reset({
        tanggal: new Date().toISOString().split('T')[0],
        id_jenis_dana: '',
        id_jenis_harta: '',
        id_label_info_dana: '',
        nominal: '',
        jumlah_donatur: '0',
        keterangan: '',
      });
    }
  }, [editItem, reset, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0F4F8]">
          <h2
            className="text-lg font-semibold text-[#303030]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {editItem ? 'Edit Penerimaan' : 'Tambah Penerimaan'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0F4F8] transition-colors">
            <X size={18} className="text-text-gray" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('tanggal')}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                errors.tanggal ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
              }`}
            />
            {errors.tanggal && <p className="text-xs text-red-500 mt-1">{errors.tanggal.message}</p>}
          </div>

          {/* Jenis Dana */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Jenis Dana <span className="text-red-500">*</span>
            </label>
            <select
              {...register('id_jenis_dana')}
              disabled={loadingMaster}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                errors.id_jenis_dana ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <option value="">Pilih Jenis Dana</option>
              {masterData?.jenisDana?.map((item: MasterDataItem) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
            {errors.id_jenis_dana && <p className="text-xs text-red-500 mt-1">{errors.id_jenis_dana.message}</p>}
          </div>

          {/* Jenis Harta */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Jenis Harta <span className="text-red-500">*</span>
            </label>
            <select
              {...register('id_jenis_harta')}
              disabled={loadingMaster}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                errors.id_jenis_harta ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <option value="">Pilih Jenis Harta</option>
              {masterData?.jenisHarta?.map((item: MasterDataItem) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
            {errors.id_jenis_harta && <p className="text-xs text-red-500 mt-1">{errors.id_jenis_harta.message}</p>}
          </div>

          {/* Label Info Dana */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Label Info Dana <span className="text-red-500">*</span>
            </label>
            <select
              {...register('id_label_info_dana')}
              disabled={loadingMaster}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                errors.id_label_info_dana ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <option value="">Pilih Label Info Dana</option>
              {masterData?.labelInfoDana?.map((item: MasterDataItem) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
            {errors.id_label_info_dana && <p className="text-xs text-red-500 mt-1">{errors.id_label_info_dana.message}</p>}
          </div>

          {/* Grid: Nominal & Jumlah Donatur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Nominal (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('nominal')}
                placeholder="0"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.nominal ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
              />
              {errors.nominal && <p className="text-xs text-red-500 mt-1">{errors.nominal.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Jumlah Donatur <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('jumlah_donatur')}
                placeholder="0"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.jumlah_donatur ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
              />
              {errors.jumlah_donatur && <p className="text-xs text-red-500 mt-1">{errors.jumlah_donatur.message}</p>}
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Keterangan
            </label>
            <textarea
              {...register('keterangan')}
              placeholder="Deskripsi transaksi..."
              rows={3}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all placeholder:text-[#B0B0B0] resize-none"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#D4D4D4] rounded-lg text-sm font-medium text-text-gray hover:bg-[#F0F4F8] transition-colors"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
