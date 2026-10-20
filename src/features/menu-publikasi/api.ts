import { adminApi, contentApi } from '../../services/api';
import type { PublikasiItem } from './types';

const API_KEY = 'menara23apikey';
const API_KEY_HEADER = { 'x-api-key': API_KEY };

function endpoints(jenis: string) {
  return {
    list: `/api/v1/publikasi/${jenis}/list`,
    create: `/api/v1/admin/publikasi/${jenis}/create`,
    update: (id: number) => `/api/v1/admin/publikasi/${jenis}/update/${id}`,
    delete: (id: number) => `/api/v1/admin/publikasi/${jenis}/delete/${id}`,
  };
}

export const publikasiApi = {
  list: async (jenis: string, params: { page?: number; per_page?: number; search?: string }) => {
    const ep = endpoints(jenis);
    const response = await adminApi.get<{
      status: boolean;
      data: PublikasiItem[];
      pagination: { page: number; per_page: number; total: number; total_pages: number };
    }>(ep.list, { params });
    return response.data;
  },

  create: async (jenis: string, data: Partial<PublikasiItem>) => {
    const ep = endpoints(jenis);
    const response = await adminApi.post<{ status: boolean; data: PublikasiItem; message?: string }>(
      ep.create, data, { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  update: async (jenis: string, id: number, data: Partial<PublikasiItem>) => {
    const ep = endpoints(jenis);
    const response = await adminApi.put<{ status: boolean; data: PublikasiItem; message?: string }>(
      ep.update(id), data, { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  delete: async (jenis: string, id: number) => {
    const ep = endpoints(jenis);
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      ep.delete(id), { headers: API_KEY_HEADER }
    );
    return response.data;
  },
};
