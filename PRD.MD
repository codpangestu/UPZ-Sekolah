# Product Requirements Document (PRD)
## Frontend Aplikasi "Menara Masjid"

| Field | Detail |
|---|---|
| Dokumen | PRD Frontend Menara Masjid |
| Versi | 1.0 |
| Tanggal | 19 Juli 2026 |
| Referensi | Buku Panduan Aplikasi Menara Masjid v1.10.24 (BAZNAS) |
| Status | Draft |

---

## 0. Workflow untuk AI Agent ⚠️ WAJIB BACA

> Dua aturan berikut adalah **wajib** untuk AI coding agent yang mengerjakan proyek ini. Setiap pelanggaran akan menyebabkan inkonsistensi dan error berantai.

### 0.1 Baca PRD Sebelum Eksekusi
AI agent **WAJIB membaca file `PRD.MD` ini** setiap kali akan memulai perencanaan atau mengeksekusi task baru. Ini berlaku untuk:
- Task baru dari user (fitur baru, bug fix, refactor)
- Task lanjutan dari task sebelumnya (setelah jeda/obrolan baru)
- Task yang membutuhkan keputusan desain, pemilihan endpoint API, atau konvensi kode

**Tujuan:**
- Memastikan konsistensi dengan spesifikasi produk (section 7)
- Memastikan endpoint API yang dipakai sesuai kontrak (section 11)
- Memastikan tech stack dan struktur folder sesuai (section 5)
- Menghindari duplicate effort atau implementasi di luar scope

**Cara:** Cukup baca section yang relevan dengan task (tidak perlu baca seluruh dokumen setiap kali, tapi agent harus tahu bagian mana yang relevan).

### 0.2 Update CONTEXT.md Setelah Selesai Setiap Task
Setelah menyelesaikan **setiap task/modul**, AI agent WAJIB memperbarui file `CONTEXT.md` di root proyek dengan informasi:
- Modul/komponen baru yang dibuat (path file + deskripsi singkat)
- Perubahan pada routing (`App.tsx`)
- Dependency baru yang ditambahkan (`package.json`)
- Bug/fix penting yang ditemukan
- Status terbaru (✅ selesai / ⏳ masih placeholder)

**Tujuan:**
- Memberikan konteks penuh untuk AI agent di sesi berikutnya
- Menghindari pembuatan ulang modul yang sudah ada
- Memudahkan tracking progress proyek

---

## 1. Latar Belakang

BAZNAS memiliki Aplikasi Menara Masjid sebagai media sarana informasi, komunikasi, dan pelaporan UPZ (Unit Pengumpul Zakat) berbasis masjid. Aplikasi ini menggantikan manajemen manual UPZ masjid dengan sistem digital yang transparan, akuntabel, dan efisien, mendukung pencatatan ZIS DSKL (Zakat, Infak, Sedekah, Dana Sosial Keagamaan Lainnya) yang terintegrasi dengan SIMBA (Sistem Informasi Manajemen BAZNAS).

Saat ini dibutuhkan pembangunan **frontend** (antarmuka pengguna) untuk dua sisi:
1. **Panel Manajemen Masjid** — dashboard privat untuk operator/pengurus masjid mengelola data.
2. **Website Publik Masjid** — halaman publik yang menampilkan profil, kegiatan, dan publikasi masjid kepada jamaah/masyarakat.

Dokumen ini menjadi acuan bagi tim produk, desain, dan engineering dalam membangun frontend tersebut.

## 2. Tujuan

- Menyediakan antarmuka yang mudah digunakan oleh pengurus masjid (non-teknis) untuk mengelola data masjid secara mandiri.
- Menyediakan halaman publik (website masjid) yang informatif, dapat dibagikan, dan terindeks mesin pencari.
- Mendukung transparansi laporan keuangan ZIS DSKL kepada jamaah dan masyarakat.
- Mempercepat proses onboarding masjid baru (target: aktif dalam ±2 menit setelah didaftarkan BAZNAS Daerah).

## 3. Target Pengguna

Berdasarkan collection API (3 varian login: umum, admin-masjid, admin-pusat), aplikasi ini melayani **3 role dengan akses & scope data yang berbeda**:

| Peran | Deskripsi | Login Endpoint | Scope Data | Akses Menu (Ringkas) |
|---|---|---|---|---|
| **Petugas** | Pengguna operasional tingkat masjid (mis. sekretaris DKM, operator harian) yang diinput oleh Admin Masjid. Level "Petugas" sesuai istilah di buku panduan asli. | `POST /api/v1/login` (umum) | 1 masjid saja (masjid tempat ia terdaftar) | Bisa akses sebagian besar menu operasional (Buku Kas, Kegiatan, Publikasi, dsb), namun **tidak bisa** mengelola akun pengelola lain / hapus data sensitif — level akses granular ditentukan field `id_labels`/`level` dari data pengguna |
| **Admin Masjid** | Penanggung jawab utama 1 masjid (Ketua DKM / pengelola resmi yang didaftarkan BAZNAS Daerah). Setara "Pengelola" di buku panduan. | `POST /api/v1/login/admin-masjid` | 1 masjid (miliknya) — akses penuh untuk masjid tersebut | Semua menu Panel Manajemen Masjid (section 7.2–7.11) untuk masjidnya sendiri, termasuk menambah/menghapus Petugas lain |
| **Admin Pusat** | Staff BAZNAS Pusat/Daerah yang mengelola data lintas-masjid, master data, dan approval. | `POST /api/v1/login/admin-pusat` | Semua masjid (lintas wilayah) | Dashboard rekap lintas masjid, Master Data (Levels, Labels, Jenis Dana, dsb — section 11.6), CRUD Wilayah, **approval Pengajuan Masjid Baru** (section 7.13 baru), CRUD Content publik nasional (Informasi, Panduan, dsb.) |
| Jamaah / Masyarakat Umum | Melihat profil, kegiatan, berita, dan berdonasi; mengajukan masjid baru | Tanpa login | — | Website Publik Masjid + halaman publik "Ajukan Masjid Baru" |

> **Implikasi untuk frontend**: Panel Manajemen perlu 1 layout dengan **sidebar menu dinamis berdasarkan role** (bukan 1 sidebar statis untuk semua). Simpan role hasil `GET /api/v1/me` di Zustand store (`useAuthStore`), lalu render item sidebar & guard route (`ProtectedRoute` dengan prop `allowedRoles`) berdasarkan role tsb. Halaman/data milik Admin Pusat (rekap lintas masjid, master data, approval pengajuan) **disembunyikan total** dari role Petugas & Admin Masjid, bukan sekadar disabled.

## 4. Ruang Lingkup (Scope)

### 4.1 In-Scope
- Halaman Login (Panel Manajemen Masjid) dengan 3 jalur role: Petugas, Admin Masjid, Admin Pusat
- Dashboard/Beranda Panel Masjid, termasuk **grafik penerimaan vs pengeluaran per bulan**
- Dashboard Rekap khusus Admin Pusat (lintas masjid)
- Manajemen Profil & Deskripsi Masjid
- Buku Kas Masjid (Penerimaan & Pengeluaran ZIS DSKL) + cetak transaksi/kwitansi
- Manajemen Data Pengurus Masjid
- Manajemen Data Anggota (Ustadz/Ustadzah, Marbot, Remaja, Santri, Cendikiawan, Jamaah)
- Manajemen Data Kegiatan Masjid
- Menu Publikasi (Postingan, Materi Khutbah Jumat, Media Info, Jadwal Kajian, Video Kajian, Cerita, Donasi, Acara/Event)
- Setting Akun Pengguna (ubah profil & password)
- Logout
- Website Publik Masjid (profil, foto, fasilitas, kegiatan, pengurus, struktur, kontak & peta, postingan, dsb.)
- **Tools interaktif di Website Publik**: Tasbih Digital, To-do List, Scan QRIS, Jadwal Sholat, Jam — dibangun sebagai fitur frontend penuh (bukan sekadar link eksternal)
- Fitur "Bagikan Website" (share link)
- **Halaman publik "Ajukan Masjid Baru"** (form pengajuan masjid oleh masyarakat/pengurus, terhubung ke endpoint Admin Service `pengajuan`) + halaman approval-nya di sisi Admin Pusat

