import { adminApi } from '../../services/api';
import type { Aset, AsetFormData } from './types';

export const asetApi = {
  list: () => adminApi.get<{ status: boolean; data: Aset[] }>('/api/v1/admin/aset/list'),
  create: (data: AsetFormData) => adminApi.post('/api/v1/admin/aset/create', data),
  update: (id: number, data: AsetFormData) => adminApi.put(`/api/v1/admin/aset/update/${id}`, data),
  delete: (id: number) => adminApi.delete(`/api/v1/admin/aset/delete/${id}`),
};
