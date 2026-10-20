import { useState, useEffect, useMemo, useCallback } from 'react';
import { Compass, MapPin, Navigation, HelpCircle, Target } from 'lucide-react';

// Kaaba coordinates (Mecca)
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

// Radius of Earth in km
const R = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculate Qibla direction (bearing from user location to Kaaba)
 * Using the great circle formula
 */
function calculateQibla(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const λ1 = toRad(lng);
  const λ2 = toRad(KAABA_LNG);

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

  let bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * Calculate distance from user location to Kaaba using Haversine formula
 */
function calculateDistance(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δφ = toRad(KAABA_LAT - lat);
  const Δλ = toRad(KAABA_LNG - lng);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function formatDistance(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(1)} rb km`;
  if (km >= 1) return `${km.toFixed(0)} km`;
  return `${(km * 1000).toFixed(0)} m`;
}

function getCardinalDirection(degree: number): string {
  const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
}

export default function ArahKiblat() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('Mendeteksi lokasi...');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<number | null>(null);
  const [orientationPermission, setOrientationPermission] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung browser ini');
      setLocationName('Lokasi tidak tersedia');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationName(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);

        // Reverse geocode (simple)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
        )
          .then((res) => res.json())
          .then((data) => {
            const city = data.address?.city || data.address?.town || data.address?.village || '';
            const country = data.address?.country || '';
            if (city) setLocationName(`${city}, ${country}`);
            else setLocationName(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
          })
          .catch(() => {
            setLocationName(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
          });
      },
      (err) => {
        setLocationError('Akses lokasi ditolak. Gunakan lokasi default (Jakarta).');
        // Default to Jakarta
        setLocation({ lat: -6.2088, lng: 106.8456 });
        setLocationName('Jakarta, Indonesia');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Get device orientation for compass
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.alpha !== null) {
      setDeviceOrientation(e.alpha);
    }
  }, []);

  const requestOrientationPermission = useCallback(async () => {
    // iOS 13+ requires permission request
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setOrientationPermission(true);
        }
      } catch {
        // Fallback
        window.addEventListener('deviceorientation', handleOrientation);
        setOrientationPermission(true);
      }
    } else {
      // Android / desktop
      window.addEventListener('deviceorientation', handleOrientation);
      setOrientationPermission(true);
    }
  }, [handleOrientation]);

  // Cleanup orientation listener
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  // Calculate Qibla
  const qiblaData = useMemo(() => {
    if (!location) return null;

    const bearing = calculateQibla(location.lat, location.lng);
    const distance = calculateDistance(location.lat, location.lng);

    return {
      bearing,
      distance,
      cardinal: getCardinalDirection(bearing),
    };
  }, [location]);

  if (!mounted) return null;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Compass size={18} className="text-[#28A71A]" />
        <h3 className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Arah Kiblat
        </h3>
      </div>

      {/* Location Info */}
      <div className="flex items-center gap-1.5 text-xs text-[#555] mb-5">
        <MapPin size={12} />
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{locationName}</span>
        {orientationPermission && deviceOrientation !== null && (
          <>
            <span className="mx-1">·</span>
            <Navigation size={12} className="text-[#28A71A]" />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {deviceOrientation.toFixed(0)}°
            </span>
          </>
        )}
      </div>

      {locationError && (
        <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-700 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {locationError}
        </div>
      )}

      {/* Compass Display */}
      <div className="relative w-48 h-48 mx-auto mb-5">
        {/* Compass Outer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-[#F0F4F8]" />

        {/* Compass markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Cardinal direction lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = toRad(angle - 90);
            const innerR = angle % 90 === 0 ? 65 : 72;
            const x1 = 100 + innerR * Math.cos(rad);
            const y1 = 100 + innerR * Math.sin(rad);
            const x2 = 100 + 88 * Math.cos(rad);
            const y2 = 100 + 88 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={angle % 90 === 0 ? '#303030' : '#D4D4D4'}
                strokeWidth={angle % 90 === 0 ? 2 : 1}
              />
            );
          })}

          {/* Cardinal Labels */}
          <text x="100" y="18" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#303030" fontFamily="'Plus Jakarta Sans', sans-serif">U</text>
          <text x="185" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#303030" fontFamily="'Plus Jakarta Sans', sans-serif">T</text>
          <text x="100" y="192" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#303030" fontFamily="'Plus Jakarta Sans', sans-serif">S</text>
          <text x="15" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#303030" fontFamily="'Plus Jakarta Sans', sans-serif">B</text>

          {/* Small direction labels */}
          <text x="135" y="18" textAnchor="middle" fontSize="9" fill="#555" fontFamily="'Plus Jakarta Sans', sans-serif">TL</text>
          <text x="185" y="60" textAnchor="middle" fontSize="9" fill="#555" fontFamily="'Plus Jakarta Sans', sans-serif">TG</text>
          <text x="135" y="192" textAnchor="middle" fontSize="9" fill="#555" fontFamily="'Plus Jakarta Sans', sans-serif">BD</text>
          <text x="15" y="60" textAnchor="middle" fontSize="9" fill="#555" fontFamily="'Plus Jakarta Sans', sans-serif">BL</text>
        </svg>

        {/* Qibla Arrow (rotated by device orientation + qibla bearing) */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{
            transform: `rotate(${
              deviceOrientation !== null
                ? qiblaData
                  ? qiblaData.bearing - deviceOrientation
                  : 0
                : qiblaData
                ? qiblaData.bearing
                : 0
            }deg)`,
          }}
        >
          <div className="relative">
            {/* Qibla indicator - green arrow pointing up */}
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[40px] border-l-transparent border-r-transparent border-b-[#28A71A] mx-auto" />
            {/* Circle at base */}
            <div className="w-3 h-3 rounded-full bg-[#28A71A] mx-auto -mt-1 shadow-md" />
          </div>
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#303030]" />
        </div>

        {/* North indicator */}
        {deviceOrientation !== null && (
          <div
            className="absolute top-0 left-1/2 -ml-2 w-4 h-4 transition-transform duration-300"
            style={{ transform: `rotate(${-deviceOrientation}deg)` }}
          >
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#E53E3E]" />
          </div>
        )}
      </div>

      {/* Qibla Info */}
      {qiblaData && (
        <div className="text-center mb-5">
          <div className="text-3xl font-bold text-[#28A71A] tabular-nums" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {qiblaData.bearing.toFixed(1)}°
          </div>
          <p className="text-xs text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Arah Kiblat ({qiblaData.cardinal})
          </p>
        </div>
      )}

      {/* Steps / Info */}
      <div className="border-t border-[rgba(0,0,0,0.1)] pt-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={14} className="text-[#555]" />
          <span className="text-xs font-medium text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Cara Penggunaan
          </span>
        </div>
        <ol className="text-[10px] text-[#555] space-y-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#EAF6E8] text-[#28A71A] text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            Izinkan akses lokasi untuk mendeteksi posisi Anda
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#EAF6E8] text-[#28A71A] text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            {orientationPermission
              ? 'Arahkan perangkat sesuai kompas — panah hijau menunjuk Kiblat'
              : 'Aktifkan sensor kompas untuk panduan arah real-time'}
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#EAF6E8] text-[#28A71A] text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            Sesuaikan arah sholat mengikuti panah hijau
          </li>
        </ol>

        {!orientationPermission && (
          <button
            onClick={requestOrientationPermission}
            className="mt-3 w-full py-2 bg-[#28A71A] text-white rounded-lg text-xs font-medium hover:bg-[#1C7712] transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Target size={14} />
            Aktifkan Kompas
          </button>
        )}

        {orientationPermission && (
          <div className="mt-3 flex items-center gap-2 text-[10px] text-[#28A71A] bg-[#EAF6E8] rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-[#28A71A] animate-pulse" />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kompas aktif — arahkan perangkat
            </span>
          </div>
        )}
      </div>

      {/* Distance */}
      {qiblaData && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-[#555] bg-[#FAFAFA] rounded-lg px-3 py-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <MapPin size={10} />
            Jarak ke Ka'bah: {formatDistance(qiblaData.distance)}
          </div>
        </div>
      )}
    </div>
  );
}
