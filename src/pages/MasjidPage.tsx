import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Star, Users, Share2, Filter, Loader2, AlertCircle, GraduationCap } from 'lucide-react';
import { masjidService } from '../services/masjidService';
import type { Provinsi } from '../types';

/** Field UPZ Sekolah dari endpoint publik Content Service */
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

type FilterType = 'Semua' | 'SMA/SMK' | 'SMP/MTs' | 'Madrasah';

export default function MasjidPage() {
  const [searchInput, setSearchInput] = useState('');
  const [nama, setNama] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Semua');
  const [idProvinsi, setIdProvinsi] = useState<number | undefined>(undefined);

  const [masjids, setMasjids] = useState<PublikMasjid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const hasilRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setNama(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch daftar sekolah dari content service
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

  // Load provinsi
  useEffect(() => {
    masjidService
      .getProvinsi()
      .then((res) => setProvinsiList((res.data || []) as Provinsi[]))
      .catch(() => setProvinsiList([]));
  }, []);

  const handleShare = (masjid: PublikMasjid) => {
    const shareData = {
      title: masjid.nama_masjid || 'UPZ Sekolah',
      text: `${masjid.nama_masjid} - terdaftar resmi di platform UPZ Sekolah BAZNAS`,
      url: `${window.location.origin}/masjid/${masjid.slug_masjid || masjid.id_masjid}`,
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
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section pb-6 pt-12">
        <div className="badge-blue mx-auto mb-5 w-fit">
          <GraduationCap size={15} />
          <span>Direktori UPZ Sekolah</span>
        </div>
        <h1 className="text-display-xl max-md:text-[32px] text-slate-800">
          Cari <span className="text-gradient-blue">UPZ Sekolah</span>{' '}
          <span className="text-gradient-blue">Seluruh Indonesia</span>
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto mt-2">
          Temukan informasi lengkap Unit Pengumpul Zakat berbasis sekolah di berbagai wilayah Indonesia binaan BAZNAS RI
        </p>

        {/* Search Container */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              <Filter size={15} className="text-slate-500 shrink-0" />
              {(['Semua', 'SMA/SMK', 'SMP/MTs', 'Madrasah'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-sky-500 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari nama sekolah, kota, atau NPSN..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              <span className="text-xs font-medium text-slate-400 flex-shrink-0 ml-2 hidden sm:inline">
                {loading ? '...' : `${masjids.length} sekolah ditemukan`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HASIL PENCARIAN ===== */}
      <section className="page-section pt-4" ref={hasilRef}>
        <div className="page-section-inner max-w-6xl">
          <div className="text-center mb-10">
            <div className="badge-blue mx-auto mb-3 w-fit">
              <Star size={14} />
              <span>Terverifikasi BAZNAS</span>
            </div>
            <h2 className="section-title text-slate-800">
              Daftar UPZ Sekolah <span className="text-gradient-blue">Binaan BAZNAS</span>
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {loading
                ? 'Memuat data sekolah...'
                : `${masjids.length} UPZ Sekolah ditampilkan${masjids.length >= 60 ? ' (maks. 60)' : ''}`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={28} className="animate-spin text-sky-600" />
              <span className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Memuat data UPZ Sekolah...
              </span>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <AlertCircle size={40} className="text-rose-500" />
              <p className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Gagal memuat data UPZ Sekolah. Silakan muat ulang halaman.
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
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden card-hover group transition-all hover:shadow-lg hover:border-sky-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image / Header Cover */}
                    <div className="relative h-44 bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center overflow-hidden">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🏫</span>

                      {/* Type Badge */}
                      <span
                        className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide bg-sky-600/90 text-white shadow-sm"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {masjid.jenis_masjid || 'UPZ Sekolah'}
                      </span>

                      {/* Capacity Badge */}
                      {masjid.daya_tampung && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-medium text-slate-600 shadow-sm">
                          <Users size={11} className="text-sky-600" />
                          <span>{masjid.daya_tampung} Siswa</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Location */}
                      {masjid.alamat_masjid && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-2">
                          <MapPin size={13} className="text-sky-600 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {masjid.alamat_masjid}
                          </span>
                        </div>
                      )}

                      {/* Name */}
                      <h3
                        className="text-base font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors line-clamp-1"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {masjid.nama_masjid || 'UPZ Sekolah'}
                      </h3>

                      {/* Description */}
                      {masjid.deskripsi && (
                        <p
                          className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          dangerouslySetInnerHTML={{ __html: masjid.deskripsi }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0">
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <Link
                        to={`/masjid/${masjid.slug_masjid || masjid.id_masjid}`}
                        className="flex-1 text-center text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-sky-600/20"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        Lihat Profil UPZ
                      </Link>
                      <button
                        onClick={() => handleShare(masjid)}
                        className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-3.5 py-2.5 rounded-xl transition-all"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <Share2 size={13} />
                        <span className="hidden sm:inline">Bagikan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!loading && !error && masjids.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
              <div className="text-5xl mb-3 opacity-30">🏫</div>
              <p
                className="text-sm font-medium text-slate-500"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Tidak ada data UPZ Sekolah yang sesuai dengan pencarian
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== REGIONS ===== */}
      <section className="page-section pb-16">
        <div className="page-section-inner max-w-6xl">
          <div className="text-center mb-10">
            <div className="badge-blue mx-auto mb-3 w-fit">
              <MapPin size={14} />
              <span>Wilayah Sebaran</span>
            </div>
            <h2 className="section-title text-slate-800">
              Jelajahi Berdasarkan <span className="text-gradient-blue">Wilayah Provinsi</span>
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Klik provinsi untuk memfilter daftar UPZ Sekolah di wilayah terkait
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {provinsiList.map((prov) => (
              <button
                key={prov.id}
                onClick={() => pilihProvinsi(Number(prov.id))}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all text-left card-hover ${
                  idProvinsi === Number(prov.id)
                    ? 'bg-sky-50 border-sky-500 shadow-md shadow-sky-500/10'
                    : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100/80 flex items-center justify-center text-sky-700 font-bold text-sm shrink-0">
                    {prov.nama_provinsi.charAt(0)}
                  </div>
                  <div>
                    <h4
                      className={`font-bold transition-colors text-sm ${
                        idProvinsi === Number(prov.id) ? 'text-sky-700' : 'text-slate-800 group-hover:text-sky-600'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {prov.nama_provinsi}
                    </h4>
                    <p
                      className="text-xs text-slate-400 mt-0.5"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Provinsi
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-600 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
