import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dataPengurusApi } from '../api';
import type { Pengurus } from '../types';

const QUERY_KEY = 'data-pengurus';

export function useDataPengurusList(params: { page?: number; per_page?: number; search?: string }) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => dataPengurusApi.list(params),
  });
}

export function useCreatePengurus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Pengurus>) => dataPengurusApi.create(data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Pengurus berhasil ditambahkan');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      } else {
        toast.error(res.message || 'Gagal menambahkan pengurus');
      }
    },
    onError: () => {
      toast.error('Gagal menambahkan pengurus. Silakan coba lagi.');
    },
  });
}

export function useUpdatePengurus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pengurus> }) =>
      dataPengurusApi.update(id, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Pengurus berhasil diperbarui');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      } else {
        toast.error(res.message || 'Gagal memperbarui pengurus');
      }
    },
    onError: () => {
      toast.error('Gagal memperbarui pengurus');
    },
  });
}

export function useDeletePengurus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dataPengurusApi.delete(id),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Pengurus berhasil dihapus');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      } else {
        toast.error(res.message || 'Gagal menghapus pengurus');
      }
    },
    onError: () => {
      toast.error('Gagal menghapus pengurus');
    },
  });
}
