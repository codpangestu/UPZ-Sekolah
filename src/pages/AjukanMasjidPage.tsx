import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import type { PengajuanFormState, Kecamatan, KelurahanDesa } from '../types';

const initialForm: PengajuanFormState = {
  nama_masjid: '',
  alamat_masjid: '',
  nohp_masjid: '',
  id_provinsi: '',
  id_kabupaten_kota: '',
  id_kecamatan: '',
  id_kelurahan_desa: '',
  keterangan: '',
};

export default function AjukanMasjidPage() {
  const [form, setForm] = useState<PengajuanFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PengajuanFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Wilayah data
  const [provinsiList, setProvinsiList] = useState<{ id: number | string; nama_provinsi: string }[]>([]);
  const [kabkotList, setKabkotList] = useState<{ id: number | string; nama_kabupaten_kota: string }[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kelurahanList, setKelurahanList] = useState<KelurahanDesa[]>([]);
  const [loadingWilayah, setLoadingWilayah] = useState(true);

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

  // Load kabupaten/kota when provinsi changes
  useEffect(() => {
    if (!form.id_provinsi) {
      setKabkotList([]);
      return;
    }
    const loadKabkot = async () => {
      try {
        const res = await adminService.getKabupatenKota(Number(form.id_provinsi));
        if (res.status && Array.isArray(res.data)) {
          setKabkotList(res.data);
        }
      } catch {
        // Silent fail
      }
    };
    loadKabkot();
    setForm((prev) => ({ ...prev, id_kabupaten_kota: '', id_kecamatan: '', id_kelurahan_desa: '' }));
    setKecamatanList([]);
    setKelurahanList([]);
  }, [form.id_provinsi]);

  // Load kecamatan when kab/kota changes
  useEffect(() => {
    if (!form.id_kabupaten_kota) {
      setKecamatanList([]);
      return;
    }
    const loadKecamatan = async () => {
      try {
        const res = await adminService.getKecamatan(Number(form.id_kabupaten_kota));
        if (res.status && Array.isArray(res.data)) {
          setKecamatanList(res.data);
        }
      } catch {
        // Silent fail
      }
    };
    loadKecamatan();
    setForm((prev) => ({ ...prev, id_kecamatan: '', id_kelurahan_desa: '' }));
    setKelurahanList([]);
  }, [form.id_kabupaten_kota]);

  // Load kelurahan/desa when kecamatan changes
  useEffect(() => {
    if (!form.id_kecamatan) {
      setKelurahanList([]);
      return;
    }
    const loadKelurahan = async () => {
      try {
        const res = await adminService.getKelurahanDesa(Number(form.id_kecamatan));
        if (res.status && Array.isArray(res.data)) {
          setKelurahanList(res.data);
        }
      } catch {
        // Silent fail
      }
    };
    loadKelurahan();
    setForm((prev) => ({ ...prev, id_kelurahan_desa: '' }));
  }, [form.id_kecamatan]);

  const validate = useCallback((): boolean => {
    const newErrors: typeof errors = {};
    if (!form.nama_masjid.trim()) newErrors.nama_masjid = 'Nama sekolah / UPZ wajib diisi';
    if (!form.alamat_masjid.trim()) newErrors.alamat_masjid = 'Alamat lengkap sekolah wajib diisi';
    if (!form.nohp_masjid.trim()) newErrors.nohp_masjid = 'Nomor kontak / WhatsApp wajib diisi';
    else if (!/^0[0-9]{8,12}$/.test(form.nohp_masjid.replace(/[\s-]/g, '')))
      newErrors.nohp_masjid = 'Format nomor tidak valid (contoh: 08123456789)';
    if (!form.id_provinsi) newErrors.id_provinsi = 'Pilih provinsi';
    if (!form.id_kabupaten_kota) newErrors.id_kabupaten_kota = 'Pilih kabupaten/kota';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await adminService.submitPengajuan({
        ...form,
        id_provinsi: Number(form.id_provinsi),
        id_kabupaten_kota: Number(form.id_kabupaten_kota),
        id_kecamatan: form.id_kecamatan ? Number(form.id_kecamatan) : undefined,
        id_kelurahan_desa: form.id_kelurahan_desa ? Number(form.id_kelurahan_desa) : undefined,
      });
      setForm(initialForm);
      setSubmitted(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal mengirim pengajuan. Silakan coba lagi.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof PengajuanFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <CheckCircle2 size={36} />
            </div>
            <h2
              className="text-2xl font-bold text-slate-800 mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Pengajuan Berhasil Dikirim!
            </h2>
            <p
              className="text-sm text-slate-600 leading-relaxed mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Terima kasih! Pengajuan pembentukan UPZ di sekolah Anda telah kami terima dan akan segera diproses oleh tim BAZNAS Daerah setempat. Tim kami akan menghubungi kontak yang didaftarkan.
            </p>
            <Link
              to="/"
              className="btn-primary-blue w-full justify-center py-3 rounded-xl text-sm font-semibold"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors mb-6"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center shadow-sm">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-slate-800"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Ajukan UPZ Sekolah Baru
              </h1>
              <p
                className="text-xs text-slate-500"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Daftarkan sekolah Anda ke platform resmi UPZ Sekolah binaan BAZNAS RI
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-sm">
            {/* Nama Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Nama Sekolah / Madrasah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama_masjid}
                onChange={(e) => handleChange('nama_masjid', e.target.value)}
                placeholder="Contoh: SMA Negeri 1 Jakarta / MAN 2 Bandung"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400 ${
                  errors.nama_masjid ? 'border-rose-300' : 'border-slate-200 focus:border-sky-500'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              {errors.nama_masjid && <p className="text-xs text-rose-500 mt-1">{errors.nama_masjid}</p>}
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Alamat Lengkap Sekolah <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={form.alamat_masjid}
                onChange={(e) => handleChange('alamat_masjid', e.target.value)}
                placeholder="Jl. Pendidikan No. ..., RT/RW, Kelurahan"
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400 resize-none ${
                  errors.alamat_masjid ? 'border-rose-300' : 'border-slate-200 focus:border-sky-500'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              {errors.alamat_masjid && <p className="text-xs text-rose-500 mt-1">{errors.alamat_masjid}</p>}
            </div>

            {/* No HP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No. Telepon / WhatsApp Kontak Pembina <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={form.nohp_masjid}
                  onChange={(e) => handleChange('nohp_masjid', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400 ${
                    errors.nohp_masjid ? 'border-rose-300' : 'border-slate-200 focus:border-sky-500'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              {errors.nohp_masjid && <p className="text-xs text-rose-500 mt-1">{errors.nohp_masjid}</p>}
            </div>

            {/* Wilayah cascading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Provinsi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.id_provinsi}
                    onChange={(e) => handleChange('id_provinsi', e.target.value)}
                    disabled={loadingWilayah}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none bg-white ${
                      errors.id_provinsi ? 'border-rose-300' : 'border-slate-200 focus:border-sky-500'
                    }`}
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
                {errors.id_provinsi && <p className="text-xs text-rose-500 mt-1">{errors.id_provinsi}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kabupaten/Kota <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.id_kabupaten_kota}
                    onChange={(e) => handleChange('id_kabupaten_kota', e.target.value)}
                    disabled={!form.id_provinsi}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none bg-white ${
                      errors.id_kabupaten_kota ? 'border-rose-300' : 'border-slate-200 focus:border-sky-500'
                    }`}
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
                {errors.id_kabupaten_kota && <p className="text-xs text-rose-500 mt-1">{errors.id_kabupaten_kota}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kecamatan
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.id_kecamatan}
                    onChange={(e) => handleChange('id_kecamatan', e.target.value)}
                    disabled={!form.id_kabupaten_kota}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-sky-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none bg-white"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kelurahan/Desa
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.id_kelurahan_desa}
                    onChange={(e) => handleChange('id_kelurahan_desa', e.target.value)}
                    disabled={!form.id_kecamatan}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-sky-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none bg-white"
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

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Keterangan Tambahan <span className="text-slate-400 font-normal lowercase">(opsional - NPSN, jumlah siswa, dll.)</span>
              </label>
              <textarea
                value={form.keterangan}
                onChange={(e) => handleChange('keterangan', e.target.value)}
                placeholder="Contoh: NPSN 20108901 / Jumlah siswa 750 orang"
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 focus:border-sky-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400 resize-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="flex items-start gap-2 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-rose-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {submitError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {submitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan UPZ Sekolah'}
          </button>
        </form>
      </div>
    </div>
  );
}
