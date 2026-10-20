// Types for Kegiatan Masjid
export interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  jenis: 'rutin' | 'tertentu';
  keterangan?: string;
  foto?: string;
  status_aktif: number;
  created_at?: string;
  updated_at?: string;
}

export interface KegiatanFormData {
  nama_kegiatan: string;
  jenis: 'rutin' | 'tertentu';
  keterangan: string;
  foto?: string;
}

export const JENIS_KEGIATAN_OPTIONS = [
  { value: 'rutin', label: 'Rutin' },
  { value: 'tertentu', label: 'Tertentu' },
];

export const JENIS_KEGIATAN_COLOR: Record<string, string> = {
  rutin: 'bg-[#EAF6E8] text-[#1C7712]',
  tertentu: 'bg-[#EAF2FF] text-[#2B7FFF]',
};
