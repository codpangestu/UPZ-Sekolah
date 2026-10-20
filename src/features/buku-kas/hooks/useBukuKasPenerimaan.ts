import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bukuKasApi } from '../api';
import type { BukuKasPenerimaan } from '../types';

const QUERY_KEY = 'bukukas-penerimaan';
const COMMAND_CENTER_KEY = 'bukukas-command-center';

export function useBukuKasPenerimaanList(params: { page?: number; per_page?: number; search?: string; id_jenis_dana?: number; id_label_info_dana?: number; start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => bukuKasApi.list(params),
  });
}

export function useCommandCenter() {
  return useQuery({
    queryKey: [COMMAND_CENTER_KEY],
    queryFn: () => bukuKasApi.commandCenter(),
  });
}

export function useMasterData() {
  return useQuery({
    queryKey: ['master-data'],
    queryFn: async () => {
      const [dana, harta, label] = await Promise.all([
        bukuKasApi.jenisDana(),
        bukuKasApi.jenisHarta(),
        bukuKasApi.labelInfoDana(),
      ]);
      return { jenisDana: dana.data || [], jenisHarta: harta.data || [], labelInfoDana: label.data || [] };
    },
  });
}

export function useCreateBukuKasPenerimaan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BukuKasPenerimaan>) => bukuKasApi.create(data),
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

export function useUpdateBukuKasPenerimaan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BukuKasPenerimaan> }) =>
      bukuKasApi.update(id, data),
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

export function useDeleteBukuKasPenerimaan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bukuKasApi.delete(id),
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
