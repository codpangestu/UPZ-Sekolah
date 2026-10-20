import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Navigation, HandCoins, Wallet } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuthStore } from '../../../store/authStore';
import { useMicrofinanceList } from '../hooks/useMicrofinance';
import type { PesertaProgram } from '../types';

// Fix Leaflet default marker icon issue with bundlers
// @ts-expect-error - Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeParticipantIcon(active: boolean): L.DivIcon {
  const size = active ? 42 : 32;
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: linear-gradient(135deg, #28A71A, #1f8a13);
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(40,167,26,0.4);
        font-size: ${active ? 15 : 13}px;
        color: white;
        transform: scale(${active ? 1.15 : 1});
        transition: all 0.3s ease;
      ">🕌</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.flyTo([lat, lng], 15, { duration: 1 });
  return null;
}

const formatRupiah = (v: string | number | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

type KoordinatSource = 'rumah' | 'usaha';

export default function PetaSebaranPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<PesertaProgram>('peserta-program', idMasjid);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [source, setSource] = useState<KoordinatSource>('usaha');

  const peserta = useMemo(() => listRes?.data || [], [listRes]);

  const withCoords = useMemo(() => {
    return peserta
      .map((p) => {
        const latRaw = source === 'rumah' ? p.kordinat_latitude_rumah : p.kordinat_latitude_lokasi_usaha;
        const lngRaw = source === 'rumah' ? p.kordinat_longitude_rumah : p.kordinat_longitude_lokasi_usaha;
        // Fallback ke koordinat lain jika sumber pilihan kosong
        const lat = parseFloat(latRaw || p.kordinat_latitude_rumah || '');
        const lng = parseFloat(lngRaw || p.kordinat_longitude_rumah || '');
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { ...p, lat, lng };
      })
      .filter((p): p is PesertaProgram & { lat: number; lng: number } => p !== null);
  }, [peserta, source]);

  const totalPinjaman = useMemo(
    () => peserta.reduce((acc, p) => acc + Number(p.jumlah_pinjaman || 0), 0),
    [peserta],
  );
  const totalSisa = useMemo(
    () => peserta.reduce((acc, p) => acc + Number(p.sisa_dana_pengembalian || 0), 0),
    [peserta],
  );

  const center: [number, number] = withCoords.length > 0 ? [withCoords[0].lat, withCoords[0].lng] : [-6.2, 106.8];

  return (
    <div className="space-y-6">
      <Link
        to="/microfinance"
        className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#28A71A] transition-colors"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Menu Microfinance
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <MapPin size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Peta Sebaran Geografis
          </h1>
          <p className="text-sm text-[#555]">Persebaran peserta program BMM masjid ini</p>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <Users size={14} className="text-[#28A71A]" /> Total Peserta
          </div>
          <p className="text-2xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isLoading ? '...' : peserta.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <Navigation size={14} className="text-[#28A71A]" /> Dengan Koordinat
          </div>
          <p className="text-2xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isLoading ? '...' : withCoords.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <HandCoins size={14} className="text-[#28A71A]" /> Total Pinjaman
          </div>
          <p className="text-xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isLoading ? '...' : formatRupiah(totalPinjaman)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-4">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
            <Wallet size={14} className="text-[#28A71A]" /> Sisa Pengembalian
          </div>
          <p className="text-xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isLoading ? '...' : formatRupiah(totalSisa)}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-stretch gap-6 max-lg:flex-col">
        {/* Map */}
        <div className="lg:w-[65%] bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b border-[rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-1 rounded-lg bg-[#F0F4F8] p-1">
              <button
                onClick={() => setSource('usaha')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${source === 'usaha' ? 'bg-[#28A71A] text-white' : 'text-[#555] hover:text-[#28A71A]'}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Lokasi Usaha
              </button>
              <button
                onClick={() => setSource('rumah')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${source === 'rumah' ? 'bg-[#28A71A] text-white' : 'text-[#555] hover:text-[#28A71A]'}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Lokasi Rumah
              </button>
            </div>
            <span className="text-xs text-[#888] ml-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {withCoords.length} titik
            </span>
          </div>
          <div className="h-[480px] max-lg:h-[320px] relative z-0">
            <MapContainer center={center} zoom={14} scrollWheelZoom={true} className="w-full h-full" zoomControl={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {withCoords.map((p) => (
                <Marker
                  key={p.id_peserta_program_bmfi_asesmen}
                  position={[p.lat, p.lng]}
                  icon={makeParticipantIcon(activeId === p.id_peserta_program_bmfi_asesmen)}
                  eventHandlers={{ click: () => setActiveId(p.id_peserta_program_bmfi_asesmen) }}
                >
                  <Popup>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: '190px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#303030', marginBottom: '2px' }}>
                        {p.nama_peserta_program_bmfi_asesmen || '-'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                        {p.nama_usaha || 'Usaha tidak diisi'}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontSize: '9px', padding: '1px 6px', background: '#E6F9F0', color: '#28A71A', borderRadius: '4px', fontWeight: 500 }}>
                          Pinjaman {formatRupiah(p.jumlah_pinjaman)}
                        </span>
                        <span style={{ fontSize: '9px', padding: '1px 6px', background: '#FFF3E0', color: '#E65100', borderRadius: '4px', fontWeight: 500 }}>
                          Sisa {formatRupiah(p.sisa_dana_pengembalian)}
                        </span>
                      </div>
                      {p.lokasi_usaha && (
                        <div style={{ fontSize: '11px', color: '#888' }}>{p.lokasi_usaha}</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
              {activeId && withCoords.find((x) => x.id_peserta_program_bmfi_asesmen === activeId) && (
                <FlyToMarker lat={activeLat(withCoords, activeId)} lng={activeLng(withCoords, activeId)} />
              )}
            </MapContainer>
          </div>
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(0,0,0,0.04)] bg-[#FAFAFA]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#28A71A] border-2 border-white shadow-sm" />
              <span className="text-[10px] text-[#666]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Peserta BMM</span>
            </div>
            <span className="text-[10px] text-[#aaa] ml-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sumber koordinat: {source === 'usaha' ? 'Lokasi Usaha' : 'Lokasi Rumah'}
            </span>
          </div>
        </div>

        {/* Daftar peserta ber-koordinat */}
        <div className="flex-1 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(0,0,0,0.04)]">
            <span className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Peserta dengan Koordinat
            </span>
            <span className="badge-xs">{withCoords.length} peserta</span>
          </div>
          <div className="flex-1 max-h-[480px] overflow-y-auto divide-y divide-[rgba(0,0,0,0.04)]">
            {isLoading ? (
              <div className="p-10 text-center text-sm text-[#888]">Memuat data...</div>
            ) : withCoords.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-2 opacity-30">🗺️</div>
                <p className="text-sm text-[#888]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Belum ada peserta dengan koordinat lokasi
                </p>
              </div>
            ) : (
              withCoords.map((p) => (
                <button
                  key={p.id_peserta_program_bmfi_asesmen}
                  onClick={() => setActiveId(p.id_peserta_program_bmfi_asesmen)}
                  className={`w-full text-left px-4 py-3 transition-colors ${activeId === p.id_peserta_program_bmfi_asesmen ? 'bg-[#F0FDF0] ring-1 ring-inset ring-[#28A71A]/30' : 'hover:bg-[#FAFAFA]'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[#303030] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {p.nama_peserta_program_bmfi_asesmen || '-'}
                    </span>
                    <MapPin size={14} className="text-[#28A71A] shrink-0" />
                  </div>
                  <div className="text-xs text-[#888] truncate mt-0.5">{p.nama_usaha || 'Usaha tidak diisi'}</div>
                  <div className="flex gap-2 mt-1.5">
                    <span className="badge-xs">{formatRupiah(p.jumlah_pinjaman)}</span>
                    <span className="badge-xs bg-[#FFF3E0] text-[#E65100]">Sisa {formatRupiah(p.sisa_dana_pengembalian)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function activeLat(list: (PesertaProgram & { lat: number; lng: number })[], id: number): number {
  return list.find((x) => x.id_peserta_program_bmfi_asesmen === id)?.lat ?? 0;
}

function activeLng(list: (PesertaProgram & { lat: number; lng: number })[], id: number): number {
  return list.find((x) => x.id_peserta_program_bmfi_asesmen === id)?.lng ?? 0;
}