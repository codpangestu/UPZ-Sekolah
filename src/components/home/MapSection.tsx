import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Navigation, GraduationCap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icon issue with bundlers
// @ts-expect-error - Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom UPZ Sekolah icons by type
function makeIcon(type: string, active: boolean): L.DivIcon {
  const isSMA = type.includes('SMA') || type.includes('SMK') || type.includes('Aliyah');
  const bgColor = isSMA
    ? 'linear-gradient(135deg, #0284C7, #0EA5E9)'
    : 'linear-gradient(135deg, #0284C7, #38BDF8)';
  const shadowColor = 'rgba(2, 132, 199, 0.4)';
  const size = active ? 44 : 36;
  const fontSize = active ? 20 : 16;
  const scale = active ? 1.15 : 1;
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${bgColor};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${shadowColor};
        font-size: ${fontSize}px;
        transform: scale(${scale});
        transition: all 0.3s ease;
      ">🏫</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

// UPZ Sekolah sample data across Indonesia
const SCHOOL_DATA = [
  {
    id: 'SCH001',
    name: 'UPZ SMAN 1 Jakarta',
    address: 'Jl. Budi Utomo No. 7, Sawah Besar, Jakarta Pusat',
    type: 'SMA Negeri',
    lat: -6.1685,
    lng: 106.8365,
    fasilitas: ['Beasiswa Siswa', 'Kotak Infak Jumat', 'Kantin Berkah', 'Bank Sampah ZIS'],
  },
  {
    id: 'SCH002',
    name: 'UPZ SMKN 2 Bandung',
    address: 'Jl. Ciliwung No. 4, Cihapit, Kota Bandung',
    type: 'SMK Negeri',
    lat: -6.9038,
    lng: 107.6254,
    fasilitas: ['Bantuan SPP/DSP', 'Pelatihan Wirausaha', 'Koperasi UPZ'],
  },
  {
    id: 'SCH003',
    name: 'UPZ MAN 1 Yogyakarta',
    address: 'Jl. C Simanjuntak No. 60, Gondokusuman, Yogyakarta',
    type: 'Madrasah Aliyah',
    lat: -7.7778,
    lng: 110.3752,
    fasilitas: ['Santunan Yatim', 'Beasiswa Prestasi', 'Pemberdayaan Guru Honorer'],
  },
  {
    id: 'SCH004',
    name: 'UPZ SMPN 1 Surabaya',
    address: 'Jl. Pacar No. 4-6, Ketabang, Genteng, Surabaya',
    type: 'SMP Negeri',
    lat: -7.2605,
    lng: 112.7486,
    fasilitas: ['Gerakan Seribu Sehari', 'Bantuan Seragam & Buku', 'Dapur Sehat'],
  },
  {
    id: 'SCH005',
    name: 'UPZ SMA Taruna Nusantara',
    address: 'Jl. Raya Purworejo Km. 5, Mertoyudan, Magelang',
    type: 'SMA Swasta',
    lat: -7.5255,
    lng: 110.2241,
    fasilitas: ['Wakaf Buku Edukasi', 'Beasiswa Penuh BAZNAS', 'Asrama Berkah'],
  },
  {
    id: 'SCH006',
    name: 'UPZ SMAN 1 Makassar',
    address: 'Jl. Gunung Bawakaraeng No. 53, Makassar',
    type: 'SMA Negeri',
    lat: -5.1382,
    lng: 119.4215,
    fasilitas: ['Bina Rohani Siswa', 'Santunan Dhuafa', 'Klinik Siswa'],
  },
];

// Component to fly to marker when a card is clicked
function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1 });
  }, [lat, lng, map]);
  return null;
}

