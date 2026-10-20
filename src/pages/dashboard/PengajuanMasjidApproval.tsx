import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Loader2,
  Building2,
  MapPin,
  Phone,
  Calendar,
  KeyRound,
  UserRound,
  Mail,
  Copy,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../../services/adminService';
import type { PengajuanMasjid, StatusPengajuan } from '../../types';
import { STATUS_PENGAJUAN_LABEL, STATUS_PENGAJUAN_COLOR } from '../../types';

export default function PengajuanMasjidApproval() {
  const [pengajuanList, setPengajuanList] = useState<PengajuanMasjid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusPengajuan | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<PengajuanMasjid | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  // Kode masjid yang baru diterbitkan saat approve — tampil di modal agar bisa disampaikan ke pemohon
  const [issuedCode, setIssuedCode] = useState<{ kode: string; nama: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getPengajuanList(1, 100);
      if (res.status && Array.isArray(res.data)) {
        // Normalisasi status backend ('Menunggu') ke key frontend ('pending')
        setPengajuanList(
          res.data.map((item) => ({
            ...item,
            status_pengajuan: adminService.normalizePengajuanStatus(item.status_pengajuan),
          }))
        );
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = async (id: number, status: 'disetujui' | 'ditolak') => {
    setActionLoading(id);
    try {
      const res = await adminService.updatePengajuan(id, {
        status_pengajuan: status,
        keterangan: status === 'ditolak' ? 'Pengajuan ditolak oleh admin' : undefined,
      });
      const issued = status === 'disetujui' ? res?.data?.kode_org_baznas : undefined;
      const item = pengajuanList.find((p) => p.id === id);
      // Update local state
      setPengajuanList((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status_pengajuan: status, kode_org_baznas: issued ?? p.kode_org_baznas }
            : p
        )
      );
      if (selectedItem?.id === id) {
        setSelectedItem((prev) =>
          prev ? { ...prev, status_pengajuan: status, kode_org_baznas: issued ?? prev.kode_org_baznas } : null
        );
      }
      // Tampilkan kode masjid yang baru diterbitkan agar bisa disampaikan ke pemohon
      if (issued && item) {
        setIssuedCode({ kode: issued, nama: item.nama_masjid });
      } else if (status === 'disetujui') {
        toast.success('Pengajuan disetujui');
      }
    } catch {
      toast.error('Gagal memperbarui pengajuan');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter items
  const filteredList = pengajuanList.filter((item) => {
    const matchesSearch =
      item.nama_masjid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat_masjid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nohp_masjid.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || item.status_pengajuan === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = pengajuanList.filter((p) => p.status_pengajuan === 'pending').length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
              <ClipboardCheck size={20} className="text-[#28A71A]" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold text-[#303030]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pengajuan Masjid Baru
              </h2>
              <p
                className="text-sm text-text-gray"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {pendingCount} pengajuan menunggu persetujuan
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="text-sm text-[#28A71A] hover:text-[#1C7712] transition-colors flex items-center gap-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Loader2 size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, alamat, atau no HP..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusPengajuan | 'all')}
          className="px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      {/* List / Detail View */}
      {selectedItem ? (
        /* Detail View */
        <div className="bg-white rounded-xl border border-[#F0F4F8] overflow-hidden">
          <div className="p-4 border-b border-[#F0F4F8] flex items-center justify-between">
            <button
              onClick={() => setSelectedItem(null)}
              className="text-sm text-[#28A71A] hover:text-[#1C7712] transition-colors flex items-center gap-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ← Kembali ke daftar
            </button>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_PENGAJUAN_COLOR[selectedItem.status_pengajuan]}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {STATUS_PENGAJUAN_LABEL[selectedItem.status_pengajuan]}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#303030] flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Building2 size={18} className="text-[#28A71A]" />
                {selectedItem.nama_masjid}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-text-gray mt-0.5" />
                <div>
                  <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alamat</p>
                  <p className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {selectedItem.alamat_masjid}
                    {selectedItem.nama_kabupaten_kota && <><br />{selectedItem.nama_kabupaten_kota}</>}
                    {selectedItem.nama_provinsi && <><br />{selectedItem.nama_provinsi}</>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-text-gray mt-0.5" />
                <div>
                  <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No. HP</p>
                  <p className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.nohp_masjid}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-text-gray mt-0.5" />
                <div>
                  <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Diajukan</p>
                  <p className="text-sm text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatDate(selectedItem.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Data Admin Masjid (dikonfirmasi sekaligus dengan masjid) */}
            {(selectedItem.nama_pemohon || selectedItem.email_pemohon) && (
              <div className="p-4 bg-[#F0F4F8]/60 border border-[#F0F4F8] rounded-xl">
                <p className="text-xs font-semibold text-[#303030] mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <UserRound size={14} className="text-[#28A71A]" />
                  Admin Masjid (dibuat saat disetujui)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama</p>
                    <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.nama_pemohon || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No. HP</p>
                    <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.nohp_pemohon || '-'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-text-gray flex items-center gap-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <Mail size={12} /> Email (untuk login)
                    </p>
                    <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.email_pemohon || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Kode Masjid (jika sudah disetujui) */}
            {selectedItem.status_pengajuan === 'disetujui' && selectedItem.kode_org_baznas && (
              <div className="p-4 bg-[#E6F9F0] border border-[#006844]/20 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#006844] rounded-lg flex items-center justify-center flex-shrink-0">
                    <KeyRound size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#006844] font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Kode Masjid (sampaikan ke pemohon)
                    </p>
                    <p className="text-base font-mono font-bold text-[#006844] tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {selectedItem.kode_org_baznas}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedItem.kode_org_baznas || '');
                    toast.success('Kode masjid disalin');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#006844]/20 rounded-lg text-xs font-medium text-[#006844] hover:bg-[#006844] hover:text-white transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Copy size={14} />
                  Salin
                </button>
              </div>
            )}

            {/* Actions */}
            {selectedItem.status_pengajuan === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-[#F0F4F8]">
                <button
                  onClick={() => handleAction(selectedItem.id, 'disetujui')}
                  disabled={actionLoading === selectedItem.id}
                  className="flex-1 py-2.5 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {actionLoading === selectedItem.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Setujui
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'ditolak')}
                  disabled={actionLoading === selectedItem.id}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-[#B0B0B0] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {actionLoading === selectedItem.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-[#F0F4F8] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 size={24} className="animate-spin text-[#28A71A] mx-auto mb-2" />
              <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Memuat data...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardCheck size={40} className="text-[#D4D4D4] mx-auto mb-3" />
              <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada pengajuan masjid'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F4F8]">
                    <th className="text-left text-xs font-medium text-text-gray px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama Masjid</th>
                    <th className="text-left text-xs font-medium text-text-gray px-4 py-3 hidden sm:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No. HP</th>
                    <th className="text-left text-xs font-medium text-text-gray px-4 py-3 hidden md:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tanggal</th>
                    <th className="text-left text-xs font-medium text-text-gray px-4 py-3 hidden lg:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kode Masjid</th>
                    <th className="text-left text-xs font-medium text-text-gray px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Status</th>
                    <th className="text-right text-xs font-medium text-text-gray px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4F8]">
                  {filteredList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.nama_masjid}
                        </p>
                        <p className="text-xs text-text-gray truncate max-w-[200px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.alamat_masjid}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.nohp_masjid}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {item.kode_org_baznas ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#006844] bg-[#E6F9F0] px-2 py-1 rounded-md"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            <KeyRound size={12} />
                            {item.kode_org_baznas}
                          </span>
                        ) : (
                          <span className="text-xs text-[#B0B0B0]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_PENGAJUAN_COLOR[item.status_pengajuan]}`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {STATUS_PENGAJUAN_LABEL[item.status_pengajuan]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                          className="text-[#28A71A] hover:text-[#1C7712] transition-colors"
                          title="Lihat detail"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Kode Masjid Diterbitkan */}
      {issuedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIssuedCode(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <button
              onClick={() => setIssuedCode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-[#303030] transition-colors"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-[#E6F9F0] rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyRound size={26} className="text-[#006844]" />
              </div>
              <h3 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Masjid Disetujui!
              </h3>
              <p className="text-sm text-text-gray mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kode masjid untuk <b className="text-[#303030]">{issuedCode.nama}</b>
              </p>
            </div>

            <div className="p-4 bg-[#EAF6E8] border border-[#28A71A]/20 rounded-xl text-center mb-5">
              <p className="text-xs text-[#555] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Sampaikan kode ini ke pemohon untuk mendaftar sebagai Admin Masjid
              </p>
              <p
                className="text-2xl font-mono font-bold text-[#1C7712] tracking-widest select-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {issuedCode.kode}
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(issuedCode.kode);
                toast.success('Kode masjid disalin');
              }}
              className="w-full py-2.5 bg-[#28A71A] hover:bg-[#1C7712] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Copy size={16} />
              Salin Kode Masjid
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
