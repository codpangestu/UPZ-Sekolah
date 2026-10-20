# 🧪 Panduan E2E Testing — Cypress (Frontend MENARA Masjid)

> Dibuat: 1 Okt 2026 — lihat CONTEXT.md Fix History #44 (setup), #45 (test login), #46 (test dashboard), #47 (test Microfinance), #48 (halaman publik data asli), #49 (CRUD publikasi).
> Status saat ini: **33 test / 6 spec, semua PASS**.

---

## 📦 Apa yang Ada di Dalam

| Spec | Jumlah | Isi | Butuh Backend? |
|------|--------|-----|----------------|
| `cypress/e2e/public-smoke.cy.ts` | 9 test | Halaman publik render: homepage (nav/h1/footer), Tools (klik kartu Jam Digital → tool ter-render), Donasi, Kontak, Login (form), Register (form), Kalkulator Pinjaman (3 input number), route 404 tidak blank, navigasi klik link `/masjid` | ❌ Tidak — cukup Vite |
| `cypress/e2e/login.cy.ts` | 7 test | Login 3 role → redirect dashboard yang benar, password salah → pesan error backend, akun lintas-role ditolak (403), session persist setelah reload | ✅ Ya — semua service + DB |
| `cypress/e2e/dashboard-admin-masjid.cy.ts` | 4 test | Dashboard setelah login: welcome card + nama masjid + 3 kartu statistik, grafik kas (Recharts) + toggle rentang, Buku Kas Penerimaan (tabel + search server-side), Profil Masjid (form terisi API). Pakai command reusable `cy.loginAdminMasjid()` dari `cypress/support/commands.ts` | ✅ Ya — semua service + DB |
| `cypress/e2e/microfinance.cy.ts` | 4 test | Menu BMM (kartu submenu + link aktif), Saldo Microfinance (seed "Saldo BAZNAS RI" Rp58.091.000), Peserta Program (50 peserta seed + ikon aksi pencairan/pengembalian, read-only), Kalkulator Skema Pinjaman (publik, hitung 1,2jt/1/12 → Rp100.000). Pakai `cy.loginViaUi()` dengan akun BMM | ✅ Ya — semua service + DB |
| `cypress/e2e/public-data.cy.ts` | 5 test | Halaman publik DATA ASLI (Fix #48): pencarian masjid + search server-side + detail via slug, klik Microfinance di navbar → /login → login BMM → /microfinance (dan role lain → dashboard role-nya), halaman publikasi tab Donasi/Acara | ✅ Ya — **Content Service (8003) WAJIB** + Auth (8001) |
| `cypress/e2e/publikasi-crud.cy.ts` | 4 test | CRUD dashboard Menu Publikasi (Fix #49): 8 tab render, tambah postingan via modal, edit status → "Tidak Aktif", hapus. Test membuat & menghapus datanya sendiri (prefiks "E2E Test") — tidak menyentuh data lain. Gotcha: scope form modal `div.fixed.z-50 form`, tombol aksi `button[title="Edit"]`/`[title="Hapus"]` | ✅ Ya — Admin Service (8005) WAJIB + Auth (8001) |

---

## 🚀 Langkah 1 — Start Vite dev server (WAJIB untuk semua spec)

```bash
cd frontend
npm run dev
```

- Dev server jalan di **http://localhost:3000** (sesuai `baseUrl` di `cypress.config.ts`).
- Cek cepat: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` → harus `200`.

## 🔌 Langkah 2 — Start 5 backend service (WAJIB untuk login/dashboard/microfinance/public-data)

```bash
cd backend
uvicorn services.auth_service.main:app --port 8001 &
uvicorn services.masjid_service.main:app --port 8002 &
uvicorn services.content_service.main:app --port 8003 &
uvicorn services.transaction_service.main:app --port 8004 &
uvicorn services.admin_service.main:app --port 8005 &
```

- Health check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/docs` → harus `200` (ulangi untuk 8002–8005).
- ⚠️ **Jangan pakai `--reload`** — di Windows bisa gagal memuat kode karena ghost instance yang bind port yang sama (SO_REUSEADDR).
- ⚠️ Kalau port macet/dipakai proses lama: `taskkill /IM python.exe /F` (matikan SEMUA service) lalu start ulang.

## ▶️ Langkah 3 — Jalankan Cypress (pilih salah satu)

```bash
cd frontend

# GUI interaktif — pilih "E2E Testing" → browser → klik spec yang mau dijalankan
npm run cypress:open

# Headless — SEMUA spec (public-smoke + login), hasil ringkas di terminal
npm run test:e2e

# Headless — satu spec saja
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

## 👤 Akun Uji (DB lokal `menara_masjid_revamp`)

Password semua akun: **`menara23`**

| Opsi dropdown login | Email | Role ter-infer | Redirect ke |
|---------------------|-------|----------------|-------------|
| Admin Masjid | `pangestuakbar939@gmail.com` | admin-masjid | `/dashboard` |
| Admin BAZNAS | `baznas-provinsi@menara.masjid` | admin-daerah (id_level=11) | `/dashboard-daerah` |
| Admin KUA | `admin.kua@menara.masjid` | admin-kua | `/dashboard-kua` |
| Admin Masjid BMM (khusus spec `microfinance.cy.ts`) | `dkmalhidayah0107@gmail.com` | admin-masjid (data seed BMM) | `/dashboard` |

> Catatan: akun "Admin BAZNAS" di atas sebenarnya akun **Admin Daerah** (provinsi) — sesuai desain Fix #40/#12, Admin Daerah & Admin Kab login lewat opsi "Admin BAZNAS" (endpoint `/login/admin-pusat`), role final di-infer dari `id_level`.
> Catatan: akun BMM (dkmalhidayah) = masjid **Jami Al-Hidayah Kubang Sepat** — satu-satunya masjid dengan seed data Microfinance (50 peserta, saldo, skema). Akun Al-istiqomah TIDAK punya data BMM.

---

## 📖 Membaca Hasil

- **Headless**: lihat tabel summary di akhir output:
  ```
  │ ✔  dashboard-admin-masjid.cy.ts  00:17   4    4    -    -    - │
  │ ✔  login.cy.ts                   00:23   7    7    -    -    - │
  │ ✔  microfinance.cy.ts            00:16   4    4    -    -    - │
  │ ✔  public-data.cy.ts             00:14   5    5    -    -    - │
  │ ✔  public-smoke.cy.ts            00:09   9    9    -    -    - │
  │ ✔  publikasi-crud.cy.ts          00:17   4    4    -    -    - │
  │ ✔  All specs passed!             01:38  33   33    -    -    - │
  ```
- **Gagal** → screenshot otomatis di `frontend/cypress/screenshots/` (di-gitignore). Video dimatikan (`video: false`).
- Jalankan ulang setelah memperbaiki; kalau semua hijau → selesai.

## 🔧 Troubleshooting

| Gejala | Penyebab & solusi |
|--------|-------------------|
| Cypress gagal `visit` / semua test timeout | Vite belum jalan → `npm run dev` dulu |
| Test login gagal padahal akun benar | Backend mati → start 5 service; atau password akun bukan `menara23` (sesi uji sebelumnya pernah reset password) → reset manual di DB |
| `ECONNREFUSED` ke port 800x | Service backend tertentu mati → health check `/docs` per port |
| Port backend macet, uvicorn tidak mau start | `taskkill /IM python.exe /F` lalu start ulang semua service |
| Error "can only be called on a single element" | Selector match >1 elemen — lihat gotcha selector di Fix #45 (trigger dropdown role = `button[type="button"]` pertama di halaman) |

## 📁 File Terkait

- `frontend/cypress.config.ts` — konfigurasi (baseUrl, timeout, dll.)
- `frontend/cypress/e2e/*.cy.ts` — file test
- `frontend/cypress/support/e2e.ts` + `commands.ts` — support file; `commands.ts` berisi command reusable **`cy.loginViaUi(email, password)`** (login via UI, akun apa pun) dan **`cy.loginAdminMasjid()`** (wrapper yang menunggu `/dashboard`, dipakai test dashboard)
- `frontend/cypress/tsconfig.json` — tsconfig terpisah agar test tidak ikut `tsc -b` proyek utama
- `CONTEXT.md` — Fix History #44 (setup & gotcha) dan #45 (test login)
