import { authApi, setAuthToken } from './api';
import { inferRoleFromUser } from '../types';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
  UpdateProfileResponse,
  ChangePasswordResponse,
} from '../types';

// Role yang benar-benar punya opsi di dropdown login (LoginPage.tsx).
// Admin KUA punya opsi + endpoint sendiri (khusus id_level 13) sehingga
// terpisah dari "Admin BAZNAS". Admin Daerah (11) & Admin Kab (12) TIDAK punya
// opsi login sendiri — keduanya login lewat opsi "Admin BAZNAS", lalu di-infer
// ulang dari response (lihat inferRoleFromUser).
export type LoginableRole = 'admin-masjid' | 'admin-baznas' | 'admin-kua';

// Map role to login endpoint (sesuai kontrak Auth Service 8001)
// Role 'admin-baznas' tetap memanggil endpoint backend /admin-pusat (nama endpoint backend tidak berubah).
const ROLE_ENDPOINT: Record<LoginableRole, string> = {
  'admin-masjid': '/api/v1/login/admin-masjid',
  'admin-baznas': '/api/v1/login/admin-pusat',
  'admin-kua': '/api/v1/login/admin-kua',
};

export const authService = {
  /**
   * Login dengan endpoint sesuai role yang dipilih di tab "Login sebagai".
   * Role final di-infer dari response user (jalur_akses + id_level) karena
   * backend tidak mengirim field `role` — mis. login lewat endpoint umum
   * (/login) oleh admin pusat harus tetap terdeteksi sebagai 'admin-pusat'.
   * Untuk opsi 'admin-kua', backend menolak akun non-KUA (dan sebaliknya
   * opsi 'admin-baznas' menolak akun KUA), jadi pemisahan tetap tegas walau
   * role final tetap di-infer dari id_level.
   */
  login: async (data: LoginRequest, role: LoginableRole) => {
    const endpoint = ROLE_ENDPOINT[role];
    const response = await authApi.post<LoginResponse>(endpoint, data);
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    // Backend tidak mengirim field `role` — infer dari jalur_akses + id_level,
    // fallback ke role tab yang dipilih user.
    const userRole = response.data.user ? inferRoleFromUser(response.data.user) : role;
    return { ...response.data, role: userRole };
  },

  /**
   * Register admin masjid — POST /api/v1/register/user.
   * Flow baru: WAJIB mengisi kode_org_baznas (kode masjid yang keluar setelah
   * pengajuan masjid disetujui Admin BAZNAS). Backend memvalidasi kode tsb
   * terhadap tabel masjid — register ditolak jika masjid belum disetujui.
   * Butuh header x-api-key (sudah diset di authApi).
   * Catatan: backend tidak menerima password, akun baru berpassword default
   * 'menara23' yang bisa diubah lewat Setting Akun.
   */
  register: async (data: RegisterRequest) => {
    const payload: RegisterRequest = {
      id_jalur_akses: data.id_jalur_akses || '',
      nama: data.nama,
      jk: data.jk,
      alamat: data.alamat,
      email: data.email,
      nohp: data.nohp || '',
      kode_org_baznas: data.kode_org_baznas || '',
      id_labels: data.id_labels ?? 1, // 1 = Admin (Admin Masjid di flow baru)
      catatan: data.catatan || '',
    };
    const response = await authApi.post<RegisterResponse>('/api/v1/register/user', payload);
    // Backend register mengembalikan 200 dengan status_code non-"000" untuk error bisnis
    if (response.data.status_code !== '000') {
      throw new Error(response.data.status || 'Pendaftaran gagal');
    }
    return response.data;
  },

  getProfile: async () => {
    // Backend mengembalikan objek user langsung (bukan wrapper { status, data })
    const response = await authApi.get<UserProfile>('/api/v1/me');
    return response.data;
  },

  /** Update data personal akun yang sedang login — PUT /api/v1/profile (FR-3.1).
   * Semua field opsional; backend return profil terbaru (objek user langsung). */
  updateProfile: async (
    data: Partial<Pick<UserProfile, 'nama' | 'email' | 'jk' | 'alamat' | 'nohp' | 'avatar'>>,
  ) => {
    const response = await authApi.put<UpdateProfileResponse>('/api/v1/profile', data);
    return response.data;
  },

  /** Ubah password akun yang sedang login — PUT /api/v1/change-password (FR-3.2).
   * Error bisnis (password lama salah, dsb.) dilempar sebagai Error agar mudah
   * ditampilkan via toast. */
  changePassword: async (password_lama: string, password_baru: string) => {
    const response = await authApi.put<ChangePasswordResponse>('/api/v1/change-password', {
      password_lama,
      password_baru,
    });
    if (response.data.status_code !== '000') {
      throw new Error(response.data.status || 'Gagal mengubah password');
    }
    return response.data;
  },

  logout: async () => {
    try {
      await authApi.post('/api/v1/logout');
    } catch {
      // Ignore logout API errors
    }
    setAuthToken(null);
  },
};
