import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Navigation } from 'lucide-react';
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

// Custom mosque icons by type
function makeIcon(type: string, active: boolean): L.DivIcon {
  const isMasjid = type === 'Masjid';
  const bgColor = isMasjid
    ? 'linear-gradient(135deg, #28A71A, #1f8a13)'
    : 'linear-gradient(135deg, #FF8C00, #E67E00)';
  const shadowColor = isMasjid ? 'rgba(40,167,26,0.4)' : 'rgba(255,140,0,0.4)';
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
        box-shadow: 0 2px 8px ${shadowColor};
        font-size: ${fontSize}px;
        transform: scale(${scale});
        transition: all 0.3s ease;
      ">🕌</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

// Extended mosque data with coordinates
const MOSQUE_DATA = [
  {
    id: 'M001',
    name: 'Masjid Istiqlal',
    address: 'Jl. Taman Wijaya Kusuma, Jakarta Pusat',
    type: 'Masjid',
    lat: -6.1701,
    lng: 106.8311,
    fasilitas: ['Taman', 'Parkir Luas', 'Perpustakaan', 'Kantin'],
  },
  {
    id: 'M002',
    name: 'Masjid Raya Al-Markaz',
    address: 'Jl. Masjid Raya No. 1, Makassar',
    type: 'Masjid',
    lat: -5.1328,
    lng: 119.4219,
    fasilitas: ['Taman', 'Parkir Luas', 'Perpustakaan'],
  },
  {
    id: 'M003',
    name: 'Masjid Raya Baiturrahman',
    address: 'Jl. Muhammad Jam No. 1, Banda Aceh',
    type: 'Masjid',
    lat: 5.5533,
    lng: 95.3172,
    fasilitas: ['Taman', 'Parkir Luas', 'Museum'],
  },
  {
    id: 'M004',
    name: 'Musholla At-Taqwa',
    address: 'Jl. Asia Afrika, Bandung',
    type: 'Musholla',
    lat: -6.9217,
    lng: 107.6071,
    fasilitas: ['AC', 'Tempat Wudhu', 'Parkir'],
  },
  {
    id: 'M005',
    name: 'Masjid Al-Akbar',
    address: 'Jl. Masjid Al-Akbar, Surabaya',
    type: 'Masjid',
    lat: -7.3177,
    lng: 112.7297,
    fasilitas: ['AC', 'Taman', 'Parkir Luas'],
  },
  {
    id: 'M006',
    name: 'Masjid Agung Demak',
    address: 'Jl. Sultan Fatah, Demak',
    type: 'Masjid',
    lat: -6.8948,
    lng: 110.6372,
    fasilitas: ['Taman', 'Museum', 'Parkir Luas'],
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

  const filteredMosques = useMemo(() => {
    if (!searchQuery.trim()) return MOSQUE_DATA;
    const q = searchQuery.toLowerCase();
    return MOSQUE_DATA.filter(
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
    <section className="section-padding py-10">
      <div className="content-width">
        {/* Heading */}
        <div className="flex flex-col justify-center items-start gap-4 mb-[27px]">
          <div className="badge-green">
            <MapPin size={14} />
            <span>Peta Sebaran</span>
          </div>
          <h2 className="text-display-lg max-md:text-[32px] max-md:leading-[40px]">
            Sebaran Masjid & Musholla di Indonesia
          </h2>
          <p className="text-base leading-6 text-[#303030] w-full text-justify max-md:text-sm">
            Temukan dan jelajahi masjid & musholla yang tersebar di seluruh Indonesia.
            Klik marker atau kartu untuk detail lokasi.
          </p>
        </div>

        {/* Map + List Container */}
        <div className="flex flex-row items-start gap-10 max-lg:flex-col">
          {/* Map Container */}
          <div className="w-[700px] flex-shrink-0 max-lg:w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] overflow-hidden">
            {/* Search Bar */}
            <div className="flex items-center gap-2 p-3 border-b border-[rgba(0,0,0,0.04)]">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#F0F4F8] rounded-lg">
                <Search size={16} className="text-[#888] shrink-0" />
                <input
                  type="text"
                  placeholder="Cari masjid, kota, atau provinsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-[#303030] placeholder:text-[#aaa] focus:outline-none bg-transparent"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              <button
                onClick={handleLocateMe}
                className="flex items-center gap-1.5 text-xs font-medium text-[#28A71A] bg-[#E6F9F0] hover:bg-[#d0f0cc] px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                title="Deteksi lokasi saya"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Navigation size={14} />
                Lokasi
              </button>
            </div>

            {/* Leaflet Map */}
            <div className="h-[480px] max-lg:h-[300px] relative z-0">
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
                        html: '<div style="width:20px;height:20px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                      })
                    }
                  >
                    <Popup>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px' }}>
                        <strong>Lokasi Saya</strong>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Mosque markers */}                  {filteredMosques.map((m) => {
                  const isActive = activeId === m.id;
                  return (
                    <Marker
                      key={m.id}
                      position={[m.lat, m.lng]}
                      icon={makeIcon(m.type, isActive)}
                      eventHandlers={{
                        click: () => setActiveId(m.id),
                      }}
                    >
                      <Popup>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: '180px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#303030', marginBottom: '2px' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                            {m.address}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            {m.fasilitas.slice(0, 3).map((f, i) => (
                              <span key={i} style={{
                                fontSize: '9px',
                                padding: '1px 6px',
                                background: '#E6F9F0',
                                color: '#28A71A',
                                borderRadius: '4px',
                                fontWeight: 500,
                              }}>
                                {f}
                              </span>
                            ))}
                          </div>
                          <a
                            href={`/masjid/${m.id}`}
                            style={{
                              fontSize: '11px',
                              color: '#28A71A',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            Lihat Detail →
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Fly to active marker */}
                {activeId && (() => {
                  const m = filteredMosques.find((x) => x.id === activeId);
                  if (!m) return null;
                  return <FlyToMarker lat={m.lat} lng={m.lng} />;
                })()}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(0,0,0,0.04)] bg-[#FAFAFA]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#28A71A] border-2 border-white shadow-sm" />
                <span className="text-[10px] text-[#666]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masjid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF8C00] border-2 border-white shadow-sm" />
                <span className="text-[10px] text-[#666]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Musholla</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6] border-2 border-white shadow-sm" />
                <span className="text-[10px] text-[#666]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lokasi Saya</span>
              </div>
              <span className="text-[10px] text-[#aaa] ml-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {filteredMosques.length} lokasi
              </span>
            </div>
          </div>

          {/* List Masjid */}
          <div className="flex flex-col gap-4 flex-1 w-full max-h-[560px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center w-full sticky top-0 bg-[#FAFAFA] py-2 z-10">
              <span className="text-lg font-medium leading-7 text-[#303030]">Masjid dan Musholla Terdekat</span>
              <div className="badge-xs">{filteredMosques.length} ditemukan</div>
            </div>

            {filteredMosques.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 opacity-30">🔍</div>
                <p className="text-sm text-[#888]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Tidak ada masjid yang ditemukan
                </p>
              </div>
            ) : (
              filteredMosques.map((masjid) => {
                const isActive = activeId === masjid.id;
                return (
                  <div
                    key={masjid.id}
                    onClick={() => handleCardClick(masjid.id)}
                    className={`masjid-card w-full cursor-pointer transition-all ${
                      isActive
                        ? 'ring-2 ring-[#28A71A] ring-offset-2 bg-[#F0FDF0]'
                        : 'hover:bg-[#F0FDF0]'
                    }`}
                  >
                    <div className="w-[78px] h-[78px] bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      🕌
                    </div>
                    <div className="flex flex-col items-start gap-3 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium leading-5 text-black">{masjid.name}</span>
                          <span className="text-sm leading-5 text-[#888]">{masjid.address}</span>
                        </div>
                        {masjid.type === 'Musholla' ? (
                          <div className="px-2.5 py-0.5 bg-[#FFF3E0] text-[#E65100] rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Musholla</div>
                        ) : (
                          <div className="px-2.5 py-0.5 bg-[#E6F9F0] text-[#28A71A] rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Masjid</div>
                        )}
                      </div>
                      <div className="flex flex-row gap-2 flex-wrap">
                        {masjid.fasilitas.map((fas, i) => (
                          <div key={i} className="badge-sm">{fas}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <Link to="/masjid" className="btn-primary-green w-full justify-center rounded-lg mt-2">
              Lihat Semua
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
