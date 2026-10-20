import { adminApi } from '../../services/api';
import type { Kegiatan, KegiatanFormData } from './types';

export const kegiatanApi = {
  list: () => adminApi.get<{ status: boolean; data: Kegiatan[] }>('/api/v1/admin/kegiatan/list'),
  create: (data: KegiatanFormData) => adminApi.post('/api/v1/admin/kegiatan/create', data),
  update: (id: number, data: KegiatanFormData) => adminApi.put(`/api/v1/admin/kegiatan/update/${id}`, data),
  delete: (id: number) => adminApi.delete(`/api/v1/admin/kegiatan/delete/${id}`),
};
