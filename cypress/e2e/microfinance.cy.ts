/// <reference types="cypress" />

// =====================================================================
// E2E test — Microfinance / BMM (real backend, TANPA mock)
// Prasyarat:
//   1. Vite dev server → http://localhost:3000
//   2. 5 backend service (8001–8005) + DB lokal
//   3. Akun uji BMM dkmalhidayah0107@gmail.com (masjid "Jami Al-Hidayah
//      Kubang Sepat", M367230004042023872) — satu-satunya masjid dengan
//      seed data microfinance (50 peserta, saldo, skema). Verifikasi data:
//      CONTEXT.md Fix History #47. Password: menara23
// =====================================================================

const AKUN_BMM = { email: 'dkmalhidayah0107@gmail.com', password: 'menara23' };

describe('Microfinance / BMM (login Admin Masjid BMM)', () => {
  beforeEach(() => {
    cy.loginViaUi(AKUN_BMM.email, AKUN_BMM.password);
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
  });

  it('Menu Microfinance menampilkan kartu submenu dengan link aktif', () => {
    cy.visit('/microfinance');

    // Kartu grid render: label submenu terlihat
    cy.contains('h3', 'Saldo Microfinance').should('be.visible');
    cy.contains('h3', 'Peserta Program dan Transaksi').should('be.visible');

    // Kartu aktif adalah <Link> — href benar (bukan kartu "Segera Hadir")
    cy.get('a[href="/microfinance/saldo"]').should('exist');
    cy.get('a[href="/microfinance/peserta-program"]').should('exist');
  });

  it('Saldo Microfinance menampilkan data saldo dari API', () => {
    cy.visit('/microfinance/saldo');

    // Tabel terisi dari GET /microfinance/saldo/list
    cy.get('table tbody tr', { timeout: 15000 }).should('have.length.at.least', 1);

    // Seed data: "Saldo BAZNAS RI" nominal 58.091.000 → format id-ID
    cy.contains('td', 'Saldo BAZNAS RI').should('be.visible');
    cy.contains('td', '58.091.000').should('be.visible');
  });

  it('Peserta Program menampilkan daftar peserta + aksi Pencairan/Pengembalian', () => {
    cy.visit('/microfinance/peserta-program');

    // Data seed 50 peserta — halaman 1 (per_page default) terisi
    cy.get('table tbody tr', { timeout: 15000 }).should('have.length.at.least', 1);
    cy.contains('td', 'H. MUHAMMAD SOLEH').should('be.visible');

    // Ikon aksi transaksi di baris (READ-ONLY: modal TIDAK disubmit)
    cy.get('tbody button[title="Pencairan Pinjaman"]').should('have.length.at.least', 1);
    cy.get('tbody button[title="Pengembalian/Cicilan"]').should('have.length.at.least', 1);
  });

  it('Kalkulator Skema Pinjaman (publik) menghitung angsuran dengan benar', () => {
    cy.visit('/kalkulator-pinjaman');

    // Input: pinjaman 1.200.000, 1 orang, skema Bulan, 12 periode
    // Formula live-site (Fix #11): round(1200000 / 1 / 12) = 100.000
    cy.get('input[type="number"]').eq(0).type('1200000');
    cy.get('input[type="number"]').eq(1).type('1');
    cy.get('select').select('bulan');
    cy.get('input[type="number"]').eq(2).type('12');

    cy.contains('button', 'Hitung Target Angsuran Pengembalian').click();

    // Hasil render: nominal + teks "per 1 Orang"
    cy.contains('Rp 100.000', { timeout: 10000 }).should('be.visible');
    cy.contains('per 1 Orang').should('be.visible');
  });
});