### 4.2 Out-of-Scope
- Sistem registrasi akun masjid di SIMBA (dilakukan oleh BAZNAS Daerah, bukan bagian frontend Menara Masjid) — namun lihat catatan di section 13 soal kemungkinan tumpang tindih dengan fitur "Pengajuan Masjid"
- Backend/API dan integrasi database (dokumen ini fokus pada frontend)
- Aplikasi mobile native (kecuali disebutkan lain oleh stakeholder)
- Fitur Sync offline-to-online (`sync-push`/`sync-pull`) — itu untuk aplikasi mobile terpisah

## 5. Tech Stack & Konvensi Proyek

> Section ini adalah **acuan wajib** bagi AI coding agent. Semua kode yang digenerate harus konsisten mengikuti stack, struktur folder, dan konvensi di bawah ini — jangan menambahkan library lain di luar daftar tanpa alasan kuat yang dicatat di komentar kode.

### 5.1 Stack Terpilih

| Layer | Pilihan | Catatan |
|---|---|---|
| Build tool | **Vite** | React + TypeScript template (`npm create vite@latest -- --template react-ts`) |
| UI Library | **React 18** | Function component + hooks only, no class component |
| Bahasa | **TypeScript** | Strict mode aktif |
| Styling | **Tailwind CSS** | Utility-first, hindari custom CSS file kecuali untuk global reset |
| Component Library | **shadcn/ui** | Import komponen ke `src/components/ui/`, boleh dikustomisasi langsung (bukan npm package tertutup) |
| Icon | **lucide-react** | Konsisten dengan shadcn/ui |
| Routing | **React Router v6** | `createBrowserRouter`, nested routes untuk layout Panel Manajemen & Website Publik |
| Form Handling | **React Hook Form + Zod** | Semua form wajib pakai schema validation Zod |
| Data Fetching / Cache | **TanStack Query (React Query)** | Semua request ke backend lewat custom hooks (`useXxxQuery`, `useXxxMutation`) |
| HTTP Client | **Axios** | Instance terpusat di `src/lib/api.ts` dengan base URL & interceptor auth token |
| State Global (non-server) | **Zustand** | Untuk state UI ringan (mis. sidebar collapsed, modal open); jangan taruh data server di sini — itu tugas React Query |
| Rich Text Editor | **Tiptap** atau **React Quill** | Untuk field "Keterangan"/Deskripsi yang butuh formatting (bold/list/quote) |
| Date Picker | **react-day-picker** (sudah include di shadcn/ui) | |
| Upload File Preview | Native `<input type="file">` + preview via `URL.createObjectURL` | Validasi tipe & ukuran maks 2MB di client sebelum upload |
| Notifikasi/Toast | **sonner** (dipakai shadcn/ui) | Untuk pesan sukses/gagal |
| Charting | **Recharts** | **Wajib dipakai** untuk grafik Penerimaan vs Pengeluaran per bulan di Dashboard (section 7.2) |
| QR Code Scanner | **`html5-qrcode`** atau **`@zxing/browser`** | Untuk fitur "Scan QRIS" di Website Publik (section 7.13) — akses kamera device via `getUserMedia`, perlu HTTPS di production |
| QR Code Generator | **`qrcode.react`** | Untuk menampilkan QRIS masjid & QR code profil masjid (cetak QR di section 7.4) |
| Perhitungan Jadwal Sholat | **`adhan`** (npm package "adhan") | Library perhitungan waktu sholat berbasis koordinat & metode kalkulasi (mis. Kemenag/MWL), dihitung 100% client-side dari lat/long masjid — tidak perlu API eksternal |
| State Lokal Persisten (Tools) | **`zustand` + `persist` middleware**, sinkronisasi ke `window.storage` (jika dalam artifact) atau `localStorage` (jika app mandiri) | Untuk To-do List & histori Tasbih Digital yang perlu tersimpan antar sesi browser |

### 5.2 Backend (Arsitektur Nyata — Microservices)

Berdasarkan Postman Collection resmi ("MENARA API v2.0.0"), backend **bukan monolith tunggal**, melainkan **5 microservices terpisah**. Frontend harus mengarah ke base URL yang berbeda-beda sesuai domain data:

| Service | Port (local) | Tanggung Jawab |
|---|---|---|
| **Auth Service** | `8001` | Login (umum, admin-masjid, admin-pusat), Register, Profil pengguna (`/me`), Logout, Manajemen Users (CRUD) |
| **Masjid Service** | `8002` | Data Wilayah (Provinsi/Kab-Kota/Kecamatan/Kelurahan), Data Masjid (list/detail/search/by-wilayah), Pengurus Masjid, Rekap Keuangan |
| **Content Service** | `8003` | Seluruh konten publik: Home, Informasi, Kajian, Acara, Cerita, Donasi, Postingan, Panduan, Pengumuman, dan konten dinamis lain (infografis, inspirasi, dsb) |
| **Transaction Service** | `8004` | Buku Kas Penerimaan & Pengeluaran (termasuk "command-center"/ringkasan), Sync data mobile (push/pull) |
| **Admin Service** | `8005` | Master Data (levels, labels, jenis dana/harta, kategori, tema), serta **seluruh operasi CRUD (Create/Update/Delete)** untuk Masjid, Content, Master Data, Wilayah, Detail Masjid, Transaksi, dan Pengajuan Masjid Baru |

**Environment variables yang wajib dikonfigurasi** (`.env` / `.env.local`):
```
VITE_AUTH_URL=http://localhost:8001
VITE_MASJID_URL=http://localhost:8002
VITE_CONTENT_URL=http://localhost:8003
VITE_TRANSACTION_URL=http://localhost:8004
VITE_ADMIN_URL=http://localhost:8005
VITE_API_KEY=menara23apikey   # header x-api-key, WAJIB untuk hampir semua endpoint privat
```

**Konvensi otentikasi & header (penting untuk `lib/api.ts`):**
- Setiap service punya **base URL sendiri** → buat **5 instance Axios terpisah** (`authApi`, `masjidApi`, `contentApi`, `transactionApi`, `adminApi`) di `src/lib/api/`, masing-masing dengan base URL dari env var di atas, atau 1 factory function `createApiClient(baseURL)` yang dipakai berulang.
- Header `x-api-key` **wajib disertakan di hampir semua endpoint** (register, wilayah, master data, list masjid, rekap, bukukas, users, sync, seluruh admin CRUD) — kecuali beberapa endpoint publik/content (Home, Informasi, Kajian, Acara, dst tidak memerlukan `x-api-key` menurut collection) dan endpoint login.
- Header `Authorization: Bearer {token}` dipakai untuk endpoint yang butuh identitas user login (mis. `GET /me`). Beberapa endpoint privat lain (list masjid, users, admin CRUD) di collection **belum eksplisit mensyaratkan Bearer token** — ini perlu **dikonfirmasi ke tim backend** apakah otorisasi cukup dengan `x-api-key` saja atau tetap butuh token per-role (lihat Open Question terkait).
- Ada **3 varian login**: `POST /api/v1/login` (umum/semua user), `POST /api/v1/login/admin-masjid`, `POST /api/v1/login/admin-pusat` — pastikan halaman Login frontend memanggil endpoint yang sesuai dengan konteks/role yang login (atau minimal sediakan toggle/deteksi role).
- Response login mengembalikan `access_token` — token ini yang disimpan dan dipasang di header `Authorization` untuk request berikutnya. **Perhatian keamanan**: karena `x-api-key` bersifat statis dan tampak di collection publik, agent JANGAN meng-hardcode nilai ini di source code yang di-bundle ke client tanpa proteksi tambahan — tetap taruh di `.env` dan diperlakukan sebagai secret, idealnya dikonfirmasi ke backend team apakah key ini aman diexpose di frontend (SPA) atau seharusnya lewat backend-for-frontend/proxy.
- Frontend HARUS dibangun **API-first**: tipe data di `types/` mengikuti **penamaan field asli dari API** (Bahasa Indonesia, `snake_case`, mis. `id_masjid`, `nama_masjid`, `id_jalur_akses`, `nominal_masuk`, `id_provinsi`) — JANGAN menerjemahkan/mengubah nama field ke Inggris demi konsistensi dengan response backend yang sebenarnya.
- Selama endpoint tertentu belum bisa diakses (mis. service belum jalan di environment dev), AI agent boleh membuat **mock handler sementara** menggunakan **MSW (Mock Service Worker)** di `src/mocks/`, mengikuti kontrak response di section 11 — BUKAN hardcode data langsung di komponen.

