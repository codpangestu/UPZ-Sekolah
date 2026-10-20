import { useState, useEffect, useMemo } from 'react';
import { Sun, Sunrise, Sunset, Moon, MapPin, Clock, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

interface PrayerEntry {
  name: string;
  icon: typeof Sun;
  time: Date;
  label: string;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

const CITY_DATA: { name: string; lat: number; lng: number }[] = [
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
  { name: 'Surabaya', lat: -7.2575, lng: 112.7521 },
  { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { name: 'Medan', lat: 3.5952, lng: 98.6722 },
  { name: 'Makassar', lat: -5.1477, lng: 119.4327 },
];

const PRAYER_CONFIG: { key: keyof PrayerTimes; name: string; icon: typeof Sun }[] = [
  { key: 'fajr', name: 'Subuh', icon: Moon },
  { key: 'sunrise', name: 'Terbit', icon: Sunrise },
  { key: 'dhuhr', name: 'Dzuhur', icon: Sun },
  { key: 'asr', name: 'Ashar', icon: Sun },
  { key: 'maghrib', name: 'Maghrib', icon: Sunset },
  { key: 'isha', name: 'Isya', icon: Moon },
];

export default function JadwalSholat() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cityIndex, setCityIndex] = useState(0);

  // Update time every second for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reactive coordinates based on selected city
  const coordinates = useMemo(() => {
    const city = CITY_DATA[cityIndex];
    return new Coordinates(city.lat, city.lng);
  }, [cityIndex]);

  const calculationMethod = useMemo(() => {
    const params = CalculationMethod.Singapore();
    params.fajrAngle = 20;
    params.ishaAngle = 18;
    return params;
  }, []);

  const prayerTimes = useMemo(() => {
    return new PrayerTimes(coordinates, currentTime, calculationMethod);
  }, [coordinates, currentTime, calculationMethod]);

  // Build prayer list
  const prayers: PrayerEntry[] = useMemo(() => {
    return PRAYER_CONFIG.map((p) => {
      const time = prayerTimes[p.key] as Date;
      return {
        name: p.name,
        icon: p.icon,
        time,
        label: formatTime(time),
      };
    });
  }, [prayerTimes]);

  // Determine next prayer index (0 = Subuh today, -1 = all passed → Subuh tomorrow)
  const rawNextIndex = useMemo(() => {
    const now = currentTime.getTime();
    return prayers.findIndex((p) => p.time.getTime() > now);
  }, [currentTime, prayers]);

  const isAfterIsha = rawNextIndex === -1;
  const nextPrayerIndex = isAfterIsha ? 0 : rawNextIndex;

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Progress bar: percentage from previous prayer toward next prayer
  const progressPercent = useMemo(() => {
    if (prayers.length === 0) return 0;
    // For after Isya, show toward Fajr next day — cap at 100%
    if (isAfterIsha) {
      const ishaMinutes =
        prayers[5]?.time.getHours() * 60 + prayers[5]?.time.getMinutes();
      const endOfDay = 24 * 60; // midnight
      const total = endOfDay - ishaMinutes;
      if (total <= 0) return 0;
      return Math.min(100, ((nowMinutes - ishaMinutes) / total) * 100);
    }
    const next = nextPrayerIndex;
    const prev = next > 0 ? next - 1 : prayers.length - 1;
    const prevMinutes =
      prayers[prev]?.time.getHours() * 60 + prayers[prev]?.time.getMinutes();
    const nextMinutes =
      prayers[next]?.time.getHours() * 60 + prayers[next]?.time.getMinutes();
    const range = nextMinutes - prevMinutes;
    if (range <= 0) return 0;
    const elapsed = nowMinutes - prevMinutes;
    return Math.min(100, Math.max(0, (elapsed / range) * 100));
  }, [prayers, nextPrayerIndex, nowMinutes, isAfterIsha]);

  const selectedCity = CITY_DATA[cityIndex];

  return (
    <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] overflow-hidden shadow-sm">
      {/* ===== HEADER NAVIGASI ===== */}
      <div className="relative px-6 pt-5 pb-4">
        {/* Back + Title Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#28A71A]/10 flex items-center justify-center text-[#28A71A] cursor-pointer hover:bg-[#28A71A]/20 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <h2
            className="text-lg font-bold text-[#303030]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Jadwal Sholat
          </h2>
        </div>

        {/* City Switcher + Clock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setCityIndex((i) => (i - 1 + CITY_DATA.length) % CITY_DATA.length)
                }
                className="w-6 h-6 rounded-full bg-[#28A71A]/10 flex items-center justify-center text-[#28A71A] hover:bg-[#28A71A]/20 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span
                className="text-sm font-semibold text-[#303030]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {selectedCity.name}
              </span>
              <button
                onClick={() =>
                  setCityIndex((i) => (i + 1) % CITY_DATA.length)
                }
                className="w-6 h-6 rounded-full bg-[#28A71A]/10 flex items-center justify-center text-[#28A71A] hover:bg-[#28A71A]/20 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <span className="text-[#aaa] text-xs">|</span>
            <span
              className="text-xs text-[#555]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Indonesia
            </span>
          </div>

          {/* Live Clock */}
          <div className="flex items-center gap-1.5 bg-[#FAFAFA] px-3 py-1.5 rounded-lg">
            <Clock size={12} className="text-[#28A71A]" />
            <span
              className="text-xs font-semibold text-[#28A71A] tabular-nums"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Date */}
        <div
          className="mt-2 text-[11px] text-[#888] flex items-center gap-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <MapPin size={10} />
          {formattedDate}
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="mx-6 h-px bg-[rgba(0,0,0,0.04)]" />

      {/* ===== PRAYER TIMES TABLE ===== */}
      <div className="px-6 py-4">
        {prayers.map((prayer, idx) => {
          const isNext = !isAfterIsha && idx === nextPrayerIndex;
          const prayerMinutes = prayer.time.getHours() * 60 + prayer.time.getMinutes();
          const isPast = isAfterIsha || prayerMinutes < nowMinutes;

          return (
            <div key={prayer.name}>
              <div
                className={`relative flex items-center justify-between py-3 px-4 rounded-2xl transition-all ${
                  isNext
                    ? 'bg-gradient-to-r from-[#28A71A]/10 to-[#28A71A]/5 ring-1 ring-[#28A71A]/20'
                    : isPast
                    ? 'opacity-45'
                    : 'hover:bg-[#FAFAFA]'
                }`}
              >
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-3">
                  {/* Timeline dot indicator */}
                  <div className="relative flex items-center justify-center">
                    {isNext ? (
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-[#28A71A] animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#28A71A]/30 animate-ping" />
                      </div>
                    ) : (
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isPast ? 'bg-[#ddd]' : 'bg-[#28A71A]/40'
                        }`}
                      />
                    )}
                  </div>

                  <prayer.icon
                    size={18}
                    className={isNext ? 'text-[#28A71A]' : 'text-[#888]'}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isNext ? 'text-[#28A71A] font-bold' : 'text-[#555]'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {prayer.name}
                  </span>
                </div>

                {/* Right: Time + Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      isNext ? 'text-[#28A71A]' : 'text-[#303030]'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {prayer.label}
                  </span>
                  {isNext && (
                    <span className="text-[9px] font-bold text-white bg-[#28A71A] px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Sekarang
                    </span>
                  )}
                  {isAfterIsha && idx === prayers.length - 1 && (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wide border border-amber-200">
                      Selesai
                    </span>
                  )}
                </div>
              </div>

              {/* Divider between rows (except last) */}
              {idx < prayers.length - 1 && (
                <div className="ml-[60px] mr-4 h-px bg-[rgba(0,0,0,0.04)]" />
              )}
            </div>
          );
        })}
      </div>

      {/* ===== GRADIENT FOOTER ===== */}
      <div className="relative mt-2 overflow-hidden">
        <div className="bg-gradient-to-br from-[#28A71A] via-[#1f8a13] to-[#166b0d] px-6 py-6">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10">
            {/* Next Prayer Info */}
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] text-white/70 uppercase tracking-widest"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {isAfterIsha ? 'Sholat Besok' : 'Waktu Berikutnya'}
                </p>
                <h3
                  className="text-lg font-bold text-white mt-0.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {isAfterIsha
                    ? `Subuh (${prayers[nextPrayerIndex]?.label || '--:--'})`
                    : prayers[nextPrayerIndex]?.name || '-'}
                </h3>
              </div>
              <div className="text-right">
                <p
                  className="text-2xl font-bold text-white tabular-nums"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {isAfterIsha
                    ? '--:--'
                    : prayers[nextPrayerIndex]?.label || '--:--'}
                </p>
                <p
                  className="text-[10px] text-white/70"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {selectedCity.name}, Indonesia
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Prayer times mini row */}
            <div className="mt-4 flex items-center justify-between">
              {prayers.map((p, i) => (
                <div key={p.name} className="text-center">
                  <p
                    className={`text-[9px] ${
                      !isAfterIsha && i === nextPrayerIndex
                        ? 'text-white font-bold'
                        : 'text-white/60'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {p.label}
                  </p>
                  <p
                    className={`text-[8px] mt-0.5 ${
                      !isAfterIsha && i === nextPrayerIndex
                        ? 'text-white/90'
                        : 'text-white/40'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {p.name.substring(0, 3)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
