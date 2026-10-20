import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface KuitansiData {
  /** 'penerimaan' or 'pengeluaran' */
  type: 'penerimaan' | 'pengeluaran';
  tanggal: string;
  nominal: number;
  /** Penerimaan: jumlah_donatur. Pengeluaran: penerima */
  detail1Label: string;
  detail1Value: string;
  keterangan: string;
  nama_jenis_dana?: string;
  nama_jenis_harta?: string;
  nama_label_info_dana?: string;
  /** Nama masjid (from auth store) */
  namaMasjid?: string;
  /** Kode masjid */
  kodeMasjid?: string;
  id?: number;
}

function formatCurrency(val: number): string {
  return `Rp ${val.toLocaleString('id-ID')}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function generateKuitansiPDF(data: KuitansiData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const isPenerimaan = data.type === 'penerimaan';
  const title = isPenerimaan ? 'KUITANSI PENERIMAAN' : 'KUITANSI PENGELUARAN';

  // Header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.namaMasjid || 'Masjid', 14, 15);
  if (data.kodeMasjid) {
    doc.text(`Kode: ${data.kodeMasjid}`, 14, 21);
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`No: ${data.id || '-'}`, pageWidth - 14, 15, { align: 'right' });
  doc.text(`Tanggal: ${formatDate(data.tanggal)}`, pageWidth - 14, 21, { align: 'right' });

  // Garis pemisah
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(14, 26, pageWidth - 14, 26);

  // Detail transaksi
  let y = 34;
  const leftMargin = 14;
  const labelX = leftMargin;
  const valueX = 70;

  const addRow = (label: string, value: string, bold = false) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(label, labelX, y);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(value, valueX, y);
    y += 8;
  };

  addRow('Tanggal', formatDate(data.tanggal));
  addRow('Jenis Dana', data.nama_jenis_dana || '-');
  addRow('Jenis Harta', data.nama_jenis_harta || '-');
  if (data.nama_label_info_dana) {
    addRow('Label Info Dana', data.nama_label_info_dana);
  }
  addRow(data.detail1Label, data.detail1Value);
  if (data.keterangan) {
    addRow('Keterangan', data.keterangan);
  }

  // Garis pemisah
  y += 2;
  doc.setLineWidth(0.3);
  doc.line(leftMargin, y, pageWidth - 14, y);
  y += 8;

  // Nominal (highlighted)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(isPenerimaan ? 'Jumlah Diterima:' : 'Jumlah Dikeluarkan:', labelX, y);
  doc.setTextColor(0, 100, 68); // dark green
  doc.text(formatCurrency(data.nominal), valueX, y);
  doc.setTextColor(0); // reset

  // Garis pemisah
  y += 8;
  doc.setLineWidth(0.3);
  doc.line(leftMargin, y, pageWidth - 14, y);
  y += 12;

  // Tanda tangan area
  const sigWidth = (pageWidth - 28) / 2;

  // Tanda tangan kiri
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Bendahara', leftMargin + sigWidth / 2, y, { align: 'center' });
  y += 20;
  doc.text('________________________', leftMargin + sigWidth / 2, y, { align: 'center' });

  // Tanda tangan kanan
  y -= 20;
  doc.text('Ketua Takmir', leftMargin + sigWidth + sigWidth / 2, y, { align: 'center' });
  y += 20;
  doc.text('________________________', leftMargin + sigWidth + sigWidth / 2, y, { align: 'center' });

  // Footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150);
  doc.text(
    'Dokumen ini dicetak secara otomatis oleh Sistem MENARA Masjid BAZNAS',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  // Save
  const filename = `Kuitansi_${isPenerimaan ? 'Penerimaan' : 'Pengeluaran'}_${data.id || Date.now()}.pdf`;
  doc.save(filename);
}