### 5.3 Struktur Folder (Wajib Diikuti)

```
src/
├── assets/                # gambar statis, logo, ikon custom
├── components/
│   ├── ui/                # komponen dari shadcn/ui (jangan diedit strukturnya, kustomisasi via className/variant)
│   ├── shared/             # komponen reusable lintas modul (DataTable, FormModal, GalleryGrid, dll — lihat section 8)
│   └── layout/             # DashboardLayout, PublicSiteLayout, AuthLayout
├── features/               # 1 folder per modul fungsional (lihat mapping di bawah)
│   ├── auth/
│   ├── dashboard/
│   ├── profil-masjid/
│   ├── buku-kas/
│   ├── buku-aset/
│   ├── data-pengurus/
│   ├── data-anggota/       # sub: ustadz, marbot, remaja, santri, cendikiawan, jamaah
│   ├── kegiatan-masjid/
│   ├── menu-publikasi/     # sub: postingan, khutbah, media-info, jadwal-kajian, video-kajian, cerita, donasi, acara
│   ├── setting-akun/
│   └── website-publik/
│       └── (sub-halaman publik: profil, foto, fasilitas, kegiatan, kontak, pengurus, struktur, logo, postingan)
├── hooks/                  # custom hooks lintas modul (mis. useDebounce, usePagination)
├── lib/
│   ├── api/
│   │   ├── client.ts        # factory createApiClient(baseURL) + interceptor auth & x-api-key
│   │   ├── auth.api.ts       # instance untuk Auth Service (8001)
│   │   ├── masjid.api.ts     # instance untuk Masjid Service (8002)
│   │   ├── content.api.ts    # instance untuk Content Service (8003)
│   │   ├── transaction.api.ts # instance untuk Transaction Service (8004)
│   │   └── admin.api.ts      # instance untuk Admin Service (8005)
│   ├── queryClient.ts      # konfigurasi TanStack Query
│   └── utils.ts            # helper umum (format currency, format tanggal, dsb.)
├── mocks/                  # MSW handlers (jika backend belum siap)
├── routes/                 # definisi React Router (router.tsx + route per grup)
├── store/                  # Zustand stores (UI state)
├── types/                  # TypeScript types/interfaces per domain (mirror schema FastAPI)
└── App.tsx
```

Setiap folder di `features/{nama-modul}/` idealnya berisi:
```
features/buku-kas/
├── components/       # komponen spesifik modul ini (mis. FormBukukasPenerimaan.tsx)
├── hooks/             # useBukukasPenerimaanQuery, useBukukasPenerimaanMutation, dst.
├── types.ts           # tipe data modul ini
├── schema.ts          # Zod schema validasi form modul ini
└── pages/             # halaman/route entrypoint modul ini
```

### 5.4 Konvensi Penamaan

- Komponen: `PascalCase.tsx` (mis. `DataTable.tsx`, `FormPengurusModal.tsx`)
- Hooks: `camelCase` diawali `use` (mis. `usePengurusListQuery.ts`)
- Types/Interfaces: `PascalCase`, akhiran sesuai konteks (`Pengurus`, `PengurusFormValues`, `PengurusResponse`)
- Route path: `kebab-case` (mis. `/menu-publikasi/materi-khutbah`)
- Nama file test: `{nama}.test.tsx` (co-located dengan komponennya)

### 5.5 Prinsip untuk AI Agent Saat Coding

1. **Reuse dulu, generate baru kemudian** — sebelum membuat komponen baru untuk modul anggota/publikasi baru, cek apakah `DataTable`, `FormModal`, `GalleryGrid` generic di `components/shared/` sudah bisa dipakai/diperluas.
2. **Semua data dari server wajib lewat TanStack Query** — jangan `useEffect` + `fetch` manual.
3. **Semua form wajib pakai React Hook Form + Zod resolver** — termasuk validasi ukuran/tipe file upload.
4. **Jangan hardcode teks Bahasa Indonesia tersebar** — kumpulkan string UI dalam file `constants` atau siapkan struktur untuk i18n meskipun saat ini hanya 1 bahasa.
5. **Ikuti kontrak API microservices di section 11** — definisikan types di `types/` per service (`types/auth.ts`, `types/masjid.ts`, dst.) mengikuti field asli dari Postman collection, dan tandai bagian yang belum terverifikasi dengan komentar `// TODO: verify against backend team`.
6. **Setiap modul CRUD (Pengurus, Anggota, Kegiatan, Publikasi, dll.) mengikuti pola yang identik** — pagination (`page`/`per_page`) + show-entries + modal tambah/edit + confirm dialog hapus — sehingga cukup dibuat generic sekali dan dipakai ulang (lihat section 9: Komponen UI Utama).
7. **Commit granular per modul** — saat men-generate banyak fitur sekaligus, pisahkan per modul/feature folder agar mudah direview.
8. **Ikuti desain Figma sebagai sumber kebenaran visual** — lihat section 5.6 untuk cara AI agent mengakses & menerapkan spesifikasi desain meski hanya punya akses view-only.

### 5.6 Referensi Desain Figma (Akses View-Only)

Desain UI untuk aplikasi ini **sudah ada di Figma** dari staf sebelumnya, namun akun yang dipakai sekarang hanya punya akses **Viewer** (tidak bisa edit). Berikut opsi untuk tetap memanfaatkan file Figma tsb secara maksimal sebagai acuan AI agent:

1. **Cek apakah "Dev Mode" tersedia untuk Viewer.** Banyak file Figma (khususnya di plan Team/Organization) mengizinkan Viewer membuka panel **Inspect/Dev Mode** meski tidak bisa mengedit — panel ini menampilkan nilai pasti: warna (hex), font-family, font-size, spacing (padding/margin), border-radius, dan bahkan snippet CSS siap pakai. Ini paling akurat dibanding menebak dari screenshot. Coba klik kanan elemen di Figma → cek apakah ada opsi "Inspect".
2. **Gunakan Figma REST API dengan Personal Access Token milik akun viewer.** Endpoint `GET https://api.figma.com/v1/files/{file_key}` **tetap bisa diakses** oleh siapa pun yang punya akses lihat file (tidak butuh izin edit), selama membuat Personal Access Token dari akun sendiri di Figma settings. Response API ini berisi seluruh struktur node, warna, tipografi, dan style secara terstruktur (JSON) — bisa dipakai untuk mengekstrak **design tokens** (palet warna, skala font, spacing) secara presisi, lalu dituangkan ke `tailwind.config.js` (`theme.extend.colors`, `theme.extend.fontSize`, dst).
3. **Manfaatkan Figma MCP (Model Context Protocol) jika AI agent yang dipakai mendukungnya** (mis. Claude Code, Cursor, atau tool sejenis yang mendukung koneksi MCP ke Figma). Server MCP resmi Figma ("Figma Dev Mode MCP Server") memungkinkan AI coding agent membaca node/frame Figma secara langsung — termasuk struktur komponen & style — hanya dengan akses view, sehingga AI agent bisa "melihat" desain secara terprogram saat menghasilkan kode, bukan cuma menebak dari gambar statis.
4. **Ekspor aset visual tetap bisa dilakukan Viewer** — gambar/ikon/logo di Figma umumnya tetap bisa di-export (PNG/SVG) oleh Viewer selama pemilik file tidak mengunci opsi tersebut. Manfaatkan ini untuk mengambil aset logo, ikon custom, ilustrasi yang dipakai di desain.
5. **Kalau opsi 1–4 semua terkunci**, sebagai jalan terakhir: minta staf/PM untuk generate **link "Share" dengan mode "Anyone with the link can view"**, lalu screenshot per halaman/frame dengan resolusi tinggi dan susun jadi dokumen referensi visual terpisah (`design-reference/`) berisi screenshot + anotasi manual (warna dominan, ukuran font perkiraan) supaya AI agent tetap punya sesuatu yang konkret untuk direplikasi, meski kurang presisi dibanding opsi API/Dev Mode.
6. **Rekomendasi terbaik**: kombinasikan opsi 2 (Figma API untuk design tokens presisi) + opsi 4 (ekspor aset) sebagai fondasi, lalu opsi 1/3 dipakai insidental saat butuh detail spacing/layout spesifik per halaman.

