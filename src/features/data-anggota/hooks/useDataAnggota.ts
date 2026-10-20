import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dataAnggotaApi } from '../api';
import type { Anggota, JenisAnggota } from '../types';

function queryKey(jenis: string, params?: any) {
  return ['data-anggota', jenis, params];
}

export function useDataAnggotaList(jenis: JenisAnggota, params: { page?: number; per_page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKey(jenis, params),
    queryFn: () => dataAnggotaApi.list(jenis, params),
  });
}

export function useCreateAnggota(jenis: JenisAnggota) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Anggota>) => dataAnggotaApi.create(jenis, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`${label(jenis)} berhasil ditambahkan`);
        queryClient.invalidateQueries({ queryKey: queryKey(jenis) });
      } else {
        toast.error(res.message || `Gagal menambahkan ${label(jenis)}`);
      }
    },
    onError: () => {
      toast.error(`Gagal menambahkan ${label(jenis)}. Silakan coba lagi.`);
    },
  });
}

export function useUpdateAnggota(jenis: JenisAnggota) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Anggota> }) =>
      dataAnggotaApi.update(jenis, id, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`${label(jenis)} berhasil diperbarui`);
        queryClient.invalidateQueries({ queryKey: queryKey(jenis) });
      } else {
        toast.error(res.message || `Gagal memperbarui ${label(jenis)}`);
      }
    },
    onError: () => {
      toast.error(`Gagal memperbarui ${label(jenis)}`);
    },
  });
}

export function useDeleteAnggota(jenis: JenisAnggota) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dataAnggotaApi.delete(jenis, id),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`${label(jenis)} berhasil dihapus`);
        queryClient.invalidateQueries({ queryKey: queryKey(jenis) });
      } else {
        toast.error(res.message || `Gagal menghapus ${label(jenis)}`);
      }
    },
    onError: () => {
      toast.error(`Gagal menghapus ${label(jenis)}`);
    },
  });
}

function label(jenis: string): string {
  const map: Record<string, string> = { ustadz: 'Ustadz', marbot: 'Marbot', jamaah: 'Jamaah' };
  return map[jenis] || 'Anggota';
}
