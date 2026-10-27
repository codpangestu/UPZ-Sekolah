import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, FileText, Scale, Lock, Phone, Mail, ArrowLeft, Printer, CheckCircle2, ChevronRight, HelpCircle, ExternalLink } from 'lucide-react';

export default function DisclaimerPage() {
  const handlePrint = () => {
    window.print();
  };

  const disclaimerPoints = [
    {
      num: '1',
      title: 'Pengenalan',
      content:
        'Halaman ini memuat disclaimer yang mengatur penggunaan aplikasi berbasis website yang disediakan oleh kami. Dengan mengakses dan menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, dan menyetujui semua ketentuan dalam disclaimer ini. Jika Anda tidak setuju dengan ketentuan ini, diharapkan untuk tidak melanjutkan penggunaan aplikasi ini.',
    },
    {
      num: '2',
      title: 'Tujuan Aplikasi',
      content:
        'Aplikasi ini disediakan untuk memberikan informasi, layanan, atau fungsi khusus kepada pengguna. Meskipun kami berupaya menyajikan informasi yang akurat dan up-to-date, kami tidak memberikan jaminan atas keakuratan, kelengkapan, atau keandalan informasi yang terkandung dalam aplikasi ini. Pengguna bertanggung jawab sepenuhnya atas penggunaan informasi yang ditemukan dalam aplikasi ini.',
    },
    {
      num: '3',
      title: 'Tanggung Jawab Pengguna',
      content:
        'Penggunaan aplikasi ini sepenuhnya menjadi tanggung jawab pengguna. Kami tidak bertanggung jawab atas kerugian, kerusakan, atau tuntutan yang timbul dari penggunaan aplikasi ini, termasuk namun tidak terbatas pada kesalahan, kehilangan data, gangguan, atau kerugian finansial yang mungkin timbul.',
    },
    {
      num: '4',
      title: 'Ketersediaan Aplikasi',
      content:
        'Kami berupaya menjaga ketersediaan aplikasi ini sebaik mungkin. Namun, kami tidak memberikan jaminan bahwa aplikasi ini akan selalu tersedia tanpa gangguan atau kesalahan. Kami berhak untuk melakukan pemeliharaan, perbaikan, atau penghentian sementara atau permanen pada aplikasi ini tanpa pemberitahuan sebelumnya.',
    },
    {
      num: '5',
      title: 'Tautan Eksternal',
      content:
        'Aplikasi ini mungkin menyediakan tautan ke situs web eksternal yang tidak dikendalikan atau dioperasikan oleh kami. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik lainnya yang ada di situs web eksternal tersebut. Penggunaan tautan eksternal dilakukan atas risiko pengguna sendiri.',
    },
    {
      num: '6',
      title: 'Perubahan Ketentuan',
      content:
        'Kami berhak untuk mengubah atau memperbarui ketentuan dalam disclaimer ini tanpa pemberitahuan sebelumnya. Disarankan bagi pengguna untuk secara berkala memeriksa halaman ini guna memahami ketentuan terbaru yang berlaku.',
    },
    {
      num: '7',
      title: 'Hak Kekayaan Intelektual',
      content:
        'Aplikasi ini dilindungi oleh hak kekayaan intelektual, termasuk namun tidak terbatas pada hak cipta, merek dagang, atau paten. Pengguna tidak diizinkan untuk menggunakan, mendistribusikan, atau memodifikasi konten aplikasi ini tanpa izin tertulis dari pemilik hak.',
    },
    {
      num: '8',
      title: 'Hukum yang Berlaku',
      content:
        'Penggunaan aplikasi ini tunduk pada hukum yang berlaku di wilayah yang relevan. Segala sengketa atau perselisihan yang timbul terkait dengan penggunaan aplikasi ini akan diselesaikan secara damai dan bila perlu dapat dirujuk ke yurisdiksi yang berwenang.',
    },
  ];

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
            <span className="text-sky-600 font-medium">Disclaimer</span>
          </nav>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs sm:text-sm font-semibold border border-amber-200/60 mb-4">
              <AlertTriangle size={16} className="text-amber-600" />
              <span>Pernyataan Penyangkalan Resmi & Batasan Tanggung Jawab</span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Disclaimer <span className="text-sky-600">Aplikasi</span>
            </h1>

            {/* Description */}
            <p
              className="text-base text-slate-600 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Syarat dan batasan tanggung jawab hukum dalam penggunaan platform aplikasi digital <strong>UPZ Sekolah / Menara BAZNAS RI</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Scale size={14} className="text-sky-600" />
                Badan Amil Zakat Nasional (BAZNAS RI)
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Berlaku untuk seluruh pengunjung, pengelola sekolah, dan pengguna layanan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* 4 HIGHLIGHT CARDS */}
      {/* ============================== */}
      <section className="section-padding py-8">
        <div className="content-width grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tujuan Informasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Disajikan untuk memfasilitasi transparansi pencatatan ZIS dan edukasi filantropi sekolah.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tanggung Jawab Pengguna</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Penggunaan informasi dan tindakan mandiri menjadi tanggung jawab masing-masing pihak.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Hak Cipta & HKI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seluruh sistem, logo, dan konten dilindungi oleh peraturan perundang-undangan hak cipta.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Yurisdiksi Hukum</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tunduk pada regulasi Republik Indonesia dan musyawarah damai atas setiap perselisihan.
            </p>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* MAIN LEGAL CONTENT + SIDEBAR */}
      {/* ============================== */}
      <section className="section-padding pb-20">
        <div className="content-width flex flex-col lg:flex-row items-start gap-8">
          {/* Main Legal Document Body */}
          <div className="w-full lg:flex-1 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            {/* Header Document */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Naskah Resmi Disclaimer Aplikasi</h2>
                  <p className="text-xs text-slate-500">Ketentuan Penggunaan & Batasan Tanggung Jawab</p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-500 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                title="Cetak Halaman Disclaimer"
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>

            {/* Content Article Body */}
            <div className="space-y-5 text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {disclaimerPoints.map((point) => (
                <div
                  key={point.num}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {point.num}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-slate-800 text-base">
                        {point.num}. {point.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {point.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Informative Closing Note */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-slate-700 mt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p className="font-semibold text-slate-800">
                      Penting untuk Diperhatikan:
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Mohon dicatat bahwa disclaimer ini hanya bersifat informatif dan tidak menggantikan nasihat hukum yang profesional. Jika Anda memiliki pertanyaan atau kekhawatiran terkait penggunaan aplikasi ini, disarankan untuk mengonsultasikan dengan ahli hukum sebelum mengambil tindakan.
                    </p>
                    <p className="font-medium text-slate-700 pt-1">
                      Terima kasih atas pengertian dan kerjasamanya.
                    </p>
                  </div>
                </div>
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
              <Link
                to="/kebijakan-privasi"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                Lihat Kebijakan Privasi
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Sidebar Info - Sticky on scroll */}
          <aside className="w-full lg:w-[360px] lg:sticky lg:top-24 flex flex-col gap-6 flex-shrink-0 self-start">
            {/* Related Policy Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Shield size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Dokumen Hukum Terkait</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pelajari bagaimana sistem kami mengelola dan melindungi data pribadi Anda.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <Link
                  to="/kebijakan-privasi"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-sky-600" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                      Kebijakan Privasi
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-sky-600" />
                </Link>

                <a
                  href="https://menara.baznas.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink size={16} className="text-sky-600" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                      Portal Menara BAZNAS
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-sky-600" />
                </a>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Pertanyaan Regulasi?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Hubungi tim BAZNAS RI jika membutuhkan klarifikasi hukum atau legalitas operasional UPZ.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Phone size={16} className="text-sky-600 flex-shrink-0" />
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-semibold">Call Center</span>
                    <span className="font-semibold text-slate-700">0811 8882 1818</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Mail size={16} className="text-sky-600 flex-shrink-0" />
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-semibold">Email Pengelola</span>
                    <span className="font-semibold text-slate-700">baznas@baznas.go.id</span>
                  </div>
                </div>
              </div>

              <Link
                to="/kontak"
                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs text-center transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
