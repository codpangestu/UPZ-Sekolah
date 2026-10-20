import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { microfinanceApi } from '../api';
import type { MicrofinanceTipe } from '../api';

const isSuccess = (statusCode: string) => statusCode === '000';

export function useMicrofinanceList<T>(tipe: MicrofinanceTipe, idMasjid: string | undefined) {
  return useQuery({
    queryKey: ['microfinance', tipe, idMasjid],
    queryFn: () => microfinanceApi.list<T>(tipe, { id_masjid: idMasjid, per_page: 100 }),
    enabled: !!idMasjid,
  });
}

export function useMutasiSummary(idMasjid: string | undefined) {
  return useQuery({
    queryKey: ['microfinance-mutasi-summary', idMasjid],
    queryFn: () => microfinanceApi.mutasiSummary(idMasjid as string),
    enabled: !!idMasjid,
  });
}

export function useKategoriPengesahan() {
  return useQuery({
    queryKey: ['bmfi-kategori-pengesahan'],
    queryFn: () => microfinanceApi.kategoriPengesahan(),
  });
}

export function useJenisAngsuran() {
  return useQuery({
    queryKey: ['bmfi-jenis-angsuran'],
    queryFn: () => microfinanceApi.jenisAngsuran(),
  });
}

export function useLabelInfoDanaKasOperasional() {
  return useQuery({
    queryKey: ['bmm-label-info-dana-kas-operasional'],
    queryFn: () => microfinanceApi.labelInfoDanaKasOperasional(),
  });
}

export function useLabelPenggunaanKasOperasional() {
  return useQuery({
    queryKey: ['bmm-label-penggunaan-kas-operasional'],
    queryFn: () => microfinanceApi.labelPenggunaanKasOperasional(),
  });
}

export function useKategoriPemutihan() {
  return useQuery({
    queryKey: ['bmfi-kategori-pemutihan'],
    queryFn: () => microfinanceApi.kategoriPemutihan(),
  });
}

export function useCreateMicrofinance(tipe: MicrofinanceTipe, successMessage = 'Data berhasil ditambahkan') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => microfinanceApi.create(tipe, data),
    onSuccess: (res) => {
      if (isSuccess(res.status_code)) {
        toast.success(successMessage);
        queryClient.invalidateQueries({ queryKey: ['microfinance', tipe] });
        queryClient.invalidateQueries({ queryKey: ['microfinance-mutasi-summary'] });
        // Transaksi (pencairan/pengembalian) juga mengubah sisa_dana_pengembalian
        // peserta & nominal_saldo_microfinance masjid di backend (side effect) —
        // invalidate keduanya juga supaya tabel Peserta Program & Saldo ikut refresh.
        if (tipe === 'transaksi') {
          queryClient.invalidateQueries({ queryKey: ['microfinance', 'peserta-program'] });
          queryClient.invalidateQueries({ queryKey: ['microfinance', 'saldo'] });
        }
      } else {
        toast.error(res.status || 'Gagal menambahkan data');
      }
    },
    onError: () => toast.error('Gagal menambahkan data. Silakan coba lagi.'),
  });
}

export function useUpdateMicrofinance(tipe: MicrofinanceTipe, successMessage = 'Data berhasil diperbarui') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, any> }) => microfinanceApi.update(tipe, id, data),
    onSuccess: (res) => {
      if (isSuccess(res.status_code)) {
        toast.success(successMessage);
        queryClient.invalidateQueries({ queryKey: ['microfinance', tipe] });
        queryClient.invalidateQueries({ queryKey: ['microfinance-mutasi-summary'] });
      } else {
        toast.error(res.status || 'Gagal memperbarui data');
      }
    },
    onError: () => toast.error('Gagal memperbarui data.'),
  });
}

export function useDeleteMicrofinance(tipe: MicrofinanceTipe, successMessage = 'Data berhasil dihapus') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => microfinanceApi.delete(tipe, id),
    onSuccess: (res) => {
      if (isSuccess(res.status_code)) {
        toast.success(successMessage);
        queryClient.invalidateQueries({ queryKey: ['microfinance', tipe] });
        queryClient.invalidateQueries({ queryKey: ['microfinance-mutasi-summary'] });
      } else {
        toast.error(res.status || 'Gagal menghapus data');
      }
    },
    onError: () => toast.error('Gagal menghapus data.'),
  });
}
