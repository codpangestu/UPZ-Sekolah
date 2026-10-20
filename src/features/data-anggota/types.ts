export type JenisAnggota = 'ustadz' | 'marbot' | 'jamaah';

export interface Anggota {
  id?: number;
  nama: string;
  nohp: string;
  alamat: string;
  jenis_kelamin: string;
  jenis_anggota: JenisAnggota;
  // Ustadz-specific
  bidang_keahlian?: string;
  // Marbot-specific
  tugas?: string;
  // Jamaah-specific
  status_keaktifan?: string;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnggotaFormData {
  nama: string;
  nohp: string;
  alamat: string;
  jenis_kelamin: string;
  bidang_keahlian?: string;
  tugas?: string;
  status_keaktifan?: string;
  keterangan: string;
}

export interface AnggotaListItem {
  id?: number;
  nama: string;
  nohp: string;
  alamat: string;
  jenis_kelamin: string;
  bidang_keahlian?: string;
  tugas?: string;
  status_keaktifan?: string;
  keterangan?: string;
  created_at?: string;
}

export interface MasterDataItem {
  id: number;
  nama: string;
}

export const ANGGOTA_LABELS: Record<JenisAnggota, string> = {
  ustadz: 'Ustadz',
  marbot: 'Marbot',
  jamaah: 'Jamaah',
};

export const JENIS_KELAMIN_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

export const BIDANG_KEAHLIAN_OPTIONS = [
  'Tahsin/Tahfidz',
  'Fiqih',
  'Aqidah',
  'Tafsir',
  'Hadits',
  'Bahasa Arab',
  'Khotib',
  'Umum',
];

export const TUGAS_MARBOT_OPTIONS = [
  'Kebersihan Masjid',
  'Perawatan Bangunan',
  'Sound System',
  'Parkir',
  'Keamanan',
  'Umum',
];

export const STATUS_KEAKTIFAN_OPTIONS = [
  'Aktif',
  'Kurang Aktif',
  'Tidak Aktif',
  'Pindah',
];
