import { useState, useEffect } from 'react';
import { Megaphone, Search, Clock, User, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { contentService } from '../services/contentService';

// =====================================================================
// Halaman publik publikasi — data ASLI dari Content Service (8003):
//   /api/v1/kajian (84), /acara (12), /cerita (8), /donasi (17),
//   /informasi (3) — lihat CONTEXT.md Fix History #48.
// Tab tanpa sumber data (postingan/wisata/audio) dihapus — dulu tampil
// dummy hardcoded. Fix #48.
// =====================================================================

/** Item publikasi ternormalisasi dari berbagai endpoint content service. */
interface PublikasiItem {
  id: number;
  tipe: 'Berita' | 'Cerita' | 'Kajian' | 'Donasi' | 'Acara';
  judul: string;
  isi: string;
  penulis: string;
  tanggal: string;
  foto: string;
  slug: string;
  dana_terkumpul?: number;
  target_dana?: number;
  batas_tanggal?: string | null;
}

const TIPE_META: Record<PublikasiItem['tipe'], { emoji: string; badge: string }> = {
  Berita: { emoji: '📰', badge: 'Berita' },
  Cerita: { emoji: '📖', badge: 'Cerita' },
  Kajian: { emoji: '🕌', badge: 'Kajian' },
  Donasi: { emoji: '🤲', badge: 'Donasi' },
  Acara: { emoji: '🎯', badge: 'Acara' },
};

const filterKategori = [
  { id: 'semua', label: 'Semua' },
  { id: 'berita', label: 'Berita' },
  { id: 'cerita', label: 'Cerita' },
  { id: 'kajian', label: 'Kajian' },
  { id: 'donasi', label: 'Donasi' },
  { id: 'acara', label: 'Acara' },
];

const stripHtml = (html?: string | null) => (html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '');

const formatTanggal = (iso?: string | null) => {
  if (!iso) return '';
  try {
    return new Date(iso.slice(0, 10).replace(/ /g, 'T')).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
};

const formatRupiah = (v?: number) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

/**
 * API mengirim tipe lowercase ('kajian','acara','cerita','donasi','informasi') —
 * map ke label tampilan (Fix #48: dulu langsung dipakai → key TIPE_META undefined).
 */
const TIPE_MAP: Record<string, PublikasiItem['tipe']> = {
  kajian: 'Kajian',
  acara: 'Acara',
  cerita: 'Cerita',
  donasi: 'Donasi',
  informasi: 'Berita',
};

/** Normalisasi response generik content service ({id,judul,isi,foto,tanggal,slug,penulis,tipe,...}). */
function normalize(raw: Record<string, unknown>): PublikasiItem {
  const tipe = TIPE_MAP[String(raw.tipe || '').toLowerCase()] || 'Kajian';
  return {
    id: Number(raw.id),
    tipe,
    judul: String(raw.judul || 'Tanpa Judul'),
    isi: stripHtml(raw.isi as string),
    penulis: String(raw.penulis || ''),
    tanggal: String(raw.tanggal || ''),
    foto: String(raw.foto || ''),
    slug: String(raw.slug || ''),
    dana_terkumpul: raw.dana_terkumpul as number | undefined,
    target_dana: raw.target_dana as number | undefined,
    batas_tanggal: (raw.batas_tanggal as string | null) || null,
  };
}

export default function PublicationMenu() {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<PublikasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ITEMS_PER_PAGE = 6;

  // Fetch dari API sesuai kategori aktif (data asli content service)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setCurrentPage(1);

    const load = async () => {
      try {
        if (activeFilter === 'semua') {
          // Gabungan 5 sumber — ambil beberapa dari masing-masing
          const [kajian, acara, cerita, donasi, berita] = await Promise.all([
            contentService.getKajian(),
            contentService.getAcara({ per_page: 6 }),
            contentService.getCerita({ per_page: 6 }),
            contentService.getDonasi({ per_page: 6 }),
            contentService.getInformasi(),
          ]);
          if (cancelled) return;
          const merged = [
            ...((kajian.data || []) as unknown as Record<string, unknown>[]).map(normalize),
            ...((acara.data || []) as unknown as Record<string, unknown>[]).map(normalize),
            ...((cerita.data || []) as unknown as Record<string, unknown>[]).map(normalize),
            ...((donasi.data || []) as unknown as Record<string, unknown>[]).map(normalize),
            ...((berita.data || []) as unknown as Record<string, unknown>[]).map(normalize),
          ]
            .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
            .slice(0, 18);
          setItems(merged);
        } else {
          const res = await (activeFilter === 'kajian'
            ? contentService.getKajian()
            : activeFilter === 'acara'
              ? contentService.getAcara({ per_page: 24 })
              : activeFilter === 'cerita'
                ? contentService.getCerita({ per_page: 24 })
                : activeFilter === 'donasi'
                  ? contentService.getDonasi({ per_page: 24 })
                  : contentService.getInformasi());
          if (cancelled) return;
          setItems(((res.data || []) as unknown as Record<string, unknown>[]).map(normalize));
        }
      } catch {
        if (cancelled) return;
        setError(true);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  // Search client-side (judul/isi/penulis) di atas data yang sudah dimuat
  const filtered = items.filter((pub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return pub.judul.toLowerCase().includes(q) || pub.isi.toLowerCase().includes(q) || pub.penulis.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="badge-green mx-auto mb-6 w-fit">
          <Megaphone size={14} />
          <span>Publikasi</span>
        </div>
        <h1>
          Jelajah <span className="text-gradient-green">Publikasi</span>
        </h1>
        <p className="text-lg text-[#555] max-w-2xl mx-auto">
          Informasi, kajian, acara, dan donasi terbaru dari masjid-masjid di seluruh Indonesia
        </p>

        {/* Search Section - Filter Chips + Search */}
        <div className="mx-auto mt-8 w-full max-w-[1200px] flex items-center gap-4">
          {/* Filter Chips */}
          <div
            className="flex-1 flex flex-row items-center px-4 h-10 rounded-2xl bg-[#F0F4F8] overflow-x-auto gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {filterKategori.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f.id)}
                className={`whitespace-nowrap text-sm font-medium transition-all px-4 py-1.5 rounded-full shrink-0 ${
                  activeFilter === f.id
                    ? 'bg-[#28A71A] text-white'
                    : 'text-[#737373] hover:text-[#555]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 px-4 h-10 rounded-2xl bg-white border border-[rgba(0,0,0,0.1)] min-w-[220px] shrink-0">
            <Search size={16} className="text-[#B0B0B0] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari publikasi..."
              className="w-full text-sm text-[#303030] placeholder:text-[#B0B0B0] focus:outline-none bg-transparent"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="page-section pb-20">
        <div className="page-section-inner max-w-6xl">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={28} className="animate-spin text-[#28A71A]" />
              <span className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Memuat publikasi...
              </span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <AlertCircle size={40} className="text-[#EF4444]" />
              <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Gagal memuat publikasi. Coba muat ulang halaman.
              </p>
            </div>
          )}

          {/* Featured Card */}
          {!loading && !error && pagedItems.length > 0 && (
            <div className="mb-8">
              <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden card-hover md:flex hover:shadow-lg transition-all">
                <div className="md:w-[400px] h-56 md:h-auto bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] flex items-center justify-center text-7xl flex-shrink-0 relative overflow-hidden">
                  <span className="relative z-10">{TIPE_META[pagedItems[0].tipe].emoji}</span>
                  {/* Type badge on image */}
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#28A71A]/90 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {pagedItems[0].tipe}
                  </span>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium text-[#888] flex items-center gap-1">
                        {TIPE_META[pagedItems[0].tipe].emoji} {pagedItems[0].tipe}
                      </span>
                      <span className="text-[#ddd]">|</span>
                      <span className="text-[11px] text-[#888]">{formatTanggal(pagedItems[0].tanggal)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#303030] mb-3 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {pagedItems[0].judul}
                    </h3>
                    {pagedItems[0].isi && (
                      <p className="text-sm text-[#555] mb-4 leading-relaxed line-clamp-2">{pagedItems[0].isi}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-4 text-xs text-[#555]">
                      {pagedItems[0].penulis && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {pagedItems[0].penulis}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Cards */}
          {!loading && !error && pagedItems.length > 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedItems.slice(1).map((pub) => {
                const persen =
                  pub.target_dana && pub.target_dana > 0
                    ? Math.min(100, Math.round(((pub.dana_terkumpul || 0) / pub.target_dana) * 100))
                    : 0;
                return (
                <div
                  key={`${pub.tipe}-${pub.id}`}
                  className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden card-hover group flex flex-col hover:shadow-lg transition-all"
                >
                  {/* Image */}
                  <div className="h-44 bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] flex items-center justify-center text-5xl relative overflow-hidden">
                    <span className="relative z-10">{TIPE_META[pub.tipe].emoji}</span>
                    {/* Type badge top-left */}
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-[#28A71A]/90 text-white rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      {pub.tipe}
                    </span>
                    {/* Category emoji decoration */}
                    <span className="absolute bottom-2 right-3 text-3xl opacity-20">
                      {TIPE_META[pub.tipe].emoji}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Type + Date row */}
                    <div className="flex items-center gap-2 text-[10px] text-[#888] mb-2">
                      <span>{TIPE_META[pub.tipe].emoji} {pub.tipe}</span>
                      <span className="text-[#ddd]">|</span>
                      <span>{formatTanggal(pub.tanggal)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[#303030] mb-2 leading-snug line-clamp-2 group-hover:text-[#28A71A] transition-colors">
                      {pub.judul}
                    </h3>

                    {/* Description */}
                    {pub.isi && (
                      <p className="text-xs text-[#666] line-clamp-2 mb-3 flex-1 leading-relaxed">{pub.isi}</p>
                    )}
                    {pub.penulis && (
                      <p className="text-xs text-[#888] flex items-center gap-1.5 mb-2">
                        <User size={11} className="shrink-0" />
                        <span className="truncate">{pub.penulis}</span>
                      </p>
                    )}

                    {/* Donasi Progress (data asli: jumlah_dana_terkumpul & target) */}
                    {pub.tipe === 'Donasi' && (pub.target_dana ?? 0) > 0 && (
                      <div className="mt-auto mb-2">
                        <div className="flex justify-between text-[10px] text-[#555] mb-1">
                          <span className="font-medium">{formatRupiah(pub.dana_terkumpul)}</span>
                          <span>Target: {formatRupiah(pub.target_dana)}</span>
                        </div>
                        <div className="w-full h-2 bg-[#F0F4F8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#28A71A] to-[#6FC466] rounded-full transition-all duration-500"
                            style={{ width: `${persen}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)]">
                      <span className="flex items-center gap-1 text-[10px] text-[#555]">
                        <Clock size={10} />
                        {formatTanggal(pub.tanggal)}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && pagedItems.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-base text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Belum ada publikasi untuk kategori ini
              </p>
              <button
                onClick={() => handleFilterChange('semua')}
                className="mt-4 text-sm font-semibold text-[#28A71A] hover:text-[#1C7712] transition-colors"
              >
                Lihat Semua Publikasi →
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentPage === 1
                    ? 'text-[#ccc] cursor-not-allowed'
                    : 'bg-white border border-[rgba(0,0,0,0.08)] text-[#555] hover:border-[#28A71A] hover:text-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <ChevronLeft size={14} />
                Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                    page === currentPage
                      ? 'bg-[#28A71A] text-white shadow-sm shadow-[#28A71A]/20'
                      : 'bg-white border border-[rgba(0,0,0,0.08)] text-[#555] hover:border-[#28A71A] hover:text-[#28A71A]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentPage === totalPages
                    ? 'text-[#ccc] cursor-not-allowed'
                    : 'bg-white border border-[rgba(0,0,0,0.08)] text-[#555] hover:border-[#28A71A] hover:text-[#28A71A]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Selanjutnya
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
