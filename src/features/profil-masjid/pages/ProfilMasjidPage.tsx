import { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Landmark,
  Share2,
  Save,
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Banknote,
  Camera,
  Video,
  Globe,
  MessageCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { masjidService } from '../../../services/masjidService';
import {
  useMasjidProfile,
  useUpdateMasjidProfile,
  useAddBank,
  useDeleteBank,
  useAddMedsos,
  useDeleteMedsos,
} from '../hooks/useMasjidProfile';
import type { Provinsi, KabupatenKota, Kecamatan, KelurahanDesa } from '../../../types';

const JENIS_MASJID_OPTIONS = ['Masjid', 'Musholla', 'Langgar', 'Surau'];

const MEDSOS_ICONS: Record<string, typeof Camera> = {
  Instagram: Camera,
  Youtube: Video,
  Facebook: Globe,
  Twitter: MessageCircle,
};

interface BankForm {
  nama_bank: string;
  norek: string;
  atas_nama: string;
}

interface MedsosForm {
  name_medsos: string;
  url_medsos: string;
}

const initialBankForm: BankForm = { nama_bank: '', norek: '', atas_nama: '' };
const initialMedsosForm: MedsosForm = { name_medsos: '', url_medsos: '' };

export default function ProfilMasjidPage() {
  const { user } = useAuthStore();
  // ID masjid dikirim backend sebagai `id_jalur_akses` (bukan `id_masjid`)
  const idMasjid = user?.id_jalur_akses || user?.id_masjid;

  const { data: profileData, isLoading, isError, refetch } = useMasjidProfile(idMasjid);
  const updateMutation = useUpdateMasjidProfile();
  const addBankMutation = useAddBank();
  const deleteBankMutation = useDeleteBank();
  const addMedsosMutation = useAddMedsos();
  const deleteMedsosMutation = useDeleteMedsos();

  const masjid = profileData?.data;

  // Form state
  const [form, setForm] = useState({
    nama_masjid: '',
    alamat_masjid: '',
    jenis_masjid: '',
    kode_pos: '',
    nohp_masjid: '',
    email_masjid: '',
    latitude: '',
    longitude: '',
    id_provinsi: '',
    id_kabupaten_kota: '',
    id_kecamatan: '',
    id_kelurahan_desa: '',
  });

  // Wilayah cascading
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [kabkotList, setKabkotList] = useState<KabupatenKota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kelurahanList, setKelurahanDesaList] = useState<KelurahanDesa[]>([]);
  const [loadingWilayah, setLoadingWilayah] = useState(true);

  // Bank & Medsos forms
  const [bankForm, setBankForm] = useState<BankForm>(initialBankForm);
  const [medsosForm, setMedsosForm] = useState<MedsosForm>(initialMedsosForm);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showMedsosForm, setShowMedsosForm] = useState(false);

  // Populate form from loaded data
  useEffect(() => {
    if (masjid) {
      setForm({
        nama_masjid: masjid.nama_masjid || '',
        alamat_masjid: masjid.alamat_masjid || '',
        jenis_masjid: masjid.jenis_masjid || '',
        kode_pos: masjid.kode_pos || '',
        nohp_masjid: masjid.nohp_masjid || '',
        email_masjid: masjid.email_masjid || '',
        latitude: masjid.latitude || '',
        longitude: masjid.longitude || '',
        id_provinsi: masjid.id_provinsi ? String(masjid.id_provinsi) : '',
        id_kabupaten_kota: masjid.id_kabupaten_kota ? String(masjid.id_kabupaten_kota) : '',
        id_kecamatan: masjid.id_kecamatan ? String(masjid.id_kecamatan) : '',
        id_kelurahan_desa: masjid.id_kelurahan_desa ? String(masjid.id_kelurahan_desa) : '',
      });
    }
  }, [masjid]);

  // Load provinsi
  useEffect(() => {
    const load = async () => {
      try {
        const res = await masjidService.getProvinsi();
        if (res.status && Array.isArray(res.data)) setProvinsiList(res.data);
      } catch { /* silent */ }
      finally { setLoadingWilayah(false); }
    };
    load();
  }, []);

  // Load kabkot when provinsi changes
  useEffect(() => {
    if (!form.id_provinsi) { setKabkotList([]); return; }
    masjidService.getKabupatenKota(Number(form.id_provinsi)).then((res) => {
      if (res.status && Array.isArray(res.data)) setKabkotList(res.data);
    });
  }, [form.id_provinsi]);

  // Load kecamatan when kabkot changes
  useEffect(() => {
    if (!form.id_kabupaten_kota) { setKecamatanList([]); return; }
    masjidService.getKecamatan(Number(form.id_kabupaten_kota)).then((res) => {
      if (res.status && Array.isArray(res.data)) setKecamatanList(res.data);
    });
  }, [form.id_kabupaten_kota]);

  // Load kelurahan when kecamatan changes
  useEffect(() => {
    if (!form.id_kecamatan) { setKelurahanDesaList([]); return; }
    masjidService.getKelurahanDesa(Number(form.id_kecamatan)).then((res) => {
      if (res.status && Array.isArray(res.data)) setKelurahanDesaList(res.data);
    });
  }, [form.id_kecamatan]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!idMasjid) return;
    if (!form.nama_masjid.trim()) {
      alert('Nama masjid wajib diisi');
      return;
    }
    const payload = {
      nama_masjid: form.nama_masjid,
      alamat_masjid: form.alamat_masjid,
      jenis_masjid: form.jenis_masjid || undefined,
      kode_pos: form.kode_pos || undefined,
      nohp_masjid: form.nohp_masjid || undefined,
      email_masjid: form.email_masjid || undefined,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
      id_provinsi: form.id_provinsi ? Number(form.id_provinsi) : undefined,
      id_kabupaten_kota: form.id_kabupaten_kota ? Number(form.id_kabupaten_kota) : undefined,
      id_kecamatan: form.id_kecamatan ? Number(form.id_kecamatan) : undefined,
      id_kelurahan_desa: form.id_kelurahan_desa ? Number(form.id_kelurahan_desa) : undefined,
    };
    await updateMutation.mutateAsync({ id: idMasjid, data: payload });
  };

  const handleAddBank = async () => {
    if (!idMasjid || !bankForm.nama_bank || !bankForm.norek || !bankForm.atas_nama) return;
    await addBankMutation.mutateAsync({ id_masjid: idMasjid, ...bankForm });
    setBankForm(initialBankForm);
    setShowBankForm(false);
  };

  const handleDeleteBank = async (id: number) => {
    if (confirm('Hapus rekening bank ini?')) {
      await deleteBankMutation.mutateAsync(id);
    }
  };

  const handleAddMedsos = async () => {
    if (!idMasjid || !medsosForm.name_medsos || !medsosForm.url_medsos) return;
    await addMedsosMutation.mutateAsync({ id_masjid: idMasjid, ...medsosForm });
    setMedsosForm(initialMedsosForm);
    setShowMedsosForm(false);
  };

  const handleDeleteMedsos = async (id: number) => {
    if (confirm('Hapus media sosial ini?')) {
      await deleteMedsosMutation.mutateAsync(id);
    }
  };

  const isSaving = updateMutation.isPending;

  // Tidak ada id masjid (mis. role Admin BAZNAS yang tidak terikat satu masjid)
  if (!idMasjid) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Building2 size={32} className="text-[#B0B0B0]" />
        <p className="text-sm text-text-gray">
          Halaman profil masjid hanya tersedia untuk Admin Masjid.
        </p>
        <p className="text-xs text-[#B0B0B0]">
          Login dengan akun Admin Masjid untuk mengelola profil masjid Anda.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-[#28A71A]" />
        <span className="ml-3 text-sm text-text-gray">Memuat profil masjid...</span>
      </div>
    );
  }

  // Error state
  if (isError || !masjid) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-text-gray">Gagal memuat profil masjid</p>
        <button onClick={() => refetch()} className="btn-primary-green text-sm">
          <RefreshCw size={14} /> Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-[#28A71A]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Profil Masjid
            </h2>
            <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kelola informasi detail masjid Anda
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* ===== INFORMASI UMUM ===== */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={18} className="text-[#28A71A]" />
          <h3 className="text-base font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Informasi Umum
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#303030] mb-1">Nama Masjid</label>
            <input
              type="text"
              value={form.nama_masjid}
              onChange={(e) => handleChange('nama_masjid', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#303030] mb-1">Alamat</label>
            <textarea
              value={form.alamat_masjid}
              onChange={(e) => handleChange('alamat_masjid', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Jenis Masjid</label>
            <select
              value={form.jenis_masjid}
              onChange={(e) => handleChange('jenis_masjid', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            >
              <option value="">Pilih Jenis</option>
              {JENIS_MASJID_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Kode Pos</label>
            <input
              type="text"
              value={form.kode_pos}
              onChange={(e) => handleChange('kode_pos', e.target.value)}
              placeholder="Contoh: 60111"
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            />
          </div>
        </div>
      </div>

      {/* ===== INFORMASI KONTAK ===== */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-6">
        <div className="flex items-center gap-2 mb-5">
          <Phone size={18} className="text-[#28A71A]" />
          <h3 className="text-base font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kontak
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">No. Telepon / HP</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type="text"
                value={form.nohp_masjid}
                onChange={(e) => handleChange('nohp_masjid', e.target.value)}
                placeholder="08123456789"
                className="w-full pl-10 pr-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type="email"
                value={form.email_masjid}
                onChange={(e) => handleChange('email_masjid', e.target.value)}
                placeholder="email@masjid.com"
                className="w-full pl-10 pr-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== LOKASI / WILAYAH ===== */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={18} className="text-[#28A71A]" />
          <h3 className="text-base font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Lokasi & Wilayah
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Provinsi</label>
            <select
              value={form.id_provinsi}
              onChange={(e) => { handleChange('id_provinsi', e.target.value); handleChange('id_kabupaten_kota', ''); handleChange('id_kecamatan', ''); handleChange('id_kelurahan_desa', ''); }}
              disabled={loadingWilayah}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            >
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((p) => (
                <option key={p.id} value={p.id}>{p.nama_provinsi}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Kabupaten/Kota</label>
            <select
              value={form.id_kabupaten_kota}
              onChange={(e) => { handleChange('id_kabupaten_kota', e.target.value); handleChange('id_kecamatan', ''); handleChange('id_kelurahan_desa', ''); }}
              disabled={!form.id_provinsi}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            >
              <option value="">Pilih Kab/Kota</option>
              {kabkotList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kabupaten_kota}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Kecamatan</label>
            <select
              value={form.id_kecamatan}
              onChange={(e) => { handleChange('id_kecamatan', e.target.value); handleChange('id_kelurahan_desa', ''); }}
              disabled={!form.id_kabupaten_kota}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kecamatan}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Kelurahan/Desa</label>
            <select
              value={form.id_kelurahan_desa}
              onChange={(e) => handleChange('id_kelurahan_desa', e.target.value)}
              disabled={!form.id_kecamatan}
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            >
              <option value="">Pilih Kelurahan/Desa</option>
              {kelurahanList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kelurahan_desa}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Latitude</label>
            <input
              type="text"
              value={form.latitude}
              onChange={(e) => handleChange('latitude', e.target.value)}
              placeholder="-7.257471"
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Longitude</label>
            <input
              type="text"
              value={form.longitude}
              onChange={(e) => handleChange('longitude', e.target.value)}
              placeholder="112.752138"
              className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all"
            />
          </div>
        </div>
      </div>

      {/* ===== REKENING BANK ===== */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-[#28A71A]" />
            <h3 className="text-base font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Rekening Bank
            </h3>
          </div>
          <button
            onClick={() => setShowBankForm(!showBankForm)}
            className="text-sm text-[#28A71A] hover:text-[#1C7712] font-medium flex items-center gap-1 transition-colors"
          >
            <Plus size={14} /> Tambah Rekening
          </button>
        </div>

        {showBankForm && (
          <div className="mb-4 p-4 bg-[#FAFAFA] rounded-lg border border-[#F0F4F8] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={bankForm.nama_bank}
                onChange={(e) => setBankForm((p) => ({ ...p, nama_bank: e.target.value }))}
                placeholder="Nama Bank (BCA, Mandiri, dll)"
                className="px-4 py-2 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
              />
              <input
                type="text"
                value={bankForm.norek}
                onChange={(e) => setBankForm((p) => ({ ...p, norek: e.target.value }))}
                placeholder="Nomor Rekening"
                className="px-4 py-2 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
              />
              <input
                type="text"
                value={bankForm.atas_nama}
                onChange={(e) => setBankForm((p) => ({ ...p, atas_nama: e.target.value }))}
                placeholder="Atas Nama"
                className="px-4 py-2 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowBankForm(false)} className="px-3 py-1.5 text-sm text-text-gray hover:text-[#303030] transition-colors">Batal</button>
              <button onClick={handleAddBank} disabled={addBankMutation.isPending} className="px-4 py-1.5 bg-[#28A71A] text-white rounded-lg text-sm font-medium hover:bg-[#1C7712] transition-colors flex items-center gap-1">
                {addBankMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null} Simpan
              </button>
            </div>
          </div>
        )}

        {masjid.bank && masjid.bank.length > 0 ? (
          <div className="space-y-2">
            {masjid.bank.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg border border-[#F0F4F8]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white rounded-lg border border-[#F0F4F8] flex items-center justify-center">
                    <Banknote size={16} className="text-[#28A71A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#303030]">{b.nama_bank}</p>
                    <p className="text-xs text-text-gray">{b.norek} — {b.atas_nama}</p>
                  </div>
                </div>
                <button onClick={() => b.id && handleDeleteBank(b.id)} className="p-1.5 rounded-lg text-text-gray hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-gray text-center py-4">Belum ada rekening bank</p>
        )}
      </div>

      {/* ===== MEDIA SOSIAL ===== */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#28A71A]" />
            <h3 className="text-base font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Media Sosial
            </h3>
          </div>
          <button
            onClick={() => setShowMedsosForm(!showMedsosForm)}
            className="text-sm text-[#28A71A] hover:text-[#1C7712] font-medium flex items-center gap-1 transition-colors"
          >
            <Plus size={14} /> Tambah Media Sosial
          </button>
        </div>

        {showMedsosForm && (
          <div className="mb-4 p-4 bg-[#FAFAFA] rounded-lg border border-[#F0F4F8] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={medsosForm.name_medsos}
                onChange={(e) => setMedsosForm((p) => ({ ...p, name_medsos: e.target.value }))}
                className="px-4 py-2 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
              >
                <option value="">Pilih Platform</option>
                <option value="Instagram">Instagram</option>
                <option value="Youtube">Youtube</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="Website">Website</option>
                <option value="Tiktok">Tiktok</option>
                <option value="Telegram">Telegram</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              <input
                type="url"
                value={medsosForm.url_medsos}
                onChange={(e) => setMedsosForm((p) => ({ ...p, url_medsos: e.target.value }))}
                placeholder="URL (https://instagram.com/...)"
                className="px-4 py-2 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowMedsosForm(false)} className="px-3 py-1.5 text-sm text-text-gray hover:text-[#303030] transition-colors">Batal</button>
              <button onClick={handleAddMedsos} disabled={addMedsosMutation.isPending} className="px-4 py-1.5 bg-[#28A71A] text-white rounded-lg text-sm font-medium hover:bg-[#1C7712] transition-colors flex items-center gap-1">
                {addMedsosMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null} Simpan
              </button>
            </div>
          </div>
        )}

        {masjid.medsos && masjid.medsos.length > 0 ? (
          <div className="space-y-2">
            {masjid.medsos.map((m, i) => {
              const Icon = MEDSOS_ICONS[m.name_medsos] || LinkIcon;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg border border-[#F0F4F8]">
                  <a
                    href={m.url_medsos}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-9 h-9 bg-white rounded-lg border border-[#F0F4F8] flex items-center justify-center">
                      <Icon size={16} className="text-[#28A71A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#303030]">{m.name_medsos}</p>
                      <p className="text-xs text-text-gray truncate max-w-[300px]">{m.url_medsos}</p>
                    </div>
                  </a>
                  <button onClick={() => m.id && handleDeleteMedsos(m.id)} className="p-1.5 rounded-lg text-text-gray hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-text-gray text-center py-4">Belum ada media sosial</p>
        )}
      </div>
    </div>
  );
}
