import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { asetApi } from '../api';
import type { AsetFormData } from '../types';

const QUERY_KEY = 'buku-aset';

export function useAsetList() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const res = await asetApi.list();
      return res.data.data;
    },
  });
}

export function useCreateAset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AsetFormData) => asetApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Aset berhasil ditambahkan'); },
    onError: () => toast.error('Gagal menambahkan aset'),
  });
}

export function useUpdateAset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AsetFormData }) => asetApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Aset berhasil diperbarui'); },
    onError: () => toast.error('Gagal memperbarui aset'),
  });
}

export function useDeleteAset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asetApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Aset berhasil dihapus'); },
    onError: () => toast.error('Gagal menghapus aset'),
  });
}
