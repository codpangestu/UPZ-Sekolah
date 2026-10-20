import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Wallet, Loader2, CalendarRange, Inbox } from 'lucide-react';
import { masjidService } from '../../services/masjidService';
import type { RekapBulananItem } from '../../types';

const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const GREEN = '#28A71A';
const RED = '#EF4444';

function labelPeriode(periode: string): string {
  const [y, m] = periode.split('-');
  const nama = BULAN_SINGKAT[Number(m) - 1];
  if (!nama) return periode;
  return `${nama} '${(y ?? '').slice(2)}`;
}

function formatRupiah(val: number | undefined | null): string {
  if (val == null || Number.isNaN(Number(val))) return 'Rp 0';
  return `Rp ${Number(val).toLocaleString('id-ID')}`;
}

/** Sumbu-Y ringkas: 1500000 → "1,5 jt" (gaya Indonesia). */
function formatCompact(val: number): string {
  const abs = Math.abs(val);
  const fmt = (n: number, suf: string) =>
    `${(n).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ${suf}`;
  if (abs >= 1_000_000_000) return fmt(val / 1_000_000_000, 'M');
  if (abs >= 1_000_000) return fmt(val / 1_000_000, 'jt');
  if (abs >= 1_000) return fmt(val / 1_000, 'rb');
  return `${val}`;
}

function toISODate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Rentang default "12 bulan terakhir": awal bulan 11 bulan lalu s/d hari ini (FR-2.6). */
function defaultRollingRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return { start: toISODate(start), end: toISODate(now) };
}

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

function KasTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-[#303030]">{label}</p>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} className="flex items-center gap-2 text-xs text-[#555555]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-medium text-[#303030]">{formatRupiah(Number(entry.value))}</span>
        </div>
      ))}
    </div>
  );
}

type Mode = 'rolling' | 'custom';

/**
 * Kartu Grafik "Penerimaan vs Pengeluaran per Bulan" (PRD FR-2.5–2.7).
 * Data: GET /api/v1/rekap/bulanan/{id_masjid} (Masjid Service) — agregasi server-side.
 */
export default function GrafikKasBulanan({ idMasjid }: { idMasjid: string | undefined }) {
  const [mode, setMode] = useState<Mode>('rolling');
  const [initialRange] = useState(defaultRollingRange);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const range = useMemo(() => {
    if (mode === 'rolling') return initialRange;
    if (customStart && customEnd) {
      return customStart <= customEnd
        ? { start: customStart, end: customEnd }
        : { start: customEnd, end: customStart };
    }
    return null; // rentang custom belum lengkap
  }, [mode, initialRange, customStart, customEnd]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-masjid-rekap-bulanan', idMasjid, range?.start, range?.end],
    queryFn: async () => {
      if (!idMasjid || !range) return null;
      const res = await masjidService.getRekapBulananByMasjid(idMasjid, {
        startDate: range.start,
        endDate: range.end,
      });
      return res?.data ?? null;
    },
    enabled: !!idMasjid && !!range,
  });

  const chartData: (RekapBulananItem & { label: string })[] = useMemo(
    () => (data?.bulanan ?? []).map((b) => ({ ...b, label: labelPeriode(b.periode) })),
    [data],
  );

  const periodeLabel =
    mode === 'rolling'
      ? '12 bulan terakhir'
      : range
        ? `${labelPeriode(range.start.slice(0, 7))} – ${labelPeriode(range.end.slice(0, 7))}`
        : 'pilih rentang tanggal';

  return (
    <div
      className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-5"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header: judul + toggle periode (FR-2.6) */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-[#28A71A]" />
          <h2 className="text-sm font-semibold text-[#303030]">Penerimaan vs Pengeluaran</h2>
          <span className="badge-xs inline-flex bg-[#EAF6E8] text-[#1C7712]">{periodeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          {(['rolling', 'custom'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m
                  ? 'bg-[#28A71A] text-white'
                  : 'bg-[#F1F5F9] text-[#555555] hover:bg-[#EAF6E8] hover:text-[#1C7712]'
              }`}
            >
              {m === 'rolling' ? '12 Bulan Terakhir' : 'Rentang Kustom'}
            </button>
          ))}
        </div>
      </div>

      {/* Input rentang kustom */}
      {mode === 'custom' && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#555555]">
          <CalendarRange size={14} className="text-[#28A71A]" />
          <input
            type="date"
            value={customStart}
            max={customEnd || undefined}
            onChange={(e) => setCustomStart(e.target.value)}
            className="rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-1.5 text-xs text-[#303030] outline-none focus:border-[#28A71A]"
            aria-label="Tanggal mulai"
          />
          <span>s/d</span>
          <input
            type="date"
            value={customEnd}
            min={customStart || undefined}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-1.5 text-xs text-[#303030] outline-none focus:border-[#28A71A]"
            aria-label="Tanggal akhir"
          />
        </div>
      )}

      {/* Ringkasan angka periode terpilih (FR-2.7) */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Total Penerimaan',
            value: data?.total_penerimaan,
            icon: TrendingUp,
            iconColor: GREEN,
            badge: 'bg-[#E6F9F0] text-[#006844]',
          },
          {
            label: 'Total Pengeluaran',
            value: data?.total_pengeluaran,
            icon: TrendingDown,
            iconColor: RED,
            badge: 'bg-red-50 text-red-600',
          },
          {
            label: 'Saldo Akhir',
            value: data?.saldo,
            icon: Wallet,
            iconColor: '#1C7712',
            badge: 'bg-[#EAF6E8] text-[#1C7712]',
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-[#FAFBFC] p-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs text-[#555555]">{card.label}</p>
              <card.icon size={14} style={{ color: card.iconColor }} />
            </div>
            <p className="text-lg font-semibold text-[#303030]">
              {isLoading ? '—' : formatRupiah(card.value)}
            </p>
            <span className={`badge-xs mt-1.5 inline-flex ${card.badge}`}>Periode terpilih</span>
          </div>
        ))}
      </div>

      {/* Grafik / status */}
      {!idMasjid ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-sm text-[#555555]">
          <Inbox size={24} className="text-[#9CA3AF]" />
          Data masjid belum tersedia untuk menghitung grafik.
        </div>
      ) : isLoading ? (
        <div className="flex h-[260px] items-center justify-center gap-2 text-sm text-[#555555]">
          <Loader2 size={18} className="animate-spin text-[#28A71A]" />
          Memuat grafik...
        </div>
      ) : isError || !data ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-sm text-[#555555]">
          <Inbox size={24} className="text-[#9CA3AF]" />
          Gagal memuat data grafik. Coba muat ulang halaman.
        </div>
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                tick={{ fill: '#555555', fontSize: 11 }}
              />
              <YAxis
                width={56}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#555555', fontSize: 11 }}
                tickFormatter={(v: number) => formatCompact(v)}
              />
              <Tooltip content={(props: unknown) => <KasTooltip {...(props as {
                active?: boolean;
                payload?: TooltipEntry[];
                label?: string;
              })} />} />
              <Bar dataKey="penerimaan" name="Penerimaan" fill={GREEN} radius={[4, 4, 0, 0]} maxBarSize={16} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill={RED} radius={[4, 4, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
          {/* Legend manual (konsisten gaya kartu dashboard) */}
          <div className="mt-2 flex items-center justify-center gap-5 text-xs text-[#555555]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: GREEN }} /> Penerimaan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: RED }} /> Pengeluaran
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
