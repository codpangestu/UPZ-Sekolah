export interface BukuKasPenerimaan {
  id?: number;
  tanggal: string;
  id_jenis_dana: number;
  id_jenis_harta: number;
  id_label_info_dana: number;
  nominal: number;
  jumlah_donatur: number;
  keterangan: string;
  lampiran?: string;
  created_at?: string;
  updated_at?: string;

  // Joined fields
  nama_jenis_dana?: string;
  nama_jenis_harta?: string;
  nama_label_info_dana?: string;
}

export interface BukuKasPenerimaanFormData {
  tanggal: string;
  id_jenis_dana: string;
  id_jenis_harta: string;
  id_label_info_dana: string;
  nominal: string;
  jumlah_donatur: string;
  keterangan: string;
}

export interface CommandCenter {
  total_nominal_masuk?: number;
  total_nominal_keluar?: number;
  saldo?: number;
  jumlah_transaksi?: number;
}

export interface MasterDataItem {
  id: number;
  nama: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