> Catatan: karena tidak ada akses edit, AI agent **tidak perlu** dan **tidak akan bisa** memodifikasi file Figma itu sendiri — file Figma murni jadi sumber referensi baca saja (read-only design source of truth), semua perubahan desain dilakukan di kode (Tailwind/React), bukan di Figma.

## 6. Alur Pengguna Utama (User Flow)

```
BAZNAS Daerah daftarkan masjid (SIMBA)
        ↓
BAZNAS Daerah tambahkan akun pengelola
        ↓
Pengurus Masjid Login ke Menara Masjid (frontend ini)
        ↓
Kelola: Profil | Buku Kas | Pengurus | Anggota | Kegiatan | Publikasi
        ↓
Data otomatis tampil di Website Publik Masjid
        ↓
Website dibagikan via WhatsApp/medsos & terindeks Google
```

## 7. Kebutuhan Fungsional (Functional Requirements)

### 7.1 Autentikasi
- **FR-1.1**: Halaman Login dengan input Email & Password.
- **FR-1.2**: Notifikasi sukses ("Selamat, E-mail dan Password Sesuai, Anda Telah Berhasil Masuk") dan notifikasi gagal (email/password salah).
- **FR-1.3**: Tombol "Keluar Aplikasi" dengan dialog konfirmasi (Ya/Tidak) sebelum logout, mengarahkan kembali ke halaman utama Menara Masjid.
- **FR-1.4**: Setelah login sukses, frontend memanggil `GET /api/v1/me` untuk mengambil data role pengguna (Petugas / Admin Masjid / Admin Pusat), disimpan di `useAuthStore` (Zustand), dan dipakai untuk menentukan endpoint login yang dipanggil sebelumnya serta menu/route yang ditampilkan (lihat section 3: Target Pengguna).
- **FR-1.5**: Halaman Login dapat menyediakan **toggle/tab pilihan "Login sebagai"** (Petugas/Admin Masjid, atau Admin Pusat) agar frontend tahu endpoint mana yang harus dipanggil (`/login`, `/login/admin-masjid`, `/login/admin-pusat`) — atau, jika 1 form generik dipakai untuk semua, coba endpoint umum dulu (`/login`) lalu redirect berdasarkan role dari response `/me`. *(Keputusan UX final: dikonfirmasi dengan tim produk saat desain wireframe.)*
- **FR-1.6**: Route guard (`ProtectedRoute`) memblokir akses ke halaman yang bukan scope role-nya (mis. Petugas mencoba akses Dashboard Rekap Admin Pusat → redirect ke halaman "403 Tidak Diizinkan" atau ke Dashboard miliknya).

### 7.2 Dashboard / Panel Manajemen

**Untuk role Petugas & Admin Masjid (dashboard 1 masjid):**
- **FR-2.1**: Sidebar navigasi kolapsibel berisi menu: Beranda, Data Masjid, Info Masjid, Menu Publikasi, Buku KAS Masjid, Buku Aset, Info dan Lain-lain, Setting Akun, Keluar Aplikasi — item menu disesuaikan role (lihat section 3).
- **FR-2.2**: Halaman Beranda menampilkan kartu info akun pengguna (nama, level akses, foto & nama masjid, alamat).
- **FR-2.3**: Tombol "Kunjungi Website Masjid" yang membuka website publik di tab baru.
- **FR-2.4**: Widget tambahan: Kartu Level Aktifitas, Sosial Media Masjid, Input Ulasan Aplikasi.
- **FR-2.5** *(baru)*: **Grafik "Penerimaan vs Pengeluaran per Bulan"** (bar chart atau line chart, dibangun dengan Recharts) untuk masjid yang sedang login, menampilkan tren 12 bulan terakhir (atau filter rentang tanggal). Data diambil dari kombinasi `GET /api/v1/rekap/by-masjid/{id_masjid}` (Masjid Service) dan/atau agregasi dari `bukukas-penerimaan/command-center` + `bukukas-pengeluaran/command-center` (Transaction Service) — bila endpoint rekap belum granular per bulan, agent membuat agregasi di frontend dari data list dengan query rentang tanggal, dan menandai `// TODO: konfirmasi apakah backend punya endpoint rekap bulanan langsung`.
- **FR-2.6** *(baru)*: Toggle/filter periode grafik: Bulanan (12 bulan terakhir), atau custom date range.
- **FR-2.7** *(baru)*: Ringkasan angka di atas grafik: Total Penerimaan, Total Pengeluaran, Saldo Akhir periode terpilih.

**Untuk role Admin Pusat (dashboard lintas masjid) — Halaman terpisah `/dashboard-pusat`:**
- **FR-2.8** *(baru)*: Ringkasan agregat seluruh masjid: jumlah masjid terdaftar, total penerimaan & pengeluaran nasional/per wilayah (dari `GET /api/v1/rekap/penerimaan` & `/rekap/pengeluaran`).
- **FR-2.9** *(baru)*: Grafik tren penerimaan vs pengeluaran lintas masjid, dengan filter wilayah (Provinsi/Kab-Kota) memakai dropdown wilayah berjenjang (section 11.2).
- **FR-2.10** *(baru)*: Widget "Pengajuan Masjid Baru Menunggu Persetujuan" (jumlah + link ke halaman approval, lihat section 7.13).

### 7.3 Setting Akun Pengguna
- **FR-3.1**: Tab "Data Personal" menampilkan & mengedit: Nama Lengkap, Jenis Kelamin, Alamat, Email, No. HP, Foto Profil.
- **FR-3.2**: Tab "Ubah Password" dengan field Password Baru & Konfirmasi Password Baru, validasi kecocokan sebelum submit.

### 7.4 Profil & Deskripsi Masjid
- **FR-4.1**: Halaman Profil Masjid menampilkan data eksisting: ID, Jenis, Tipologi, Nama, No HP, Email, Daya Tampung, Deskripsi.
- **FR-4.2**: Form "Ubah Profil Masjid" mencakup:
  - Warna tulisan & background website (color picker + hex input)
  - Kategori jenis gaya font tulisan + preview
  - Tulisan berjalan (running text) di halaman website
  - Label masjid (status UPZ) & No. SK UPZ
  - Luas tanah, luas bangunan, daya tampung, status tanah
  - Alamat lengkap + dropdown Provinsi/Kab-Kota/Kecamatan/Kelurahan
  - Upload thumbnail/foto profil (jpg/jpeg/png/gif, maks 2MB, resolusi disarankan 721x1280px)
  - Link video profil (embed YouTube)
- **FR-4.3**: Tombol cetak QR Code profil masjid.
- **FR-4.4**: Input koordinat lokasi masjid (untuk peta).

