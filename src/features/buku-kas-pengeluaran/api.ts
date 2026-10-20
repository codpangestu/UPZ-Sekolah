import { transactionApi, adminApi } from '../../services/api';
import type { BukuKasPengeluaran, CommandCenter, MasterDataItem } from './types';

const API_KEY = 'menara23apikey';
const API_KEY_HEADER = { 'x-api-key': API_KEY };

export const bukuKasPengeluaranApi = {
  // ---- Transaksi ----
  list: async (params: { page?: number; per_page?: number; search?: string; id_jenis_dana?: number; id_label_info_dana?: number; start_date?: string; end_date?: string }) => {
    const response = await transactionApi.get<{
      status: boolean;
      data: BukuKasPengeluaran[];
      pagination: { page: number; per_page: number; total: number; total_pages: number };
    }>('/api/v1/bukukas-pengeluaran/list', { params });
    return response.data;
  },

  commandCenter: async () => {
    const response = await transactionApi.get<{ status: boolean; data: CommandCenter }>(
      '/api/v1/bukukas-pengeluaran/command-center',
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  create: async (data: Partial<BukuKasPengeluaran>) => {
    const response = await adminApi.post<{ status: boolean; data: BukuKasPengeluaran; message?: string }>(
      '/api/v1/admin/transaksi/bukukas-pengeluaran/create',
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  update: async (id: number, data: Partial<BukuKasPengeluaran>) => {
    const response = await adminApi.put<{ status: boolean; data: BukuKasPengeluaran; message?: string }>(
      `/api/v1/admin/transaksi/bukukas-pengeluaran/update/${id}`,
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      `/api/v1/admin/transaksi/bukukas-pengeluaran/delete/${id}`,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  // ---- Master Data untuk dropdown (shared dengan penerimaan) ----
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
