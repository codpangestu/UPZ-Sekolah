import { Link } from 'react-router-dom';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DataTable from '../../buku-kas/components/DataTable';
import type { Column } from '../../buku-kas/components/DataTable';
import { useMicrofinanceList, useMutasiSummary } from '../hooks/useMicrofinance';
import type { TransaksiMicrofinance } from '../types';

const formatRupiah = (v: string | number | null) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;

export default function MutasiTransaksiPage() {
  const { user } = useAuthStore();
  const idMasjid = user?.id_jalur_akses;

  const { data: listRes, isLoading } = useMicrofinanceList<TransaksiMicrofinance>('transaksi', idMasjid);
  const { data: summaryRes } = useMutasiSummary(idMasjid);

  const data = listRes?.data || [];
  const summary = summaryRes?.data;

  const columns: Column<TransaksiMicrofinance>[] = [
    { key: 'tanggal', label: 'Tanggal', render: (d) => d.tanggal || '-' },
    { key: 'nominal_peminjaman', label: 'Pencairan', render: (d) => Number(d.nominal_peminjaman) > 0 ? formatRupiah(d.nominal_peminjaman) : '-' },
    { key: 'nominal_pengembalian', label: 'Pengembalian', render: (d) => Number(d.nominal_pengembalian) > 0 ? formatRupiah(d.nominal_pengembalian) : '-' },
    { key: 'infak_peserta', label: 'Infak', render: (d) => Number(d.infak_peserta) > 0 ? formatRupiah(d.infak_peserta) : '-', hideOnMobile: true },
    { key: 'keterangan_transaksi', label: 'Keterangan', render: (d) => d.keterangan_transaksi || '-', hideOnMobile: true },
  ];

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
          <Receipt size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Mutasi Transaksi Microfinance</h1>
          <p className="text-sm text-[#555]">Ringkasan saldo & riwayat ledger BMM masjid ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Saldo Tersedia Saat Ini', value: summary?.saldo_tersedia },
          { label: 'Dana Masih di Peserta (Outstanding)', value: summary?.dana_di_peserta },
          { label: 'Total Saldo Keseluruhan', value: summary?.total_saldo_keseluruhan },
          { label: 'Total Riwayat Infak Peserta', value: summary?.total_infak_peserta },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-5">
            <p className="text-xs text-[#555] mb-1">{card.label}</p>
            <p className="text-lg font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {formatRupiah(card.value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      <DataTable data={data} columns={columns} loading={isLoading} emptyMessage="Belum ada transaksi microfinance" />
    </div>
  );
}
