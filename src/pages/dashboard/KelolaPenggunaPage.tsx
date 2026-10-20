import { useState, useEffect, useCallback } from 'react';
import {
  UserCog,
  Search,
  Loader2,
  ShieldCheck,
  UserRound,
  Building2,
  CheckCircle2,
  XCircle,
  Ban,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../../services/adminService';
import { masjidService } from '../../services/masjidService';
import type { UserListItem, Masjid, Provinsi, KabupatenKota, Kecamatan } from '../../types';

type LevelFilter =
  | 'all' | 'admin-baznas' | 'admin-masjid' | 'admin-daerah' | 'admin-kab' | 'admin-kua' | 'pengguna';

// "Anak" Admin BAZNAS yang scope-nya dipersempit ke wilayah tertentu.
// id 11/12/13 mengikuti baris `levels` LEGACY yang sudah ada di DB (10=Admin
// BAZNAS Pusat, 11=Admin BAZNAS Provinsi, 12=Admin BAZNAS Kabupaten Kota; 13
// sebelumnya placeholder tanpa user, dipakai utk Admin KUA/kecamatan).
// JANGAN pakai id 4/5/6 — sudah dipakai data legacy lain (Anggota/Admin
// Masjid/Admin Monitor Masjid) dengan user asli.
const SCOPED_ADMIN_LEVELS = [11, 12, 13];

const LEVEL_LABEL: Record<number, string> = {
  1: 'Admin BAZNAS',
  2: 'Admin Masjid',
  3: 'Pengguna',
  11: 'Admin Daerah',
  12: 'Admin Kab',
  13: 'Admin KUA',
};

const LEVEL_BADGE: Record<number, string> = {
  1: 'bg-[#F3E8FF] text-[#7C3AED]',
  2: 'bg-[#E6F9F0] text-[#006844]',
  3: 'bg-[#EAF2FF] text-[#2B7FFF]',
  11: 'bg-[#E0F2FE] text-[#0369A1]',
  12: 'bg-[#FEF3C7] text-[#B45309]',
  13: 'bg-[#FCE7F3] text-[#BE185D]',
};

function matchesLevelFilter(user: UserListItem, filter: LevelFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'admin-baznas') return user.id_level === 1;
  if (filter === 'admin-masjid') return user.id_level === 2;
  if (filter === 'admin-daerah') return user.id_level === 11;
  if (filter === 'admin-kab') return user.id_level === 12;
  if (filter === 'admin-kua') return user.id_level === 13;
  // Pengguna = bukan salah satu dari 5 level admin di atas
  return !user.id_level || (user.id_level !== 1 && user.id_level !== 2 && !SCOPED_ADMIN_LEVELS.includes(user.id_level));
}

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Region filter
  const [provinsiFilter, setProvinsiFilter] = useState('');
  const [kabFilter, setKabFilter] = useState('');
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [kabList, setKabList] = useState<KabupatenKota[]>([]);
  const [masjidRegionMap, setMasjidRegionMap] = useState<Map<string, { id_provinsi?: number | string; id_kabupaten_kota?: number | string }>>(new Map());

  // Modal promosi
  const [promoteTarget, setPromoteTarget] = useState<UserListItem | null>(null);
  const [promoteLevel, setPromoteLevel] = useState(2);
  const [promoteRoleChoice, setPromoteRoleChoice] = useState<Record<number, number>>({});
  const [selectedMasjid, setSelectedMasjid] = useState('');
  const [promoteLoading, setPromoteLoading] = useState(false);

  // Dropdown wilayah cascading KHUSUS modal promosi (terpisah dari filter di atas)
  const [modalProvinsi, setModalProvinsi] = useState('');
  const [modalKab, setModalKab] = useState('');
  const [modalKec, setModalKec] = useState('');
  const [modalKabList, setModalKabList] = useState<KabupatenKota[]>([]);
  const [modalKecList, setModalKecList] = useState<Kecamatan[]>([]);

  useEffect(() => {
    if (modalProvinsi) {
      masjidService.getKabupatenKota(Number(modalProvinsi)).then((res) => {
        if (res?.data) setModalKabList(res.data);
      });
    } else {
      setModalKabList([]);
    }
    setModalKab('');
  }, [modalProvinsi]);

  useEffect(() => {
    if (modalKab) {
      masjidService.getKecamatan(Number(modalKab)).then((res) => {
        if (res?.data) setModalKecList(res.data);
      });
    } else {
      setModalKecList([]);
    }
    setModalKec('');
  }, [modalKab]);

  // Fetch provinsi on mount
  useEffect(() => {
    masjidService.getProvinsi().then((res) => {
      if (res?.data) setProvinsiList(res.data);
    });
  }, []);

  // Fetch kab/kota when provinsi changes
  useEffect(() => {
    if (provinsiFilter) {
      masjidService.getKabupatenKota(Number(provinsiFilter)).then((res) => {
        if (res?.data) setKabList(res.data);
      });
    } else {
      setKabList([]);
    }
    setKabFilter('');
  }, [provinsiFilter]);

  // Reset page-like behavior: region filter changes reset kab filter (handled above)

  /** Fetch ALL masjid by paginating through backend (max per_page=100). */
  const fetchAllMasjid = async (): Promise<Masjid[]> => {
    const ALL: Masjid[] = [];
    let pg = 1;
    const PER = 100;
    while (true) {
      try {
        const res = await masjidService.getMasjidList(pg, PER);
        const batch = Array.isArray(res?.data) ? (res.data as Masjid[]) : [];
        ALL.push(...batch);
        if (batch.length < PER) break;
        pg++;
      } catch {
        break;
      }
    }
    return ALL;
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    // Fetch users list — primary source
    try {
      const usersRes = await adminService.getUsersList();
      if (usersRes && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      }
    } catch {
      toast.error('Gagal memuat data pengguna');
    }

    // Fetch all masjid for region filter (non-critical)
    try {
      const masjidList = await fetchAllMasjid();
      if (masjidList.length > 0) {
        setMasjids(masjidList);
        const regionMap = new Map<string, { id_provinsi?: number | string; id_kabupaten_kota?: number | string }>();
        masjidList.forEach((m: Masjid) => {
          regionMap.set(m.id_masjid, {
            id_provinsi: m.id_provinsi,
            id_kabupaten_kota: m.id_kabupaten_kota,
          });
        });
        setMasjidRegionMap(regionMap);
      }
    } catch {
      // Masjid API failed — filter by region won't work, but user data still shows
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      user.nama?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.nohp?.toLowerCase().includes(q) ||
      user.nama_masjid?.toLowerCase().includes(q);
    if (!matchesSearch || !matchesLevelFilter(user, levelFilter)) return false;
    // Region filter — only applies to users with a mosque
    if (provinsiFilter || kabFilter) {
      const region = masjidRegionMap.get(user.id_jalur_akses || '');
      if (!region) return false; // user has no mosque in map, hide when region filter active
      if (provinsiFilter && String(region.id_provinsi) !== provinsiFilter) return false;
      if (kabFilter && String(region.id_kabupaten_kota) !== kabFilter) return false;
    }
    return true;
  });

  const counts = {
    total: users.length,
    adminMasjid: users.filter((u) => u.id_level === 2).length,
    pengguna: users.filter((u) => matchesLevelFilter(u, 'pengguna')).length,
    nonaktif: users.filter((u) => u.status_aktif !== 1).length,
  };

  const openPromoteModal = (user: UserListItem, level: number) => {
    setPromoteTarget(user);
    setPromoteLevel(level);
    setSelectedMasjid(user.id_jalur_akses || '');
    setModalProvinsi('');
    setModalKab('');
    setModalKec('');
  };

  const handlePromote = async () => {
    if (!promoteTarget) return;
    if (promoteLevel === 2 && !selectedMasjid) {
      toast.error('Pilih masjid terlebih dahulu');
      return;
    }
    if (promoteLevel === 11 && !modalProvinsi) {
      toast.error('Pilih provinsi terlebih dahulu');
      return;
    }
    if (promoteLevel === 12 && (!modalProvinsi || !modalKab)) {
      toast.error('Pilih provinsi dan kabupaten/kota terlebih dahulu');
      return;
    }
    if (promoteLevel === 13 && (!modalProvinsi || !modalKab || !modalKec)) {
      toast.error('Pilih provinsi, kabupaten/kota, dan kecamatan terlebih dahulu');
      return;
    }

    setPromoteLoading(true);
    try {
      const payload =
        promoteLevel === 2
          ? { id_level: 2, id_jalur_akses: selectedMasjid }
          : promoteLevel === 11
            ? { id_level: 11, id_provinsi: Number(modalProvinsi) }
            : promoteLevel === 12
              ? { id_level: 12, id_provinsi: Number(modalProvinsi), id_kabupaten_kota: Number(modalKab) }
              : { id_level: 13, id_provinsi: Number(modalProvinsi), id_kabupaten_kota: Number(modalKab), id_kecamatan: Number(modalKec) };

      const res = await adminService.updateUser(promoteTarget.id_user, payload);
      if (res && (res.status_code === '000' || res.status === 'Sukses')) {
        const levelLabel = LEVEL_LABEL[promoteLevel] || 'Admin';
        const masjid = promoteLevel === 2 ? masjids.find((m: Masjid) => m.id_masjid === selectedMasjid) : undefined;
        toast.success(`${promoteTarget.nama} kini menjadi ${levelLabel}`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id_user === promoteTarget.id_user
              ? {
                  ...u,
                  id_level: promoteLevel,
                  nama_level: levelLabel,
                  id_jalur_akses: promoteLevel === 2 ? selectedMasjid : '',
                  nama_masjid: promoteLevel === 2 ? (masjid?.nama_masjid || u.nama_masjid) : undefined,
                }
              : u
          )
        );
        setPromoteTarget(null);
      } else {
        toast.error(res?.status || 'Gagal mempromosikan pengguna');
      }
    } catch {
      toast.error('Gagal mempromosikan pengguna');
    } finally {
      setPromoteLoading(false);
    }
  };

  const handleDemote = async (user: UserListItem) => {
    setActionLoading(user.id_user);
    try {
      const res = await adminService.updateUser(user.id_user, { id_level: 3 });
      if (res && (res.status_code === '000' || res.status === 'Sukses')) {
        toast.success(`${user.nama} diturunkan menjadi Pengguna`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id_user === user.id_user
              ? { ...u, id_level: 3, nama_level: 'Pengguna', id_jalur_akses: '' }
              : u
          )
        );
      } else {
        toast.error(res?.status || 'Gagal menurunkan level');
      }
    } catch {
      toast.error('Gagal menurunkan level');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (user: UserListItem) => {
    const next = user.status_aktif === 1 ? 0 : 1;
    setActionLoading(user.id_user);
    try {
      const res = await adminService.updateUser(user.id_user, { status_aktif: next });
      if (res && (res.status_code === '000' || res.status === 'Sukses')) {
        toast.success(next === 1 ? `${user.nama} diaktifkan` : `${user.nama} dinonaktifkan`);
        setUsers((prev) =>
          prev.map((u) => (u.id_user === user.id_user ? { ...u, status_aktif: next } : u))
        );
      } else {
        toast.error(res?.status || 'Gagal mengubah status');
      }
    } catch {
      toast.error('Gagal mengubah status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
              <UserCog size={20} className="text-[#28A71A]" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold text-[#303030]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Kelola Pengguna
              </h2>
              <p
                className="text-sm text-text-gray"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Atur level akses akun — kelola Admin Masjid dan akun pengguna
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="text-sm text-[#28A71A] hover:text-[#1C7712] transition-colors flex items-center gap-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.08)]">
          <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Total Pengguna
          </p>
          <p className="text-2xl font-semibold text-[#303030] mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {counts.total}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.08)]">
          <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Admin Masjid
          </p>
          <p className="text-2xl font-semibold text-[#006844] mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {counts.adminMasjid}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.08)]">
          <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pengguna
          </p>
          <p className="text-2xl font-semibold text-[#2B7FFF] mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {counts.pengguna}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.08)]">
          <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Akun Nonaktif
          </p>
          <p className="text-2xl font-semibold text-red-500 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {counts.nonaktif}
          </p>
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
            placeholder="Cari nama, email, no HP, atau nama masjid..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
          className="px-4 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <option value="all">Semua Level</option>
          <option value="admin-baznas">Admin BAZNAS</option>
          <option value="admin-masjid">Admin Masjid</option>
          <option value="admin-daerah">Admin Daerah</option>
          <option value="admin-kab">Admin Kab</option>
          <option value="admin-kua">Admin KUA</option>
          <option value="pengguna">Pengguna</option>
        </select>
        {/* Region filters */}
        <div className="relative sm:w-48">
          <select
            value={provinsiFilter}
            onChange={(e) => setProvinsiFilter(e.target.value)}
            className="w-full pl-4 pr-8 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 appearance-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <option value="">Semua Provinsi</option>
            {provinsiList.map((p) => (
              <option key={String(p.id)} value={String(p.id)}>
                {p.nama_provinsi}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
        </div>
        <div className="relative sm:w-48">
          <select
            value={kabFilter}
            onChange={(e) => setKabFilter(e.target.value)}
            disabled={!provinsiFilter}
            className="w-full pl-4 pr-8 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 appearance-none disabled:opacity-50 disabled:bg-[#F5F5F5]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <option value="">Semua Kab/Kota</option>
            {kabList.map((k) => (
              <option key={String(k.id)} value={String(k.id)}>
                {k.nama_kabupaten_kota}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#F0F4F8] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="animate-spin text-[#28A71A] mx-auto mb-2" />
            <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Memuat data...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UserCog size={40} className="text-[#D4D4D4] mx-auto mb-3" />
            <p className="text-sm text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {searchQuery || levelFilter !== 'all' || provinsiFilter || kabFilter
                ? 'Tidak ada hasil pencarian'
                : 'Belum ada pengguna terdaftar'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0F4F8]">
                  <th className="text-left text-xs font-medium text-text-gray px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Pengguna
                  </th>
                  <th className="text-left text-xs font-medium text-text-gray px-4 py-3 hidden md:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Masjid
                  </th>
                  <th className="text-left text-xs font-medium text-text-gray px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Level
                  </th>
                  <th className="text-left text-xs font-medium text-text-gray px-4 py-3 hidden sm:table-cell" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-text-gray px-4 py-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F8]">
                {filteredUsers.map((user) => {
                  const isPengguna = matchesLevelFilter(user, 'pengguna');
                  const isAdminMasjid = user.id_level === 2;
                  const isAdminBaznas = user.id_level === 1;
                  const isScopedAdmin = !!user.id_level && SCOPED_ADMIN_LEVELS.includes(user.id_level);
                  const level = user.id_level ?? 3;
                  const active = user.status_aktif === 1;
                  const busy = actionLoading === user.id_user;
                  return (
                    <tr key={user.id_user} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                              isAdminBaznas
                                ? 'bg-[#7C3AED]'
                                : isAdminMasjid
                                  ? 'bg-[#006844]'
                                  : isScopedAdmin
                                    ? 'bg-[#0369A1]'
                                    : 'bg-[#2B7FFF]'
                            }`}
                          >
                            {user.nama?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#303030] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {user.nama}
                            </p>
                            <p className="text-xs text-text-gray truncate max-w-[200px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {user.email}
                              {user.nohp ? ` • ${user.nohp}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {user.nama_masjid ? (
                          <span className="text-sm text-text-gray flex items-center gap-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            <Building2 size={14} className="text-[#28A71A] flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{user.nama_masjid}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#B0B0B0]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${LEVEL_BADGE[level]}`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {LEVEL_LABEL[level] || user.nama_level || 'Pengguna'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                            active ? 'bg-[#E6F9F0] text-[#006844]' : 'bg-red-50 text-red-600'
                          }`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isAdminBaznas ? (
                            <span className="text-xs text-[#B0B0B0]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              —
                            </span>
                          ) : (
                            <>
                              {isPengguna && (
                                <>
                                  <select
                                    value={promoteRoleChoice[user.id_user] ?? 2}
                                    onChange={(e) =>
                                      setPromoteRoleChoice((prev) => ({
                                        ...prev,
                                        [user.id_user]: Number(e.target.value),
                                      }))
                                    }
                                    disabled={busy}
                                    className="px-2 py-1.5 border border-[#D4D4D4] rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                  >
                                    <option value={2}>Admin Masjid</option>
                                    <option value={11}>Admin Daerah</option>
                                    <option value={12}>Admin Kab</option>
                                    <option value={13}>Admin KUA</option>
                                  </select>
                                  <button
                                    onClick={() => openPromoteModal(user, promoteRoleChoice[user.id_user] ?? 2)}
                                    disabled={busy}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] text-white rounded-lg text-xs font-medium transition-colors"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                  >
                                    <ShieldCheck size={14} />
                                    Jadikan
                                  </button>
                                </>
                              )}
                              {(isAdminMasjid || isScopedAdmin) && (
                                <button
                                  onClick={() => handleDemote(user)}
                                  disabled={busy}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D4D4D4] hover:bg-[#F0F4F8] text-[#555] rounded-lg text-xs font-medium transition-colors"
                                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                  <UserRound size={14} />
                                  Turunkan
                                </button>
                              )}
                              <button
                                onClick={() => handleToggleStatus(user)}
                                disabled={busy}
                                title={active ? 'Nonaktifkan akun' : 'Aktifkan akun'}
                                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                                  active
                                    ? 'text-red-500 hover:bg-red-50'
                                    : 'text-[#28A71A] hover:bg-[#EAF6E8]'
                                }`}
                              >
                                <Ban size={16} />
                              </button>
                            </>
                          )}
                          {busy && <Loader2 size={14} className="animate-spin text-[#28A71A]" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Promosi */}
      {promoteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !promoteLoading && setPromoteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E6F9F0] rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#006844]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Jadikan {LEVEL_LABEL[promoteLevel] || 'Admin'}
                </h3>
                <p className="text-xs text-text-gray" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {promoteTarget.nama} • {promoteTarget.email}
                </p>
              </div>
            </div>

            {promoteLevel === 2 ? (
              <>
                <label
                  className="block text-sm font-medium text-[#303030] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Pilih Masjid yang Dikelola
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <select
                    value={selectedMasjid}
                    onChange={(e) => setSelectedMasjid(e.target.value)}
                    disabled={promoteLoading}
                    className="w-full pl-10 pr-8 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 appearance-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <option value="">— Pilih masjid —</option>
                    {masjids.map((m) => (
                      <option key={m.id_masjid} value={m.id_masjid}>
                        {m.nama_masjid}
                        {m.kode_org_baznas ? ` (${m.kode_org_baznas})` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
                </div>
                {masjids.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Belum ada data masjid terdaftar. Tambahkan masjid dulu di Data Masjid.
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium text-[#303030] mb-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Provinsi
                  </label>
                  <div className="relative">
                    <select
                      value={modalProvinsi}
                      onChange={(e) => setModalProvinsi(e.target.value)}
                      disabled={promoteLoading}
                      className="w-full pl-4 pr-8 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 appearance-none"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <option value="">— Pilih provinsi —</option>
                      {provinsiList.map((p) => (
                        <option key={String(p.id)} value={String(p.id)}>
                          {p.nama_provinsi}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
                  </div>
                </div>

                {(promoteLevel === 12 || promoteLevel === 13) && (
                  <div>
                    <label
                      className="block text-sm font-medium text-[#303030] mb-2"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Kabupaten/Kota
                    </label>
                    <div className="relative">
                      <select
                        value={modalKab}
                        onChange={(e) => setModalKab(e.target.value)}
                        disabled={promoteLoading || !modalProvinsi}
                        className="w-full pl-4 pr-8 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 appearance-none disabled:opacity-50 disabled:bg-[#F5F5F5]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">— Pilih kabupaten/kota —</option>
                        {modalKabList.map((k) => (
                          <option key={String(k.id)} value={String(k.id)}>
                            {k.nama_kabupaten_kota}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
                    </div>
                  </div>
                )}

                {promoteLevel === 13 && (
                  <div>
                    <label
                      className="block text-sm font-medium text-[#303030] mb-2"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Kecamatan
                    </label>
                    <div className="relative">
                      <select
                        value={modalKec}
                        onChange={(e) => setModalKec(e.target.value)}
                        disabled={promoteLoading || !modalKab}
                        className="w-full pl-4 pr-8 py-2.5 border border-[#D4D4D4] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 appearance-none disabled:opacity-50 disabled:bg-[#F5F5F5]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <option value="">— Pilih kecamatan —</option>
                        {modalKecList.map((k) => (
                          <option key={String(k.id)} value={String(k.id)}>
                            {k.nama_kecamatan}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPromoteTarget(null)}
                disabled={promoteLoading}
                className="flex-1 py-2.5 border border-[rgba(0,0,0,0.15)] rounded-lg text-sm font-medium text-[#303030] hover:bg-[#F0F4F8] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Batal
              </button>
              <button
                onClick={handlePromote}
                disabled={promoteLoading}
                className="flex-1 py-2.5 bg-[#28A71A] hover:bg-[#1C7712] disabled:bg-[#B0B0B0] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {promoteLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
