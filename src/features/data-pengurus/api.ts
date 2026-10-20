import { adminApi } from '../../services/api';
import type { Pengurus } from './types';

const API_KEY = 'menara23apikey';
const API_KEY_HEADER = { 'x-api-key': API_KEY };

export const dataPengurusApi = {
  list: async (params: { page?: number; per_page?: number; search?: string }) => {
    const response = await adminApi.get<{
      status: boolean;
      data: Pengurus[];
      pagination: { page: number; per_page: number; total: number; total_pages: number };
    }>('/api/v1/data-pengurus/list', { params });
    return response.data;
  },

  create: async (data: Partial<Pengurus>) => {
    const response = await adminApi.post<{ status: boolean; data: Pengurus; message?: string }>(
      '/api/v1/admin/transaksi/data-pengurus/create',
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  update: async (id: number, data: Partial<Pengurus>) => {
    const response = await adminApi.put<{ status: boolean; data: Pengurus; message?: string }>(
      `/api/v1/admin/transaksi/data-pengurus/update/${id}`,
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      `/api/v1/admin/transaksi/data-pengurus/delete/${id}`,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },
};
