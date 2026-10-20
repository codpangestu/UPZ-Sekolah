// API Response Types

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// Masjid Types
export interface Masjid {
  id_masjid: string;
  nama_masjid: string;
  alamat_masjid: string;
  jenis_masjid?: string;
  id_provinsi?: number | string;
  id_kabupaten_kota?: number | string;
  id_kecamatan?: number;
  id_kelurahan_desa?: number;
  kode_pos?: string;
  nohp_masjid?: string;
  email_masjid?: string;
  latitude?: string;
  longitude?: string;
  status_aktif?: number;
  /** Kode BAZNAS (kode_org_baznas) & slug — ada di response masjid/list */
  kode_org_baznas?: string;
  slug_masjid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MasjidDetail extends Masjid {
  fasilitas?: Fasilitas[];
  bank?: BankInfo[];
  medsos?: Medsos[];
  images?: ImageInfo[];
}

export interface Fasilitas {
  nama_fasilitas: string;
  keterangan?: string;
}

export interface BankInfo {
  id?: number;
  nama_bank: string;
  norek: string;
  atas_nama: string;
}

export interface Medsos {
  id?: number;
  name_medsos: string;
  url_medsos: string;
}

export interface ImageInfo {
  url: string;
  keterangan?: string;
}

// Content Types
export interface ContentItem {
  id: number;
  judul: string;
  slug: string;
  keterangan?: string;
  gambar?: string;
  status_aktif?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Kajian extends ContentItem {
  pemateri?: string;
  video_url?: string;
  tanggal?: string;
}

export interface Acara extends ContentItem {
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  lokasi?: string;
}

export interface Donasi extends ContentItem {
  target_dana?: number;
  dana_terkumpul?: number;
  tanggal_berakhir?: string;
}

// Wilayah Types
// Catatan: response backend wilayah (Masjid Service) memakai kolom `id` (kode BPS),
// bukan `id_provinsi`/`id_kabupaten_kota` — field dengan prefix `id_*` adalah kolom
// FK di tabel entitas lain (masjid, pengajuan), bukan di response wilayah.
export interface Provinsi {
  id: number | string; // kode BPS provinsi (mis. "11")
  nama_provinsi: string;
}

export interface KabupatenKota {
  id: number | string; // kode BPS kab/kota (mis. "1101")
  id_provinsi: number | string;
  nama_kabupaten_kota: string;
}

export interface Kecamatan {
  id: number | string; // kode BPS kecamatan
  id_kabupaten_kota: number | string;
  nama_kecamatan: string;
}

export interface KelurahanDesa {
  id: number | string; // kode BPS kelurahan/desa
  id_kecamatan: number | string;
  nama_kelurahan_desa: string;
}

// Auth Types
// 5 role: Admin Masjid & Admin BAZNAS, + 3 role ber-scope wilayah
// (Admin Daerah=provinsi, Admin Kab=kabupaten/kota, Admin KUA=kecamatan).
// Dropdown login = 3 opsi: Admin Masjid, Admin BAZNAS, Admin KUA.
// Admin KUA kini punya opsi + endpoint sendiri (`/login/admin-kua`, id_level
// 13) dan TIDAK lagi bisa login lewat opsi "Admin BAZNAS" (ditolak backend).
// Admin Daerah (11) & Admin Kab (12) tetap lewat opsi "Admin BAZNAS", lalu
// di-infer dari id_level (lihat `inferRoleFromUser` di bawah).
export type UserRole =
  | 'admin-masjid'
  | 'admin-baznas'
  | 'admin-daerah'
  | 'admin-kab'
  | 'admin-kua';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

/**
 * Profile pengguna — field mengikuti response asli Auth Service (8001).
 * Login umum `/login` mengembalikan id_level + id_labels + nohp,
 * login admin-masjid tanpa nohp, login admin-pusat minimal.
 * `role` tidak pernah dikirim backend — di-infer dari `jalur_akses` + `id_level`.
 */
export interface UserProfile {
  id_user: number;
  nama: string;
  email: string;
  jalur_akses?: string; // 'Masjid' | 'Pusat' | dst.
  id_jalur_akses?: string; // id masjid untuk user masjid
  avatar?: string;
  id_level?: number; // 1=Admin Pusat, 2=Admin Masjid, 3=Petugas, 11=Admin Daerah, 12=Admin Kab, 13=Admin KUA (seed; id 4/5/6 SUDAH dipakai data legacy lain — jangan dipakai ulang)
  id_labels?: number; // 1 = Admin, 2 = Petugas, 3 = Jamaah (seed)
  nohp?: string;
  jk?: string;
  alamat?: string;
  status_aktif?: number;
  // Scope wilayah untuk Admin Daerah (id_provinsi)/Kab (+id_kabupaten_kota)/
  // KUA (+id_kecamatan) — akun Kab/KUA menyimpan hierarki lengkap.
  id_provinsi?: number;
  id_kabupaten_kota?: number;
  id_kecamatan?: number;
  // Backward compat (beberapa kode lama membaca field ini)
  role?: UserRole;
  id_masjid?: string;
  nama_masjid?: string;
  foto_profil?: string;
  level?: string;
}

/**
 * Register User (publik) — `POST /api/v1/register/user`.
 * Catatan: backend TIDAK menerima password; password default 'menara23'.
 * `id_labels` default 3 (Jamaah).
 */
export interface RegisterRequest {
  id_jalur_akses?: string;
  nama: string;
  jk: string;
  alamat: string;
  email: string;
  nohp?: string;
  /** Kode masjid (kode_org_baznas) — WAJIB untuk daftar Admin Masjid. Masjid harus sudah disetujui Admin BAZNAS. */
  kode_org_baznas?: string;
  id_labels?: number;
  catatan?: string;
}

/** Response register backend format kustom: { status_code, status } */
export interface RegisterResponse {
  status_code: string; // '000' = sukses, '403' = email sudah terdaftar, dst.
  status: string;
}

/** Infer role pengguna dari data profile yang dikirim backend (tanpa field role). */
export function inferRoleFromUser(user: Partial<UserProfile> | null | undefined): UserRole {
  if (!user) {
    return 'admin-masjid';
  }
  // Backward compat jika suatu saat backend mengirim field role — tapi tolak
  // nilai lama (mis. 'petugas'/'admin-pusat' dari localStorage sesi lama) agar
  // tidak menghasilkan role invalid yang membuat redirect/guard rusak.
  const KNOWN_ROLES: UserRole[] = [
    'admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua',
  ];
  if (user.role && KNOWN_ROLES.includes(user.role)) {
    return user.role;
  }
  if (user.jalur_akses === 'Pusat') {
    // Role ber-scope wilayah — dibedakan murni dari id_level. Admin KUA punya
    // opsi login terpisah, tapi tetap di-infer di sini supaya session-restore
    // (`GET /me`) dan sesi lama tetap menghasilkan role yang benar.
    // id 11/12/13 mengikuti baris `levels` legacy yang sudah ada di DB
    // (Admin BAZNAS Provinsi/Kabupaten Kota) — JANGAN diubah ke 4/5/6, id itu
    // sudah dipakai data legacy lain (Anggota/Admin Masjid/Admin Monitor Masjid).
    if (user.id_level === 11) return 'admin-daerah';
    if (user.id_level === 12) return 'admin-kab';
    if (user.id_level === 13) return 'admin-kua';
    return 'admin-baznas';
  }
  // Semua akun dengan jalur Masjid (level 2/3) kini dipetakan sebagai Admin Masjid
  if (user.jalur_akses === 'Masjid') {
    return 'admin-masjid';
  }
  return 'admin-masjid';
}

/**
 * Response endpoint users (Auth Service) — format kustom backend:
 * `status_code` "000" = sukses, "101" = api key invalid, "404" = tidak ditemukan.
 */
export interface UpdateUserResponse {
  status_code?: string;
  status?: string;
  message?: string;
  data?: unknown;
}

/**
 * Item user dari `GET /api/v1/users/list` (Auth Service).
 * Sudah join dengan Levels, Labels, dan Masjid (nama_masjid/alamat_masjid).
 */
export interface UserListItem {
  id_user: number;
  nama: string;
  email: string;
  nohp?: string;
  jk?: string;
  kode_org_baznas?: string;
  id_jalur_akses?: string;
  id_level?: number; // 1 = Admin Pusat, 2 = Admin Masjid, 3 = Petugas
  id_labels?: number;
  status_aktif?: number;
  created_at?: string;
  nama_level?: string;
  nama_labels?: string;
  nama_masjid?: string;
  alamat_masjid?: string;
  id_masjid?: string;
}

/** Item minimal daftar masjid untuk dropdown `GET /api/v1/masjid/list`. */
export interface MasjidOption {
  id_masjid: string;
  nama_masjid: string;
  kode_org_baznas?: string;
  jenis_masjid?: string;
  alamat_masjid?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  'admin-masjid': 'Admin Masjid',
  'admin-baznas': 'Admin BAZNAS',
  'admin-daerah': 'Admin Daerah',
  'admin-kab': 'Admin Kab',
  'admin-kua': 'Admin KUA',
};

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  'admin-masjid': '/dashboard',
  'admin-baznas': '/dashboard-baznas',
  'admin-daerah': '/dashboard-daerah',
  'admin-kab': '/dashboard-kab',
  'admin-kua': '/dashboard-kua',
};

export interface SidebarMenuItem {
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: SidebarMenuItem[];
}

// Rekap Types
export interface RekapPenerimaan {
  total: number;
  bulan_ini?: number;
  hari_ini?: number;
  jumlah_transaksi?: number;
}

export interface RekapPengeluaran {
  total: number;
  bulan_ini?: number;
  hari_ini?: number;
  jumlah_transaksi?: number;
}

/** Response `GET /api/v1/rekap/by-masjid/{id_masjid}` — rekap per masjid. */
export interface RekapByMasjid {
  id_masjid: string;
  total_penerimaan?: number;
  total_donatur?: number;
  total_pengeluaran?: number;
  total_penerima_manfaat?: number;
}

/** Satu baris bulanan pada response `GET /api/v1/rekap/bulanan/{id_masjid}` (FR-2.5). */
export interface RekapBulananItem {
  /** 'YYYY-MM' */
  periode: string;
  penerimaan: number;
  pengeluaran: number;
}

/** Response `GET /api/v1/rekap/bulanan/{id_masjid}` — rekap penerimaan vs pengeluaran per bulan. */
export interface RekapBulanan {
  id_masjid: string;
  start_date: string;
  end_date: string;
  bulanan: RekapBulananItem[];
  total_penerimaan: number;
  total_pengeluaran: number;
  saldo: number;
}

/** Response `PUT /api/v1/profile` — return profil terbaru. */
export type UpdateProfileResponse = UserProfile;

/** Response `PUT /api/v1/change-password` — format kustom backend {status_code, status}. */
export interface ChangePasswordResponse {
  status_code: string;
  status: string;
}

// Pengajuan Masjid Types
export type StatusPengajuan = 'pending' | 'disetujui' | 'ditolak';

export interface PengajuanMasjid {
  id: number;
  nama_masjid: string;
  alamat_masjid: string;
  nohp_masjid: string;
  id_provinsi: number;
  id_kabupaten_kota: number;
  nama_provinsi?: string;
  nama_kabupaten_kota?: string;
  keterangan?: string;
  status_pengajuan: StatusPengajuan;
  /** Kode masjid (kode_org_baznas) — diterbitkan langsung saat pengajuan dibuat. */
  kode_org_baznas?: string;
  slug_masjid?: string;
  nama_pemohon?: string;
  email_pemohon?: string;
  jk_pemohon?: string;
  nohp_pemohon?: string;
  alamat_pemohon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PengajuanFormData {
  nama_masjid: string;
  alamat_masjid: string;
  nohp_masjid: string;
  id_provinsi: number;
  id_kabupaten_kota: number;
  id_kecamatan?: number;
  id_kelurahan_desa?: number;
  keterangan: string;
  /** Data admin pemohon (nama & email) — daftar masjid sekaligus admin-nya. */
  nama_pemohon?: string;
  email_pemohon?: string;
}

export interface PengajuanFormState {
  nama_masjid: string;
  alamat_masjid: string;
  nohp_masjid: string;
  id_provinsi: string;
  id_kabupaten_kota: string;
  id_kecamatan: string;
  id_kelurahan_desa: string;
  keterangan: string;
}

export const STATUS_PENGAJUAN_LABEL: Record<StatusPengajuan, string> = {
  'pending': 'Menunggu',
  'disetujui': 'Disetujui',
  'ditolak': 'Ditolak',
};

export const STATUS_PENGAJUAN_COLOR: Record<StatusPengajuan, string> = {
  'pending': 'bg-amber-100 text-amber-700',
  'disetujui': 'bg-emerald-100 text-emerald-700',
  'ditolak': 'bg-red-100 text-red-700',
};
