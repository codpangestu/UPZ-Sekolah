import { contentApi } from './api';
import type {
  ApiResponse,
  ContentItem,
  Kajian,
  Acara,
  Donasi,
} from '../types';

export const contentService = {
  // ===== Publikasi publik (kajian/acara/cerita/donasi — Fix #48) =====
  getAcara: async (params: { judul?: string; page?: number; per_page?: number } = {}) => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/acara', { params });
    return response.data;
  },

  getCerita: async (params: { judul?: string; page?: number; per_page?: number } = {}) => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/cerita', { params });
    return response.data;
  },

  getDonasi: async (params: { judul?: string; page?: number; per_page?: number } = {}) => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/donasi', { params });
    return response.data;
  },
  // Home
  getHome: async () => {
    const response = await contentApi.get<ApiResponse<any>>('/api/v1/home');
    return response.data;
  },

  // Informasi
  getInformasi: async () => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/informasi');
    return response.data;
  },

  getInformasiBySlug: async (slug: string) => {
    const response = await contentApi.get<ApiResponse<ContentItem>>(`/api/v1/informasi/${slug}`);
    return response.data;
  },

  // Kajian
  getKajian: async () => {
    const response = await contentApi.get<ApiResponse<Kajian[]>>('/api/v1/kajian');
    return response.data;
  },

  getKajianBySlug: async (slug: string) => {
    const response = await contentApi.get<ApiResponse<Kajian>>(`/api/v1/kajian/${slug}`);
    return response.data;
  },

  // Acara/Cerita/Donasi versi lama (tanpa params) dihapus — diganti versi
  // dengan params di atas file (Fix #48; dulu memanggil route yang belum ada)

  getAcaraBySlug: async (slug: string) => {
    const response = await contentApi.get<ApiResponse<Acara>>(`/api/v1/acara/${slug}`);
    return response.data;
  },

  getDonasiBySlug: async (slug: string) => {
    const response = await contentApi.get<ApiResponse<Donasi>>(`/api/v1/donasi/${slug}`);
    return response.data;
  },

  // Postingan
  getPostingan: async () => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/postingan');
    return response.data;
  },

  // Inspirasi
  getInspirasi: async () => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/inspirasi');
    return response.data;
  },

  // Info Ayat
  getInfoAyat: async () => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/infoayat');
    return response.data;
  },

  // Info Doa
  getInfoDoa: async () => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/infodoa');
    return response.data;
  },

  // Pengumuman
  getPengumuman: async () => {
    const response = await contentApi.get<ApiResponse<ContentItem[]>>('/api/v1/pengumuman');
    return response.data;
  },
};
