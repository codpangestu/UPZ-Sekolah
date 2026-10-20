import { z } from 'zod';

const baseFields = {
  nama: z.string().min(1, 'Nama wajib diisi'),
  nohp: z
    .string()
    .min(1, 'Nomor HP wajib diisi')
    .refine((val) => /^0[0-9]{8,12}$/.test(val.replace(/[\s-]/g, '')), 'Format nomor HP tidak valid'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  jenis_kelamin: z.string().min(1, 'Jenis kelamin wajib dipilih'),
  keterangan: z.string().optional().default(''),
};

export const ustadzSchema = z.object({
  ...baseFields,
  bidang_keahlian: z.string().min(1, 'Bidang keahlian wajib dipilih'),
});

export const marbotSchema = z.object({
  ...baseFields,
  tugas: z.string().min(1, 'Tugas wajib dipilih'),
});

export const jamaahSchema = z.object({
  ...baseFields,
  status_keaktifan: z.string().min(1, 'Status keaktifan wajib dipilih'),
});

export type UstadzFormValues = z.infer<typeof ustadzSchema>;
export type MarbotFormValues = z.infer<typeof marbotSchema>;
export type JamaahFormValues = z.infer<typeof jamaahSchema>;

export type AnggotaFormValues = UstadzFormValues | MarbotFormValues | JamaahFormValues;

export function getSchemaForJenis(jenis: string) {
  switch (jenis) {
    case 'ustadz': return ustadzSchema;
    case 'marbot': return marbotSchema;
    case 'jamaah': return jamaahSchema;
    default: return ustadzSchema;
  }
}
