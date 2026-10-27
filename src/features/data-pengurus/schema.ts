import { z } from 'zod';

export const dataPengurusSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  jabatan: z.string().min(1, 'Jabatan wajib dipilih'),
  nohp: z
    .string()
    .min(1, 'Nomor HP wajib diisi')
    .refine((val) => /^0[0-9]{8,12}$/.test(val.replace(/[\s-]/g, '')), 'Format nomor HP tidak valid'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  jenis_kelamin: z.string().min(1, 'Jenis kelamin wajib dipilih'),
  masa_jabatan_mulai: z.string(),
  masa_jabatan_selesai: z.string(),
  keterangan: z.string(),
});

export type DataPengurusFormValues = z.infer<typeof dataPengurusSchema>;
