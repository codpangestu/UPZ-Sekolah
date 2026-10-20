import { adminApi, transactionApi } from '../../services/api';
import type { MasterDataItem, MutasiSummary } from './types';

export type MicrofinanceTipe =
  | 'sejarah-profil'
  | 'saldo'
  | 'pilihan-skema-pinjaman'
  | 'pendamping'
  | 'peserta-program'
  | 'transaksi'
  | 'skoring-asesmen'
  | 'operasional-kas-penerimaan'
  | 'operasional-kas-pengeluaran'
  | 'pemutihan';

interface ApiEnvelope<T> {
  status_code: string;
  status: string;
  message?: string | null;
  data: T;
  total?: number;
  page?: number;
  per_page?: number;
}

export const microfinanceApi = {
  list: async <T>(tipe: MicrofinanceTipe, params: { id_masjid?: string; page?: number; per_page?: number }) => {
    const response = await transactionApi.get<ApiEnvelope<T[]>>(`/api/v1/microfinance/${tipe}/list`, { params });
    return response.data;
  },

  mutasiSummary: async (id_masjid: string) => {
    const response = await transactionApi.get<ApiEnvelope<MutasiSummary>>('/api/v1/microfinance/mutasi/summary', {
      params: { id_masjid },
    });
    return response.data;
  },

  create: async <T = any>(tipe: MicrofinanceTipe, data: Record<string, any>) => {
    const response = await adminApi.post<ApiEnvelope<T>>(`/api/v1/admin/microfinance/${tipe}/create`, data);
    return response.data;
  },

  update: async (tipe: MicrofinanceTipe, id: number, data: Record<string, any>) => {
    const response = await adminApi.put<ApiEnvelope<null>>(`/api/v1/admin/microfinance/${tipe}/update/${id}`, data);
    return response.data;
  },

  delete: async (tipe: MicrofinanceTipe, id: number) => {
    const response = await adminApi.delete<ApiEnvelope<null>>(`/api/v1/admin/microfinance/${tipe}/delete/${id}`);
    return response.data;
  },

  // ---- Master data untuk dropdown ----
  kategoriPengesahan: async () => {
    const response = await adminApi.get<ApiEnvelope<MasterDataItem[]>>('/api/v1/bmfi-kategori-pengesahan-microfinance');
    return response.data;
  },
  jenisAngsuran: async () => {
    const response = await adminApi.get<ApiEnvelope<MasterDataItem[]>>('/api/v1/bmfi-jenis-angsuran');
    return response.data;
  },
  labelInfoDanaKasOperasional: async () => {
    const response = await adminApi.get<ApiEnvelope<MasterDataItem[]>>('/api/v1/bmm-label-info-dana-kas-operasional');
    return response.data;
  },
  labelPenggunaanKasOperasional: async () => {
    const response = await adminApi.get<ApiEnvelope<MasterDataItem[]>>('/api/v1/bmm-label-penggunaan-kas-operasional');
    return response.data;
  },
  kategoriPemutihan: async () => {
    const response = await adminApi.get<ApiEnvelope<MasterDataItem[]>>('/api/v1/bmfi-kategori-pemutihan-penghapusbukuan');
    return response.data;
  },
};
