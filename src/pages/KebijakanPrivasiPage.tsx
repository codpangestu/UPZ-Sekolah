import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, Scale, AlertCircle, Phone, Mail, ArrowLeft, Printer, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function KebijakanPrivasiPage() {
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
            <span className="text-sky-600 font-medium">Kebijakan Privasi</span>
          </nav>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs sm:text-sm font-semibold border border-sky-100 mb-4">
              <ShieldCheck size={16} className="text-sky-600" />
              <span>Dokumen Resmi Regulasi & Privasi BAZNAS RI</span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Kebijakan <span className="text-sky-600">Privasi</span>
            </h1>

            {/* Description */}
            <p
              className="text-base text-slate-600 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Komitmen kami dalam menjaga keamanan, kerahasiaan, dan kenyamanan seluruh pengguna layanan aplikasi digital <strong>UPZ Sekolah / Menara BAZNAS</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Scale size={14} className="text-sky-600" />
                Badan Amil Zakat Nasional (BAZNAS RI)
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Diperbarui secara berkala sesuai ketentuan hukum yang berlaku</span>
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
              <Lock size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Kerahasiaan Terjaga</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Data terlindungi dan tidak ditampilkan kepada publik tanpa persetujuan tertulis pengguna.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Scale size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Kepatuhan Hukum</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengecualian kerahasiaan hanya berlaku atas perintah pengadilan dan peraturan hukum yang sah.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tanggung Jawab Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengelola bertanggung jawab penuh atas data yang diserahkan langsung oleh pengguna di situs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Pertukaran Mandiri</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pertukaran data mandiri antar pengguna berada di luar kewenangan dan tanggung jawab pengelola.
            </p>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* MAIN CONTENT + SIDEBAR */}
      {/* ============================== */}
      <section className="section-padding pb-20">
        <div className="content-width flex flex-col lg:flex-row items-start gap-8">
          {/* Main Legal Document Body */}
          <div className="w-full lg:flex-1 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            {/* Header Document */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Naskah Ketentuan Kebijakan Privasi</h2>
                  <p className="text-xs text-slate-500">Standar Pengelolaan Informasi Pengguna</p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-500 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                title="Cetak Halaman Kebijakan Privasi"
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>

            {/* Content Article Body */}
            <div className="space-y-6 text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {/* Introduction Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border border-sky-100/70 text-slate-700">
                <p className="mb-3">
                  Terima kasih telah mengakses aplikasi <strong>Menara Masjid / UPZ Sekolah</strong> yaitu website resmi di lingkungan <strong>Badan Amil Zakat Nasional (BAZNAS)</strong> (<a href="https://menara.baznas.go.id" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold hover:underline">www.menara.baznas.go.id</a>). Kami sangat menghormati kenyamanan privasi Anda dan melindungi informasi pribadi Anda sebaik-baiknya.
                </p>
                <p>
                  Ketentuan-ketentuan yang ada dalam halaman ini mengatur hal-hal menyangkut data-data para Pengguna Situs yang diberikan oleh para Pengguna Situs kepada Pengelola Situs dalam rangka pemanfaatan fasilitas, fitur, jasa, dan/atau layanan yang ditawarkan oleh Pengelola Situs melalui Situs <strong>www.menara.baznas.go.id</strong>. Ketentuan-ketentuan menyangkut data mengikat seluruh Pengguna Situs tanpa terkecuali untuk tunduk dan patuh atas ketentuan-ketentuan yang telah ditetapkan Pengelola Situs.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-sky-600" />
                  Ketentuan-ketentuan Menyangkut Data Pengguna:
                </h3>
              </div>

              {/* Point 1 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="space-y-3 flex-1">
                    <p className="font-semibold text-slate-800">
                      Atas data-data yang diberikan oleh para Pengguna Situs kepada Pengelola Situs sebagai pemenuhan syarat atas pemanfaatan fasilitas, fitur, jasa, dan/atau layanan yang ditawarkan oleh Pengelola Situs, maka Pengelola Situs berkewajiban untuk:
                    </p>
                    <div className="pl-2 space-y-2.5">
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-sky-600 text-xs mt-0.5">a.</span>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                          Menjaga kerahasiaan data-data para Pengguna yang tidak dapat ditampilkan dalam Situs dan/atau diberikan kepada pihak-pihak tertentu atas penggunaan jasa atau layanan Situs selama tidak ada perjanjian tertulis terlebih dahulu kepada Pengguna;
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-sky-600 text-xs mt-0.5">b.</span>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                          Kerahasiaan data Pengguna yang wajib dijaga oleh Pengelola Situs menjadi tidak berlaku apabila Pengelola Situs dipaksa oleh ketentuan hukum yang berlaku, perintah pengadilan, dan/atau perintah dari aparat/instansi yang berwenang, untuk membuka data-data milik Pengguna tersebut.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Point 2 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Pengelola Situs hanya bertanggung jawab atas data yang diberikan Pengguna Situs kepada Pengelola Situs sebagaimana yang telah ditentukan pada ketentuan sebelumnya.
                    </p>
                  </div>
                </div>
              </div>

              {/* Point 3 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Pengelola Situs tidak bertanggung jawab atas pemberian atau pertukaran data yang dilakukan sendiri antar Pengguna Situs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Point 4 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Pengelola berhak untuk mengubah ketentuan menyangkut data-data para Pengguna Situs tanpa pemberitahuan terlebih dahulu dengan tanpa mengabaikan hak para Pengguna Situs untuk dijaga kerahasiaan datanya sebagaimana yang telah ditentukan dalam butir.
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
              <div className="text-xs text-slate-400">
                Pusat Bantuan & Layanan Legal BAZNAS RI
              </div>
            </div>
          </div>

          {/* Right Sidebar Info - Sticky on scroll */}
          <aside className="w-full lg:w-[360px] lg:sticky lg:top-24 flex flex-col gap-6 flex-shrink-0 self-start">
            {/* Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Pertanyaan Privasi?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Jika Anda memiliki pertanyaan seputar perlindungan data dan privasi akun Anda, silakan hubungi tim kami.
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

            {/* Security Guarantee Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/20">
              <ShieldCheck size={36} className="mb-3 text-sky-200" />
              <h4 className="text-base font-bold mb-2">Jaminan Keamanan BAZNAS</h4>
              <p className="text-xs text-sky-100 leading-relaxed">
                Seluruh data transaksi donasi, muzakki, dan profil sekolah terenkripsi dan diawasi secara ketat oleh Badan Amil Zakat Nasional Republik Indonesia.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
