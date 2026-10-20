import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  FileText,
  Send,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import type { PengajuanFormData, PengajuanFormState, Kecamatan, KelurahanDesa } from '../types';

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
        // Silent fail - use empty list
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
    if (!form.nama_masjid.trim()) newErrors.nama_masjid = 'Nama masjid wajib diisi';
    if (!form.alamat_masjid.trim()) newErrors.alamat_masjid = 'Alamat masjid wajib diisi';
    if (!form.nohp_masjid.trim()) newErrors.nohp_masjid = 'Nomor HP wajib diisi';
    else if (!/^0[0-9]{8,12}$/.test(form.nohp_masjid.replace(/[\s-]/g, '')))
      newErrors.nohp_masjid = 'Format nomor HP tidak valid (contoh: 08123456789)';
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
      <div className="min-h-screen bg-[#FAFAFA] pt-20">
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-[#F0F4F8] p-8 text-center">
            <div className="w-16 h-16 bg-[#EAF6E8] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-[#28A71A]" />
            </div>
            <h2
              className="text-xl font-semibold text-[#303030] mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Pengajuan Berhasil Dikirim!
            </h2>
            <p
              className="text-sm text-text-gray mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Terima kasih! Pengajuan masjid Anda telah diterima dan akan diproses oleh tim BAZNAS. Kami akan menghubungi Anda melalui nomor yang didaftarkan.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 py-2.5 px-6 bg-[#28A71A] text-white rounded-lg text-sm font-medium hover:bg-[#1C7712] transition-colors"
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
    <div className="min-h-screen bg-[#FAFAFA] pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-text-gray hover:text-[#28A71A] transition-colors mb-6"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-[#28A71A]" />
            </div>
            <div>
              <h1
                className="text-xl font-semibold text-[#303030]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Ajukan Masjid Baru
              </h1>
              <p
                className="text-sm text-text-gray"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Daftarkan masjid Anda ke platform MENARA Masjid BAZNAS
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#F0F4F8] p-6 space-y-5">
            {/* Nama Masjid */}
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Nama Masjid <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama_masjid}
                onChange={(e) => handleChange('nama_masjid', e.target.value)}
                placeholder="Masukkan nama masjid"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all placeholder:text-[#B0B0B0] ${
                  errors.nama_masjid ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              {errors.nama_masjid && <p className="text-xs text-red-500 mt-1">{errors.nama_masjid}</p>}
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Alamat Masjid <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.alamat_masjid}
                onChange={(e) => handleChange('alamat_masjid', e.target.value)}
                placeholder="Masukkan alamat lengkap masjid"
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all placeholder:text-[#B0B0B0] resize-none ${
                  errors.alamat_masjid ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              {errors.alamat_masjid && <p className="text-xs text-red-500 mt-1">{errors.alamat_masjid}</p>}
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No. HP Pengurus <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                <input
                  type="tel"
                  value={form.nohp_masjid}
                  onChange={(e) => handleChange('nohp_masjid', e.target.value)}
                  placeholder="08123456789"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all placeholder:text-[#B0B0B0] ${
                    errors.nohp_masjid ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              {errors.nohp_masjid && <p className="text-xs text-red-500 mt-1">{errors.nohp_masjid}</p>}
            </div>

            {/* Wilayah - 4 dropdown cascading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <select
                    value={form.id_provinsi}
                    onChange={(e) => handleChange('id_provinsi', e.target.value)}
                    disabled={loadingWilayah}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all appearance-none bg-white ${
                      errors.id_provinsi ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                    } ${!form.id_provinsi ? 'text-[#B0B0B0]' : 'text-[#303030]'}`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinsiList.map((p) => (
                      <option key={p.id} value={p.id} className="text-[#303030]">
                        {p.nama_provinsi}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.id_provinsi && <p className="text-xs text-red-500 mt-1">{errors.id_provinsi}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kabupaten/Kota <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <select
                    value={form.id_kabupaten_kota}
                    onChange={(e) => handleChange('id_kabupaten_kota', e.target.value)}
                    disabled={!form.id_provinsi}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all appearance-none bg-white ${
                      errors.id_kabupaten_kota ? 'border-red-300' : 'border-[#D4D4D4] focus:border-[#28A71A]'
                    } ${!form.id_kabupaten_kota ? 'text-[#B0B0B0]' : 'text-[#303030]'}`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <option value="">Pilih Kab/Kota</option>
                    {kabkotList.map((k) => (
                      <option key={k.id} value={k.id} className="text-[#303030]">
                        {k.nama_kabupaten_kota}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.id_kabupaten_kota && <p className="text-xs text-red-500 mt-1">{errors.id_kabupaten_kota}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kecamatan
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <select
                    value={form.id_kecamatan}
                    onChange={(e) => handleChange('id_kecamatan', e.target.value)}
                    disabled={!form.id_kabupaten_kota}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all appearance-none bg-white ${
                      !form.id_kabupaten_kota ? 'text-[#B0B0B0]' : 'text-[#303030]'
                    } border-[#D4D4D4] focus:border-[#28A71A]`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {kecamatanList.map((k) => (
                      <option key={k.id} value={k.id} className="text-[#303030]">
                        {k.nama_kecamatan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kelurahan/Desa
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <select
                    value={form.id_kelurahan_desa}
                    onChange={(e) => handleChange('id_kelurahan_desa', e.target.value)}
                    disabled={!form.id_kecamatan}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 transition-all appearance-none bg-white ${
                      !form.id_kecamatan ? 'text-[#B0B0B0]' : 'text-[#303030]'
                    } border-[#D4D4D4] focus:border-[#28A71A]`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <option value="">Pilih Kelurahan/Desa</option>
                    {kelurahanList.map((k) => (
                      <option key={k.id} value={k.id} className="text-[#303030]">
                        {k.nama_kelurahan_desa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Keterangan Tambahan
              </label>
              <textarea
                value={form.keterangan}
                onChange={(e) => handleChange('keterangan', e.target.value)}
                placeholder="Informasi tambahan tentang masjid (misal: status tanah, luas bangunan, dll.)"
                rows={3}
                className="w-full px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all placeholder:text-[#B0B0B0] resize-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {submitError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#28A71A]/20"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {submitting ? 'Mengirim...' : 'Ajukan Masjid'}
          </button>

          <p className="text-xs text-center text-[#B0B0B0]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Dengan mengirimkan formulir ini, Anda menyetujui{' '}
            <Link to="#" className="text-[#28A71A] hover:underline">Syarat & Ketentuan</Link> yang berlaku.
          </p>
        </form>
      </div>
    </div>
  );
}
