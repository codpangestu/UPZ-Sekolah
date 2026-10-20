import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const MONTHS_IND = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_IND = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Simple Hijri date calculation (approximate)
function getHijriDate(date: Date): { day: number; month: string; year: number } {
  const hijriMonths = [
    'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir",
    'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
    'Ramadhan', 'Syawwal', "Dzulqa'dah", 'Dzulhijjah',
  ];
  // Julian day number
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  // Approximate Hijri conversion
  const h = Math.floor((jd - 1948440) / 29.53058867);
  const day = Math.floor(((jd - 1948440) % 29.53058867));
  const month = Math.floor(h % 12);
  const year = Math.floor(h / 12) - 1;
  return {
    day: Math.max(1, Math.min(30, Math.round(day))),
    month: hijriMonths[Math.max(0, Math.min(11, month))],
    year: Math.max(1, year),
  };
}

export default function JamDigital() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dayName = DAYS_IND[time.getDay()];
  const date = time.getDate();
  const month = MONTHS_IND[time.getMonth()];
  const year = time.getFullYear();
  const hijri = getHijriDate(time);

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Clock size={18} className="text-[#28A71A]" />
        <h3 className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Jam Digital
        </h3>
      </div>

      {/* Time Display */}
      <div className="bg-gradient-to-br from-[#1C7712] to-[#28A71A] rounded-xl p-5 text-white text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-light tabular-nums tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {hours}:{minutes}
            </span>
            <span className="text-xl font-light tabular-nums text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {seconds}
            </span>
          </div>
          <p className="text-sm text-white/70 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {time.getHours() >= 12 ? 'PM' : 'AM'} WIB
          </p>
        </div>
      </div>

      {/* Date Info */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {dayName}, {date} {month} {year}
        </p>
        <p className="text-xs text-[#555] mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {hijri.day} {hijri.month} {hijri.year} H
        </p>
      </div>
    </div>
  );
}
