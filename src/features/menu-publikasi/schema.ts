import { z } from 'zod';

const baseFields = {
  judul: z.string().min(1, 'Judul wajib diisi'),
  keterangan: z.string().optional().default(''),
  status_aktif: z.string().optional().default('1'),
};

export const postinganSchema = z.object({
  ...baseFields,
  konten: z.string().min(1, 'Konten wajib diisi'),
  kategori: z.string().min(1, 'Kategori wajib dipilih'),
  gambar: z.string().optional().default(''),
});

export const khutbahSchema = z.object({
  ...baseFields,
  konten: z.string().min(1, 'Konten wajib diisi'),
  pemateri: z.string().min(1, 'Pemateri wajib diisi'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
});

export const mediaInfoSchema = z.object({
  ...baseFields,
  url: z.string().min(1, 'URL wajib diisi').url('Format URL tidak valid'),
  tipe_media: z.string().min(1, 'Tipe media wajib dipilih'),
});

export const jadwalKajianSchema = z.object({
  ...baseFields,
  pemateri: z.string().min(1, 'Pemateri wajib diisi'),
  hari: z.string().min(1, 'Hari wajib dipilih'),
  jam: z.string().min(1, 'Jam wajib diisi'),
  lokasi: z.string().min(1, 'Lokasi wajib diisi'),
});

export const videoKajianSchema = z.object({
  ...baseFields,
  video_url: z.string().min(1, 'URL Video wajib diisi').url('Format URL tidak valid'),
  pemateri: z.string().min(1, 'Pemateri wajib diisi'),
});

export const ceritaSchema = z.object({
  ...baseFields,
  konten: z.string().min(1, 'Konten wajib diisi'),
  penulis: z.string().min(1, 'Penulis wajib diisi'),
  gambar: z.string().optional().default(''),
});

export const donasiSchema = z.object({
  ...baseFields,
  target_dana: z
    .string()
    .min(1, 'Target dana wajib diisi')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Target harus angka positif'),
  tanggal_berakhir: z.string().min(1, 'Tanggal berakhir wajib diisi'),
});

export const acaraSchema = z.object({
  ...baseFields,
  tanggal_mulai: z.string().min(1, 'Tanggal mulai wajib diisi'),
  tanggal_selesai: z.string().min(1, 'Tanggal selesai wajib diisi'),
  lokasi: z.string().min(1, 'Lokasi wajib diisi'),
});

export type PostinganFormValues = z.infer<typeof postinganSchema>;
export type KhutbahFormValues = z.infer<typeof khutbahSchema>;
export type MediaInfoFormValues = z.infer<typeof mediaInfoSchema>;
export type JadwalKajianFormValues = z.infer<typeof jadwalKajianSchema>;
export type VideoKajianFormValues = z.infer<typeof videoKajianSchema>;
export type CeritaFormValues = z.infer<typeof ceritaSchema>;
export type DonasiFormValues = z.infer<typeof donasiSchema>;
export type AcaraFormValues = z.infer<typeof acaraSchema>;

export function getSchemaForJenis(jenis: string) {
  const map: Record<string, z.ZodObject<any>> = {
    'postingan': postinganSchema,
    'materi-khutbah': khutbahSchema,
    'media-info': mediaInfoSchema,
    'jadwal-kajian': jadwalKajianSchema,
    'video-kajian': videoKajianSchema,
    'cerita': ceritaSchema,
    'donasi': donasiSchema,
    'acara': acaraSchema,
  };
  return map[jenis] || postinganSchema;
}
