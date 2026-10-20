// Tipe data microfinance (BMM — BAZNAS Microfinance Masjid).
// Penamaan field MENGIKUTI PERSIS skema database asli (bmfi_*) —
// lihat backend/database/004_microfinance_bmm.sql — bukan diterjemahkan.

export interface MasterDataItem {
  [key: string]: any;
}

export interface SejarahProfilMicrofinance {
  id_bmfi_sejarah_dan_profil_microfinance: number;
  tgl_bmfi_sejarah_dan_profil_microfinance: string | null;
  judul: string | null;
  tahun_pengesahan: string | null;
  nomor_kerangka_acuan_kerja: string | null;
  jumlah_peserta_awal_pengesahan: string | null;
  nominal_saldo_awal_pengesahan: string | null;
  keterangan: string | null;
  status_aktif: number | null;
  id_bmfi_kategori_pengesahan_microfinance: number | null;
  id_masjid: string | null;
}

export interface SaldoMicrofinance {
  id_bmfi_saldo_microfinance: number;
  nama_bmfi_saldo_microfinance: string | null;
  nominal_saldo_microfinance: string | null;
  saldo_awal_penerimaan: string | null;
  pemberian_saldo_awal: string | null;
  keterangan: string | null;
  parent_id: string | null;
}

export interface PilihanSkemaPinjaman {
  id_pilihan_skema_pinjaman: number;
  nama_pilihan_skema_pinjaman: string | null;
  jumlah_nominal: string;
  keterangan: string | null;
  parent_id: string | null;
}

export interface Pendamping {
  id_pendamping_bmfi_asesmen: number;
  nama_pendamping_bmfi_asesmen: string | null;
  jenis_kelamin: string | null;
  no_ktp: string | null;
  no_hp: string | null;
  tempat_tanggal_lahir: string | null;
  alamat: string | null;
  keterangan: string | null;
  parent_id: string | null;
}

export interface PesertaProgram {
  id_peserta_program_bmfi_asesmen: number;
  nama_peserta_program_bmfi_asesmen: string | null;
  no_ktp: string | null;
  no_hp: string | null;
  jenis_kelamin: string | null;
  tempat_tanggal_lahir: string | null;
  alamat_rumah: string | null;
  nama_usaha: string | null;
  lokasi_usaha: string | null;
  no_rekening: string | null;
  atas_nama_rekening: string | null;
  nama_bank: string | null;
  keterangan: string | null;
  jumlah_pinjaman: string;
  sisa_dana_pengembalian: string;
  id_pendamping_bmfi_asesmen: number | null;
  parent_id: string | null;
  kordinat_latitude_rumah: string | null;
  kordinat_longitude_rumah: string | null;
  kordinat_latitude_lokasi_usaha: string | null;
  kordinat_longitude_lokasi_usaha: string | null;
  id_provinsi: string | null;
  id_kabupaten_kota: string | null;
}

export interface TransaksiMicrofinance {
  id_bmfi_transaksi_microfinance: number;
  tanggal: string | null;
  nominal_peminjaman: string;
  nominal_pengembalian: string;
  infak_peserta: string;
  keterangan_transaksi: string | null;
  id_bmfi_peserta_program: number | null;
  id_bmfi_pendamping: number | null;
  id_bmfi_jenis_angsuran: number | null;
  id_jalur_akses: string | null;
}

export interface OperasionalKasPenerimaan {
  id_bmfi_bmm_operasional_kas_penerimaan: number;
  tanggal: string | null;
  nominal_masuk: string | null;
  jumlah_donatur: string | null;
  keterangan: string | null;
  id_bmm_label_info_dana_kas_operasional: number | null;
  id_jalur_akses: string | null;
}

export interface OperasionalKasPengeluaran {
  id_bmfi_bmm_operasional_kas_pengeluaran: number;
  tanggal: string | null;
  nominal_keluar: string | null;
  jumlah_penerima_manfaat: string | null;
  keterangan: string | null;
  id_bmm_label_penggunaan_kas_operasional: number | null;
  id_jalur_akses: string | null;
}

export interface PemutihanPenghapusbukuan {
  id_bmfi_pemutihan_penghapusbukuan: number;
  tgl_bmfi_pemutihan_penghapusbukuan: string | null;
  judul: string | null;
  jumlah_nominal_pemutihan_penghapusbukuan: number | null;
  keterangan: string | null;
  status_bmfi_pemutihan_penghapusbukuan: string | null;
  id_bmfi_kategori_pemutihan_penghapusbukuan: number | null;
  peserta_program_bmfi_pemutihan_penghapusbukuan: string | null;
  pendamping_bmfi_pemutihan_penghapusbukuan: string | null;
  id_user: number;
  id_masjid: string | null;
}

export interface BmmLabelInfoDanaKasOperasional {
  id_bmm_label_info_dana_kas_operasional: number;
  nama_bmm_label_info_dana_kas_operasional: string | null;
}

export interface BmmLabelPenggunaanKasOperasional {
  id_bmm_label_penggunaan_kas_operasional: number;
  nama_bmm_label_penggunaan_kas_operasional: string | null;
}

export interface MutasiSummary {
  saldo_tersedia: number;
  dana_di_peserta: number;
  total_saldo_keseluruhan: number;
  total_infak_peserta: number;
}
