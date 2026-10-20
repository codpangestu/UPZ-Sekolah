/// <reference types="cypress" />

// =====================================================================
// E2E test — CRUD Dashboard Menu Publikasi (Fix #49, real backend)
// Prasyarat:
//   1. Vite dev server + 5 backend service + DB lokal
//   2. Akun uji Admin Masjid pangestuakbar939@gmail.com (menara23)
//   3. Tabel `publikasi` (migration 006) — test membuat & menghapus
//      datanya sendiri (prefiks "E2E Test"), TIDAK menyentuh data lain.
// =====================================================================

const JUDUL_UNIK = () => `E2E Test Publikasi ${Date.now()}`;
let judulDibuat = '';

describe('Dashboard Menu Publikasi — CRUD (Fix #49)', () => {
  beforeEach(() => {
    cy.loginAdminMasjid();
    cy.visit('/menu-publikasi');
    cy.url().should('include', '/menu-publikasi');
  });

  it('Halaman list ter-render dengan 8 tab jenis + tabel kosong', () => {
    // 8 tab jenis render
    cy.contains('button', 'Postingan').should('be.visible');
    cy.contains('button', 'Khutbah').should('be.visible');
    cy.contains('button', 'Media Info').should('be.visible');
    cy.contains('button', 'Jadwal Kajian').should('be.visible');
    cy.contains('button', 'Video Kajian').should('be.visible');
    cy.contains('button', 'Cerita').should('be.visible');
    cy.contains('button', 'Donasi').should('be.visible');
    cy.contains('button', 'Acara').should('be.visible');

    // Tabel + tombol tambah dari API publikasi (bukan error 404 lagi)
    cy.contains('button', 'Tambah Postingan', { timeout: 15000 }).should('be.visible');
  });

  it('Tambah postingan baru → muncul di tabel', () => {
    judulDibuat = JUDUL_UNIK();

    cy.contains('button', 'Tambah Postingan').click();

    // Scope ke form di dalam modal (fixed z-50) — input[type=text] umum
    // juga match search bar di belakang modal (tertutup overlay)
    // Scope SEMUA query ke dalam form modal — input[type=text] umum juga
    // match search bar di belakang modal (tertutup overlay)
    cy.get('div.fixed.z-50 form').within(() => {
      cy.get('input[placeholder="Judul konten"]').type(judulDibuat);
      cy.get('textarea[placeholder="Tulis konten..."]').type('<p>Konten dari test E2E</p>');
      // Kategori wajib — opsi dari KATEGORI_OPTIONS (Zakat/Infak/Berita/...)
      cy.get('select').eq(0).select('Berita');
      cy.get('textarea[placeholder="Catatan tambahan..."]').type('Keterangan dari test E2E');
      cy.contains('button', 'Simpan').click();
    });

    // Toast sukses + data muncul di tabel (list ter-refresh otomatis)
    cy.contains(judulDibuat, { timeout: 15000 }).should('be.visible');
  });

  it('Edit postingan: ubah status jadi nonaktif', () => {
    // Baris dengan judul yang baru dibuat test sebelumnya
    cy.contains(judulDibuat, { timeout: 15000 }).should('be.visible');

    // Buka modal edit — tombol aksi punya title="Edit" (kolom Aksi)
    cy.contains('table tbody tr', judulDibuat).find('button[title="Edit"]').click();

    // Pastikan ini modal EDIT (bukan Tambah)
    cy.contains('h2', 'Edit Postingan', { timeout: 10000 }).should('be.visible');

    // Scope ke form modal — dropdown filter status ada di toolbar BELAKANG modal
    cy.get('div.fixed.z-50 form').within(() => {
      cy.get('select').last().select('0'); // dropdown Status (paling akhir di form)
      cy.contains('button', 'Simpan Perubahan').click();
    });
    cy.contains('berhasil diperbarui', { timeout: 15000 }).should('exist');

    // Badge status berubah — teks badge: "Aktif" / "Tidak Aktif"
    cy.contains('table tbody tr', judulDibuat).contains('Tidak Aktif').should('exist');
  });

  it('Hapus postingan uji → hilang dari tabel (cleanup)', () => {
    cy.contains(judulDibuat, { timeout: 15000 }).should('be.visible');

    // Konfirmasi hapus (window.confirm)
    cy.on('window:confirm', () => true);
    cy.contains('table tbody tr', judulDibuat).find('button[title="Hapus"]').click();

    // Baris hilang
    cy.contains('table tbody tr', judulDibuat).should('not.exist');
  });
});
