export type JenisPublikasi = 'postingan' | 'materi-khutbah' | 'media-info' | 'jadwal-kajian' | 'video-kajian' | 'cerita' | 'donasi' | 'acara';

export interface PublikasiItem {
  id?: number;
  judul: string;
  slug?: string;
  keterangan?: string;
  gambar?: string;
  status_aktif?: number;
  jenis: JenisPublikasi;
  // Postingan
  konten?: string;
  kategori?: string;
  // Khutbah
  pemateri?: string;
  tanggal?: string;
  // Media Info
  url?: string;
  tipe_media?: string;
  // Jadwal Kajian
  hari?: string;
  jam?: string;
  lokasi?: string;
  // Video Kajian
  video_url?: string;
  // Donasi
  target_dana?: number;
  dana_terkumpul?: number;
  tanggal_berakhir?: string;
  // Acara
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  // Cerita
  penulis?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PublikasiFormData {
  judul: string;
  keterangan: string;
  konten?: string;
  gambar?: string;
  kategori?: string;
  pemateri?: string;
  tanggal?: string;
  url?: string;
  tipe_media?: string;
  hari?: string;
  jam?: string;
  lokasi?: string;
  video_url?: string;
  penulis?: string;
  target_dana: string;
  dana_terkumpul: string;
  tanggal_berakhir: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status_aktif: string;
}

export const PUBLIKASI_LABELS: Record<JenisPublikasi, string> = {
  'postingan': 'Postingan',
  'materi-khutbah': 'Materi Khutbah',
  'media-info': 'Media Info',
  'jadwal-kajian': 'Jadwal Kajian',
  'video-kajian': 'Video Kajian',
  'cerita': 'Cerita',
  'donasi': 'Donasi',
  'acara': 'Acara',
};

export const KATEGORI_OPTIONS = [
  'Zakat', 'Infak', 'Sedekah', 'Kajian', 'Berita', 'Artikel', 'Pengumuman', 'Lainnya',
];

export const TIPE_MEDIA_OPTIONS = [
  'Dokumen', 'Gambar', 'Video', 'Audio', 'Infografis', 'Lainnya',
];

export const HARI_OPTIONS = [
  'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Setiap Hari',
];

export const STATUS_AKTIF_OPTIONS = [
  { value: '1', label: 'Aktif' },
  { value: '0', label: 'Tidak Aktif' },
];
