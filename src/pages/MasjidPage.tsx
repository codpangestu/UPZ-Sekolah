import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Star, Users, Share2, Filter, Loader2, AlertCircle } from 'lucide-react';
import { masjidService } from '../services/masjidService';
import type { Provinsi } from '../types';

/** Field masjid dari endpoint publik GET /content 8003 /masjid/search (Fix #48). */
interface PublikMasjid {
  id_masjid: string;
  nama_masjid: string | null;
  jenis_masjid: string | null;
  tipologi: string | null;
  alamat_masjid: string | null;
  daya_tampung: string | null;
  deskripsi: string | null;
  slug_masjid: string | null;
}

type FilterType = 'Semua' | 'Masjid' | 'Musholla';

export default function MasjidPage() {
  const [searchInput, setSearchInput] = useState('');
  const [nama, setNama] = useState(''); // nilai yang sudah di-debounce → dikirim ke server
  const [activeFilter, setActiveFilter] = useState<FilterType>('Semua');
  const [idProvinsi, setIdProvinsi] = useState<number | undefined>(undefined);

  const [masjids, setMasjids] = useState<PublikMasjid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const hasilRef = useRef<HTMLDivElement>(null);

  // Debounce input pencarian (server-side search, bukan filter data mock)
  useEffect(() => {
    const t = setTimeout(() => setNama(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch daftar masjid dari endpoint publik content service
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    masjidService
      .searchMasjid({
        nama: nama || undefined,
        jenis: activeFilter === 'Semua' ? undefined : activeFilter,
        id_provinsi: idProvinsi,
        limit: 60,
      })
      .then((res) => {
        if (cancelled) return;
        setMasjids((res.data || []) as unknown as PublikMasjid[]);
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
  }, [nama, activeFilter, idProvinsi]);

  // Daftar provinsi untuk section "Jelajahi Wilayah" (endpoint butuh x-api-key — sudah ada di masjidApi)
  useEffect(() => {
    masjidService
      .getProvinsi()
      .then((res) => setProvinsiList((res.data || []) as Provinsi[]))
      .catch(() => setProvinsiList([]));
  }, []);

  const handleShare = (masjid: PublikMasjid) => {
    const shareData = {
      title: masjid.nama_masjid || 'Masjid',
      text: `${masjid.nama_masjid} - terdaftar di platform MENARA`,
      url: `${window.location.origin}/masjid/${masjid.slug_masjid}`,
    };
    if (typeof navigator.share === 'function') {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareData.url).catch(() => {});
    }
  };

  const pilihProvinsi = (id: number) => {
    setIdProvinsi((prev) => (prev === id ? undefined : id));
    hasilRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section pb-6">
        <div className="badge-green mx-auto mb-6 w-fit">
          <MapPin size={14} />
          <span>Peta Sebaran</span>
        </div>
        <h1>
          Cari <span className="text-gradient-green">Masjid</span> & Musholla{' '}
          <span className="text-gradient-green">Seluruh Indonesia</span>
        </h1>
        <p className="text-lg text-[#555] max-w-2xl mx-auto mt-3">
          Temukan informasi lengkap masjid dan musholla di berbagai wilayah Indonesia
        </p>

        {/* Search Container */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm p-6">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <Filter size={14} className="text-[#555]" />
              {(['Semua', 'Masjid', 'Musholla'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-[#28A71A] text-white shadow-sm shadow-[#28A71A]/20'
                      : 'bg-[#F0F4F8] text-[#555] hover:bg-[#E6F9F0] hover:text-[#28A71A]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-[#F0F4F8] rounded-xl px-4 py-3">
              <Search size={18} className="text-[#B0B0B0] mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari nama masjid..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-sm text-[#303030] placeholder:text-[#B0B0B0] focus:outline-none bg-transparent"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              <span className="text-[11px] text-[#B0B0B0] flex-shrink-0 ml-2 hidden sm:inline">
                {loading ? '...' : `${masjids.length} ditemukan`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HASIL PENCARIAN (data asli dari Content Service) ===== */}
      <section className="page-section pt-4" ref={hasilRef}>
        <div className="page-section-inner max-w-6xl">
          <div className="text-center mb-10">
            <div className="badge-green mx-auto mb-4 w-fit">
              <Star size={14} />
              <span>Terdaftar</span>
            </div>
            <h2 className="section-title">
              Masjid & Musholla <span className="text-gradient-green">Terverifikasi MENARA</span>
            </h2>
            <p className="text-base text-[#555] mt-3">
              {loading
                ? 'Memuat data masjid...'
                : `${masjids.length} masjid/musholla ditampilkan${masjids.length >= 60 ? ' (maks. 60)' : ''}`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={28} className="animate-spin text-[#28A71A]" />
              <span className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Memuat data masjid...
              </span>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <AlertCircle size={40} className="text-[#EF4444]" />
              <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Gagal memuat data masjid. Coba muat ulang halaman.
              </p>
            </div>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {!loading &&
              !error &&
              masjids.map((masjid) => (
                <div
                  key={masjid.id_masjid}
                  className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden card-hover group transition-all hover:shadow-lg hover:border-[#28A71A]/20"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] flex items-center justify-center overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🕌</span>

                    {/* Type Badge */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${
                        masjid.jenis_masjid === 'Musholla'
                          ? 'bg-[#FF8C00]/90 text-white'
                          : 'bg-[#28A71A]/90 text-white'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {masjid.jenis_masjid || 'Masjid'}
                    </span>

                    {/* Capacity Badge */}
                    {masjid.daya_tampung && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#555] shadow-sm">
                        <Users size={10} />
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{masjid.daya_tampung}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Location */}
                    {masjid.alamat_masjid && (
                      <div className="flex items-start gap-1 text-[11px] text-[#888] mb-1.5">
                        <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {masjid.alamat_masjid}
                        </span>
                      </div>
                    )}

                    {/* Name */}
                    <h3
                      className="text-base font-bold text-[#303030] mb-1.5 group-hover:text-[#28A71A] transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {masjid.nama_masjid || 'Tanpa Nama'}
                    </h3>

                    {/* Description */}
                    {masjid.deskripsi && (
                      <p
                        className="text-xs text-[#666] mb-3 line-clamp-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        dangerouslySetInnerHTML={{ __html: masjid.deskripsi }}
                      />
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[rgba(0,0,0,0.04)]">
                      <Link
                        to={`/masjid/${masjid.slug_masjid || masjid.id_masjid}`}
                        className="flex-1 text-center text-xs font-semibold text-white bg-[#28A71A] hover:bg-[#1f8a13] px-4 py-2 rounded-xl transition-colors"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        Lihat Profil
                      </Link>
                      <button
                        onClick={() => handleShare(masjid)}
                        className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#555] bg-[#F0F4F8] hover:bg-[#E6F9F0] hover:text-[#28A71A] px-3 py-2 rounded-xl transition-all"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <Share2 size={12} />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!loading && !error && masjids.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-30">🕌</div>
              <p
                className="text-sm text-[#888]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Tidak ada masjid atau musholla yang ditemukan
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== REGIONS (data provinsi asli dari API, klik untuk filter) ===== */}
      <section className="page-section">
        <div className="page-section-inner max-w-6xl">
          <div className="text-center mb-10">
            <div className="badge-green mx-auto mb-4 w-fit">
              <MapPin size={14} />
              <span>Wilayah</span>
            </div>
            <h2 className="section-title">
              Jelajahi Berdasarkan <span className="text-gradient-green">Wilayah</span>
            </h2>
            <p className="text-base text-[#555] mt-3">
              Klik provinsi untuk memfilter daftar masjid di atas
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {provinsiList.map((prov) => (
              <button
                key={prov.id}
                onClick={() => pilihProvinsi(Number(prov.id))}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all text-left card-hover ${
                  idProvinsi === Number(prov.id)
                    ? 'bg-[#EAF6E8] border-[#28A71A] shadow-md'
                    : 'bg-white border-[rgba(0,0,0,0.08)] hover:border-[#28A71A]/30 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F9F0] flex items-center justify-center text-[#28A71A] font-bold text-sm shrink-0">
                    {prov.nama_provinsi.charAt(0)}
                  </div>
                  <div>
                    <h4
                      className={`font-semibold transition-colors text-sm ${
                        idProvinsi === Number(prov.id) ? 'text-[#28A71A]' : 'text-[#303030] group-hover:text-[#28A71A]'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {prov.nama_provinsi}
                    </h4>
                    <p
                      className="text-xs text-[#888] mt-0.5"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Provinsi
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#ccc] group-hover:text-[#28A71A] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
