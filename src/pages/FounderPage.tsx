import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Building2,
  Sparkles,
  ChevronRight,
  Quote,
  ArrowRight,
  Code2,
  Heart,
  Layers,
  CheckCircle2,
  Landmark,
  School,
  BookOpen,
} from 'lucide-react';

const karierList = [
  {
    title: 'IT BAZNAS Republik Indonesia',
    desc: 'Amil BAZNAS RI sejak tahun 2017, aktif dalam pengembangan solusi digital transformasi tata kelola lembaga dan layanan zakat.',
    icon: Building2,
    badge: '2017 - Sekarang',
    highlight: true,
  },
  {
    title: 'Founder Aplikasi Menara Masjid & Ekosistem UPZ',
    desc: 'Penggagas, arsitek sistem, dan inisiator digitalisasi tata kelola masjid dan replikasi platform ke UPZ Desa & UPZ Sekolah.',
    icon: Sparkles,
    badge: 'Inisiator',
    highlight: true,
  },
  {
    title: 'Dosen Sistem & Teknologi Informasi',
    desc: 'Universitas Darunnajah, mendidik generasi talenta teknologi masa depan dan menggerakkan kolaborasi riset aplikatif.',
    icon: GraduationCap,
    badge: 'Akademisi',
    highlight: false,
  },
  {
    title: 'Pengurus Dewan Masjid Indonesia (DMI) Kota Bekasi',
    desc: 'Bidang Pengembangan Sarana, aktif mengabdi dan memperkuat sarana digitalisasi kelembagaan.',
    icon: Layers,
    badge: 'Pengurus DMI',
    highlight: false,
  },
  {
    title: 'Pegiat Filantropi Islam & Kemasjidan',
    desc: 'Pelopor inovasi digital untuk memperluas kemaslahatan sosial, transparansi, dan akuntabilitas dana umat.',
    icon: Heart,
    badge: 'Aktivis Sosial',
    highlight: false,
  },
];

const keahlianList = [
  'Transformasi digital dan pengembangan aplikasi.',
  'Digitalisasi tata kelola zakat, infak, dan sedekah.',
  'Sistem informasi dan layanan digital kelembagaan.',
  'Replikasi dan adaptasi platform teknologi untuk pemberdayaan masyarakat.',
  'Kolaborasi akademik dan pengembangan inovasi berbasis teknologi.',
];

const pendidikanList = [
  {
    jenjang: 'S-3',
    jurusan: 'Informatika',
    status: 'Sedang ditempuh / Kandidat Doktor',
    active: true,
  },
  {
    jenjang: 'S-2',
    jurusan: 'Ilmu Komputer',
    status: 'Magister Komputer (M.Kom.)',
    active: false,
  },
  {
    jenjang: 'S-1',
    jurusan: 'Sistem Informasi',
    status: 'Sarjana Komputer (S.Kom.)',
    active: false,
  },
  {
    jenjang: 'D-3',
    jurusan: 'Manajemen Informatika',
    status: 'Ahli Madya Komputer (A.Md.Kom.)',
    active: false,
  },
];

const inisiatifDigital = [
  {
    num: '01',
    name: 'Menara Masjid',
    tagline: 'Inisiatif Awal & Fondasi',
    desc: 'Digitalisasi administrasi, pencatatan keuangan, dan pelaporan akuntabel pengelolaan ZIS di lingkungan masjid dan UPZ Masjid se-Indonesia.',
    icon: Landmark,
    highlightBadge: 'Inisiatif Perintis',
  },
  {
    num: '02',
    name: 'UPZ Desa',
    tagline: 'Adaptasi Tingkat Desa',
    desc: 'Inovasi yang mengadaptasi pendekatan digitalisasi untuk membantu UPZ di tingkat desa mengelola administrasi, pencatatan, pelaporan, dan informasi kelembagaan secara lebih terstruktur.',
    icon: Building2,
    highlightBadge: 'Kolaborasi Kampus',
  },
  {
    num: '03',
    name: 'UPZ Sekolah',
    tagline: 'Ekosistem Pendidikan',
    desc: 'Adaptasi dan replikasi fondasi teknologi ke lingkungan pendidikan sekolah dasar, menengah, dan kejuruan guna memperluas literasi filantropi Islam sejak dini.',
    icon: School,
    highlightBadge: 'Replikasi Pendidikan',
  },
];

