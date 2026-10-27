import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Loader2,
  GraduationCap,
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
  // Kode UPZ sekolah yang baru diterbitkan saat approve — tampil di modal agar bisa disampaikan ke pemohon
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
        keterangan: status === 'ditolak' ? 'Pengajuan ditolak oleh admin BAZNAS' : undefined,
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
      // Tampilkan kode UPZ yang baru diterbitkan agar bisa disampaikan ke pemohon
      if (issued && item) {
        setIssuedCode({ kode: issued, nama: item.nama_masjid });
      } else if (status === 'disetujui') {
        toast.success('Pengajuan UPZ Sekolah disetujui');
      }
    } catch {
      toast.error('Gagal memperbarui status pengajuan');
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E0F2FE] rounded-xl flex items-center justify-center">
              <ClipboardCheck size={20} className="text-[#0284C7]" />
            </div>
            <div>
              <h2
                className="text-lg font-bold text-slate-800"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Approval Pengajuan UPZ Sekolah
              </h2>
              <p
                className="text-sm text-slate-500"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {pendingCount} pengajuan sekolah menunggu verifikasi BAZNAS
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="text-sm text-[#0284C7] hover:text-[#0369A1] font-semibold transition-colors flex items-center gap-1.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Loader2 size={14} className={loading ? 'animate-spin' : ''} />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama sekolah, alamat, atau kontak..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusPengajuan | 'all')}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setSelectedItem(null)}
              className="text-sm text-[#0284C7] hover:text-[#0369A1] font-semibold transition-colors flex items-center gap-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ← Kembali ke daftar
            </button>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_PENGAJUAN_COLOR[selectedItem.status_pengajuan]}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {STATUS_PENGAJUAN_LABEL[selectedItem.status_pengajuan]}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <GraduationCap size={20} className="text-[#0284C7]" />
                {selectedItem.nama_masjid}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alamat Sekolah</p>
                  <p className="text-sm text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {selectedItem.alamat_masjid}
                    {selectedItem.nama_kabupaten_kota && <><br />{selectedItem.nama_kabupaten_kota}</>}
                    {selectedItem.nama_provinsi && <><br />{selectedItem.nama_provinsi}</>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kontak Sekolah</p>
                  <p className="text-sm text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.nohp_masjid}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Waktu Pengajuan</p>
                  <p className="text-sm text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatDate(selectedItem.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Data Admin UPZ Sekolah */}
            {(selectedItem.nama_pemohon || selectedItem.email_pemohon) && (
              <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD]/40 rounded-xl">
                <p className="text-xs font-semibold text-slate-800 mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <UserRound size={14} className="text-[#0284C7]" />
                  Admin UPZ Sekolah (dibuat otomatis saat disetujui)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama Pengurus / Guru</p>
                    <p className="text-sm font-medium text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.nama_pemohon || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No. HP Admin</p>
                    <p className="text-sm font-medium text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.nohp_pemohon || '-'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-500 flex items-center gap-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <Mail size={12} /> Email Login Akun
                    </p>
                    <p className="text-sm font-medium text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedItem.email_pemohon || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Kode UPZ Sekolah (jika sudah disetujui) */}
            {selectedItem.status_pengajuan === 'disetujui' && selectedItem.kode_org_baznas && (
              <div className="p-4 bg-[#E0F2FE] border border-[#0284C7]/20 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0284C7] rounded-lg flex items-center justify-center flex-shrink-0">
                    <KeyRound size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#0369A1] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Kode UPZ Sekolah (sampaikan ke pihak sekolah)
                    </p>
                    <p className="text-base font-mono font-bold text-[#0369A1] tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {selectedItem.kode_org_baznas}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedItem.kode_org_baznas || '');
                    toast.success('Kode UPZ Sekolah disalin');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#0284C7]/30 rounded-lg text-xs font-semibold text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Copy size={14} />
                  Salin
                </button>
              </div>
            )}

            {/* Actions */}
            {selectedItem.status_pengajuan === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleAction(selectedItem.id, 'disetujui')}
                  disabled={actionLoading === selectedItem.id}
                  className="flex-1 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {actionLoading === selectedItem.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Setujui & Terbitkan Kode
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'ditolak')}
                  disabled={actionLoading === selectedItem.id}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {actionLoading === selectedItem.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Tolak Pengajuan
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 size={24} className="animate-spin text-[#0284C7] mx-auto mb-2" />
              <p className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Memuat daftar pengajuan...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardCheck size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada pengajuan UPZ Sekolah baru'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama UPZ Sekolah</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3 hidden sm:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No. HP Sekolah</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3 hidden md:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tanggal</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3 hidden lg:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kode UPZ</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Status</th>
                    <th className="text-right text-xs font-semibold text-slate-600 px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.nama_masjid}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.alamat_masjid}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-slate-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.nohp_masjid}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-slate-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {item.kode_org_baznas ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0369A1] bg-[#E0F2FE] px-2 py-1 rounded-md"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            <KeyRound size={12} />
                            {item.kode_org_baznas}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_PENGAJUAN_COLOR[item.status_pengajuan]}`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {STATUS_PENGAJUAN_LABEL[item.status_pengajuan]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                          className="text-[#0284C7] hover:text-[#0369A1] p-1.5 rounded-lg hover:bg-sky-50 transition-colors"
                          title="Lihat detail pengajuan"
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

      {/* Modal Kode UPZ Sekolah Diterbitkan */}
      {issuedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIssuedCode(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <button
              onClick={() => setIssuedCode(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-[#E0F2FE] rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyRound size={26} className="text-[#0284C7]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                UPZ Sekolah Disetujui!
              </h3>
              <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kode UPZ Sekolah untuk <b className="text-slate-800">{issuedCode.nama}</b>
              </p>
            </div>

            <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-center mb-5">
              <p className="text-xs text-slate-600 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Sampaikan kode ini ke pihak sekolah untuk mendaftar sebagai Admin UPZ Sekolah
              </p>
              <p
                className="text-2xl font-mono font-bold text-[#0284C7] tracking-widest select-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {issuedCode.kode}
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(issuedCode.kode);
                toast.success('Kode UPZ Sekolah berhasil disalin');
              }}
              className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Copy size={16} />
              Salin Kode UPZ Sekolah
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