### 7.5 Buku Kas Masjid (Penerimaan & Pengeluaran)
- **FR-5.1**: Ringkasan di header: Total Nominal Masuk, Total Nominal Keluar, Saldo — realtime terhitung.
- **FR-5.2**: Tabel list transaksi dengan kolom: Tanggal, Opsi (cetak/lihat), Jenis Dana, Jenis Harta, Label Info Dana, Nominal, Jumlah Donatur/Penerima Manfaat, Keterangan, Aksi (Edit/Hapus).
- **FR-5.3**: Fitur pencarian berdasarkan keterangan & filter data.
- **FR-5.4**: Form "Tambah Bukukas Penerimaan" — field: Tanggal, Jenis Dana, Jenis Harta, Label Info Dana, Nominal, Jumlah Donatur, Keterangan, Lampiran (upload bukti).
- **FR-5.5**: Form "Tambah Bukukas Pengeluaran" — field: Tanggal, Nominal, Jumlah Penerima Manfaat, Jumlah Pengentasan Kemiskinan, Jenis Asnaf, Jenis Bidang Program, Keterangan, Jenis Dana, Jenis Harta, Label Info Dana, Lampiran.
- **FR-5.6**: Fitur "Cetak Transaksi" (laporan keseluruhan) dan "Cetak" per baris (kwitansi per transaksi).
- **FR-5.7**: Pagination & kontrol jumlah baris per halaman (show entries: 10/25/50/…).

### 7.6 Buku Aset
- **FR-6.1**: Modul pencatatan aset masjid (mengikuti pola CRUD serupa Buku Kas — tambah/edit/hapus/cetak). *Detail field lanjutan menunggu konfirmasi dari tim produk (tidak dirinci di sumber panduan).*

### 7.7 Info Masjid — Data Pengurus
- **FR-7.1**: Tabel "Data Pengurus Akun Aplikasi" — kolom: Foto, Nama Lengkap, Level, Label, Aksi (Edit/Hapus).
- **FR-7.2**: Form "Tambah Pengurus" — field: Status Akun (Aktif untuk Akun Aplikasi / non-aktif hanya data), Level Akun (Petugas/lainnya), Fungsi (jabatan struktur), Nama Lengkap, Jenis Kelamin, Alamat, No. HP, Email, Foto Profil, Info Lainnya.
- **FR-7.3**: Catatan validasi: jika pengguna tidak diizinkan akses Admin Panel, status diatur "tidak aktif".

### 7.8 Info Masjid — Data Anggota
- **FR-8.1**: Sub-menu popup: Data Ustadz/Ustadzah, Data Marbot, Data Remaja, Data Santri, Data Cendikiawan, Data Jamaah.
- **FR-8.2**: Data Ustadz/Ustadzah — form: Nama Lengkap, Jenis Kelamin, Usia, Pekerjaan, No. KTP, Tempat Tanggal Lahir, Alamat, Keterangan (rich text), Foto.
- **FR-8.3**: Data Jamaah — form: Kategori Data Jamaah (mis. Warga Lama), Tanggal, Nama Lengkap, Jenis Kelamin, Usia, Pekerjaan, No. KTP, Tempat Tanggal Lahir, Alamat, Foto.
- **FR-8.4**: Pola form serupa berlaku untuk Data Marbot, Remaja, Santri, Cendikiawan.
- **FR-8.5**: Semua tabel data anggota memiliki: pencarian (nama/alamat), toggle status aktif/nonaktif, aksi Edit/Hapus, tombol "Lihat"/"Salin" link publik profil anggota.

### 7.9 Data Kegiatan Masjid
- **FR-9.1**: Tabel daftar kegiatan (Nama, Jenis: Rutin/Tertentu, Aksi).
- **FR-9.2**: Form "Tambah Kegiatan" — field: Nama, Jenis, Keterangan (rich text editor), Foto (jpg/jpeg/png/gif, maks 2MB).

### 7.10 Menu Publikasi
- **FR-10.1**: Landing menu publikasi dengan pilihan: Postingan, Materi Khutbah Jumat, Media Info, Jadwal Kajian Ilmu, Video Kajian, Cerita, Donasi, Acara.
- **FR-10.2**: **Postingan** — tabel list (Link/Lihat/Salin, Gambar, Judul, Penulis, Status toggle aktif/nonaktif, Aksi). Form Tambah: Kategori Postingan, Penulis, Judul, Status, Tanggal, Keterangan (rich text editor lengkap: bold/italic/list/quote), Foto.
- **FR-10.3**: Modul lain (Materi Khutbah, Media Info, Jadwal Kajian, Video Kajian, Cerita, Donasi, Acara) mengikuti pola CRUD serupa Postingan, disesuaikan field khususnya masing-masing (mis. Donasi perlu field rekening/QRIS, Acara perlu field tanggal & lokasi event).

### 7.11 Struktur, Logo, Mitra, QRIS (Sub-menu Info Masjid tambahan)
- **FR-11.1**: Struktur Masjid — pengaturan struktur organisasi kepengurusan.
- **FR-11.2**: Logo Masjid — upload logo-logo organisasi terkait masjid (DKM, PHBI, UPZ, dsb.) untuk ditampilkan di website.
- **FR-11.3**: Mitra Kerjasama — daftar mitra masjid.
- **FR-11.4**: QRIS — upload/kelola QR code donasi.

### 7.12 Website Publik Masjid
- **FR-12.1**: Header berisi nama masjid, running text, tombol Media Info Masjid, jumlah dilihat, jumlah suka, tombol "Bagikan Website".
- **FR-12.2**: Navigasi tab utama: Profil Masjid & Info (Profil, Foto, Fasilitas, Kegiatan, Kontak, Peta), Pengurus & Organisasi (Pengurus, Struktur, Logo, Mitra, Komunitas, Dokumen), Publikasi (Postingan, Jadwal Kajian, Video Kajian, Donasi, QRIS, Acara), Tools (Tasbih digital, To-do list, Scan QRIS, Jadwal Sholat, Jam).
- **FR-12.3**: Galeri foto-foto masjid (grid card dengan judul).
- **FR-12.4**: Galeri fasilitas masjid (grid card dengan judul, mis. Kursi Difabilitas, AC, WiFi, dll).
- **FR-12.5**: Galeri kegiatan masjid.
- **FR-12.6**: Halaman Kontak — alamat, telepon, email, media sosial, info rekening donasi, peta lokasi (Google Maps embed).
- **FR-12.7**: Halaman Pengurus — grid foto pengurus dengan nama & jabatan.
- **FR-12.8**: Halaman Logo-logo organisasi masjid (grid).
- **FR-12.9**: Halaman Postingan Berita — grid card (gambar, judul, nama penulis), dapat diklik untuk membaca detail.
- **FR-12.10**: Fitur "Bagikan Website" — menyalin link ke clipboard, notifikasi "Berhasil disalin!", opsi share ke berbagai platform (WhatsApp, Facebook, dll via share sheet).
- **FR-12.11**: SEO — halaman website harus dapat diindeks mesin pencari (title, meta description, structured data dasar mengikuti nama masjid & alamat).

## 8. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Responsivitas** | Frontend harus responsive: desktop (Panel Manajemen dominan dipakai di desktop) dan mobile (Website Publik harus optimal di mobile karena diakses jamaah via WhatsApp/pencarian). |
| **Aksesibilitas** | Kontras warna cukup terutama karena warna tema (background & tulisan) dapat dikustomisasi per masjid — perlu validasi kontras minimum. |
| **Performa** | Halaman publik (Website Masjid) harus cepat dimuat karena jadi entry point dari share link & pencarian Google. |
| **Keamanan** | Validasi upload file (tipe & ukuran maks 2MB untuk foto), proteksi form dari XSS pada field rich text (Keterangan/Deskripsi). |
| **Kompatibilitas Browser** | Mendukung Chrome, Safari, Firefox versi terbaru (mengacu pada dokumentasi asli yang mencontohkan Chrome & WhatsApp share). |
| **Konsistensi UI** | Sidebar hijau (brand color BAZNAS/Menara Masjid), ikon konsisten per menu, pola tabel (search + show entries + pagination + Aksi kolom) dipakai berulang di semua modul CRUD. |
| **Localization** | Bahasa Indonesia sebagai bahasa utama antarmuka. |
| **Reusability** | Karena banyak modul (Ustadz, Marbot, Jamaah, Santri, Cendikiawan, Postingan, dll.) memiliki pola form & tabel yang sangat mirip, komponen tabel-CRUD & form generator harus dibuat reusable/generic. |

