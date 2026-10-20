import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { publikasiApi } from '../api';
import { PUBLIKASI_LABELS } from '../types';
import type { PublikasiItem, JenisPublikasi } from '../types';

function queryKey(jenis: string, params?: any) {
  return ['publikasi', jenis, params];
}

export function usePublikasiList(jenis: JenisPublikasi, params: { page?: number; per_page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKey(jenis, params),
    queryFn: () => publikasiApi.list(jenis, params),
  });
}

export function useCreatePublikasi(jenis: JenisPublikasi) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PublikasiItem>) => publikasiApi.create(jenis, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`${PUBLIKASI_LABELS[jenis]} berhasil ditambahkan`);
        queryClient.invalidateQueries({ queryKey: ['publikasi', jenis] });
      } else {
        toast.error(res.message || `Gagal menambahkan ${PUBLIKASI_LABELS[jenis]}`);
      }
    },
    onError: () => {
      toast.error(`Gagal menambahkan ${PUBLIKASI_LABELS[jenis]}. Silakan coba lagi.`);
    },
  });
}

export function useUpdatePublikasi(jenis: JenisPublikasi) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PublikasiItem> }) =>
      publikasiApi.update(jenis, id, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`${PUBLIKASI_LABELS[jenis]} berhasil diperbarui`);
        queryClient.invalidateQueries({ queryKey: ['publikasi', jenis] });
      } else {
        toast.error(res.message || `Gagal memperbarui ${PUBLIKASI_LABELS[jenis]}`);
      }
    },
    onError: () => {
      toast.error(`Gagal memperbarui ${PUBLIKASI_LABELS[jenis]}`);
    },
  });
}

export function useDeletePublikasi(jenis: JenisPublikasi) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => publikasiApi.delete(jenis, id),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`${PUBLIKASI_LABELS[jenis]} berhasil dihapus`);
        queryClient.invalidateQueries({ queryKey: ['publikasi', jenis] });
      } else {
        toast.error(res.message || `Gagal menghapus ${PUBLIKASI_LABELS[jenis]}`);
      }
    },
    onError: () => {
      toast.error(`Gagal menghapus ${PUBLIKASI_LABELS[jenis]}`);
    },
  });
}
