import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, Info, Building2, KeyRound, Mail, Lock, MapPin,
  Loader2, Check, ChevronLeft, ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import type { Kecamatan, KelurahanDesa } from '../types';

const STEPS = [
  { id: 1, label: 'Data Masjid', desc: 'Ajukan data masjid' },
  { id: 2, label: 'Data Admin Masjid', desc: 'Kode otomatis terisi' },
] as const;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== Step 1: Daftar Masjid (data masjid saja — kode diterbitkan otomatis) =====
  const [masjidForm, setMasjidForm] = useState({
    nama_masjid: '',
    alamat_masjid: '',
    nohp_masjid: '',
    id_provinsi: '',
    id_kabupaten_kota: '',
    id_kecamatan: '',
    id_kelurahan_desa: '',
    keterangan: '',
  });
  const [provinsiList, setProvinsiList] = useState<{ id: number | string; nama_provinsi: string }[]>([]);
  const [kabkotList, setKabkotList] = useState<{ id: number | string; nama_kabupaten_kota: string }[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kelurahanList, setKelurahanList] = useState<KelurahanDesa[]>([]);
  const [loadingWilayah, setLoadingWilayah] = useState(true);
  // id pengajuan + kode masjid yang diterbitkan backend saat langkah 1 sukses
  const [pengajuanId, setPengajuanId] = useState<number | null>(null);
  const [issuedKode, setIssuedKode] = useState('');

  // ===== Step 2: Daftar Admin Masjid (kode otomatis terisi) =====
  const [adminForm, setAdminForm] = useState({
    nama: '',
    email: '',
    jk: 'Laki-laki',
    nohp: '',
    alamat: '',
  });

  // Load provinsi on mount
  useEffect(() => {
    const loadProvinsi = async () => {
      try {
        const res = await adminService.getProvinsi();
        if (res.status && Array.isArray(res.data)) {
          setProvinsiList(res.data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoadingWilayah(false);
      }
    };
    loadProvinsi();
  }, []);

  // Load kabupaten/kota saat provinsi berubah
  useEffect(() => {
    if (!masjidForm.id_provinsi) {
      setKabkotList([]);
      return;
    }
    const loadKabkot = async () => {
      try {
        const res = await adminService.getKabupatenKota(Number(masjidForm.id_provinsi));
        if (res.status && Array.isArray(res.data)) {
          setKabkotList(res.data);
        }
      } catch {
        // Silent fail
      }
    };
    loadKabkot();
    setMasjidForm((prev) => ({ ...prev, id_kabupaten_kota: '', id_kecamatan: '', id_kelurahan_desa: '' }));
    setKecamatanList([]);
    setKelurahanList([]);
  }, [masjidForm.id_provinsi]);

  // Load kecamatan saat kab/kota berubah
  useEffect(() => {
    if (!masjidForm.id_kabupaten_kota) {
      setKecamatanList([]);
      return;
    }
    const loadKecamatan = async () => {
      try {
        const res = await adminService.getKecamatan(Number(masjidForm.id_kabupaten_kota));
        if (res.status && Array.isArray(res.data)) {
          setKecamatanList(res.data);
        }
      } catch {
        // Silent fail
      }
    };
    loadKecamatan();
    setMasjidForm((prev) => ({ ...prev, id_kecamatan: '', id_kelurahan_desa: '' }));
    setKelurahanList([]);
  }, [masjidForm.id_kabupaten_kota]);

  // Load kelurahan/desa saat kecamatan berubah
  useEffect(() => {
    if (!masjidForm.id_kecamatan) {
      setKelurahanList([]);
      return;
    }
    const loadKelurahan = async () => {
      try {
        const res = await adminService.getKelurahanDesa(Number(masjidForm.id_kecamatan));
        if (res.status && Array.isArray(res.data)) {
          setKelurahanList(res.data);
        }
      } catch {
        // Silent fail
      }
    };
    loadKelurahan();
    setMasjidForm((prev) => ({ ...prev, id_kelurahan_desa: '' }));
  }, [masjidForm.id_kecamatan]);

  const goToStep = (next: 1 | 2) => {
    // Step 2 hanya bisa dibuka setelah kode masjid diterbitkan
    if (next === 2 && !issuedKode) return;
    setStep(next);
    setError('');
  };

  /** Jika pengajuan sudah dibuat (step 1 selesai), kembali ke step 2 tanpa membuat duplikat. */
  const handleMasjidSubmitted = (e: React.FormEvent) => {
    // Jangan submit ulang — langsung lanjut ke step 2 (cegah pengajuan duplikat)
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const namaProvinsi = provinsiList.find((p) => String(p.id) === String(masjidForm.id_provinsi))?.nama_provinsi;
  const namaKabkot = kabkotList.find((k) => String(k.id) === String(masjidForm.id_kabupaten_kota))?.nama_kabupaten_kota;

  /** Langkah 1 — Daftar Masjid: membuat pengajuan; backend langsung terbitkan kode masjid. */
  const handleSubmitMasjid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const m = masjidForm;
    if (!m.nama_masjid.trim() || !m.alamat_masjid.trim() || !m.nohp_masjid.trim()) {
      setError('Lengkapi data masjid terlebih dahulu.');
      return;
    }
    if (!m.id_provinsi || !m.id_kabupaten_kota) {
      setError('Pilih provinsi dan kabupaten/kota.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminService.submitPengajuan({
        nama_masjid: m.nama_masjid.trim(),
        alamat_masjid: m.alamat_masjid.trim(),
        nohp_masjid: m.nohp_masjid.trim(),
        id_provinsi: Number(m.id_provinsi),
        id_kabupaten_kota: Number(m.id_kabupaten_kota),
        id_kecamatan: m.id_kecamatan ? Number(m.id_kecamatan) : undefined,
        id_kelurahan_desa: m.id_kelurahan_desa ? Number(m.id_kelurahan_desa) : undefined,
        keterangan: m.keterangan.trim(),
      });
      const kode = res?.data?.kode_org_baznas || '';
      const id = res?.data?.id;
      if (!kode || !id) {
        throw new Error('Kode masjid tidak diterbitkan. Silakan coba lagi.');
      }
      setIssuedKode(kode);
      setPengajuanId(id);
      toast.success(`Kode masjid Anda: ${kode}.`);
      // Lanjut otomatis ke langkah 2 — form admin masjid dengan kode terisi
      setStep(2);
      setError('');
    } catch (err: any) {
      const message =
        err?.response?.data?.status ||
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengirim pengajuan masjid. Silakan coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Langkah 2 — Daftar Admin Masjid: simpan data admin ke pengajuan yang sama. */
  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const a = adminForm;
    if (!a.nama.trim() || !a.email.trim() || !a.alamat.trim()) {
      setError('Lengkapi data diri Anda terlebih dahulu.');
      return;
    }
    if (!pengajuanId) {
      setError('Sesi pendaftaran tidak valid. Silakan mulai dari langkah 1.');
      return;
    }

    setIsLoading(true);
    try {
      await adminService.updatePengajuanAdmin(pengajuanId, {
        nama_pemohon: a.nama.trim(),
        email_pemohon: a.email.trim(),
        jk_pemohon: a.jk,
        nohp_pemohon: a.nohp.trim(),
        alamat_pemohon: a.alamat.trim(),
      });
      toast.success('Pendaftaran terkirim! Tunggu persetujuan Admin BAZNAS.');
      navigate('/login', { state: { email: a.email.trim() } });
    } catch (err: any) {
      const message =
        err?.response?.data?.status ||
        err?.response?.data?.message ||
        err?.message ||
        'Gagal menyimpan data admin. Silakan coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white focus:bg-white';
  const labelCls = 'block text-sm font-semibold text-[#303030] mb-1.5';

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* ===== LEFT SIDE - Form (50%) ===== */}
      <div className="w-1/2 flex flex-col h-full bg-[#FAFAFA] relative">
        {/* Logo & Back Link */}
        <div className="flex-shrink-0 flex items-center justify-between px-[120px] pt-[60px]">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/images/logo-menara.svg"
                alt="MENARA Masjid Logo"
                className="w-[30px] h-[30px] object-contain"
              />
            </div>
            <span
              className="text-base font-bold text-[#303030] tracking-wide"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              MENARA Masjid
            </span>
          </Link>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#28A71A] transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Kembali ke Login
          </Link>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-start justify-center px-[80px] xl:px-[120px] py-6 overflow-y-auto">
          <div className="w-full max-w-[460px]">
            {/* Mobile Back Link */}
            <Link
              to="/login"
              className="sm:hidden inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#28A71A] transition-colors mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ArrowLeft size={14} />
              Kembali ke Login
            </Link>

            {/* Welcome Header */}
            <div className="mb-5">
              <h1
                className="text-[28px] font-bold text-[#303030] mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Daftar Admin Masjid
              </h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Daftarkan masjid Anda dulu — kode masjid diterbitkan otomatis, lalu lengkapi data Admin Masjid
              </p>
            </div>

            {/* ===== Multi-Step Progress ===== */}
            <div className="mb-6">
              <div className="relative flex items-start">
                {/* Connector line */}
                <div
                  className={`absolute top-[19px] left-[12.5%] right-[12.5%] h-0.5 transition-colors duration-500 ${
                    step === 2 ? 'bg-[#28A71A]' : 'bg-gray-200'
                  }`}
                />
                {STEPS.map((s) => {
                  const isActive = step === s.id;
                  const isDone = step > s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goToStep(s.id)}
                      disabled={s.id === 2 && !issuedKode}
                      aria-current={isActive ? 'step' : undefined}
                      className="relative z-10 flex-1 flex flex-col items-center gap-2 disabled:cursor-not-allowed group"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                          isDone
                            ? 'bg-[#28A71A] border-[#28A71A] text-white'
                            : isActive
                              ? 'bg-white border-[#28A71A] text-[#28A71A] shadow-lg shadow-[#28A71A]/25'
                              : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        {isDone ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <span className="text-sm font-bold">{s.id}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-xs font-semibold transition-colors ${
                            isActive || isDone ? 'text-[#1C7712]' : 'text-gray-400'
                          }`}
                        >
                          {s.label}
                        </p>
                        <p className="text-[10px] text-gray-400 hidden sm:block">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* ========== STEP 1: DAFTAR MASJID ========== */}
            {step === 1 && (
              <form
                onSubmit={pengajuanId ? handleMasjidSubmitted : handleSubmitMasjid}
                className="space-y-4"
              >
                {/* Info alur */}
                <div className="p-3.5 bg-[#EAF6E8] border border-[#28A71A]/20 rounded-xl flex items-start gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Info size={16} className="text-[#28A71A] flex-shrink-0 mt-0.5" />
                  {pengajuanId ? (
                    <p className="text-xs text-[#555] leading-relaxed">
                      Pengajuan masjid <b>{masjidForm.nama_masjid}</b> sudah dibuat dengan kode{' '}
                      <b className="font-mono text-[#1C7712]">{issuedKode}</b>. Lanjut ke langkah 2 untuk mendaftarkan{' '}
                      <b>Admin Masjid</b> — atau ubah data di bawah jika ada yang perlu diperbaiki (data sudah terkirim, perubahan tidak mengubah pengajuan).
                    </p>
                  ) : (
                    <p className="text-xs text-[#555] leading-relaxed">
                      Setelah data masjid dikirim, Anda langsung menerima <b>kode masjid</b> dan otomatis lanjut ke
                      langkah 2 untuk mendaftarkan <b>Admin Masjid</b>. Admin BAZNAS akan mengkonfirmasi masjid + admin sekaligus.
                    </p>
                  )}
                </div>

                {/* Data Masjid */}
                <p className="text-sm font-bold text-[#303030] mt-5 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Data Masjid
                </p>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nama Masjid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={masjidForm.nama_masjid}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, nama_masjid: e.target.value }))}
                    placeholder="Nama masjid Anda"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Alamat Masjid <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={masjidForm.alamat_masjid}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, alamat_masjid: e.target.value }))}
                    placeholder="Alamat lengkap masjid"
                    rows={2}
                    className={`${inputCls} resize-none`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={masjidForm.id_provinsi}
                        onChange={(e) => setMasjidForm((p) => ({ ...p, id_provinsi: e.target.value }))}
                        disabled={loadingWilayah}
                        className={`${inputCls} pl-10 appearance-none`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinsiList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama_provinsi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Kab/Kota <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={masjidForm.id_kabupaten_kota}
                        onChange={(e) => setMasjidForm((p) => ({ ...p, id_kabupaten_kota: e.target.value }))}
                        disabled={!masjidForm.id_provinsi}
                        className={`${inputCls} pl-10 appearance-none`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">Pilih Kab/Kota</option>
                        {kabkotList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama_kabupaten_kota}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Kecamatan
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={masjidForm.id_kecamatan}
                        onChange={(e) => setMasjidForm((p) => ({ ...p, id_kecamatan: e.target.value }))}
                        disabled={!masjidForm.id_kabupaten_kota}
                        className={`${inputCls} pl-10 appearance-none`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">Pilih Kecamatan</option>
                        {kecamatanList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama_kecamatan}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Kelurahan/Desa
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={masjidForm.id_kelurahan_desa}
                        onChange={(e) => setMasjidForm((p) => ({ ...p, id_kelurahan_desa: e.target.value }))}
                        disabled={!masjidForm.id_kecamatan}
                        className={`${inputCls} pl-10 appearance-none`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">Pilih Kelurahan/Desa</option>
                        {kelurahanList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama_kelurahan_desa}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    No. HP Masjid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={masjidForm.nohp_masjid}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, nohp_masjid: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Keterangan <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={masjidForm.keterangan}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, keterangan: e.target.value }))}
                    placeholder="Informasi tambahan masjid"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#28A71A]/25 hover:shadow-[#28A71A]/40 disabled:shadow-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Mengirim...
                    </>
                  ) : pengajuanId ? (
                    <>
                      <ArrowLeft size={17} className="rotate-180" />
                      Lanjut ke Data Admin Masjid
                    </>
                  ) : (
                    <>
                      <Building2 size={17} />
                      Ajukan Masjid & Dapatkan Kode
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========== STEP 2: DAFTAR ADMIN MASJID ========== */}
            {step === 2 && (
              <form onSubmit={handleSubmitAdmin} className="space-y-4">
                {/* Ringkasan masjid yang diajukan */}
                <div className="p-4 bg-white border border-[#28A71A]/20 rounded-xl shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <p className="text-[11px] font-bold text-[#555] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <ClipboardList size={13} className="text-[#28A71A]" />
                    Ringkasan Pengajuan Masjid
                  </p>
                  <p className="text-sm font-bold text-[#303030]">{masjidForm.nama_masjid}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {masjidForm.alamat_masjid}
                    {namaKabkot && <><br />{namaKabkot}{namaProvinsi ? `, ${namaProvinsi}` : ''}</>}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <KeyRound size={14} className="text-[#006844]" />
                    <span className="text-xs text-gray-500">Kode Masjid:</span>
                    <span className="text-sm font-mono font-bold text-[#1C7712] tracking-wider">{issuedKode}</span>
                  </div>
                </div>

                {/* Data Admin */}
                <p className="text-sm font-bold text-[#303030] mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Data Admin Masjid
                </p>

                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminForm.nama}
                    onChange={(e) => setAdminForm((p) => ({ ...p, nama: e.target.value }))}
                    placeholder="Nama lengkap Anda"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Email untuk login"
                      className={`${inputCls} pl-10`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Jenis Kelamin
                    </label>
                    <select
                      value={adminForm.jk}
                      onChange={(e) => setAdminForm((p) => ({ ...p, jk: e.target.value }))}
                      className={inputCls}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      No. HP
                    </label>
                    <input
                      type="tel"
                      value={adminForm.nohp}
                      onChange={(e) => setAdminForm((p) => ({ ...p, nohp: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className={inputCls}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={adminForm.alamat}
                    onChange={(e) => setAdminForm((p) => ({ ...p, alamat: e.target.value }))}
                    placeholder="Alamat lengkap Anda"
                    rows={2}
                    className={`${inputCls} resize-none`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>

                {/* Password info */}
                <div className="p-3.5 bg-[#EAF6E8] border border-[#28A71A]/20 rounded-xl flex items-start gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Lock size={16} className="text-[#28A71A] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555] leading-relaxed">
                    Password awal akun Anda adalah{' '}
                    <code className="px-1.5 py-0.5 bg-white rounded-md text-[#1C7712] font-semibold border border-[#28A71A]/20">menara23</code>.
                    Anda dapat mengubahnya nanti melalui menu Setting Akun.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    disabled={isLoading}
                    className="py-3 px-5 border border-gray-200 hover:border-[#28A71A] hover:text-[#1C7712] text-gray-500 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <ChevronLeft size={16} />
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#28A71A]/25 hover:shadow-[#28A71A]/40 disabled:shadow-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      <>
                        <UserPlus size={17} />
                        Daftar Admin Masjid
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="text-[#28A71A] hover:text-[#1C7712] font-semibold transition-colors"
              >
                Masuk sekarang
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-8 text-xs text-center text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              &copy; 2024 Menara Masjid BAZNAS. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Banner ===== */}
      <div className="w-1/2 h-full flex items-center justify-center bg-[#FAFAFA] overflow-hidden">
        <div className="w-[570px] h-[904px] max-h-[90vh] rounded-[40px] overflow-hidden shadow-xl bg-[#D9D9D9]">
          <img
            src="/images/banner-login.svg"
            alt="MENARA Masjid"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
