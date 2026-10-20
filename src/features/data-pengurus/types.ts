export interface Pengurus {
  id?: number;
  nama: string;
  jabatan: string;
  nohp: string;
  alamat: string;
  jenis_kelamin: string;
  masa_jabatan_mulai?: string;
  masa_jabatan_selesai?: string;
  keterangan?: string;
  foto?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PengurusFormData {
  nama: string;
  jabatan: string;
  nohp: string;
  alamat: string;
  jenis_kelamin: string;
  masa_jabatan_mulai: string;
  masa_jabatan_selesai: string;
  keterangan: string;
}

export const JABATAN_OPTIONS = [
  { value: 'Ketua', label: 'Ketua' },
  { value: 'Wakil Ketua', label: 'Wakil Ketua' },
  { value: 'Sekretaris', label: 'Sekretaris' },
  { value: 'Wakil Sekretaris', label: 'Wakil Sekretaris' },
  { value: 'Bendahara', label: 'Bendahara' },
  { value: 'Wakil Bendahara', label: 'Wakil Bendahara' },
  { value: 'Seksi Dakwah', label: 'Seksi Dakwah' },
  { value: 'Seksi Pendidikan', label: 'Seksi Pendidikan' },
  { value: 'Seksi Sosial', label: 'Seksi Sosial' },
  { value: 'Seksi Pembangunan', label: 'Seksi Pembangunan' },
  { value: 'Seksi Remaja Masjid', label: 'Seksi Remaja Masjid' },
  { value: 'Seksi Perlengkapan', label: 'Seksi Perlengkapan' },
  { value: 'Seksi Kebersihan', label: 'Seksi Kebersihan' },
  { value: 'Badan Pengawas', label: 'Badan Pengawas' },
  { value: 'Anggota', label: 'Anggota' },
  { value: 'Lainnya', label: 'Lainnya' },
];

export const JENIS_KELAMIN_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

export const GENDER_LABEL: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' };
