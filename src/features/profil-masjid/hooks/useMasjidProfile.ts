import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profilMasjidApi } from '../api';

const PROFILE_KEY = 'profil-masjid';

export function useMasjidProfile(id: string | undefined) {
  return useQuery({
    queryKey: [PROFILE_KEY, id],
    queryFn: () => profilMasjidApi.getDetail(id!),
    enabled: !!id,
  });
}

export function useUpdateMasjidProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      profilMasjidApi.update(id, data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Profil masjid berhasil diperbarui');
        queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
      } else {
        toast.error(res.message || 'Gagal memperbarui profil masjid');
      }
    },
    onError: () => {
      toast.error('Gagal memperbarui profil masjid. Silakan coba lagi.');
    },
  });
}

export function useAddBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id_masjid: string; nama_bank: string; norek: string; atas_nama: string }) =>
      profilMasjidApi.addBank(data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Rekening bank berhasil ditambahkan');
        queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
      } else {
        toast.error(res.message || 'Gagal menambahkan rekening bank');
      }
    },
    onError: () => {
      toast.error('Gagal menambahkan rekening bank');
    },
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => profilMasjidApi.deleteBank(id),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Rekening bank berhasil dihapus');
        queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
      } else {
        toast.error(res.message || 'Gagal menghapus rekening bank');
      }
    },
    onError: () => {
      toast.error('Gagal menghapus rekening bank');
    },
  });
}

export function useAddMedsos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id_masjid: string; name_medsos: string; url_medsos: string }) =>
      profilMasjidApi.addMedsos(data),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Media sosial berhasil ditambahkan');
        queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
      } else {
        toast.error(res.message || 'Gagal menambahkan media sosial');
      }
    },
    onError: () => {
      toast.error('Gagal menambahkan media sosial');
    },
  });
}

export function useDeleteMedsos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => profilMasjidApi.deleteMedsos(id),
    onSuccess: (res) => {
      if (res.status) {
        toast.success('Media sosial berhasil dihapus');
        queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
      } else {
        toast.error(res.message || 'Gagal menghapus media sosial');
      }
    },
    onError: () => {
      toast.error('Gagal menghapus media sosial');
    },
  });
}