## 9. Komponen UI Utama yang Perlu Dibangun

1. **AuthLayout** — halaman login.
2. **DashboardLayout** — sidebar + topbar + content area (untuk Panel Manajemen).
3. **DataTable** (generic) — search bar, show-entries selector, kolom dinamis, pagination, tombol Tambah, aksi Edit/Hapus/Cetak per baris.
4. **FormModal** (generic) — modal form dengan berbagai tipe field: text, textarea/rich-text editor, date picker, select/dropdown wilayah (provinsi→kab/kota→kecamatan→kelurahan berjenjang), file upload (image/pdf), color picker, toggle status.
5. **ProfileCard** — kartu info akun pengguna & masjid di beranda.
6. **PublicSiteLayout** — header masjid (judul, running text, tombol interaksi), tab navigasi kategori, footer.
7. **GalleryGrid** — untuk foto, fasilitas, kegiatan, logo, pengurus.
8. **MapEmbed** — komponen peta lokasi.
9. **ShareWidget** — copy-to-clipboard + share sheet.
10. **PrintPreview** — untuk cetak laporan transaksi & kwitansi.
11. **Toast/Notification** — untuk pesan sukses/gagal (mis. "Berhasil disalin!", "Selamat, Anda Telah Berhasil Masuk").
12. **ConfirmDialog** — untuk konfirmasi logout & hapus data.

## 10. Peta Halaman (Sitemap)

### Panel Manajemen Masjid (butuh login)
```
/login
/dashboard (Beranda)
/data-masjid/profil
/data-masjid/foto
/data-masjid/fasilitas
/data-masjid/fasilitas-tpa-tpq
/data-masjid/fasilitas-pesantren
/data-masjid/mobil-ambulance
/data-masjid/berbagi-makanan
/data-masjid/kegiatan
/data-masjid/komunitas
/data-masjid/dokumen
/data-masjid/arsip
/data-masjid/cap-stempel-masjid
/data-masjid/cap-stempel-upz
/data-masjid/logo
/info-masjid/data-pengurus
/info-masjid/data-anggota/ustadz
/info-masjid/data-anggota/ustadzah
/info-masjid/data-anggota/marbot
/info-masjid/data-anggota/remaja
/info-masjid/data-anggota/santri
/info-masjid/data-anggota/cendikiawan
/info-masjid/data-anggota/jamaah
/info-masjid/struktur
/info-masjid/mitra-kerjasama
/info-masjid/qris
/menu-publikasi/postingan
/menu-publikasi/materi-khutbah
/menu-publikasi/media-info
/menu-publikasi/jadwal-kajian
/menu-publikasi/video-kajian
/menu-publikasi/cerita
/menu-publikasi/donasi
/menu-publikasi/acara
/buku-kas/penerimaan
/buku-kas/pengeluaran
/buku-aset
/setting-akun
```

### Website Publik
```
/n/{slug-nama-masjid}                  → Beranda profil masjid
/n/{slug}/foto
/n/{slug}/fasilitas
/n/{slug}/kegiatan
/n/{slug}/kontak
/n/{slug}/pengurus
/n/{slug}/struktur
/n/{slug}/logo
/n/{slug}/postingan
/n/{slug}/postingan/{id}
/n/{slug}/jadwal-kajian
/n/{slug}/video-kajian
/n/{slug}/donasi
/n/{slug}/qris
/n/{slug}/acara
```

## 11. Kontrak API (Referensi untuk AI Agent — Berdasarkan Postman Collection Resmi "MENARA API v2.0.0")

> Endpoint di bawah ini **bukan asumsi lagi** — diambil langsung dari Postman Collection resmi tim backend. AI agent WAJIB memakai path, method, dan base URL persis seperti ini. Field JSON memakai penamaan asli backend (Bahasa Indonesia, `snake_case`) — jangan diterjemahkan ke Inggris.

### 11.1 Auth Service (`VITE_AUTH_URL`, port 8001)

| Fungsi | Method & Path | Header | Body / Query |
|---|---|---|---|
| Login (umum) | `POST /api/v1/login` | — | `{ email, password }` → response `{ access_token, ... }` |
| Login Admin Masjid | `POST /api/v1/login/admin-masjid` | — | `{ email, password }` |
| Login Admin Pusat | `POST /api/v1/login/admin-pusat` | — | `{ email, password }` |
| Register User (mobile/publik) | `POST /api/v1/register/user` | `x-api-key` | `{ id_jalur_akses, nama, jk, alamat, email, nohp, kode_org_baznas, id_labels, catatan }` |
| Get Current User | `GET /api/v1/me` | `Authorization: Bearer {token}` | — |
| Logout | `POST /api/v1/logout` | — | — |
| List Users | `GET /api/v1/users/list` | `x-api-key` | — |
| Detail User | `GET /api/v1/users/detail/{id_user}` | `x-api-key` | — |
| Register User (oleh admin) | `POST /api/v1/users/register` | `x-api-key` | form-urlencoded: `nama, email, jk, alamat, nohp, id_jalur_akses, id_labels` |
| Update User | `PUT /api/v1/users/update/{id_user}` | `x-api-key` | form-urlencoded |
| Delete User | `DELETE /api/v1/users/delete/{id_user}` | `x-api-key` | — |

### 11.2 Masjid Service (`VITE_MASJID_URL`, port 8002)

**Wilayah (dropdown berjenjang — dipakai di form Profil Masjid, Pengurus, dsb.):**

| Fungsi | Method & Path | Query |
|---|---|---|
| List Provinsi | `GET /api/v1/provinsi` | `?id=` (opsional, filter by ID) |
| List Kabupaten/Kota | `GET /api/v1/kabupaten-kota` | `?id_provinsi=` |
| List Kecamatan | `GET /api/v1/kecamatan` | `?id_kabupaten_kota=` |
| List Kelurahan/Desa | `GET /api/v1/kelurahan-desa` | `?id_kecamatan=` |

Semua endpoint wilayah butuh header `x-api-key`.

**Masjid & Rekap:**

| Fungsi | Method & Path | Header | Query/Path |
|---|---|---|---|
| Detail Masjid by ID | `GET /api/v1/masjid/detail/{id_masjid}` | — | |
| List Masjid | `GET /api/v1/masjid/list` | `x-api-key` | `?page=&per_page=` |
| Masjid by Wilayah | `GET /api/v1/masjid/by-wilayah` | `x-api-key` | `?id_provinsi=&page=&per_page=` |
| Cari Masjid (publik) | `GET /api/v1/masjid/search` | — | `?nama=` |
| Detail Masjid Publik Lengkap (untuk Website Publik, by slug) | `GET /api/v1/masjid/{slug}` | — | |
| Pengurus Masjid | `GET /api/v1/masjid/pengurus/{id_masjid}` | `x-api-key` | |
| Rekap Penerimaan (global) | `GET /api/v1/rekap/penerimaan` | `x-api-key` | |
| Rekap Pengeluaran (global) | `GET /api/v1/rekap/pengeluaran` | `x-api-key` | |
| Rekap by Masjid | `GET /api/v1/rekap/by-masjid/{id_masjid}` | `x-api-key` | |

> Catatan: Untuk **halaman Website Publik** (section 10), gunakan `GET /api/v1/masjid/{slug}` (Masjid Service) sebagai sumber data profil masjid + detail terkait, dikombinasikan dengan endpoint Content Service untuk postingan/kajian/acara dsb (lihat 11.3).

### 11.3 Content Service (`VITE_CONTENT_URL`, port 8003) — Semua Tanpa Auth (Publik)

