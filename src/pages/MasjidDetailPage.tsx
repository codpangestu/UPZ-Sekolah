import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Users, Loader2, AlertCircle, Building2, Calendar } from 'lucide-react';
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
  const { id } = useParams<{ id: string }>(); // id = slug masjid
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
        // 404 backend mengirim status_code="404" dengan data null — ApiResponse
        // type frontend tidak punya status_code, jadi cukup cek data-nya.
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
      <div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#28A71A]" />
          <span className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Memuat profil masjid...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <AlertCircle size={48} className="text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#303030] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terjadi Kesalahan</h2>
          <p className="text-sm text-[#555] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Gagal memuat profil masjid. Coba muat ulang halaman.</p>
          <Link to="/masjid" className="btn-primary-green">Kembali ke Daftar Masjid</Link>
        </div>
      </div>
    );
  }

  if (notFound || !masjid) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-[#303030] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masjid Tidak Ditemukan</h2>
          <p className="text-sm text-[#555] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masjid yang Anda cari tidak tersedia.</p>
          <Link to="/masjid" className="btn-primary-green">Kembali ke Daftar Masjid</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="page-section">
        <div className="page-section-inner max-w-4xl">
          {/* Back Button */}
          <Link
            to="/masjid"
            className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#28A71A] transition-colors mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Masjid
          </Link>

          {/* Header Card */}
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl overflow-hidden mb-6 card-hover">
            <div className="h-64 bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] flex items-center justify-center relative">
              <span className="text-8xl">🕌</span>
              {masjid.jenis_masjid && (
                <span
                  className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide ${
                    masjid.jenis_masjid === 'Musholla' ? 'bg-[#FF8C00]/90 text-white' : 'bg-[#28A71A]/90 text-white'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {masjid.jenis_masjid}
                </span>
              )}
            </div>
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#303030] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {masjid.nama_masjid || 'Tanpa Nama'}
              </h1>
              {masjid.alamat_masjid && (
                <div className="flex items-start gap-2 text-sm text-[#555] mb-4">
                  <MapPin size={16} className="text-[#28A71A] mt-0.5 flex-shrink-0" />
                  <span>{masjid.alamat_masjid}</span>
                </div>
              )}
              {stripHtml(masjid.deskripsi) && (
                <p className="text-base text-[#303030] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {stripHtml(masjid.deskripsi)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Kontak */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6">
              <div className="badge-green mb-4 w-fit">
                <MapPin size={14} />
                <span>Informasi Kontak</span>
              </div>
              <div className="space-y-4">
                {masjid.alamat_masjid ? (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#28A71A] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alamat</p>
                      <p className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.alamat_masjid}</p>
                    </div>
                  </div>
                ) : null}
                {masjid.nohp_masjid ? (
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[#28A71A] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Telepon</p>
                      <p className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.nohp_masjid}</p>
                    </div>
                  </div>
                ) : null}
                {masjid.email_masjid ? (
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#28A71A] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email</p>
                      <p className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.email_masjid}</p>
                    </div>
                  </div>
                ) : null}
                {!masjid.alamat_masjid && !masjid.nohp_masjid && !masjid.email_masjid && (
                  <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Informasi kontak belum dilengkapi admin masjid.
                  </p>
                )}
              </div>
            </div>

            {/* Fasilitas */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6">
              <div className="badge-green mb-4 w-fit">
                <Building2 size={14} />
                <span>Fasilitas</span>
              </div>
              {masjid.fasilitas && masjid.fasilitas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {masjid.fasilitas.map((fas) => (
                    <span key={fas.id} className="badge-sm">{fas.nama}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Fasilitas belum didata.
                </p>
              )}
            </div>

            {/* Kajian & Acara Terbaru dari masjid ini (data asli) */}
            <div className="md:col-span-2 bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6">
              <div className="badge-green mb-4 w-fit">
                <Users size={14} />
                <span>Kajian & Acara</span>
              </div>
              {((masjid.kajian?.length ?? 0) + (masjid.acara?.length ?? 0)) > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {masjid.kajian?.slice(0, 4).map((k) => (
                    <div key={`k-${k.id}`} className="flex items-start gap-3 p-3 bg-[#FAFAFA] rounded-xl border border-[rgba(0,0,0,0.04)]">
                      <div className="w-9 h-9 rounded-full bg-[#EAF6E8] flex items-center justify-center text-[#28A71A] flex-shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#303030] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.judul}</p>
                        <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Kajian{k.tanggal ? ` • ${k.tanggal.slice(0, 10)}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  {masjid.acara?.slice(0, 4).map((a) => (
                    <div key={`a-${a.id}`} className="flex items-start gap-3 p-3 bg-[#FAFAFA] rounded-xl border border-[rgba(0,0,0,0.04)]">
                      <div className="w-9 h-9 rounded-full bg-[#EAF6E8] flex items-center justify-center text-[#28A71A] flex-shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#303030] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.judul}</p>
                        <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Acara{a.tanggal ? ` • ${a.tanggal.slice(0, 10)}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Belum ada kajian/acara yang dipublikasikan masjid ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
