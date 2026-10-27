import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Loader2, AlertCircle, GraduationCap, Calendar, Award } from 'lucide-react';
import { masjidService } from '../services/masjidService';

/** Shape response GET /api/v1/masjid/{slug} (Content Service 8003). */
interface PublikMasjidDetail {
  id_masjid?: string;
  nama_masjid?: string | null;
  slug_masjid?: string | null;
  jenis_masjid?: string | null;
  tipologi?: string | null;
  alamat_masjid?: string | null;
  deskripsi?: string | null;
  nohp_masjid?: string | null;
  email_masjid?: string | null;
  fasilitas?: Array<{ id: number; nama: string }>;
  kajian?: Array<{ id: number; judul: string; tanggal: string; penulis?: string }>;
  acara?: Array<{ id: number; judul: string; tanggal: string; penulis?: string }>;
}

export default function MasjidDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [masjid, setMasjid] = useState<PublikMasjidDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError(false);
    setMasjid(null);
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    masjidService
      .getMasjidBySlug(id)
      .then((res) => {
        if (cancelled) return;
        if (!res?.data) {
          setNotFound(true);
        } else {
          setMasjid(res.data as unknown as PublikMasjidDetail);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const stripHtml = (html?: string | null) => (html ? html.replace(/<[^>]*>/g, '').trim() : '');

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-sky-600" />
          <span className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Memuat profil UPZ Sekolah...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terjadi Kesalahan</h2>
          <p className="text-sm text-slate-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Gagal memuat profil UPZ Sekolah. Silakan muat ulang halaman.</p>
          <Link to="/masjid" className="btn-primary-blue">Kembali ke Direktori UPZ Sekolah</Link>
        </div>
      </div>
    );
  }

  if (notFound || !masjid) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🏫</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>UPZ Sekolah Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Data UPZ Sekolah yang Anda cari belum terdaftar atau tidak aktif.</p>
          <Link to="/masjid" className="btn-primary-blue">Kembali ke Direktori UPZ Sekolah</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="page-section py-8">
        <div className="page-section-inner max-w-4xl">
          {/* Back Button */}
          <Link
            to="/masjid"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft size={16} />
            Kembali ke Direktori UPZ Sekolah
          </Link>

          {/* Header Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden mb-6 shadow-sm">
            <div className="h-64 bg-gradient-to-br from-sky-50 via-sky-100/60 to-sky-50 flex items-center justify-center relative">
              <span className="text-8xl">🏫</span>
              <span
                className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wide bg-sky-600 text-white shadow-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {masjid.jenis_masjid || 'UPZ Sekolah BAZNAS'}
              </span>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-xs">Binaan BAZNAS</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {masjid.nama_masjid || 'UPZ Sekolah'}
              </h1>
              {masjid.alamat_masjid && (
                <div className="flex items-start gap-2 text-sm text-slate-500 mb-4">
                  <MapPin size={16} className="text-sky-600 mt-0.5 flex-shrink-0" />
                  <span>{masjid.alamat_masjid}</span>
                </div>
              )}
              {stripHtml(masjid.deskripsi) && (
                <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {stripHtml(masjid.deskripsi)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Kontak */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="badge-blue mb-4 w-fit">
                <MapPin size={14} />
                <span>Informasi Kontak Sekolah</span>
              </div>
              <div className="space-y-4">
                {masjid.alamat_masjid ? (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alamat Lengkap</p>
                      <p className="text-sm text-slate-700 font-medium mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.alamat_masjid}</p>
                    </div>
                  </div>
                ) : null}
                {masjid.nohp_masjid ? (
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No. Telepon / WhatsApp</p>
                      <p className="text-sm text-slate-700 font-medium mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.nohp_masjid}</p>
                    </div>
                  </div>
                ) : null}
                {masjid.email_masjid ? (
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alamat Email</p>
                      <p className="text-sm text-slate-700 font-medium mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.email_masjid}</p>
                    </div>
                  </div>
                ) : null}
                {!masjid.alamat_masjid && !masjid.nohp_masjid && !masjid.email_masjid && (
                  <p className="text-sm text-slate-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Informasi kontak belum dilengkapi oleh admin sekolah.
                  </p>
                )}
              </div>
            </div>

            {/* Fasilitas & Program */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="badge-blue mb-4 w-fit">
                <GraduationCap size={15} />
                <span>Program & Layanan ZIS</span>
              </div>
              {masjid.fasilitas && masjid.fasilitas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {masjid.fasilitas.map((fas) => (
                    <span key={fas.id} className="badge-sm bg-sky-50 text-sky-700 font-medium border border-sky-100">{fas.nama}</span>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="badge-sm bg-sky-50 text-sky-700 font-medium border border-sky-100 mr-2">Beasiswa Siswa</span>
                  <span className="badge-sm bg-sky-50 text-sky-700 font-medium border border-sky-100 mr-2">Kotak Infak Jumat</span>
                  <span className="badge-sm bg-sky-50 text-sky-700 font-medium border border-sky-100">Bantuan SPP Mustahik</span>
                </div>
              )}
            </div>

            {/* Kegiatan & Acara Terbaru dari UPZ Sekolah */}
            <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="badge-blue mb-4 w-fit">
                <Calendar size={14} />
                <span>Kegiatan & Penyaluran Beasiswa</span>
              </div>
              {((masjid.kajian?.length ?? 0) + (masjid.acara?.length ?? 0)) > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {masjid.kajian?.slice(0, 4).map((k) => (
                    <div key={`k-${k.id}`} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.judul}</p>
                        <p className="text-xs text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Kegiatan{k.tanggal ? ` • ${k.tanggal.slice(0, 10)}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  {masjid.acara?.slice(0, 4).map((a) => (
                    <div key={`a-${a.id}`} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <Award size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.judul}</p>
                        <p className="text-xs text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Penyaluran{a.tanggal ? ` • ${a.tanggal.slice(0, 10)}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Belum ada agenda atau penyaluran yang dipublikasikan oleh UPZ Sekolah ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
