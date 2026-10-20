/// <reference types="cypress" />

// =====================================================================
// E2E test — Dashboard Admin Masjid (real backend, TANPA mock)
// Prasyarat:
//   1. Vite dev server → http://localhost:3000
//   2. 5 backend service (8001–8005) + DB lokal
//   3. Akun uji pangestuakbar939@gmail.com (masjid "Al-istiqomah",
//      id MSJ-8E8AEA) — rekap all-zero & Buku Kas ada data Zakat Mal
//      (verifikasi API terakhir lihat CONTEXT.md Fix History #46)
// =====================================================================

describe('Dashboard Admin Masjid (setelah login)', () => {
  beforeEach(() => {
    // Custom command (cypress/support/commands.ts): login via UI → berakhir di /dashboard
    cy.loginAdminMasjid();
  });

  it('Menampilkan selamat datang, nama masjid, dan kartu statistik', () => {
    // Welcome card + nama user
    cy.contains('h1', 'Selamat Datang').should('be.visible');

    // Nama masjid dari GET /masjid/detail (bukan state kosong)
    cy.contains('p', 'Al-istiqomah').should('be.visible');

    // 3 kartu statistik render dengan nilai dari GET /rekap/by-masjid
    // (data uji: seluruhnya 0 — nilai Rp 0 valid, yang dites adalah struktur)
    // CATATAN: label "Total Penerimaan" dkk juga ada di kartu ringkasan GRAFIK
    // (GrafikKasBulanan, nilai pakai p.text-lg) — kartu statistik dashboard
    // satu-satunya yang pakai p.text-2xl, jadi asser via itu (3 kartu, isi 'Rp')
    cy.get('p.text-2xl').should('have.length', 3);
    cy.get('p.text-2xl').each(($el) => {
      expect($el.text()).to.contain('Rp');
    });
  });

  it('Grafik Penerimaan vs Pengeluaran ter-render + toggle Rentang Kustom', () => {
    cy.contains('h2', 'Penerimaan vs Pengeluaran').should('be.visible');

    // Recharts selesai memuat data (wrapper SVG chart muncul otomatis)
    cy.get('.recharts-wrapper', { timeout: 15000 }).should('exist');
    cy.get('.recharts-xAxis').should('exist');

    // Toggle ke Rentang Kustom → 2 input tanggal muncul
    cy.contains('button', 'Rentang Kustom').click();
    cy.get('input[aria-label="Tanggal mulai"]').should('exist');
    cy.get('input[aria-label="Tanggal akhir"]').should('exist');

    // Kembali ke mode rolling
    cy.contains('button', '12 Bulan Terakhir').click();
    cy.get('input[aria-label="Tanggal mulai"]').should('not.exist');
  });

  it('Buku Kas Penerimaan: tabel berisi data + search server-side bekerja', () => {
    cy.visit('/buku-kas/penerimaan');

    // Tabel terisi data nyata (auto-wait sampai fetch selesai)
    cy.get('table tbody tr').should('have.length.at.least', 1);

    // Tombol tambah dari toolbar DataTable
    cy.contains('button', 'Tambah Penerimaan').should('be.visible');

    // Search server-side: ketik lalu tunggu hasil ter-filter dari backend
    cy.get('input[placeholder="Cari berdasarkan keterangan..."]').type('Zakat');
    cy.contains('td', 'Zakat', { timeout: 15000 }).should('be.visible');
  });

  it('Profil Masjid: form terisi dari data masjid (nama & alamat)', () => {
    cy.visit('/data-masjid/profil');

    // Tidak menampilkan pesan gagal muat
    cy.contains('Gagal memuat profil masjid').should('not.exist');

    // Input pertama = Nama Masjid, terisi dari API detail masjid
    cy.get('input[type="text"]').first().should('have.value', 'Al-istiqomah');

    // Textarea alamat terisi (tidak kosong)
    cy.get('textarea').first().should('not.have.value', '');
  });
});