export default function FounderPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-12 bg-gradient-to-b from-sky-50/70 via-[#F8FAFC] to-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-sky-600 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-800 font-medium">Founder</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs sm:text-sm font-semibold border border-sky-200">
                <Sparkles size={16} className="text-sky-600" />
                <span>BIODATA FOUNDER &amp; INOVATOR</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                M. Romadhona <span className="text-sky-600">Kusuma</span>
              </h1>

              <p className="text-sm sm:text-base font-semibold text-sky-700">
                A.Md.Kom., S.Kom., M.Kom.
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Praktisi teknologi informasi, akademisi, dan pegiat filantropi Islam yang berfokus pada pengembangan inovasi digital untuk mendukung tata kelola zakat, infak, dan sedekah (ZIS) di Indonesia. Dengan pengalaman di bidang TI sejak 2017, beliau berupaya menjadikan teknologi sebagai sarana memperluas manfaat sosial, transparansi, dan akuntabilitas dana umat.
              </p>

              {/* Quote Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
                <Quote size={28} className="text-sky-600/20 absolute top-3 right-3" />
                <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed mb-2 font-medium">
                  &ldquo;Sebaik-baiknya manusia adalah yang paling bermanfaat untuk orang lain.&rdquo;
                </p>
                <span className="text-xs text-slate-500 font-semibold block">
                  — HR. Ahmad, Ath-Thabrani (Prinsip Hidup Founder)
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Logo Design By &copy; Romadhona
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
                  Amil BAZNAS RI sejak 2017
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
                  Dosen STI Univ. Darunnajah
                </span>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white mb-5 backdrop-blur-sm">
                  <GraduationCap size={32} />
                </div>

                <span className="text-xs uppercase tracking-wider text-sky-200 font-bold block mb-1">
                  Profil Singkat Inovator
                </span>
                <h3 className="text-xl font-bold mb-2">Muhammad Romadhona Kusuma</h3>
                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed mb-6">
                  Praktisi TI, pendidik, dan pegiat kemasjidan yang merintis ekosistem digitalisasi masjid dan UPZ modern berbasis web serta keterbukaan tata kelola keuangan ZIS.
                </p>

                <div className="space-y-3 border-t border-white/20 pt-4 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sky-200">Mulai Pengabdian IT</span>
                    <span className="font-semibold text-white">Sejak Tahun 2017</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sky-200">Afiliasi Lembaga</span>
                    <span className="font-semibold text-white">BAZNAS RI &amp; Univ. Darunnajah</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sky-200">Organisasi</span>
                    <span className="font-semibold text-white">DMI Kota Bekasi (Bid. Sarana)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sky-200">Desain Logo</span>
                    <span className="font-semibold text-white">&copy; Romadhona</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* NARASI BIOGRAFI & REKAM JEJAK */}
      {/* ========================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Profil &amp; Dedikasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Perjalanan Inovasi Filantropi Digital
              </h2>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              <strong className="text-slate-900">Muhammad Romadhona Kusuma</strong> adalah praktisi teknologi informasi, akademisi, dan pegiat filantropi Islam yang berfokus pada pengembangan inovasi digital untuk mendukung tata kelola zakat, infak, dan sedekah (ZIS) di Indonesia. Dengan pengalaman di bidang teknologi informasi dan pengelolaan layanan digital sejak 2017, ia berupaya menjadikan teknologi sebagai sarana untuk memperluas manfaat sosial, meningkatkan transparansi, dan memperkuat akuntabilitas pengelolaan dana umat.
            </p>

            <p>
              Dalam kiprahnya di <strong className="text-slate-900">Badan Amil Zakat Nasional (BAZNAS) Republik Indonesia</strong>, Romadhona terlibat dalam pengembangan solusi digital yang mendukung transformasi tata kelola lembaga dan layanan zakat. Berangkat dari pengalaman tersebut, ia menginisiasi <strong className="text-sky-700 font-semibold">Aplikasi Menara Masjid</strong>, platform digital yang mendukung digitalisasi administrasi dan pelaporan pengelolaan ZIS di lingkungan masjid dan UPZ Masjid.
            </p>

            <p>
              Pengalaman pengembangan Menara Masjid kemudian menjadi inspirasi bagi lahirnya <strong className="text-sky-700 font-semibold">Aplikasi UPZ Desa</strong>, sebuah inovasi yang mengadaptasi pendekatan digitalisasi untuk membantu UPZ di tingkat desa mengelola administrasi, pencatatan, pelaporan, dan informasi kelembagaan secara lebih terstruktur. Selanjutnya, fondasi dan pendekatan teknologi dari kedua platform tersebut direplikasi dan disesuaikan untuk pengembangan <strong className="text-sky-700 font-semibold">Aplikasi UPZ Sekolah</strong>, sebagai upaya memperluas jangkauan digitalisasi pengelolaan zakat ke lingkungan pendidikan.
            </p>

            {/* Sinergi & Pembelajaran Praktis Mahasiswa */}
            <div className="my-6 p-5 sm:p-6 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <Code2 size={20} />
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  Kolaborasi Pengembangan dengan Generasi Muda
                </h4>
                <p>
                  Dalam pengembangan UPZ Desa, ia turut mendorong kolaborasi dengan generasi muda, termasuk <strong className="text-slate-900 font-semibold">Akbar Pangestu</strong>, mahasiswa Program Studi Sistem dan Teknologi Informasi Universitas Darunnajah, dalam proses pengembangan ulang dan penyempurnaan aplikasi. Kolaborasi ini mencerminkan komitmennya terhadap pengembangan teknologi sekaligus pembelajaran praktis bagi mahasiswa.
                </p>
              </div>
            </div>

            <p>
              Selain berkiprah sebagai praktisi teknologi, Romadhona merupakan dosen Program Studi Sistem dan Teknologi Informasi di <strong className="text-slate-900">Universitas Darunnajah</strong> serta pengurus <strong className="text-slate-900">Dewan Masjid Indonesia (DMI) Kota Bekasi</strong> pada Bidang Pengembangan Sarana. Ia juga sedang menempuh pendidikan doktoral (S-3) Informatika, setelah menyelesaikan pendidikan Magister Ilmu Komputer (S-2), Sarjana Sistem Informasi (S-1), dan Diploma Manajemen Informatika (D-3).
            </p>

            <p>
              Berlandaskan prinsip <em>“sebaik-baiknya manusia adalah yang paling bermanfaat untuk orang lain”</em>, Romadhona membawa visi untuk membangun ekosistem digital filantropi Islam yang inklusif, mudah direplikasi, dan berkelanjutan. Baginya, inovasi bukan sekadar menciptakan aplikasi, melainkan menghadirkan teknologi yang dapat dimanfaatkan oleh masjid, desa, sekolah, dan berbagai lembaga sosial untuk memperkuat pelayanan serta kemaslahatan masyarakat.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INISIATIF DIGITAL (MENARA MASJID, UPZ DESA, UPZ SEKOLAH) */}
      {/* ========================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full inline-block mb-3 border border-sky-100">
              Kilas Balik Inovasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Inisiatif Digital
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Ekosistem platform digital terintegrasi untuk memperluas jangkauan transparansi dan tata kelola ZIS di berbagai tingkatan.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {inisiatifDigital.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {item.num}
                      </span>
                      <span className="text-xs font-semibold text-sky-700 bg-sky-100/70 border border-sky-200 px-2.5 py-0.5 rounded-full">
                        {item.highlightBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} className="text-sky-600" />
                      <h3 className="font-bold text-base text-slate-900">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-xs font-semibold text-sky-700 mb-2">
                      {item.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-medium text-sky-600">
                    <CheckCircle2 size={14} className="text-sky-600" />
                    <span>Inisiatif Aktif</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* RIWAYAT KARIER, KEAHLIAN & PENDIDIKAN */}
      {/* ========================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Riwayat Karier & Organisasi */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Pengalaman &amp; Pengabdian
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Riwayat Karier &amp; Organisasi
                  </h2>
                </div>
              </div>

              <div className="space-y-3.5">
                {karierList.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                        item.highlight
                          ? 'bg-sky-50/60 border-sky-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          item.highlight
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            {item.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200/60">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bidang Keahlian dan Fokus Inovasi */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-sky-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Bidang Keahlian dan Fokus Inovasi
                </h3>
              </div>
              <div className="space-y-2.5">
                {keahlianList.map((keahlian, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>{keahlian}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Riwayat Pendidikan */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Latar Belakang Akademis
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Riwayat Pendidikan
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {pendidikanList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.active
                        ? 'bg-sky-50/70 border-sky-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          item.active
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.jenjang}
                      </span>
                      {item.active && (
                        <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200/60">
                          Sedang Ditempuh
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {item.jurusan}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reborn Contributor Box */}
            <div className="mt-6 pt-5 border-t border-slate-100 rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 mb-1.5">
                <Code2 size={16} className="text-sky-600" />
                <span>Tim Reborn &amp; Redesign Aplikasi</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplikasi didesain ulang menggunakan bahasa pemrograman terbaru oleh{' '}
                <strong className="text-slate-900">Akbar Pangestu</strong>, mahasiswa Program Studi Sistem dan Teknologi Informasi Universitas Darunnajah di bawah bimbingan langsung founder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTTOM CTA / NAVIGATION */}
      {/* ========================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 p-6 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Pelajari Lebih Lanjut Tentang Inovasi UPZ Sekolah
            </h3>
            <p className="text-xs sm:text-sm text-sky-100/90 max-w-xl leading-relaxed">
              Ketahui visi, misi, dan landasan hukum perlindungan hak cipta serta ketentuan penggunaan platform digital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/tentang"
              className="text-xs sm:text-sm font-semibold bg-white text-sky-700 px-4 py-2.5 rounded-full hover:bg-sky-50 transition-colors shadow-sm"
            >
              Tentang Kami
            </Link>
            <Link
              to="/syarat-ketentuan"
              className="text-xs sm:text-sm font-semibold bg-white/20 text-white px-4 py-2.5 rounded-full hover:bg-white/30 transition-colors inline-flex items-center gap-1.5"
            >
              Syarat &amp; Ketentuan
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
