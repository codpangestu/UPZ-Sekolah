import { z } from 'zod';

export const bukuKasPenerimaanSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  id_jenis_dana: z.string().min(1, 'Jenis dana wajib dipilih'),
  id_jenis_harta: z.string().min(1, 'Jenis harta wajib dipilih'),
  id_label_info_dana: z.string().min(1, 'Label info dana wajib dipilih'),
  nominal: z
    .string()
    .min(1, 'Nominal wajib diisi')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Nominal harus angka positif'),
  jumlah_donatur: z
    .string()
    .min(1, 'Jumlah donatur wajib diisi')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Jumlah donatur harus angka'),
  keterangan: z.string().optional().default(''),
});

export type BukuKasPenerimaanFormValues = z.infer<typeof bukuKasPenerimaanSchema>;
