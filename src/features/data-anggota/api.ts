import { adminApi } from '../../services/api';
import type { Anggota, AnggotaListItem } from './types';

const API_KEY = 'menara23apikey';
const API_KEY_HEADER = { 'x-api-key': API_KEY };

function endpoints(jenis: string) {
  return {
    list: `/api/v1/data-anggota/${jenis}/list`,
    create: `/api/v1/admin/transaksi/data-anggota/${jenis}/create`,
    update: (id: number) => `/api/v1/admin/transaksi/data-anggota/${jenis}/update/${id}`,
    delete: (id: number) => `/api/v1/admin/transaksi/data-anggota/${jenis}/delete/${id}`,
  };
}

export const dataAnggotaApi = {
  list: async (jenis: string, params: { page?: number; per_page?: number; search?: string }) => {
    const ep = endpoints(jenis);
    const response = await adminApi.get<{
      status: boolean;
      data: AnggotaListItem[];
      pagination: { page: number; per_page: number; total: number; total_pages: number };
    }>(ep.list, { params });
    return response.data;
  },

  create: async (jenis: string, data: Partial<Anggota>) => {
    const ep = endpoints(jenis);
    const response = await adminApi.post<{ status: boolean; data: Anggota; message?: string }>(
      ep.create,
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  update: async (jenis: string, id: number, data: Partial<Anggota>) => {
    const ep = endpoints(jenis);
    const response = await adminApi.put<{ status: boolean; data: Anggota; message?: string }>(
      ep.update(id),
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  delete: async (jenis: string, id: number) => {
    const ep = endpoints(jenis);
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      ep.delete(id),
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },
};
