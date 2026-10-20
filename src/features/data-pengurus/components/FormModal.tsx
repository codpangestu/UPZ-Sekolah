import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { dataPengurusSchema, type DataPengurusFormValues } from '../schema';
import { JABATAN_OPTIONS, JENIS_KELAMIN_OPTIONS } from '../types';
import type { Pengurus } from '../types';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DataPengurusFormValues) => void;
  submitting?: boolean;
  editItem?: Pengurus | null;
}

export default function FormModal({ open, onClose, onSubmit, submitting, editItem }: FormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DataPengurusFormValues>({
    resolver: zodResolver(dataPengurusSchema),
    defaultValues: {
      nama: '',
      jabatan: '',
      nohp: '',
      alamat: '',
      jenis_kelamin: '',
      masa_jabatan_mulai: '',
      masa_jabatan_selesai: '',
      keterangan: '',
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        nama: editItem.nama || '',
        jabatan: editItem.jabatan || '',
        nohp: editItem.nohp || '',
        alamat: editItem.alamat || '',
        jenis_kelamin: editItem.jenis_kelamin || '',
        masa_jabatan_mulai: editItem.masa_jabatan_mulai ? editItem.masa_jabatan_mulai.split('T')[0] : '',
        masa_jabatan_selesai: editItem.masa_jabatan_selesai ? editItem.masa_jabatan_selesai.split('T')[0] : '',
        keterangan: editItem.keterangan || '',
      });
    } else {
      reset({
        nama: '',
        jabatan: '',
        nohp: '',
        alamat: '',
        jenis_kelamin: '',
        masa_jabatan_mulai: '',
        masa_jabatan_selesai: '',
        keterangan: '',
      });
    }
  }, [editItem, reset, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0F4F8]">
          <h2 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {editItem ? 'Edit Pengurus' : 'Tambah Pengurus'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0F4F8] transition-colors">
            <X size={18} className="text-text-gray" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nama')}
              placeholder="Nama pengurus"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.nama ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>}
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Jabatan <span className="text-red-500">*</span>
            </label>
            <select
              {...register('jabatan')}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.jabatan ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <option value="">Pilih Jabatan</option>
              {JABATAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.jabatan && <p className="text-xs text-red-500 mt-1">{errors.jabatan.message}</p>}
          </div>

          {/* Row: No HP & Jenis Kelamin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No. HP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('nohp')}
                placeholder="08123456789"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.nohp ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
              />
              {errors.nohp && <p className="text-xs text-red-500 mt-1">{errors.nohp.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                {...register('jenis_kelamin')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.jenis_kelamin ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="">Pilih</option>
                {JENIS_KELAMIN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.jenis_kelamin && <p className="text-xs text-red-500 mt-1">{errors.jenis_kelamin.message}</p>}
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('alamat')}
              placeholder="Alamat lengkap"
              rows={2}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all resize-none ${errors.alamat ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {errors.alamat && <p className="text-xs text-red-500 mt-1">{errors.alamat.message}</p>}
          </div>

          {/* Row: Masa Jabatan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Masa Jabatan Mulai
              </label>
              <input
                type="date"
                {...register('masa_jabatan_mulai')}
                className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Masa Jabatan Selesai
              </label>
              <input
                type="date"
                {...register('masa_jabatan_selesai')}
                className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Keterangan
            </label>
            <textarea
              {...register('keterangan')}
              placeholder="Catatan tambahan..."
              rows={2}
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