| Fungsi | Method & Path |
|---|---|
| Home/Beranda | `GET /api/v1/home` |
| Informasi | `GET /api/v1/informasi` · `GET /api/v1/informasi/{slug}` |
| Kajian | `GET /api/v1/kajian` · `GET /api/v1/kajian/{slug}` |
| Acara | `GET /api/v1/acara` · `GET /api/v1/acara/{slug}` |
| Cerita | `GET /api/v1/cerita` · `GET /api/v1/cerita/{slug}` |
| Donasi | `GET /api/v1/donasi` · `GET /api/v1/donasi/{slug}` |
| Postingan | `GET /api/v1/postingan` · `GET /api/v1/postingan/{slug}` |
| Panduan Pengguna | `GET /api/v1/panduan-pengguna` · `.../{slug}` |
| Panduan Pengelola | `GET /api/v1/panduan-pengelola` · `.../{slug}` |
| Pengumuman | `GET /api/v1/pengumuman` · `.../{slug}` |
| Repository, Dokumentasi Pengembangan/Pengujian/Sosialisasi, Info Pemberitahuan, Infografis, Inspirasi, Infovideo, Infoayat, Infohadits, Infodoa | `GET /api/v1/{resource}` (list only, tanpa param di collection) |

> Semua konten di atas **dipakai untuk Website Publik & Menu Publikasi** (section 7.10, 7.12) — gunakan endpoint ini, jangan buat endpoint baru di frontend.

### 11.4 Transaction Service (`VITE_TRANSACTION_URL`, port 8004)

| Fungsi | Method & Path | Header | Query |
|---|---|---|---|
| Penerimaan - List | `GET /api/v1/bukukas-penerimaan/list` | `x-api-key` | `?page=&per_page=` |
| Penerimaan - Command Center (ringkasan/total) | `GET /api/v1/bukukas-penerimaan/command-center` | `x-api-key` | — |
| Pengeluaran - List | `GET /api/v1/bukukas-pengeluaran/list` | `x-api-key` | `?page=&per_page=` |
| Pengeluaran - Command Center | `GET /api/v1/bukukas-pengeluaran/command-center` | `x-api-key` | — |

> Endpoint **"command-center"** kemungkinan besar adalah sumber data untuk kartu ringkasan "Total Nominal Masuk / Keluar / Saldo" di halaman Buku Kas (FR-7.5 / section 7.5) — gunakan ini, bukan menghitung total di frontend dari list data.
> Create/Update/Delete transaksi kas **tidak ada di service ini** — dilakukan lewat **Admin Service** (lihat 11.5, "Transaksi CRUD").
> Endpoint Sync (`sync-push`, `sync-pull`) ditujukan untuk **aplikasi mobile offline-first** — **di luar scope frontend web** ini, cukup diketahui sebagai konteks arsitektur.

### 11.5 Admin Service (`VITE_ADMIN_URL`, port 8005) — Semua Operasi Create/Update/Delete

Ini adalah service **paling penting untuk Panel Manajemen Masjid**, karena hampir seluruh form "Tambah/Edit/Hapus" di section 7 mengarah ke sini. Semua butuh header `x-api-key` (dan kemungkinan `Authorization: Bearer`, perlu dikonfirmasi — lihat Open Question).

| Grup | Method & Path Pattern | Contoh Tipe/Resource |
|---|---|---|
| **Masjid CRUD** | `POST /api/v1/admin/masjid/create`, `PUT .../update/{id_masjid}`, `DELETE .../delete/{id_masjid}` | — |
| **Sync Detail Masjid (bulk)** | `POST /api/v1/admin/masjid/{id_masjid}/sync-detail` | Body berisi array `fasilitas[]`, `bank[]`, `medsos[]` sekaligus — dipakai untuk update banyak detail masjid dalam 1 request |
| **Content CRUD (generic)** | `POST /api/v1/admin/content/{tipe}/create`, `PUT .../update/{id}`, `DELETE .../delete/{id}` | `tipe` ∈ `informasi, kajian, acara, cerita, donasi, postingan, panduan-pengguna, panduan-pengelola, pengumuman, repository, dokumentasi-pengembangan, dokumentasi-pengujian, dokumentasi-sosialisasi, info-pemberitahuan, infografis, inspirasi, infovideo, infoayat, infohadits, infodoa` |
| **Master Data CRUD (generic)** | `POST /api/v1/admin/master/{tipe}/create`, `PUT .../update/{id}`, `DELETE .../delete/{id}` | `tipe` ∈ `levels, labels, jenis-dana, jenis-harta, jenis-laporan, jenis-perolehan-aset, label-info-dana, tema, kategori-acara, kategori-cerita, kategori-donasi, kategori-postingan, kategori-panduan-pengguna, kategori-panduan-pengelola, kategori-menara-video` |
| **Wilayah CRUD (generic)** | `POST /api/v1/admin/wilayah/{tipe}/create` (update/delete mengikuti pola sama, belum dicontohkan di collection) | `tipe` ∈ `provinsi, kabupaten-kota, kecamatan, kelurahan-desa` |
| **Detail Masjid CRUD (generic)** | `POST /api/v1/admin/detail/{tipe}/create` (+ update/delete pola sama) | `tipe` ∈ `fasilitas, images, dokumen, bank, medsos, logo, mitra-kerjasama, qris, struktur, kegiatan, videos` — Body selalu sertakan `parent_id` (= `id_masjid`) |
| **Transaksi CRUD (generic)** | `POST /api/v1/admin/transaksi/{tipe}/create` (+ update/delete pola sama) | `tipe` ∈ `bukukas-penerimaan, bukukas-pengeluaran, kas, coa, buku-aset, berkas-laporan, saran-masukan` |
| **Pengajuan Masjid Baru** | `GET /api/v1/admin/pengajuan/list`, `POST .../create`, `PUT .../update/{id}`, `DELETE .../delete/{id}` | Field: `nama_masjid, alamat_masjid, nohp_masjid, id_provinsi, id_kabupaten_kota, status_pengajuan` |

**Mapping ke modul frontend (section 7):**
- FR-7.4 (Profil Masjid) → Masjid CRUD (`update`) + Detail Masjid CRUD (`fasilitas`, `images`, `logo`, `medsos`, `bank`)
- FR-7.5 (Buku Kas) → Transaksi CRUD (`bukukas-penerimaan`, `bukukas-pengeluaran`) untuk create/update/delete + Transaction Service untuk list & command-center (read)
- FR-7.6 (Buku Aset) → Transaksi CRUD (`buku-aset`)
- FR-7.7/7.8 (Data Pengurus & Anggota) → **Belum ada endpoint spesifik "pengurus create/update/delete" atau "anggota per kategori (ustadz/jamaah/dst)" di collection ini.** Endpoint yang ada hanya `GET /api/v1/masjid/pengurus/{id_masjid}` (read-only). Ini **wajib dikonfirmasi ke tim backend** — kemungkinan tergolong dalam "Detail Masjid CRUD" dengan tipe yang belum tercantum, atau memang belum diimplementasi backend-nya (lihat Open Question).
- FR-7.9 (Kegiatan Masjid) → Detail Masjid CRUD (`kegiatan`)
- FR-7.10 (Menu Publikasi: Postingan, Cerita, Donasi, Acara, dll.) → Content CRUD (`{tipe}`) untuk create/update/delete + Content Service untuk read (list/detail by slug)
- FR-7.11 (Struktur, Logo, Mitra, QRIS) → Detail Masjid CRUD (`struktur`, `logo`, `mitra-kerjasama`, `qris`)

### 11.6 Master Data (Read-only, untuk dropdown/select form)

| Fungsi | Method & Path | Header |
|---|---|---|
| Levels | `GET /api/v1/levels` | `x-api-key` |
| Labels | `GET /api/v1/labels` | `x-api-key` |
| Jenis Dana | `GET /api/v1/jenis-dana` | `x-api-key` |
| Jenis Harta | `GET /api/v1/jenis-harta` | `x-api-key` |
| Label Info Dana | `GET /api/v1/label-info-dana` | `x-api-key` |
| Tema | `GET /api/v1/tema` | — |
| Kategori Acara | `GET /api/v1/kategori-acara` | — |
| Kategori Cerita | `GET /api/v1/kategori-cerita` | — |
| Kategori Donasi | `GET /api/v1/kategori-donasi` | — |
| Kategori Postingan | `GET /api/v1/kategori-postingan` | — |

