import { Search, ChevronLeft, ChevronRight, Loader2, Filter, Calendar } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export interface TableFilterOption {
  value: string;
  label: string;
}

export interface TableFilter {
  /** Key unik filter. */
  key: string;
  label: string;
  placeholder?: string;
  options: TableFilterOption[];
  value: string;
  onChange: (value: string) => void;
}

/** Filter rentang tanggal opsional — dirender setelah dropdown filter. */
export interface TableDateRange {
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  startLabel?: string;
  endLabel?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  /** Filter dropdown opsional — dirender di toolbar setelah search. */
  filters?: TableFilter[];
  /** Filter rentang tanggal opsional — dirender setelah dropdown filter. */
  dateRange?: TableDateRange;
  onAdd?: () => void;
  addLabel?: string;
  showEntries?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading,
  searchPlaceholder = 'Cari data...',
  onSearch,
  searchQuery = '',
  filters = [],
  dateRange,
  onAdd,
  addLabel,
  showEntries = true,
  page = 1,
  totalPages = 1,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  emptyMessage = 'Tidak ada data',
}: DataTableProps<T>) {
  const perPageOptions = [10, 25, 50, 100];

  return (
    <div className="bg-white rounded-xl border border-[#F0F4F8] overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-[#F0F4F8]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Search */}
          {onSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {filters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Filter size={13} />
                  Filter
                </span>
                {filters.map((f) => (
                  <select
                    key={f.key}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    className="px-3 py-2 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <option value="">{f.placeholder || `Semua ${f.label}`}</option>
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
            {dateRange && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Calendar size={13} />
                  Tanggal
                </span>
                <input
                  type="date"
                  value={dateRange.startValue}
                  onChange={(e) => dateRange.onStartChange(e.target.value)}
                  title={dateRange.startLabel || 'Tanggal Mulai'}
                  className="px-2 py-2 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <span className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>s/d</span>
                <input
                  type="date"
                  value={dateRange.endValue}
                  onChange={(e) => dateRange.onEndChange(e.target.value)}
                  title={dateRange.endLabel || 'Tanggal Selesai'}
                  className="px-2 py-2 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
            )}
            {onAdd && (
              <button
                onClick={onAdd}
                className="px-4 py-2 bg-[#28A71A] hover:bg-[#1C7712] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {addLabel || 'Tambah'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="animate-spin text-[#28A71A] mx-auto mb-2" />
            <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0F4F8] bg-[#FAFAFA]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left text-xs font-medium text-text-gray px-4 py-3 ${col.className || ''} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F8]">
              {data.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-[#FAFAFA] transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-[#303030] ${col.className || ''} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {col.render ? col.render(item) : item[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Pagination */}
      {(showEntries || totalPages > 1) && !loading && data.length > 0 && (
        <div className="px-4 py-3 border-t border-[#F0F4F8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Show entries */}
          {showEntries && onPerPageChange && (
            <div className="flex items-center gap-2 text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span>Tampilkan</span>
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-[#D4D4D4] rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span>entri</span>
            </div>
          )}

          {/* Page navigation */}
          {onPageChange && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded border border-[#D4D4D4] text-text-gray hover:bg-[#F0F4F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded border border-[#D4D4D4] text-text-gray hover:bg-[#F0F4F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
