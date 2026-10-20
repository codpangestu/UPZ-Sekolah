import { masjidApi, contentApi } from './api';
import type {
  ApiResponse,
  Masjid,
  MasjidDetail,
  Provinsi,
  KabupatenKota,
  Kecamatan,
  KelurahanDesa,
  RekapPenerimaan,
  RekapPengeluaran,
  RekapByMasjid,
  RekapBulanan,
  PaginatedResponse,
} from '../types';

export const masjidService = {
  // Masjid
  getMasjidList: async (page = 1, perPage = 10) => {
    const response = await masjidApi.get<PaginatedResponse<Masjid>>('/api/v1/masjid/list', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  getMasjidDetail: async (id: string) => {
    const response = await masjidApi.get<ApiResponse<MasjidDetail>>(`/api/v1/masjid/detail/${id}`);
    return response.data;
  },

  getMasjidBySlug: async (slug: string) => {
    // Detail publik masjid ada di CONTENT SERVICE (8003) — route /masjid/{slug}
    // (bukan Masjid Service 8002 yang butuh auth). Lihat CONTEXT.md Fix #48.
    const response = await contentApi.get<ApiResponse<MasjidDetail>>(`/api/v1/masjid/${slug}`);
    return response.data;
  },

  searchMasjid: async (params: {
    nama?: string;
    jenis?: string;
    tipologi?: string;
    id_provinsi?: number;
    id_kabupaten_kota?: number;
    id_kecamatan?: number;
    limit?: number;
  }) => {
    // Pencarian masjid PUBLIK ada di CONTENT SERVICE (8003) — route /masjid/search.
    // Bug pra-eksisting (Fix #48): dulu memanggil masjidApi (8002) yang tidak punya
    // route ini → 404; dan route /masjid/search di 8003 tertangkap /masjid/{slug}.
    const response = await contentApi.get<ApiResponse<Masjid[]>>('/api/v1/masjid/search', {
      params,
    });
    return response.data;
  },

  getMasjidByWilayah: async (idProvinsi: number, page = 1, perPage = 10) => {
    const response = await masjidApi.get<PaginatedResponse<Masjid>>('/api/v1/masjid/by-wilayah', {
      params: { id_provinsi: idProvinsi, page, per_page: perPage },
    });
    return response.data;
  },

  // Wilayah
  getProvinsi: async () => {
    const response = await masjidApi.get<ApiResponse<Provinsi[]>>('/api/v1/provinsi');
    return response.data;
  },

  getKabupatenKota: async (idProvinsi?: number) => {
    const response = await masjidApi.get<ApiResponse<KabupatenKota[]>>('/api/v1/kabupaten-kota', {
      params: idProvinsi ? { id_provinsi: idProvinsi } : undefined,
    });
    return response.data;
  },

  getKecamatan: async (idKabupatenKota?: number) => {
    const response = await masjidApi.get<ApiResponse<Kecamatan[]>>('/api/v1/kecamatan', {
      params: idKabupatenKota ? { id_kabupaten_kota: idKabupatenKota } : undefined,
    });
    return response.data;
  },

  getKelurahanDesa: async (idKecamatan?: number) => {
    const response = await masjidApi.get<ApiResponse<KelurahanDesa[]>>('/api/v1/kelurahan-desa', {
      params: idKecamatan ? { id_kecamatan: idKecamatan } : undefined,
    });
    return response.data;
  },

  // Rekap
  getRekapPenerimaan: async () => {
    const response = await masjidApi.get<ApiResponse<RekapPenerimaan>>('/api/v1/rekap/penerimaan');
    return response.data;
  },

  getRekapPengeluaran: async () => {
    const response = await masjidApi.get<ApiResponse<RekapPengeluaran>>('/api/v1/rekap/pengeluaran');
    return response.data;
  },

  /** Rekap per masjid (untuk dashboard Admin Masjid). */
  getRekapByMasjid: async (idMasjid: string) => {
    const response = await masjidApi.get<ApiResponse<RekapByMasjid>>(`/api/v1/rekap/by-masjid/${idMasjid}`);
    return response.data;
  },

  /** Rekap penerimaan vs pengeluaran per bulan (FR-2.5).
   * Mode: tahun tertentu (12 bulan Jan–Des) ATAU rentang tanggal custom (FR-2.6). */
  getRekapBulananByMasjid: async (
    idMasjid: string,
    opts: { tahun?: number; startDate?: string; endDate?: string } = {},
  ) => {
    const params: Record<string, string | number> = {};
    if (opts.tahun) params.tahun = opts.tahun;
    if (opts.startDate && opts.endDate) {
      params.start_date = opts.startDate;
      params.end_date = opts.endDate;
    }
    const response = await masjidApi.get<ApiResponse<RekapBulanan>>(
      `/api/v1/rekap/bulanan/${idMasjid}`,
      { params },
    );
    return response.data;
  },
};