export default function MapSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) return SCHOOL_DATA;
    const q = searchQuery.toLowerCase();
    return SCHOOL_DATA.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCardClick = (id: string) => {
    setActiveId(id);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          alert('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
        }
      );
    }
  };

  return (
    <section className="section-padding py-12">
      <div className="content-width">
        {/* Heading */}
        <div className="flex flex-col justify-center items-start gap-3 mb-8">
          <div className="badge-blue">
            <GraduationCap size={15} />
            <span>Peta Sebaran UPZ Sekolah</span>
          </div>
          <h2 className="text-display-lg max-md:text-[28px] max-md:leading-[36px] text-slate-800">
            Sebaran UPZ Sekolah di Seluruh Indonesia
          </h2>
          <p className="text-base leading-6 text-slate-600 max-w-3xl max-md:text-sm">
            Temukan dan pantau Unit Pengumpul Zakat berbasis sekolah yang resmi terdaftar di BAZNAS.
            Dukung transparansi donasi, beasiswa, dan program kebaikan untuk pelajar di seluruh tanah air.
          </p>
        </div>

        {/* Map + List Container */}
        <div className="flex flex-row items-start gap-8 max-lg:flex-col">
          {/* Map Container */}
          <div className="w-[680px] flex-shrink-0 max-lg:w-full bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
            {/* Search Bar */}
            <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl focus-within:border-sky-500 transition-colors">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari nama sekolah, kota, atau jenjang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              <button
                onClick={handleLocateMe}
                className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 px-3.5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                title="Deteksi lokasi saya"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Navigation size={14} />
                Lokasi Saya
              </button>
            </div>

            {/* Leaflet Map */}
            <div className="h-[480px] max-lg:h-[320px] relative z-0">
              <MapContainer
                center={[-2.5, 118]}
                zoom={5}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User location marker */}
                {userLocation && (
                  <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={
                      new L.DivIcon({
                        className: 'user-marker',
                        html: '<div style="width:20px;height:20px;background:#0284C7;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(2,132,199,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                      })
                    }
                  >
                    <Popup>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px' }}>
                        <strong>Lokasi Anda</strong>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* School markers */}
                {filteredSchools.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <Marker
                      key={s.id}
                      position={[s.lat, s.lng]}
                      icon={makeIcon(s.type, isActive)}
                      eventHandlers={{
                        click: () => setActiveId(s.id),
                      }}
                    >
                      <Popup>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: '200px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>
                            {s.address}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {s.fasilitas.slice(0, 3).map((f, i) => (
                              <span key={i} style={{
                                fontSize: '9px',
                                padding: '2px 6px',
                                background: '#E0F2FE',
                                color: '#0369A1',
                                borderRadius: '4px',
                                fontWeight: 600,
                              }}>
                                {f}
                              </span>
                            ))}
                          </div>
                          <a
                            href={`/masjid/${s.id}`}
                            style={{
                              fontSize: '11px',
                              color: '#0284C7',
                              fontWeight: 700,
                              textDecoration: 'none',
                            }}
                          >
                            Lihat Profil UPZ Sekolah →
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Fly to active marker */}
                {activeId && (() => {
                  const s = filteredSchools.find((x) => x.id === activeId);
                  if (!s) return null;
                  return <FlyToMarker lat={s.lat} lng={s.lng} />;
                })()}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0284C7] border-2 border-white shadow-sm" />
                <span className="text-[11px] text-slate-600 font-medium">SMA / SMK / MA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#38BDF8] border-2 border-white shadow-sm" />
                <span className="text-[11px] text-slate-600 font-medium">SMP / MTs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0284C7] border-2 border-white shadow-sm" />
                <span className="text-[11px] text-slate-600 font-medium">Lokasi Anda</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium ml-auto">
                {filteredSchools.length} UPZ Sekolah
              </span>
            </div>
          </div>

          {/* List Sekolah */}
          <div className="flex flex-col gap-3.5 flex-1 w-full max-h-[570px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center w-full sticky top-0 bg-[#FAFAFA] py-2 z-10">
              <span className="text-base font-bold text-slate-800">Daftar UPZ Sekolah Terdekat</span>
              <div className="badge-xs">{filteredSchools.length} sekolah</div>
            </div>

            {filteredSchools.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <div className="text-4xl mb-2 opacity-40">🔍</div>
                <p className="text-sm text-slate-500 font-medium">
                  Tidak ada UPZ Sekolah yang ditemukan
                </p>
              </div>
            ) : (
              filteredSchools.map((school) => {
                const isActive = activeId === school.id;
                return (
                  <div
                    key={school.id}
                    onClick={() => handleCardClick(school.id)}
                    className={`w-full p-4 rounded-xl cursor-pointer transition-all border ${
                      isActive
                        ? 'border-sky-500 bg-sky-50/60 shadow-md shadow-sky-100'
                        : 'border-slate-200/80 bg-white hover:border-sky-300 hover:bg-sky-50/30'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-sm shadow-sky-500/20">
                        🏫
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-800 truncate">{school.name}</span>
                          <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0">
                            {school.type}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 line-clamp-1 mb-2.5">{school.address}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {school.fasilitas.map((fas, i) => (
                            <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {fas}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <Link to="/masjid" className="btn-primary-blue w-full justify-center rounded-xl mt-2 py-3 text-sm font-semibold">
              Lihat Semua UPZ Sekolah
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
