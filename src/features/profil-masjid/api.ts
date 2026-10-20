import { masjidApi, adminApi } from '../../services/api';
import type { MasjidDetail, BankInfo, Medsos } from '../../types';

const API_KEY = 'menara23apikey';
const API_KEY_HEADER = { 'x-api-key': API_KEY };

export const profilMasjidApi = {
  getDetail: async (id: string) => {
    const response = await masjidApi.get<{ status: boolean; data: MasjidDetail }>(
      `/api/v1/masjid/detail/${id}`
    );
    return response.data;
  },

  update: async (id: string, data: Partial<MasjidDetail>) => {
    const response = await adminApi.put<{ status: boolean; data: MasjidDetail; message?: string }>(
      `/api/v1/admin/masjid/update/${id}`,
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  addBank: async (data: { id_masjid: string; nama_bank: string; norek: string; atas_nama: string }) => {
    const response = await adminApi.post<{ status: boolean; data: BankInfo; message?: string }>(
      '/api/v1/admin/masjid/bank/create',
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  deleteBank: async (id: number) => {
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      `/api/v1/admin/masjid/bank/delete/${id}`,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  addMedsos: async (data: { id_masjid: string; name_medsos: string; url_medsos: string }) => {
    const response = await adminApi.post<{ status: boolean; data: Medsos; message?: string }>(
      '/api/v1/admin/masjid/medsos/create',
      data,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },

  deleteMedsos: async (id: number) => {
    const response = await adminApi.delete<{ status: boolean; message?: string }>(
      `/api/v1/admin/masjid/medsos/delete/${id}`,
      { headers: API_KEY_HEADER }
    );
    return response.data;
  },
};
