import { adminApi, masjidApi, authApi } from './api';
import type {
  ApiResponse,
  PengajuanMasjid,
  PengajuanFormData,
  PaginatedResponse,
  UserListItem,
  MasjidOption,
  UpdateUserResponse,
  StatusPengajuan,
} from '../types';

export const adminService = {
  // Kelola Pengguna (Auth Service 8001) — Admin Pusat
  getUsersList: async () => {
    const response = await authApi.get<ApiResponse<UserListItem[]>>('/api/v1/users/list');
    return response.data;
  },

  /** Update user — catatan: backend menerima param lewat query string, bukan body. */
  updateUser: async (
    idUser: number,
    data: {
      id_level?: number;
      id_jalur_akses?: string;
      status_aktif?: number;
      kode_org_baznas?: string;
      // Scope wilayah untuk promosi ke Admin Daerah/Kab/KUA (lihat CONTEXT.md)
      id_provinsi?: number;
      id_kabupaten_kota?: number;
      id_kecamatan?: number;
    }
  ) => {
    const response = await authApi.put<UpdateUserResponse>(
      `/api/v1/users/update/${idUser}`,
      null,
      { params: data }
    );
    return response.data;
  },

  // Daftar masjid untuk dropdown promosi admin masjid (Masjid Service 8002)
  getMasjidOptions: async () => {
    const response = await masjidApi.get<ApiResponse<MasjidOption[]>>('/api/v1/masjid/list', {
      params: { page: 1, per_page: 100 },
    });
    return response.data;
  },

  // Pengajuan Masjid (langkah 1) — status default 'pending' agar konsisten dengan key
  // frontend. Backend menerbitkan kode masjid + slug LANGSUNG saat pengajuan dibuat
  // (dikembalikan di `data`), dipakai pemohon untuk lanjut ke langkah 2 (daftar admin).
  submitPengajuan: async (data: PengajuanFormData) => {
    const response = await adminApi.post<ApiResponse<PengajuanMasjid & { kode_org_baznas?: string; slug_masjid?: string }>>(
      '/api/v1/admin/pengajuan/create',
      { ...data, status_pengajuan: 'pending' }
    );
    return response.data;
  },

  /**
   * Langkah 2 — simpan data admin pemohon ke pengajuan yang sama
   * (tanpa mengubah status). Backend menyimpan nama/email/jk/nohp/alamat pemohon
   * di pengajuan; saat Admin BAZNAS menyetujui, masjid + akun admin dibuat sekaligus.
   */
  updatePengajuanAdmin: async (
    id: number,
    data: {
      nama_pemohon: string;
      email_pemohon: string;
      jk_pemohon: string;
      nohp_pemohon: string;
      alamat_pemohon: string;
    }
  ) => {
    const response = await adminApi.put<ApiResponse<null>>(
      `/api/v1/admin/pengajuan/update/${id}`,
      data
    );
    return response.data;
  },

  /** Normalisasi status pengajuan dari backend ('Menunggu'/'Disetujui'/'Ditolak') ke key frontend. */
  normalizePengajuanStatus: (raw?: string): StatusPengajuan => {
    const map: Record<string, StatusPengajuan> = {
      'pending': 'pending',
      'menunggu': 'pending',
      'disetujui': 'disetujui',
      'ditolak': 'ditolak',
    };
    return map[(raw || '').toLowerCase()] ?? 'pending';
  },

  getPengajuanList: async (page = 1, perPage = 10) => {
    const response = await adminApi.get<PaginatedResponse<PengajuanMasjid>>(
      '/api/v1/admin/pengajuan/list',
      { params: { page, per_page: perPage } }
    );
    return response.data;
  },

  /**
   * Update status pengajuan. Saat disetujui, backend menerbitkan kode masjid
   * (kode_org_baznas) yang dikembalikan di `data` — dipakai untuk memberi tahu
   * pemohon agar bisa mendaftar sebagai Admin Masjid.
   */
  updatePengajuan: async (id: number, data: { status_pengajuan: string; keterangan?: string }) => {
    const response = await adminApi.put<ApiResponse<PengajuanMasjid & { kode_org_baznas?: string }>>(
      `/api/v1/admin/pengajuan/update/${id}`,
      data
    );
    return response.data;
  },

  deletePengajuan: async (id: number) => {
    const response = await adminApi.delete<ApiResponse<null>>(
      `/api/v1/admin/pengajuan/delete/${id}`
    );
    return response.data;
  },

  // Wilayah — using masjidApi (Masjid Service port 8002) per PRD section 11.2
  getProvinsi: async () => {
    const response = await masjidApi.get<ApiResponse<any[]>>('/api/v1/provinsi');
    return response.data;
  },

  getKabupatenKota: async (idProvinsi: number) => {
    const response = await masjidApi.get<ApiResponse<any[]>>('/api/v1/kabupaten-kota', {
      params: { id_provinsi: idProvinsi },
    });
    return response.data;
  },

  getKecamatan: async (idKabupatenKota: number) => {
    const response = await masjidApi.get<ApiResponse<any[]>>('/api/v1/kecamatan', {
      params: { id_kabupaten_kota: idKabupatenKota },
    });
    return response.data;
  },

  getKelurahanDesa: async (idKecamatan: number) => {
    const response = await masjidApi.get<ApiResponse<any[]>>('/api/v1/kelurahan-desa', {
      params: { id_kecamatan: idKecamatan },
    });
    return response.data;
  },
};
