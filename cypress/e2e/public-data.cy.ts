/// <reference types="cypress" />

// =====================================================================
// E2E test — Halaman publik dengan DATA ASLI (Fix #48)
// Prasyarat:
//   1. Vite dev server → http://localhost:3000
//   2. Content Service (8003) WAJIB (search masjid, kajian/acara/cerita/donasi)
//   3. Auth Service (8001) untuk test alur login microfinance
// =====================================================================

const AKUN_BMM = { email: 'dkmalhidayah0107@gmail.com', password: 'menara23' };
const AKUN_BAZNAS = { email: 'baznas-provinsi@menara.masjid', password: 'menara23' };

describe('Halaman publik — data asli dari API (Fix #48)', () => {
  it('Pencarian masjid menampilkan data asli + search server-side bekerja', () => {
    cy.visit('/masjid');

    // Kartu masjid terisi dari GET /masjid/search (data asli, bukan mock)
    cy.get('.card-hover', { timeout: 15000 }).should('have.length.at.least', 1);

    // Search server-side (debounced) → nama asli muncul
    cy.get('input[placeholder="Cari nama masjid..."]').type('istiqomah');
    cy.contains('h3', 'Al-istiqomah', { timeout: 15000 }).should('be.visible');
  });

  it('Detail masjid publik menampilkan data asli via slug', () => {
    cy.visit('/masjid');

    cy.get('.card-hover', { timeout: 15000 }).should('have.length.at.least', 1);
    cy.get('.card-hover').first().contains('Lihat Profil').click();

    // URL berubah ke /masjid/{slug}, h1 berisi nama masjid asli
    cy.url({ timeout: 15000 }).should('include', '/masjid/');
    cy.get('h1', { timeout: 15000 }).invoke('text').should('have.length.at.least', 3);
    cy.contains('Kembali ke Daftar Masjid').should('exist');
  });

  it('Klik Microfinance di navbar (belum login) → /login → setelah login BMM → /microfinance', () => {
    cy.clearAllLocalStorage();
    cy.visit('/masjid');

    // Link Microfinance ada di dropdown "Lainnya" (desktop, hidden sampai hover)
    cy.get('a[href="/microfinance"]').first().click({ force: true });

    // Direct ke /login (bukan flash redirect diam-diam)
    cy.url().should('include', '/login');

    // Login sebagai Admin Masjid BMM → mendarat di /microfinance
    cy.get('input[type="email"]').type(AKUN_BMM.email);
    cy.get('input[type="password"]').type(AKUN_BMM.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 15000 }).should('include', '/microfinance');
  });

  it('Login role lain dari redirect microfinance → dashboard sesuai role', () => {
    cy.clearAllLocalStorage();
    cy.visit('/masjid');

    cy.get('a[href="/microfinance"]').first().click({ force: true });
    cy.url().should('include', '/login');

    // Pilih role Admin BAZNAS lalu login akun provinsi (id_level=11 → admin-daerah)
    cy.get('button[type="button"]').first().click();
    cy.get('div.absolute.z-20 button[type="button"]').contains('Admin BAZNAS').click();
    cy.get('input[type="email"]').type(AKUN_BAZNAS.email);
    cy.get('input[type="password"]').type(AKUN_BAZNAS.password);
    cy.get('button[type="submit"]').click();

    // Role tidak punya akses microfinance → dashboard default role-nya
    cy.url({ timeout: 15000 }).should('include', '/dashboard-daerah');
    cy.url().should('not.include', '/microfinance');
  });

  it('Halaman publikasi menampilkan data asli dari API', () => {
    cy.visit('/kajian');

    // Kartu publikasi terisi (gabungan 5 endpoint content service)
    cy.get('.card-hover', { timeout: 15000 }).should('have.length.at.least', 1);

    // Tab Donasi → kartu donasi asli (data legacy: target dana NULL,
    // jadi progress bar tidak tampil — progress hanya muncul jika target > 0)
    cy.contains('button', 'Donasi').click();
    cy.get('.card-hover', { timeout: 15000 }).should('have.length.at.least', 1);

    // Tab Acara → kartu acara asli
    cy.contains('button', 'Acara').click();
    cy.get('.card-hover', { timeout: 15000 }).should('have.length.at.least', 1);
  });
});