> Dipakai untuk mengisi dropdown pada form Buku Kas (Jenis Dana, Jenis Harta, Label Info Dana — lihat FR-7.5) dan form Publikasi (Kategori Postingan, dsb — lihat FR-7.10). Base URL: Admin Service (8005), meskipun sifatnya read.

### 11.7 Catatan Umum untuk AI Agent

- Semua endpoint **`list`** yang mendukung pagination memakai query param **`page` & `per_page`** (bukan `limit`) — sesuaikan komponen `DataTable` generic (section 9) dengan konvensi ini, bukan asumsi lama (`page&limit`).
- **Belum ada endpoint dedicated untuk fitur "search dalam tabel"** (mis. cari berdasarkan keterangan/nama) di sebagian besar list endpoint kecuali `masjid/search?nama=`. Untuk modul lain (Bukukas, Content, Users), perlu dikonfirmasi apakah `list` endpoint mendukung query `?search=` atau filtering dilakukan di sisi frontend setelah fetch — **jangan asumsikan search backend tersedia** sebelum dikonfirmasi.
- Response sukses & error belum terdokumentasi formatnya di collection ini (tidak ada contoh response body) — AI agent membuat **error handling generik** di `lib/api/client.ts` (interceptor) yang menangani minimal: status 401 (redirect ke login), 403, 404, 422 (validation error), 500, dan menampilkan pesan via Toast, sambil menandai `// TODO: verify actual response shape once backend confirmed`.
- Endpoint upload file (foto profil, foto kegiatan, lampiran bukukas, dsb.) **tidak tercantum di collection ini** — kemungkinan terintegrasi di dalam masing-masing endpoint create/update sebagai multipart/form-data, atau ada endpoint upload terpisah yang belum didokumentasikan. **Wajib dikonfirmasi ke backend team** sebelum AI agent mengimplementasikan komponen upload (lihat Open Question).

## 12. Metrik Keberhasilan (Success Metrics)

- Waktu onboarding masjid (dari akun dibuat hingga profil terisi lengkap) ≤ 15 menit di sisi frontend.
- Tingkat penyelesaian pengisian form profil masjid (completion rate) meningkat.
- Jumlah kunjungan & share website publik masjid.
- Penurunan keluhan/error input pada Buku Kas (validasi form efektif).
- Waktu muat halaman website publik < 3 detik (di koneksi rata-rata).

## 13. Asumsi & Ketergantungan

- Backend dibangun sebagai **5 microservices terpisah** (Auth, Masjid, Content, Transaction, Admin — lihat section 5.2 & 11), bukan monolith tunggal; frontend mengonsumsi API dari 5 base URL berbeda.
- Autentikasi & manajemen akun tingkat masjid dikelola oleh Auth Service; frontend hanya mengonsumsi API yang tersedia.
- Registrasi masjid awal via SIMBA (BAZNAS Daerah) tetap di luar scope frontend ini — namun perlu dicatat bahwa collection API menunjukkan ada juga endpoint **"Pengajuan Masjid"** (`/api/v1/admin/pengajuan/*`) di Admin Service, yang mungkin merupakan jalur pengajuan masjid baru versi terbaru (menggantikan/melengkapi alur SIMBA) — perlu diklarifikasi ke tim produk apakah ini perlu dibuatkan UI-nya juga.
- Struktur wilayah administratif (Provinsi/Kab-Kota/Kecamatan/Kelurahan) sudah tersedia lewat Masjid Service (`GET /api/v1/provinsi`, dst — lihat section 11.2), dan CRUD-nya (untuk admin pusat) tersedia di Admin Service.
- Warna tema, font, dan running text bersifat dinamis per masjid — kemungkinan disimpan sebagai bagian dari data Masjid/Detail Masjid, namun **field spesifiknya belum terlihat di collection** (tidak ada contoh body untuk field ini di endpoint Masjid CRUD) — perlu dikonfirmasi ke backend.
- Header `x-api-key` yang sama (`menara23apikey` di environment contoh) dipakai di hampir semua service — ini kemungkinan API key tingkat aplikasi (bukan per-user), sehingga **tidak menggantikan otentikasi user** (`Authorization: Bearer`) untuk endpoint yang butuh identitas pengguna.
- Selama endpoint tertentu (upload file, CRUD Pengurus/Anggota per kategori) belum terlihat jelas di collection, AI agent bekerja dengan asumsi pola generic yang paling mendekati (mis. Detail Masjid CRUD) dan menandai dengan komentar `// TODO: verify against backend team` sampai dikonfirmasi.

## 14. Pertanyaan Terbuka (Open Questions)

**Terkait Produk:**
1. Apakah dibutuhkan role/permission lebih granular selain "Petugas" (mis. Super Admin masjid vs Editor konten)? *(Catatan: collection punya 3 varian login — umum, admin-masjid, admin-pusat — kemungkinan role sudah dibedakan di level ini, perlu dikonfirmasi mapping role ↔ akses menu.)*
2. Apakah dibutuhkan fitur laporan/analytics tambahan (grafik penerimaan vs pengeluaran per bulan) di dashboard? *(Endpoint `rekap/penerimaan`, `rekap/pengeluaran`, `rekap/by-masjid` sudah tersedia — kemungkinan besar untuk fitur ini.)*
3. Apakah tools "Tasbih digital", "To-do list", "Scan QRIS", "Jadwal Sholat", "Jam" di website publik perlu dibangun sebagai fitur interaktif front-end penuh atau cukup tautan ke aplikasi/tools eksternal? *(Tidak ada endpoint terkait di collection — kemungkinan fitur ini client-side murni.)*
4. Apakah desain visual (UI Kit/Design System) sudah tersedia, atau perlu dirancang dari awal mengacu pada screenshot di buku panduan?
5. Apakah endpoint **"Pengajuan Masjid"** (Admin Service) dimaksudkan untuk menggantikan alur registrasi via SIMBA, dan apakah perlu dibuatkan halaman publik "Ajukan Masjid Baru" di frontend ini?

**Terkait Teknis/API (wajib dikonfirmasi sebelum development lanjut):**
6. **Endpoint Pengurus & Anggota (Ustadz/Marbot/Remaja/Santri/Cendikiawan/Jamaah) untuk Create/Update/Delete belum ditemukan di collection** — hanya ada `GET /api/v1/masjid/pengurus/{id_masjid}` (read-only). Apakah modul ini masuk ke "Detail Masjid CRUD" dengan tipe tambahan yang belum dicontohkan, atau backend memang belum mengimplementasikannya?
7. **Endpoint upload file (foto profil, foto kegiatan, lampiran bukukas) tidak ada di collection.** Apakah upload dilakukan via multipart/form-data langsung di endpoint create/update masing-masing resource, atau ada endpoint upload terpisah (mis. ke storage/CDN) yang belum didokumentasikan?
8. Apakah endpoint privat (List Masjid, List Users, semua Admin CRUD) benar-benar **cukup dengan header `x-api-key` saja**, atau tetap mewajibkan `Authorization: Bearer {token}` milik user yang login? Ini krusial untuk desain `lib/api/client.ts` (interceptor).
9. Apakah list endpoint (Bukukas, Content, Users) mendukung query param **`search`** untuk pencarian server-side, atau pencarian di DataTable generic (section 9) harus dilakukan **client-side** setelah data di-fetch?
10. Format response sukses & error (structure JSON envelope, kode error) — apakah ada dokumentasi Swagger/OpenAPI per service yang bisa diakses (mis. `http://localhost:800x/docs`) untuk memverifikasi shape response secara pasti?
11. Apakah `x-api-key` yang bersifat statis ini aman untuk diexpose di bundle frontend (client-side SPA), atau sebaiknya proxy lewat backend-for-frontend agar key tidak terlihat oleh publik?



---

*Dokumen ini disusun berdasarkan isi Buku Panduan Aplikasi Menara Masjid v1.10.24 (BAZNAS, 10 Oktober 2024) dan ditujukan sebagai acuan awal pengembangan frontend. Detail teknis (arsitektur, API contract, komponen desain final) akan dijabarkan pada dokumen turunan seperti Technical Design Document (TDD) dan Design System.*