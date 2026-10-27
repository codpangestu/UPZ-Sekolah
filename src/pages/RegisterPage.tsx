import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, Info, GraduationCap, KeyRound, Mail, Lock, MapPin,
  Loader2, Check, ChevronLeft, ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import type { Kecamatan, KelurahanDesa } from '../types';

const STEPS = [
  { id: 1, label: 'Data UPZ Sekolah', desc: 'Ajukan data sekolah & UPZ' },
  { id: 2, label: 'Data Admin UPZ Sekolah', desc: 'Kode otomatis terisi' },
] as const;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== Step 1: Daftar UPZ Sekolah =====
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
  const [pengajuanId, setPengajuanId] = useState<number | null>(null);
  const [issuedKode, setIssuedKode] = useState('');

  // ===== Step 2: Daftar Admin UPZ Sekolah =====
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
    if (next === 2 && !issuedKode) return;
    setStep(next);
    setError('');
  };

  const handleMasjidSubmitted = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const namaProvinsi = provinsiList.find((p) => String(p.id) === String(masjidForm.id_provinsi))?.nama_provinsi;
  const namaKabkot = kabkotList.find((k) => String(k.id) === String(masjidForm.id_kabupaten_kota))?.nama_kabupaten_kota;

  /** Langkah 1 — Daftar UPZ Sekolah: membuat pengajuan; backend langsung terbitkan kode sekolah/UPZ. */
  const handleSubmitMasjid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const m = masjidForm;
    if (!m.nama_masjid.trim() || !m.alamat_masjid.trim() || !m.nohp_masjid.trim()) {
      setError('Lengkapi data sekolah dan kontak terlebih dahulu.');
      return;
    }
    if (!m.id_provinsi || !m.id_kabupaten_kota) {
      setError('Pilih provinsi dan kabupaten/kota sekolah.');
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
        throw new Error('Kode UPZ Sekolah tidak diterbitkan. Silakan coba lagi.');
      }
      setIssuedKode(kode);
      setPengajuanId(id);
      toast.success(`Kode UPZ Sekolah Anda: ${kode}.`);
      setStep(2);
      setError('');
    } catch (err: any) {
      const message =
        err?.response?.data?.status ||
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengirim pengajuan UPZ Sekolah. Silakan coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Langkah 2 — Daftar Admin UPZ Sekolah */
  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const a = adminForm;
    if (!a.nama.trim() || !a.email.trim() || !a.alamat.trim()) {
      setError('Lengkapi data diri pengurus UPZ Sekolah terlebih dahulu.');
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
      toast.success('Pendaftaran terkirim! Menunggu verifikasi Admin BAZNAS.');
      navigate('/login', { state: { email: a.email.trim() } });
    } catch (err: any) {
      const message =
        err?.response?.data?.status ||
        err?.response?.data?.message ||
        err?.message ||
        'Gagal menyimpan data pengurus. Silakan coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400 bg-white hover:border-slate-300';
  const labelCls = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* ===== LEFT SIDE - Form (50%) ===== */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-[#F8FAFC] relative">
        {/* Logo & Back Link */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-12 lg:px-16 pt-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} />
            </div>
            <div className="flex flex-col">
              <span
                className="text-base font-bold text-slate-800 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                UPZ Sekolah
              </span>
              <span className="text-[10px] font-semibold text-sky-600 tracking-wider uppercase">
                BAZNAS RI
              </span>
            </div>
          </Link>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Kembali ke Login
          </Link>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-start justify-center px-6 sm:px-12 lg:px-16 py-6 overflow-y-auto">
          <div className="w-full max-w-[460px] my-auto py-4">
            {/* Mobile Back Link */}
            <Link
              to="/login"
              className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ArrowLeft size={14} />
              Kembali ke Login
            </Link>

            {/* Welcome Header */}
            <div className="mb-5">
              <h1
                className="text-[26px] font-bold text-slate-800 mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pendaftaran UPZ Sekolah
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Daftarkan profil sekolah Anda — kode UPZ diterbitkan otomatis, lalu lengkapi data Admin UPZ Sekolah.
              </p>
            </div>

            {/* ===== Multi-Step Progress ===== */}
            <div className="mb-6">
              <div className="relative flex items-start">
                {/* Connector line */}
                <div
                  className={`absolute top-[19px] left-[15%] right-[15%] h-0.5 transition-colors duration-500 ${
                    step === 2 ? 'bg-sky-600' : 'bg-slate-200'
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
                      className="relative z-10 flex-1 flex flex-col items-center gap-1.5 disabled:cursor-not-allowed group"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                          isDone
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : isActive
                              ? 'bg-white border-sky-600 text-sky-600 shadow-lg shadow-sky-600/25 ring-2 ring-sky-100'
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <Check size={16} strokeWidth={3} />
                        ) : (
                          <span className="text-xs font-bold">{s.id}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-xs font-semibold transition-colors ${
                            isActive || isDone ? 'text-sky-700' : 'text-slate-400'
                          }`}
                        >
                          {s.label}
                        </p>
                        <p className="text-[10px] text-slate-400 hidden sm:block">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* ========== STEP 1: DAFTAR UPZ SEKOLAH ========== */}
            {step === 1 && (
              <form
                onSubmit={pengajuanId ? handleMasjidSubmitted : handleSubmitMasjid}
                className="space-y-3.5"
              >
                {/* Info alur */}
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-start gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Info size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
                  {pengajuanId ? (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pengajuan UPZ Sekolah <b>{masjidForm.nama_masjid}</b> sudah terdaftar dengan kode{' '}
                      <b className="font-mono text-sky-700">{issuedKode}</b>. Lanjut ke langkah 2 untuk mendaftarkan data pengurus.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Setelah profil sekolah dikirim, Anda langsung mendapatkan <b>kode registrasi UPZ Sekolah</b> dan lanjut mendaftarkan <b>Admin UPZ Sekolah</b>.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nama Sekolah / Madrasah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={masjidForm.nama_masjid}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, nama_masjid: e.target.value }))}
                    placeholder="Contoh: SMAN 1 Jakarta / MAN 2 Bandung"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Alamat Lengkap Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={masjidForm.alamat_masjid}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, alamat_masjid: e.target.value }))}
                    placeholder="Jl. Pendidikan No. ..., RT/RW"
                    rows={2}
                    className={`${inputCls} resize-none`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Provinsi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                      Kab/Kota <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={masjidForm.id_kelurahan_desa}
                        onChange={(e) => setMasjidForm((p) => ({ ...p, id_kelurahan_desa: e.target.value }))}
                        disabled={!masjidForm.id_kecamatan}
                        className={`${inputCls} pl-10 appearance-none`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">Pilih Kelurahan</option>
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
                    No. Telepon / Kontak Sekolah <span className="text-rose-500">*</span>
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
                    Keterangan <span className="text-slate-400 font-normal lowercase">(opsional - misal NPSN / jenjang)</span>
                  </label>
                  <input
                    type="text"
                    value={masjidForm.keterangan}
                    onChange={(e) => setMasjidForm((p) => ({ ...p, keterangan: e.target.value }))}
                    placeholder="Contoh: NPSN 20108901 / Sekolah Binaan BAZNAS"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 disabled:shadow-none mt-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Memproses Pendaftaran...
                    </>
                  ) : pengajuanId ? (
                    <>
                      <ArrowLeft size={17} className="rotate-180" />
                      Lanjut ke Data Admin UPZ Sekolah
                    </>
                  ) : (
                    <>
                      <GraduationCap size={17} />
                      Ajukan UPZ Sekolah & Dapatkan Kode
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========== STEP 2: DAFTAR ADMIN UPZ SEKOLAH ========== */}
            {step === 2 && (
              <form onSubmit={handleSubmitAdmin} className="space-y-3.5">
                {/* Ringkasan UPZ Sekolah yang diajukan */}
                <div className="p-4 bg-white border border-sky-100 rounded-xl shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ClipboardList size={14} className="text-sky-600" />
                    Ringkasan Pengajuan UPZ Sekolah
                  </p>
                  <p className="text-sm font-bold text-slate-800">{masjidForm.nama_masjid}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {masjidForm.alamat_masjid}
                    {namaKabkot && <><br />{namaKabkot}{namaProvinsi ? `, ${namaProvinsi}` : ''}</>}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <KeyRound size={14} className="text-sky-600" />
                    <span className="text-xs text-slate-500">Kode UPZ Sekolah:</span>
                    <span className="text-sm font-mono font-bold text-sky-700 tracking-wider">{issuedKode}</span>
                  </div>
                </div>

                {/* Data Admin */}
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Data Pengurus / Admin UPZ Sekolah
                </p>

                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nama Lengkap Pemohon / Guru Pembina <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminForm.nama}
                    onChange={(e) => setAdminForm((p) => ({ ...p, nama: e.target.value }))}
                    placeholder="Nama lengkap & gelar"
                    className={inputCls}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Alamat Email Login <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="admin@sekolah.sch.id"
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
                      No. WhatsApp Aktif
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
                    Alamat Domisili <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={adminForm.alamat}
                    onChange={(e) => setAdminForm((p) => ({ ...p, alamat: e.target.value }))}
                    placeholder="Alamat domisili pengurus"
                    rows={2}
                    className={`${inputCls} resize-none`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>

                {/* Password info */}
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-start gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Lock size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kata sandi default awal akun Anda adalah{' '}
                    <code className="px-1.5 py-0.5 bg-white rounded-md text-sky-700 font-semibold border border-sky-200">menara23</code>.
                    Dapat Anda ubah setelah berhasil masuk ke dashboard.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    disabled={isLoading}
                    className="py-3 px-5 border border-slate-200 hover:border-sky-500 hover:text-sky-600 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <ChevronLeft size={16} />
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 disabled:shadow-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <UserPlus size={17} />
                        Kirim Pendaftaran Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <p className="mt-5 text-center text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sudah memiliki akun terdaftar?{' '}
              <Link
                to="/login"
                className="text-sky-600 hover:text-sky-700 font-bold transition-colors"
              >
                Masuk sekarang
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-6 text-xs text-center text-slate-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              &copy; 2026 UPZ Sekolah - BAZNAS RI. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Banner ===== */}
      <div className="hidden lg:flex w-1/2 h-full items-center justify-center bg-gradient-to-br from-sky-600 via-sky-500 to-sky-700 p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-8 border border-white/30 shadow-2xl">
            <GraduationCap size={44} />
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            Pendaftaran Resmi BAZNAS
          </span>
          <h2 className="text-3xl font-extrabold leading-tight mb-4">
            Langkah Mudah Membentuk UPZ di Sekolah Anda
          </h2>
          <p className="text-sm leading-relaxed text-sky-100 max-w-md">
            Daftarkan sekolah Anda sekarang untuk memperoleh Surat Keputusan (SK) resmi pembentukan UPZ dari BAZNAS Kabupaten/Kota setempat.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mt-10 pt-8 border-t border-white/20 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <span className="block text-lg font-bold">Kode Otomatis</span>
              <span className="text-xs text-sky-100">Kode organisasi langsung terbit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <span className="block text-lg font-bold">Amanah & Legal</span>
              <span className="text-xs text-sky-100">Sesuai UU Zakat No. 23/2011</span>
            </div>
          </div>
        </div>

        {/* Ambient decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
