import { z } from 'zod';

export const bukuKasPengeluaranSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  id_jenis_dana: z.string().min(1, 'Jenis dana wajib dipilih'),
  id_jenis_harta: z.string().min(1, 'Jenis harta wajib dipilih'),
  id_label_info_dana: z.string().min(1, 'Label info dana wajib dipilih'),
  nominal: z
    .string()
    .min(1, 'Nominal wajib diisi')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Nominal harus angka positif'),
  penerima: z
    .string()
    .min(1, 'Penerima wajib diisi'),
  keterangan: z.string(),
});

export type BukuKasPengeluaranFormValues = z.infer<typeof bukuKasPengeluaranSchema>;
