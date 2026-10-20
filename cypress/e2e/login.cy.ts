/// <reference types="cypress" />

// =====================================================================
// E2E test — Flow Login 3 role (real backend, TANPA mock)
// Prasyarat:
//   1. Vite dev server   → npm run di frontend/ (port 3000)
//   2. 5 backend service → uvicorn di backend/ (port 8001–8005)
//   3. DB lokal `menara_masjid_revamp` berisi akun uji:
//        • pangestuakbar939@gmail.com  (Admin Masjid, id_level=2)
//        • baznas-provinsi@menara.masjid (Admin Daerah, id_level=11 —
//          login lewat opsi "Admin BAZNAS", endpoint /login/admin-pusat)
//        • admin.kua@menara.masjid     (Admin KUA, id_level=13)
//      password semua akun: menara23
// =====================================================================

// --- Akun uji (jangan taruh kredensial produksi di sini) ---
const AKUN_MASJID = { email: 'pangestuakbar939@gmail.com', password: 'menara23' };
const AKUN_BAZNAS = { email: 'baznas-provinsi@menara.masjid', password: 'menara23' };
const AKUN_KUA = { email: 'admin.kua@menara.masjid', password: 'menara23' };

// --- Selector (struktur LoginPage.tsx) ---
const ROLE_TRIGGER = 'div.relative button[type="button"]'; // trigger dropdown "Login sebagai"
const EMAIL_INPUT = 'input[type="email"]';
const PASSWORD_INPUT = 'input[type="password"]';
const SUBMIT_BTN = 'button[type="submit"]';

/** Isi form login lalu submit. Role TIDAK diubah (default Admin Masjid). */
function isiFormLogin(email: string, password: string) {
  cy.get(EMAIL_INPUT).clear().type(email);
  cy.get(PASSWORD_INPUT).clear().type(password);
  cy.get(SUBMIT_BTN).click();
}

/** Pilih role di dropdown "Login sebagai" (klik trigger → klik opsi menu). */
function pilihRole(label: string) {
  // Trigger dropdown = button[type="button"] PERTAMA di halaman
  // (setelahnya: toggle show-password & "Lupa kata sandi?")
  cy.get('button[type="button"]').first().click();
  // Menu dropdown render di div.absolute.z-20 — hanya berisi opsi role
  cy.get('div.absolute.z-20 button[type="button"]')
    .contains(label)
    .click();
}

beforeEach(() => {
  // Pastikan state auth bersih sebelum tiap test
  cy.visit('/login');
  cy.clearLocalStorage();
  cy.reload();
  cy.get(EMAIL_INPUT).should('exist');
});

describe('Flow Login — 3 role', () => {
  it('Login Admin Masjid → redirect ke /dashboard + nama masjid tampil', () => {
    isiFormLogin(AKUN_MASJID.email, AKUN_MASJID.password);

    cy.url().should('include', '/dashboard', { timeout: 15000 });
    // Pastikan benar-benar di dashboard Admin Masjid (bukan dashboard role lain)
    cy.url().should('not.include', '/dashboard-baznas');
    cy.url().should('not.include', '/dashboard-daerah');
    cy.url().should('not.include', '/dashboard-kab');
    cy.url().should('not.include', '/dashboard-kua');
  });

  it('Login Admin BAZNAS (akun Admin Daerah) → redirect ke /dashboard-daerah', () => {
    pilihRole('Admin BAZNAS');
    isiFormLogin(AKUN_BAZNAS.email, AKUN_BAZNAS.password);

    // id_level=11 → inferRoleFromUser → admin-daerah → /dashboard-daerah
    cy.url().should('include', '/dashboard-daerah', { timeout: 15000 });
  });

  it('Login Admin KUA → redirect ke /dashboard-kua', () => {
    pilihRole('Admin KUA');
    isiFormLogin(AKUN_KUA.email, AKUN_KUA.password);

    cy.url().should('include', '/dashboard-kua', { timeout: 15000 });
  });

  it('Password salah → tetap di /login + pesan error dari backend', () => {
    isiFormLogin(AKUN_MASJID.email, 'password-salah');

    cy.url().should('include', '/login');
    // Alert error merah render dengan pesan backend { detail }
    cy.get('.bg-red-50')
      .should('be.visible')
      .and('contain.text', 'Email atau password salah');
  });

  it('Akun masjid lewat opsi Admin BAZNAS → ditolak backend (403)', () => {
    pilihRole('Admin BAZNAS');
    isiFormLogin(AKUN_MASJID.email, AKUN_MASJID.password);

    cy.url().should('include', '/login');
    cy.get('.bg-red-50')
      .should('be.visible')
      .and('contain.text', 'Akses ditolak');
  });

  it('Akun masjid lewat opsi Admin KUA → ditolak backend (403)', () => {
    pilihRole('Admin KUA');
    isiFormLogin(AKUN_MASJID.email, AKUN_MASJID.password);

    cy.url().should('include', '/login');
    cy.get('.bg-red-50')
      .should('be.visible')
      .and('contain.text', 'Akses ditolak');
  });

  it('Session tersimpan → reload halaman dashboard tetap login', () => {
    isiFormLogin(AKUN_MASJID.email, AKUN_MASJID.password);

    cy.url().should('include', '/dashboard', { timeout: 15000 });

    // Reload: token valid di localStorage → App.tsx restore sesi via GET /me
    cy.reload();
    cy.url().should('include', '/dashboard');
    // Masih di dashboard (tidak ditendang balik ke /login)
    cy.url().should('not.include', '/login');
  });
});
