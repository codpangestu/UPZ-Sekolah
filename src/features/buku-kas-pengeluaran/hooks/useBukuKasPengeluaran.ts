import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bukuKasPengeluaranApi } from '../api';
import type { BukuKasPengeluaran } from '../types';

const QUERY_KEY = 'bukukas-pengeluaran';
const COMMAND_CENTER_KEY = 'bukukas-pengeluaran-command-center';

export function useBukuKasPengeluaranList(params: { page?: number; per_page?: number; search?: string; id_jenis_dana?: number; id_label_info_dana?: number; start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => bukuKasPengeluaranApi.list(params),
  });
}

export function useCommandCenter() {
  return useQuery({
    queryKey: [COMMAND_CENTER_KEY],
    queryFn: () => bukuKasPengeluaranApi.commandCenter(),
  });
}

export function useMasterData() {
  return useQuery({
    queryKey: ['master-data-pengeluaran'],
    queryFn: async () => {
      const [dana, harta, label] = await Promise.all([
        bukuKasPengeluaranApi.jenisDana(),
        bukuKasPengeluaranApi.jenisHarta(),
        bukuKasPengeluaranApi.labelInfoDana(),
      ]);
      return { jenisDana: dana.data || [], jenisHarta: harta.data || [], labelInfoDana: label.data || [] };
    },
  });
}

export function useCreateBukuKasPengeluaran() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BukuKasPengeluaran>) => bukuKasPengeluaranApi.create(data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Transaksi berhasil ditambahkan');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [COMMAND_CENTER_KEY] });
      } else {
        toast.error(res.message || 'Gagal menambahkan transaksi');
      }
    },
    onError: () => {
      toast.error('Gagal menambahkan transaksi. Silakan coba lagi.');
    },
  });
}

export function useUpdateBukuKasPengeluaran() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BukuKasPengeluaran> }) =>
      bukuKasPengeluaranApi.update(id, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Transaksi berhasil diperbarui');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [COMMAND_CENTER_KEY] });
      } else {
        toast.error(res.message || 'Gagal memperbarui transaksi');
      }
    },
    onError: () => {
      toast.error('Gagal memperbarui transaksi');
    },
  });
}

export function useDeleteBukuKasPengeluaran() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bukuKasPengeluaranApi.delete(id),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Transaksi berhasil dihapus');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [COMMAND_CENTER_KEY] });
      } else {
        toast.error(res.message || 'Gagal menghapus transaksi');
      }
    },
    onError: () => {
      toast.error('Gagal menghapus transaksi');
    },
  });
}
