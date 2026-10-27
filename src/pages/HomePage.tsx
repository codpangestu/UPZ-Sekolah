import { Link } from 'react-router-dom';
import { Building2, Users, ArrowRight, Eye, Heart, Calendar, Clock, MessageCircle, BookOpen, HelpCircle, Share2, GraduationCap, Coins, Award, DownloadCloud, Download } from 'lucide-react';
import MapSection from '../components/home/MapSection';
import bannerHero from '../assets/illustrations/bannerHomepage.jpg';

const infoStats = [
  {
    icon: <GraduationCap size={22} />,
    title: '3,850+',
    subtitle: 'UPZ Sekolah terdaftar',
    bgBlue: true,
  },
  {
    icon: <Award size={22} />,
    title: '18,400+',
    subtitle: 'Siswa penerima manfaat',
    bgBlue: false,
  },
  {
    icon: <Users size={22} />,
    title: '25,000+',
    subtitle: 'Guru & Muzakki terdaftar',
    bgBlue: false,
  },
  {
    icon: <Coins size={22} />,
    title: 'Rp 4.2 M+',
    subtitle: 'Dana ZIS terhimpun',
    bgBlue: false,
  },
];

const publikasiData = [
  { title: 'Penyaluran Beasiswa BAZNAS untuk 120 Siswa Berprestasi', description: 'Program kolaborasi UPZ Sekolah bersama BAZNAS Daerah guna mendukung kelanjutan studi pelajar berprestasi.', category: 'Beasiswa', date: '15 Januari 2026', readTime: '4 menit', views: '1,420', likes: '88', image: '🎓' },
  { title: 'Gerakan Infak Jumat Berkah: Renovasi Fasilitas Belajar', description: 'Pengelolaan dana infak siswa dan guru untuk melengkapi ruang komputer dan perpustakaan sekolah.', category: 'Infak Sekolah', date: '10 Januari 2026', readTime: '5 menit', views: '980', likes: '64', image: '📚' },
  { title: 'Edukasi Literasi ZIS Sejak Dini di Lingkungan Sekolah', description: 'Menanamkan karakter peduli sesama melalui pembelajaran zakat praktis bagi siswa SD, SMP, hingga SMA.', category: 'Artikel', date: '05 Januari 2026', readTime: '3 menit', views: '1,150', likes: '72', image: '📖' },
];

const testimoniData = [
  { comment: 'Aplikasi UPZ Sekolah sangat memudahkan kami dalam pembukuan infak Jumat dan zakat fitrah sekolah. Laporan ke BAZNAS jadi otomatis dan transparan.', author: 'Drs. H. Mulyono (Kepala Sekolah SMAN 1)', rating: 5 },
  { comment: 'Penyaluran beasiswa bagi siswa kurang mampu jadi tepat sasaran berkat pendataan terverifikasi sistem UPZ Sekolah BAZNAS.', author: 'Ustadzah Nurul Hidayah (Ketua UPZ MAN 1)', rating: 5 },
  { comment: 'Orang tua siswa dapat memantau peruntukan dana infak secara terbuka. Sangat menginspirasi dan meningkatkan kepercayaan masyarakat.', author: 'Ahmad Fauzi (Komite Sekolah)', rating: 5 },
];

const quickAccessData = [
  { icon: (<GraduationCap size={24} className="text-sky-600" />), title: 'Direktori UPZ Sekolah', subtitle: 'Cari profil & data sekolah', buttonText: 'Selengkapnya', link: '/masjid' },
  { icon: (<Coins size={24} className="text-sky-600" />), title: 'Buku Kas ZIS', subtitle: 'Transparansi dana sekolah', buttonText: 'Selengkapnya', link: '/login' },
  { icon: (<BookOpen size={24} className="text-sky-600" />), title: 'Publikasi & Kajian', subtitle: 'Kabar kegiatan & materi', buttonText: 'Selengkapnya', link: '/kajian' },
  { icon: (<Building2 size={24} className="text-sky-600" />), title: 'Ajukan UPZ Baru', subtitle: 'Pendaftaran sekolah binaan', buttonText: 'Selengkapnya', link: '/ajukan-masjid' },
];

