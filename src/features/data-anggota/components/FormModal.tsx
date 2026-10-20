import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { getSchemaForJenis } from '../schema';
import {
  BIDANG_KEAHLIAN_OPTIONS,
  TUGAS_MARBOT_OPTIONS,
  STATUS_KEAKTIFAN_OPTIONS,
  JENIS_KELAMIN_OPTIONS,
  ANGGOTA_LABELS,
} from '../types';
import type { JenisAnggota, Anggota } from '../types';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitting?: boolean;
  editItem?: Anggota | null;
  jenis: JenisAnggota;
}

export default function FormModal({ open, onClose, onSubmit, submitting, editItem, jenis }: FormModalProps) {
  const schema = getSchemaForJenis(jenis);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: '',
      nohp: '',
      alamat: '',
      jenis_kelamin: '',
      bidang_keahlian: '',
      tugas: '',
      status_keaktifan: '',
      keterangan: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editItem) {
      reset({
        nama: editItem.nama || '',
        nohp: editItem.nohp || '',
        alamat: editItem.alamat || '',
        jenis_kelamin: editItem.jenis_kelamin || '',
        bidang_keahlian: editItem.bidang_keahlian || '',
        tugas: editItem.tugas || '',
        status_keaktifan: editItem.status_keaktifan || '',
        keterangan: editItem.keterangan || '',
      });
    } else {
      reset({
        nama: '',
        nohp: '',
        alamat: '',
        jenis_kelamin: '',
        bidang_keahlian: '',
        tugas: '',
        status_keaktifan: '',
        keterangan: '',
      });
    }
  }, [editItem, reset, open, jenis]);

  if (!open) return null;

  const label = ANGGOTA_LABELS[jenis];
  const isUstadz = jenis === 'ustadz';
  const isMarbot = jenis === 'marbot';
  const isJamaah = jenis === 'jamaah';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0F4F8]">
          <h2
            className="text-lg font-semibold text-[#303030]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {editItem ? `Edit ${label}` : `Tambah ${label}`}
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
              placeholder={`Nama ${label}`}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                errors.nama ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message as string}</p>}
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
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.nohp ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
              />
              {errors.nohp && <p className="text-xs text-red-500 mt-1">{errors.nohp.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                {...register('jenis_kelamin')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.jenis_kelamin ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="">Pilih</option>
                {JENIS_KELAMIN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.jenis_kelamin && <p className="text-xs text-red-500 mt-1">{errors.jenis_kelamin.message as string}</p>}
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
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all resize-none ${
                errors.alamat ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {errors.alamat && <p className="text-xs text-red-500 mt-1">{errors.alamat.message as string}</p>}
          </div>

          {/* Ustadz-specific: Bidang Keahlian */}
          {isUstadz && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Bidang Keahlian <span className="text-red-500">*</span>
              </label>
              <select
                {...register('bidang_keahlian')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.bidang_keahlian ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="">Pilih Bidang Keahlian</option>
                {BIDANG_KEAHLIAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.bidang_keahlian && <p className="text-xs text-red-500 mt-1">{errors.bidang_keahlian.message as string}</p>}
            </div>
          )}

          {/* Marbot-specific: Tugas */}
          {isMarbot && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Tugas <span className="text-red-500">*</span>
              </label>
              <select
                {...register('tugas')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.tugas ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="">Pilih Tugas</option>
                {TUGAS_MARBOT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.tugas && <p className="text-xs text-red-500 mt-1">{errors.tugas.message as string}</p>}
            </div>
          )}

          {/* Jamaah-specific: Status Keaktifan */}
          {isJamaah && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Status Keaktifan <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status_keaktifan')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${
                  errors.status_keaktifan ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <option value="">Pilih Status</option>
                {STATUS_KEAKTIFAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.status_keaktifan && <p className="text-xs text-red-500 mt-1">{errors.status_keaktifan.message as string}</p>}
            </div>
          )}

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
