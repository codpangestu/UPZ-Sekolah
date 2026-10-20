import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { kegiatanApi } from '../api';
import type { Kegiatan, KegiatanFormData } from '../types';

const QUERY_KEY = 'kegiatan-masjid';

export function useKegiatanList() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const res = await kegiatanApi.list();
      return res.data.data;
    },
  });
}

export function useCreateKegiatan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: KegiatanFormData) => kegiatanApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Kegiatan berhasil ditambahkan');
    },
    onError: () => toast.error('Gagal menambahkan kegiatan'),
  });
}

export function useUpdateKegiatan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: KegiatanFormData }) => kegiatanApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Kegiatan berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui kegiatan'),
  });
}

export function useDeleteKegiatan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => kegiatanApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Kegiatan berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus kegiatan'),
  });
}
