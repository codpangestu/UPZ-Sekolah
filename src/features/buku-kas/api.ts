import { transactionApi, adminApi } from '../../services/api';
import type { BukuKasPenerimaan, CommandCenter, MasterDataItem } from './types';

const API_KEY = 'menara23apikey';
const API_KEY_HEADER = { 'x-api-key': API_KEY };

export const bukuKasApi = {
  // ---- Transaksi ----
  list: async (params: { page?: number; per_page?: number; search?: string; id_jenis_dana?: number; id_label_info_dana?: number; start_date?: string; end_date?: string }) => {
    const response = await transactionApi.get<{
      status: boolean;
      data: BukuKasPenerimaan[];
      pagination: { page: number; per_page: number; total: number; total_pages: number };
    }>('/api/v1/bukukas-penerimaan/list', { params });
    return response.data;
  },

  commandCenter: async () => {
    const response = await transactionApi.get<{ status: boolean; data: CommandCenter }>(
      '/api/v1/bukukas-penerimaan/command-center',
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  create: async (data: Partial<BukuKasPenerimaan>) => {
    const response = await adminApi.post<{ status: boolean; data: BukuKasPenerimaan; message?: string }>(
      '/api/v1/admin/transaksi/bukukas-penerimaan/create',
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  update: async (id: number, data: Partial<BukuKasPenerimaan>) => {
    const response = await adminApi.put<{ status: boolean; data: BukuKasPenerimaan; message?: string }>(
      `/api/v1/admin/transaksi/bukukas-penerimaan/update/${id}`,
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      `/api/v1/admin/transaksi/bukukas-penerimaan/delete/${id}`,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  // ---- Master Data untuk dropdown ----
  jenisDana: async () => {
    const response = await adminApi.get<{ status: boolean; data: MasterDataItem[] }>(
      '/api/v1/jenis-dana'
    );
    return response.data;
  },

  jenisHarta: async () => {
    const response = await adminApi.get<{ status: boolean; data: MasterDataItem[] }>(
      '/api/v1/jenis-harta'
    );
    return response.data;
  },

  labelInfoDana: async () => {
    const response = await adminApi.get<{ status: boolean; data: MasterDataItem[] }>(
      '/api/v1/label-info-dana'
    );
    return response.data;
  },
};
