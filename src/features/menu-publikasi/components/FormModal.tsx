import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { getSchemaForJenis } from '../schema';
import { PUBLIKASI_LABELS, KATEGORI_OPTIONS, TIPE_MEDIA_OPTIONS, HARI_OPTIONS, STATUS_AKTIF_OPTIONS } from '../types';
import type { JenisPublikasi, PublikasiItem } from '../types';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitting?: boolean;
  editItem?: PublikasiItem | null;
  jenis: JenisPublikasi;
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
      judul: '',
      keterangan: '',
      status_aktif: '1',
      konten: '',
      kategori: '',
      gambar: '',
      pemateri: '',
      tanggal: '',
      url: '',
      tipe_media: '',
      hari: '',
      jam: '',
      lokasi: '',
      video_url: '',
      penulis: '',
      target_dana: '',
      tanggal_berakhir: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        judul: editItem.judul || '',
        keterangan: editItem.keterangan || '',
        status_aktif: String(editItem.status_aktif ?? '1'),
        konten: editItem.konten || '',
        kategori: editItem.kategori || '',
        gambar: editItem.gambar || '',
        pemateri: editItem.pemateri || '',
        tanggal: editItem.tanggal ? editItem.tanggal.split('T')[0] : '',
        url: editItem.url || '',
        tipe_media: editItem.tipe_media || '',
        hari: editItem.hari || '',
        jam: editItem.jam || '',
        lokasi: editItem.lokasi || '',
        video_url: editItem.video_url || '',
        penulis: editItem.penulis || '',
        target_dana: String(editItem.target_dana || ''),
        tanggal_berakhir: editItem.tanggal_berakhir ? editItem.tanggal_berakhir.split('T')[0] : '',
        tanggal_mulai: editItem.tanggal_mulai ? editItem.tanggal_mulai.split('T')[0] : '',
        tanggal_selesai: editItem.tanggal_selesai ? editItem.tanggal_selesai.split('T')[0] : '',
      });
    } else {
      reset({
        judul: '',
        keterangan: '',
        status_aktif: '1',
        konten: '',
        kategori: '',
        gambar: '',
        pemateri: '',
        tanggal: '',
        url: '',
        tipe_media: '',
        hari: '',
        jam: '',
        lokasi: '',
        video_url: '',
        penulis: '',
        target_dana: '',
        tanggal_berakhir: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
      });
    }
  }, [editItem, reset, open, jenis]);

  if (!open) return null;

  const label = PUBLIKASI_LABELS[jenis];
  const isPostingan = jenis === 'postingan';
  const isKhutbah = jenis === 'materi-khutbah';
  const isMediaInfo = jenis === 'media-info';
  const isJadwalKajian = jenis === 'jadwal-kajian';
  const isVideoKajian = jenis === 'video-kajian';
  const isCerita = jenis === 'cerita';
  const isDonasi = jenis === 'donasi';
  const isAcara = jenis === 'acara';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[#F0F4F8]">
          <h2 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {editItem ? `Edit ${label}` : `Tambah ${label}`}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0F4F8] transition-colors">
            <X size={18} className="text-text-gray" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Judul <span className="text-red-500">*</span></label>
            <input
              type="text" {...register('judul')}
              placeholder="Judul konten"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.judul ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
            />
            {errors.judul && <p className="text-xs text-red-500 mt-1">{errors.judul.message as string}</p>}
          </div>

          {/* Konten (Postingan, Khutbah, Cerita) */}
          {(isPostingan || isKhutbah || isCerita) && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1">Konten <span className="text-red-500">*</span></label>
              <textarea
                {...register('konten')}
                placeholder="Tulis konten..."
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all resize-none ${errors.konten ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
              />
              {errors.konten && <p className="text-xs text-red-500 mt-1">{errors.konten.message as string}</p>}
            </div>
          )}

          {/* Kategori (Postingan) */}
          {isPostingan && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1">Kategori <span className="text-red-500">*</span></label>
              <select
                {...register('kategori')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.kategori ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}
              >
                <option value="">Pilih Kategori</option>
                {KATEGORI_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              {errors.kategori && <p className="text-xs text-red-500 mt-1">{errors.kategori.message as string}</p>}
            </div>
          )}

          {/* Gambar (Postingan, Cerita) */}
          {(isPostingan || isCerita) && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1">URL Gambar</label>
              <input
                type="text" {...register('gambar')}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all"
              />
            </div>
          )}

          {/* Row: Pemateri & Tanggal (Khutbah) */}
          {isKhutbah && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Pemateri <span className="text-red-500">*</span></label>
                <input type="text" {...register('pemateri')} placeholder="Nama pemateri"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.pemateri ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.pemateri && <p className="text-xs text-red-500 mt-1">{errors.pemateri.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Tanggal <span className="text-red-500">*</span></label>
                <input type="date" {...register('tanggal')}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.tanggal ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.tanggal && <p className="text-xs text-red-500 mt-1">{errors.tanggal.message as string}</p>}
              </div>
            </div>
          )}

          {/* Media Info */}
          {isMediaInfo && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">URL <span className="text-red-500">*</span></label>
                <input type="url" {...register('url')} placeholder="https://..."
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.url ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Tipe Media <span className="text-red-500">*</span></label>
                <select {...register('tipe_media')}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.tipe_media ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}>
                  <option value="">Pilih Tipe</option>
                  {TIPE_MEDIA_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                {errors.tipe_media && <p className="text-xs text-red-500 mt-1">{errors.tipe_media.message as string}</p>}
              </div>
            </>
          )}

          {/* Jadwal Kajian */}
          {isJadwalKajian && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1">Hari <span className="text-red-500">*</span></label>
                  <select {...register('hari')}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.hari ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`}>
                    <option value="">Pilih Hari</option>
                    {HARI_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                  {errors.hari && <p className="text-xs text-red-500 mt-1">{errors.hari.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1">Jam <span className="text-red-500">*</span></label>
                  <input type="time" {...register('jam')}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.jam ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                  {errors.jam && <p className="text-xs text-red-500 mt-1">{errors.jam.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Pemateri <span className="text-red-500">*</span></label>
                <input type="text" {...register('pemateri')} placeholder="Nama pemateri"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.pemateri ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.pemateri && <p className="text-xs text-red-500 mt-1">{errors.pemateri.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Lokasi <span className="text-red-500">*</span></label>
                <input type="text" {...register('lokasi')} placeholder="Lokasi kajian"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.lokasi ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.lokasi && <p className="text-xs text-red-500 mt-1">{errors.lokasi.message as string}</p>}
              </div>
            </>
          )}

          {/* Video Kajian */}
          {isVideoKajian && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">URL Video <span className="text-red-500">*</span></label>
                <input type="url" {...register('video_url')} placeholder="https://youtube.com/..."
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.video_url ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.video_url && <p className="text-xs text-red-500 mt-1">{errors.video_url.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Pemateri <span className="text-red-500">*</span></label>
                <input type="text" {...register('pemateri')} placeholder="Nama pemateri"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.pemateri ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.pemateri && <p className="text-xs text-red-500 mt-1">{errors.pemateri.message as string}</p>}
              </div>
            </>
          )}

          {/* Cerita: Penulis */}
          {isCerita && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1">Penulis <span className="text-red-500">*</span></label>
              <input type="text" {...register('penulis')} placeholder="Nama penulis"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.penulis ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
              {errors.penulis && <p className="text-xs text-red-500 mt-1">{errors.penulis.message as string}</p>}
            </div>
          )}

          {/* Donasi */}
          {isDonasi && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Target Dana (Rp) <span className="text-red-500">*</span></label>
                <input type="number" {...register('target_dana')} placeholder="0"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.target_dana ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.target_dana && <p className="text-xs text-red-500 mt-1">{errors.target_dana.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Tanggal Berakhir <span className="text-red-500">*</span></label>
                <input type="date" {...register('tanggal_berakhir')}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.tanggal_berakhir ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.tanggal_berakhir && <p className="text-xs text-red-500 mt-1">{errors.tanggal_berakhir.message as string}</p>}
              </div>
            </div>
          )}

          {/* Acara */}
          {isAcara && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input type="date" {...register('tanggal_mulai')}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.tanggal_mulai ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                  {errors.tanggal_mulai && <p className="text-xs text-red-500 mt-1">{errors.tanggal_mulai.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input type="date" {...register('tanggal_selesai')}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.tanggal_selesai ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                  {errors.tanggal_selesai && <p className="text-xs text-red-500 mt-1">{errors.tanggal_selesai.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1">Lokasi <span className="text-red-500">*</span></label>
                <input type="text" {...register('lokasi')} placeholder="Lokasi acara"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all ${errors.lokasi ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'}`} />
                {errors.lokasi && <p className="text-xs text-red-500 mt-1">{errors.lokasi.message as string}</p>}
              </div>
            </>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Status</label>
            <select {...register('status_aktif')}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all">
              {STATUS_AKTIF_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Keterangan</label>
            <textarea {...register('keterangan')} placeholder="Catatan tambahan..." rows={2}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-[#D4D4D4] rounded-lg text-sm font-medium text-text-gray hover:bg-[#F0F4F8] transition-colors">
              Batal
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