const filterKategori = ['Semua', 'Beasiswa', 'Zakat Sekolah', 'Infak Jumat', 'Kegiatan', 'Artikel', 'Pengumuman'];

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC]">
      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <section className="section-padding pt-[60px]">
        <div className="content-width flex flex-row justify-center items-start gap-12 max-lg:flex-col max-lg:items-center">
          {/* Hero Text */}
          <div className="flex flex-col justify-center items-start gap-6 lg:w-[640px] max-lg:w-full">
            {/* Badge */}
            <div className="badge-blue">
              <GraduationCap size={15} />
              <span>Platform Digital UPZ Sekolah BAZNAS</span>
            </div>

            {/* Heading */}
            <h1 className="text-display-xl max-md:text-[34px] max-md:leading-[42px] text-slate-800">
              Dari Sekolah,{' '}
              <span className="text-gradient-blue">Tumbuh Kebaikan & Prestasi</span>{' '}
              Generasi Bangsa
            </h1>

            {/* Sub Heading */}
            <p className="text-base leading-6 text-slate-600 max-w-[620px] max-md:text-sm">
              Platform digital terintegrasi untuk pengelolaan Unit Pengumpul Zakat (UPZ) berbasis sekolah
              di seluruh Indonesia bersama BAZNAS RI. Wujudkan tata kelola ZIS DSKL yang transparan,
              profesional, dan berdaya guna bagi pendidikan umat.
            </p>

            {/* Buttons */}
            <div className="flex flex-row items-center gap-4 max-md:flex-col max-md:w-full">
              <Link to="/ajukan-masjid" className="btn-primary-blue gap-2 py-3 px-6 text-sm font-semibold max-md:w-full max-md:justify-center">
                <GraduationCap size={18} />
                Daftar UPZ Sekolah
              </Link>
              <Link to="/masjid" className="btn-outline-blue gap-2 py-3 px-6 text-sm font-semibold max-md:w-full max-md:justify-center">
                Jelajahi Direktori
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="w-[500px] h-[340px] flex-shrink-0 max-lg:w-full max-lg:h-auto max-lg:aspect-[500/340] rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/15 border-2 border-white ring-1 ring-sky-100 relative group">
            <img
              src={bannerHero}
              alt="Ilustrasi UPZ Sekolah BAZNAS"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Ambient decorative subtle gradient & badge overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Info Section - 4 Statistical Cards */}
        <div className="content-width grid grid-cols-2 md:grid-cols-4 gap-4 mt-[60px]">
          {infoStats.map((item, index) => (
            <div
              key={index}
              className={`${item.bgBlue
                ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-600/20'
                : 'bg-white border border-slate-200/80 shadow-sm'
                } rounded-2xl p-5 flex flex-col items-start gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bgBlue ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-600'
                  }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-2xl font-bold ${item.bgBlue ? 'text-white' : 'text-slate-800'
                  }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item.title}
              </span>
              <span
                className={`text-sm ${item.bgBlue ? 'text-sky-100' : 'text-slate-500'
                  }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item.subtitle}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MAP SECTION — Interactive Leaflet Map */}
      <MapSection />

      {/* ============================== */}
      {/* PUBLIKASI SECTION */}
      {/* ============================== */}
      <section className="section-padding py-[60px]">
        <div className="content-width">
          <div className="flex flex-col justify-center items-start gap-5 mb-10">
            <div className="badge-blue">
              <BookOpen size={14} />
              <span>Publikasi & Edukasi</span>
            </div>
            <h2 className="text-display-lg text-slate-800 max-md:text-[30px] max-md:leading-[38px]">
              Cerita & Kabar dari <span className="text-gradient-blue">UPZ Sekolah</span>
            </h2>

            {/* Filter buttons */}
            <div className="flex flex-row items-start gap-2.5 overflow-x-auto w-full pb-1">
              {filterKategori.map((k, i) => (
                <button
                  key={i}
                  className={`text-sm font-medium leading-5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${i === 0 ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' : 'border border-slate-200 text-slate-600 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50'
                    }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Publikasi Cards */}
          <div className="flex flex-row items-stretch gap-6 max-lg:flex-col">
            {publikasiData.map((pub, index) => (
              <div key={index} className="publication-card flex-1 bg-white border border-sky-100/80 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <div className="w-full h-[150px] bg-gradient-to-br from-sky-50 to-sky-100/60 rounded-xl flex items-center justify-center text-5xl">
                  {pub.image}
                </div>
                <div className="flex flex-col items-start gap-1.5 w-full mt-2">
                  <div className="badge-xs">{pub.category}</div>
                  <span className="text-base font-bold leading-snug text-slate-800 line-clamp-2">{pub.title}</span>
                  <span className="text-sm leading-relaxed text-slate-500 line-clamp-2">{pub.description}</span>
                </div>
                <div className="flex flex-row items-start gap-4 w-full mt-2 text-slate-400">
                  <div className="flex items-center gap-1.5 flex-1">
                    <Calendar size={13} />
                    <span className="text-xs leading-[18px]">{pub.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1">
                    <Clock size={13} />
                    <span className="text-xs leading-[18px]">{pub.readTime}</span>
                  </div>
                </div>
                <div className="w-full border-t border-slate-100 my-2" />
                <div className="flex justify-between items-center w-full text-slate-400">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-1.5">
                      <Eye size={15} />
                      <span className="text-xs">{pub.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} className="hover:text-rose-500 cursor-pointer" />
                      <span className="text-xs">{pub.likes}</span>
                    </div>
                  </div>
                  <Share2 size={14} className="hover:text-sky-600 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Link to="/kajian" className="btn-primary-blue gap-2 py-2.5 px-5 text-sm font-semibold">
              Lihat Semua Publikasi
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* DOWNLOAD SECTION */}
      {/* ============================== */}
      <section className="section-padding py-10">
        <div className="content-width flex flex-col justify-center items-center gap-[27px]">
          <div className="flex flex-col justify-center items-center gap-4 w-full">
            <div className="badge-blue">
              <DownloadCloud size={14} />
              <span>Download APK</span>
            </div>
            <h2 className="text-display-lg text-center text-[#303030] max-md:text-[28px] max-md:leading-[36px]">
              Download Aplikasi UPZ Sekolah
            </h2>
            <p className="text-base leading-6 text-center text-[#303030] max-md:text-sm">
              Unduh aplikasi kami dan nikmati kemudahan dalam mengelola UPZ Sekolah.
            </p>

            <div className="flex flex-row justify-center items-center gap-6 max-md:flex-col">
              <a href="#" className="btn-primary-blue gap-2">
                <Download size={18} />
                Download APK
              </a>
              <a href="#" className="btn-outline-blue gap-2">
                <Download size={18} />
                App Store
              </a>
            </div>
          </div>

          <div className="w-[714px] max-w-full rounded-3xl overflow-hidden shadow-sm">
            <img
              src="/images/posterp.webp"
              alt="Poster UPZ Sekolah"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* QUICK ACCESS SECTION */}
      {/* ============================== */}
      <section className="section-padding py-[60px]">
        <div className="content-width">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Akses Cepat</span>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">Layanan Utama UPZ Sekolah</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickAccessData.map((item, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between items-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  {item.icon}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base font-bold text-slate-800">{item.title}</span>
                  <span className="text-xs text-slate-500">{item.subtitle}</span>
                </div>
                <Link to={item.link} className="w-full py-2 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-xl text-xs font-semibold transition-colors">
                  {item.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* TESTIMONI SECTION */}
      {/* ============================== */}
      <section className="section-padding py-[60px] bg-slate-50">
        <div className="content-width">
          <div className="flex flex-col items-start gap-3 mb-8">
            <div className="badge-blue">
              <MessageCircle size={14} />
              <span>Testimoni</span>
            </div>
            <h2 className="text-display-lg text-slate-800 max-md:text-[28px] max-md:leading-[36px]">
              Apa Kata Pengelola UPZ Sekolah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimoniData.map((item, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600 italic">"{item.comment}"</p>
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800">{item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* CTA SECTION */}
      {/* ============================== */}
      <section className="flex flex-col justify-center items-center py-14 px-5 gap-5 bg-gradient-to-br from-sky-50 via-sky-100/40 to-sky-50 border-t border-sky-100 text-center">
        <h2 className="text-display-md text-slate-800 max-md:text-[26px] max-md:leading-[34px]">
          Ingin Membentuk UPZ di Sekolah Anda?
        </h2>
        <p className="text-base leading-6 text-slate-600 max-w-xl max-md:text-sm">
          Daftarkan sekolah Anda sekarang untuk memperoleh SK resmi dari BAZNAS dan kelola ZIS sekolah dengan sistem digital terpercaya.
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center mt-2">
          <Link to="/ajukan-masjid" className="btn-primary-blue gap-2 py-3 px-6 text-sm font-semibold">
            <GraduationCap size={18} />
            Ajukan UPZ Sekolah Baru
          </Link>
          <Link to="/kontak" className="btn-outline-blue gap-2 py-3 px-6 text-sm font-semibold">
            <HelpCircle size={18} />
            Pusat Konsultasi
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
