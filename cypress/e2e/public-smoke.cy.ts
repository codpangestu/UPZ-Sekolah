/// <reference types="cypress" />

// =====================================================================
// Smoke test — halaman publik MENARA Masjid
// Prasyarat: `npm run dev` jalan di http://localhost:3000
// Backend TIDAK wajib jalan — test memverifikasi UI render, bukan data.
// =====================================================================

describe('Smoke test halaman publik', () => {
  it('Homepage tampil lengkap: navbar, konten, footer', () => {
    cy.visit('/');

    // Navbar publik render
    cy.get('nav').should('be.visible');

    // Konten utama homepage render (hero ada h1 display)
    cy.get('h1').should('exist');

    // Footer render
    cy.get('footer').should('exist');

    // Tidak ada error JavaScript fatal — #root berisi konten
    cy.get('#root').children().should('have.length.greaterThan', 0);
  });

  it('Halaman Tools menampilkan grid + tool aktif ter-render saat diklik', () => {
    cy.visit('/tools');

    // Buka satu tool (klik kartu "Jam Digital")
    cy.contains('button', 'Jam Digital').should('be.visible').click();

    // Tool aktif: tombol kembali + konten .page-section muncul
    cy.contains('button', 'Kembali ke Tools').should('be.visible');
    cy.get('.page-section').should('exist');
  });

  it('Halaman Donasi tampil dengan judul section', () => {
    cy.visit('/donasi');

    cy.get('.hero-section').should('exist');
    cy.get('h2.section-title').should('exist');
  });

  it('Halaman Kontak tampil', () => {
    cy.visit('/kontak');

    cy.get('.hero-section').should('exist');
  });

  it('Halaman Login tampil dengan form', () => {
    cy.visit('/login');

    // Halaman login punya form email + password
    cy.get('input[type="email"], input[name="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('Halaman Register tampil', () => {
    cy.visit('/register');

    cy.get('#root').children().should('have.length.greaterThan', 0);
    // Wizard register langkah 1 ada form
    cy.get('form').should('exist');
  });

  it('Kalkulator Pinjaman (publik) tampil dengan input & tombol hitung', () => {
    cy.visit('/kalkulator-pinjaman');

    cy.get('#root').children().should('have.length.greaterThan', 0);
    // 3 input angka: jumlah pinjaman, jumlah orang, jumlah periode
    cy.get('input[type="number"]').should('have.length.at.least', 3);
  });

  it('Route tidak dikenal tidak merender blank', () => {
    cy.visit('/halaman-tidak-ada-404', { failOnStatusCode: false });

    // React Router tetap render sesuatu (redirect/layout), #root tidak kosong
    cy.get('#root').children().should('have.length.greaterThan', 0);
  });

  it('Navigasi navbar berfungsi (klik link Masjid)', () => {
    cy.visit('/');

    // Link desktop nav (link "Tools" ada di dropdown Lainnya, tidak selalu visible)
    cy.get('nav a[href="/masjid"]').first().should('be.visible').click();

    cy.url().should('include', '/masjid');
    // Halaman tetap ter-render
    cy.get('#root').children().should('have.length.greaterThan', 0);
  });
});
