import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Code2, Users, GraduationCap, Building2, School, Lock, HelpCircle, Printer, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function SyaratKetentuanPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* ============================== */}
      {/* HEADER & HERO SECTION */}
      {/* ============================== */}
      <section className="bg-white border-b border-slate-100 pt-8 pb-12 sm:pt-12 sm:pb-16 section-padding">
        <div className="content-width">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-sky-600 transition-colors">Beranda</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-sky-600 font-medium">Syarat & Ketentuan</span>
          </nav>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs sm:text-sm font-semibold border border-sky-100 mb-4">
              <Scale size={16} className="text-sky-600" />
              <span>© 2026 — Hak Cipta Dilindungi Sesuai Ketentuan yang Berlaku</span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Hak Cipta dan <span className="text-sky-600">Ketentuan Penggunaan</span>
            </h1>

            {/* Description */}
            <p
              className="text-base text-slate-600 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Halaman ini memuat informasi mengenai hak cipta, atribusi pengembangan, ketentuan penggunaan, perlindungan data, serta tanggung jawab pengguna terhadap platform digital yang dikembangkan untuk mendukung digitalisasi tata kelola kelembagaan dan filantropi Islam.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Code2 size={14} className="text-sky-600" />
                Kolaborasi Universitas Darunnajah & BAZNAS RI
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Menara Masjid | UPZ Desa | UPZ Sekolah</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* ATRIBUSI BANNER CARD */}
      {/* ============================== */}
      <section className="section-padding py-8">
        <div className="content-width">
          <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-600/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
                Sinergi Dosen & Mahasiswa
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                Inisiatif Digitalisasi Tata Kelola ZIS & Lembaga Islam
              </h2>
              <p className="text-sm text-sky-100 leading-relaxed">
                Digagas oleh <strong>M. Romadhona Kusuma</strong> (Dosen STI Universitas Darunnajah & Amil BAZNAS RI) bersama Tim Reborn <strong>Akbar Pangestu</strong> dan <strong>Ari Fujiono</strong>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                <Printer size={16} />
                <span>Cetak Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* MAIN DOCUMENT + SIDEBAR */}
      {/* ============================== */}
      <section className="section-padding pb-20">
        <div className="content-width flex flex-col lg:flex-row items-start gap-8">
          {/* Main Legal Content */}
          <div className="w-full lg:flex-1 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            
            {/* Section 1: Identitas dan Atribusi */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Identitas dan Atribusi Pengembangan
                  </h3>
                  <p className="text-xs text-slate-500">Peran & Kolaborasi Inisiator serta Tim Pengembang</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <p>
                    <strong className="text-slate-800">Founder dan Inisiator:</strong> M. Romadhona Kusuma, A.Md.Kom., S.Kom., M.Kom.
                  </p>
                  <p>
                    <strong className="text-slate-800">Profesi:</strong> Dosen Program Studi Sistem dan Teknologi Informasi, Universitas Darunnajah, serta praktisi teknologi informasi dan amil BAZNAS Republik Indonesia.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <p className="font-semibold text-slate-800">
                    Tim Reborn, Pengembangan Ulang, dan Penyempurnaan Aplikasi:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Akbar Pangestu</strong> — Mahasiswa Program Studi Sistem dan Teknologi Informasi, Universitas Darunnajah.</li>
                    <li><strong>Ari Fujiono</strong> — Mahasiswa Program Studi Sistem dan Teknologi Informasi, Universitas Darunnajah.</li>
                  </ul>
                </div>

                <p>
                  Platform ini merupakan bagian dari inisiatif digital yang digagas oleh M. Romadhona Kusuma. Dalam tahap pengembangan selanjutnya, aplikasi mengalami proses reborn, pembaruan, dan penyempurnaan teknologi melalui kolaborasi yang melibatkan Akbar Pangestu dan Ari Fujiono.
                </p>
                <p>
                  Kolaborasi ini mencerminkan sinergi antara dosen dan mahasiswa dalam menghadirkan solusi digital yang mendukung digitalisasi tata kelola zakat, infak, dan sedekah (ZIS).
                </p>
                <p className="text-xs text-slate-500 italic">
                  Atribusi ini diberikan untuk menjelaskan peran masing-masing pihak dalam perjalanan pengembangan aplikasi. Hak atas konsep, kode sumber, desain, dokumentasi, dan komponen lainnya mengikuti kontribusi masing-masing pihak, perjanjian yang berlaku, serta ketentuan peraturan perundang-undangan.
                </p>
              </div>
            </div>

            {/* Section 2: Ruang Lingkup Hak Cipta */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Ruang Lingkup Hak Cipta
                  </h3>
                  <p className="text-xs text-slate-500">Perlindungan Komponen Karya Platform</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>Hak cipta dapat mencakup berbagai komponen karya dalam platform, antara lain:</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    'Konsep, rancangan, dan dokumentasi pengembangan yang merupakan karya orisinal.',
                    'Desain antarmuka pengguna (UI/UX) dan elemen visual yang dibuat secara mandiri.',
                    'Kode sumber, struktur program, modul, dan implementasi perangkat lunak.',
                    'Dokumentasi teknis, panduan penggunaan, dan materi pendukung.',
                    'Konten, ilustrasi, serta elemen digital lainnya sesuai kepemilikan dan lisensinya.',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Perlindungan terhadap setiap komponen mengikuti ketentuan hak cipta dan kekayaan intelektual yang berlaku. Komponen pihak ketiga, termasuk pustaka open-source, tetap tunduk pada lisensi masing-masing.
                </p>
              </div>
            </div>

            {/* Section 3: Tujuan dan Ruang Lingkup Penggunaan */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Tujuan dan Ruang Lingkup Penggunaan
                  </h3>
                  <p className="text-xs text-slate-500">Pemanfaatan Ekosistem Aplikasi Berkelanjutan</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>
                  Platform ini dikembangkan untuk mendukung pemanfaatan teknologi informasi dalam pengelolaan administrasi, pencatatan, dokumentasi, pelaporan, dan penyampaian informasi kelembagaan.
                </p>
                <p>Penerapannya dapat disesuaikan dengan kebutuhan masing-masing platform, termasuk:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 flex flex-col gap-2">
                    <Building2 size={22} className="text-sky-600" />
                    <h4 className="font-bold text-slate-800 text-sm">a. Aplikasi Menara Masjid</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mendukung digitalisasi administrasi dan pengelolaan kegiatan masjid serta Unit Pengumpul Zakat (UPZ) Masjid.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col gap-2">
                    <School size={22} className="text-emerald-600" />
                    <h4 className="font-bold text-slate-800 text-sm">b. Aplikasi UPZ Desa</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mendukung administrasi, pencatatan, pelaporan, dan penyediaan informasi kelembagaan UPZ di tingkat desa.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col gap-2">
                    <GraduationCap size={22} className="text-indigo-600" />
                    <h4 className="font-bold text-slate-800 text-sm">c. Aplikasi UPZ Sekolah</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mendukung digitalisasi administrasi dan pengelolaan kegiatan UPZ di lingkungan pendidikan.
                    </p>
                  </div>
                </div>

                <p>
                  Ketiga platform tersebut merupakan bagian dari kesinambungan inovasi digital melalui pendekatan replikasi, adaptasi, dan penyempurnaan teknologi sesuai kebutuhan masing-masing lembaga.
                </p>
                <p className="font-medium text-slate-700">
                  Setiap lembaga pengguna bertanggung jawab memastikan bahwa pemanfaatan aplikasi sesuai dengan kewenangan, kebijakan internal, dan ketentuan yang berlaku.
                </p>
              </div>
            </div>

            {/* Section 4: Ketentuan Penggunaan */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Ketentuan Penggunaan
                  </h3>
                  <p className="text-xs text-slate-500">Kewajiban & Larangan Pengguna</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p className="font-semibold text-slate-800">
                  Pengguna wajib menggunakan platform secara bertanggung jawab dan tidak diperkenankan untuk:
                </p>
                <div className="space-y-2">
                  {[
                    'Menggandakan, menjual, mendistribusikan, atau mengomersialkan komponen aplikasi yang dilindungi tanpa izin atau dasar lisensi yang sah.',
                    'Menghapus atau mengubah atribusi pencipta, pemberitahuan hak cipta, maupun informasi lisensi tanpa kewenangan.',
                    'Menggunakan aplikasi untuk penipuan, akses tanpa izin, manipulasi data, atau tindakan yang melanggar hukum.',
                    'Melakukan modifikasi, rekayasa balik, atau pembuatan karya turunan yang melanggar hak pemilik maupun ketentuan lisensi.',
                    'Menggunakan data yang diperoleh melalui platform untuk tujuan yang tidak sah atau di luar kewenangan.',
                  ].map((larangan, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-rose-900 text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✕</span>
                      <span>{larangan}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Penggunaan, modifikasi, pengembangan turunan, dan distribusi lebih lanjut harus mengikuti izin pemegang hak dan ketentuan lisensi yang berlaku.
                </p>
              </div>
            </div>

            {/* Section 5: Data, Privasi, dan Keamanan Informasi */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Data, Privasi, dan Keamanan Informasi
                  </h3>
                  <p className="text-xs text-slate-500">Standar Pengamanan & Tanggung Jawab Data</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>
                  Data yang dimasukkan ke dalam platform, termasuk data kelembagaan, transaksi, laporan, dan data pribadi, harus dikelola sesuai ketentuan perlindungan data serta peraturan perundang-undangan yang berlaku.
                </p>
                <p className="font-semibold text-slate-800">
                  Pengelola platform dan lembaga pengguna bertanggung jawab sesuai peran dan kewenangannya untuk:
                </p>
                <div className="space-y-2">
                  {[
                    'Menjaga kerahasiaan dan keamanan informasi.',
                    'Memastikan penggunaan data memiliki dasar yang sah.',
                    'Membatasi akses berdasarkan kebutuhan dan kewenangan pengguna.',
                    'Menjaga keakuratan pencatatan serta pelaporan.',
                    'Mencegah akses, pengungkapan, atau pemanfaatan data tanpa izin.',
                  ].map((tanggung, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Lock size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
                      <span>{tanggung}</span>
                    </div>
                  ))}
                </div>
                <p className="font-medium text-slate-700 pt-1">
                  Pengguna wajib menjaga kerahasiaan akun dan kredensial akses. Informasi pribadi maupun data transaksi tidak boleh disebarluaskan tanpa dasar yang sah.
                </p>
              </div>
            </div>

            {/* Section 6: Pengembangan, Pembaruan, dan Kolaborasi */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  6
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Pengembangan, Pembaruan, dan Kolaborasi
                  </h3>
                  <p className="text-xs text-slate-500">Evolusi Arsitektur Sistem & Kontribusi</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>
                  Platform dapat mengalami pembaruan, redesign, reborn, penambahan fitur, perubahan teknologi, dan penyesuaian sistem sesuai kebutuhan operasional.
                </p>
                <p>
                  Pengembangan tersebut dapat melibatkan founder, mahasiswa, pengembang, kontributor, maupun mitra lainnya. Setiap kontribusi perlu diakui secara proporsional, sedangkan kepemilikan atas hasil pengembangan mengikuti perjanjian, kontribusi masing-masing pihak, dan ketentuan hukum yang berlaku.
                </p>
                <p className="p-3.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-100 text-xs sm:text-sm">
                  Penggunaan kembali kode sumber, desain, modul, atau komponen aplikasi pada platform lain tidak secara otomatis memberikan hak untuk menyalin atau mendistribusikan seluruh komponen tersebut tanpa izin atau dasar lisensi yang sesuai.
                </p>
              </div>
            </div>

            {/* Section 7: Batasan Tanggung Jawab */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  7
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Batasan Tanggung Jawab
                  </h3>
                  <p className="text-xs text-slate-500">Kapasitas Platform sebagai Sarana Pendukung</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>
                  Platform disediakan sebagai sarana pendukung digitalisasi kelembagaan. Upaya dilakukan untuk menjaga keandalan, keamanan, dan ketersediaan sistem, tetapi gangguan teknis, kesalahan perangkat lunak, atau kendala layanan tetap mungkin terjadi.
                </p>
                <p>
                  Pengelola platform tidak serta-merta menggantikan kewenangan lembaga dalam melakukan verifikasi, pengesahan transaksi, validasi laporan, maupun pengambilan keputusan operasional.
                </p>
                <p>
                  Setiap lembaga pengguna tetap bertanggung jawab atas kebenaran data yang dimasukkan, validitas transaksi, pengesahan laporan, dan kepatuhan terhadap prosedur kelembagaan serta ketentuan yang berlaku.
                </p>
                <p className="text-xs text-slate-500 italic">
                  Ketentuan ini tidak menghapus tanggung jawab yang tidak dapat dikesampingkan berdasarkan hukum.
                </p>
              </div>
            </div>

            {/* Section 8: Lisensi dan Komponen Pihak Ketiga */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  8
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Lisensi dan Komponen Pihak Ketiga
                  </h3>
                  <p className="text-xs text-slate-500">Pustaka Open-Source & Hak Pihak Ketiga</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>
                  Sebagian komponen platform dapat menggunakan perangkat lunak, pustaka, layanan, atau sumber daya pihak ketiga. Penggunaannya tunduk pada ketentuan lisensi dan persyaratan layanan masing-masing penyedia.
                </p>
                <p>
                  Tidak ada bagian dalam halaman ini yang dimaksudkan untuk mengalihkan hak milik pihak ketiga kepada founder, pengembang, atau pengguna platform.
                </p>
                <p>
                  Permohonan penggunaan ulang, integrasi, modifikasi, maupun distribusi komponen tertentu dapat diajukan kepada pihak yang berwenang sesuai kepemilikan dan lisensinya.
                </p>
              </div>
            </div>

            {/* Section 9: Perubahan Ketentuan */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  9
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Perubahan Ketentuan
                  </h3>
                  <p className="text-xs text-slate-500">Klausul Pembaruan Regulasi</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p>
                  Ketentuan hak cipta dan penggunaan ini dapat diperbarui apabila terdapat perubahan teknologi, kebijakan pengembangan, kebutuhan kelembagaan, atau peraturan perundang-undangan.
                </p>
                <p>
                  Versi terbaru akan dipublikasikan melalui halaman ini. Apabila terdapat perjanjian khusus yang sah antara pihak terkait, ketentuan dalam perjanjian tersebut berlaku sesuai ruang lingkupnya.
                </p>
              </div>
            </div>

            {/* Section 10: Kontak dan Permohonan Izin */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
              <div className="flex items-start gap-3.5 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  10
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Kontak dan Permohonan Izin
                  </h3>
                  <p className="text-xs text-slate-500">Kanal Resmi Komunikasi & Kemitraan</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2 sm:pl-11">
                <p className="font-semibold text-slate-800">
                  Untuk keperluan berikut:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                  <li>Permohonan izin penggunaan atau pengembangan lebih lanjut.</li>
                  <li>Kerja sama teknologi dan integrasi sistem.</li>
                  <li>Pelaporan dugaan pelanggaran hak cipta.</li>
                  <li>Pertanyaan mengenai atribusi dan lisensi.</li>
                  <li>Permintaan informasi terkait pengembangan aplikasi.</li>
                </ul>
                <p className="pt-2">
                  Silakan menghubungi pengelola resmi melalui kanal kontak yang tersedia pada website atau aplikasi terkait.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors"
              >
                <ArrowLeft size={16} />
                Kembali ke Beranda
              </Link>
              <div className="text-xs text-slate-400">
                Dokumen Regulasi & Hak Cipta UPZ Sekolah BAZNAS RI
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky on scroll */}
          <aside className="w-full lg:w-[360px] lg:sticky lg:top-24 flex flex-col gap-6 flex-shrink-0 self-start">
            {/* Attribution Team Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                  Informasi Pengembangan
                </span>
                <h3 className="text-base font-bold text-slate-800">Founder & Tim Reborn</h3>
              </div>

              <div className="space-y-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Founder & Inisiator</span>
                  <p className="font-bold text-slate-800 text-sm">M. Romadhona Kusuma, A.Md.Kom., S.Kom., M.Kom.</p>
                  <p className="text-slate-500">Dosen STI Universitas Darunnajah & Amil BAZNAS RI</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tim Reborn & Penyempurnaan</span>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">• Akbar Pangestu <span className="text-slate-500 font-normal">(Mahasiswa STI)</span></p>
                    <p className="font-semibold text-slate-800">• Ari Fujiono <span className="text-slate-500 font-normal">(Mahasiswa STI)</span></p>
                  </div>
                  <p className="text-slate-400 text-[11px] pt-1">Universitas Darunnajah</p>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1 text-slate-700">
                  <span className="text-[10px] font-bold text-sky-700 uppercase">Ekosistem Platform</span>
                  <p className="font-semibold text-sky-950 text-xs">
                    Menara Masjid • UPZ Desa • UPZ Sekolah
                  </p>
                </div>
              </div>
            </div>

            {/* Related Legal Documents */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Dokumen Hukum Terkait</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pelajari kebijakan privasi dan pernyataan disclaimer kami.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <Link
                  to="/kebijakan-privasi"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 transition-colors group"
                >
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                    Kebijakan Privasi
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-sky-600" />
                </Link>

                <Link
                  to="/disclaimer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 transition-colors group"
                >
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                    Disclaimer Aplikasi
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-sky-600" />
                </Link>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Permohonan Izin & Kemitraan</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Untuk perizinan hak cipta, kerja sama teknologi, dan integrasi sistem kelembagaan.
                </p>
              </div>

              <Link
                to="/kontak"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs text-center transition-colors"
              >
                Kirim Permohonan
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
