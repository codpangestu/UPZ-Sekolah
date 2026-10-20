import { Link } from 'react-router-dom';
import { MapPin, Building2, Users, Download, ArrowRight, Eye, Heart, Calendar, Clock, MessageCircle, BookOpen, DownloadCloud, HelpCircle, Share2 } from 'lucide-react';
import MapSection from '../components/home/MapSection';

const infoStats = [
  {
    icon: <Building2 size={22} />,
    title: '9,588',
    subtitle: 'Masjid terdaftar',
    bgGreen: true,
  },
  {
    icon: <MapPin size={22} />,
    title: '1,657',
    subtitle: 'Musholla terdaftar',
    bgGreen: false,
  },
  {
    icon: <Users size={22} />,
    title: '15,000++',
    subtitle: 'Pengguna terdaftar',
    bgGreen: false,
  },
  {
    icon: <Users size={22} />,
    title: '10,000+',
    subtitle: 'Pengurus masjid',
    bgGreen: false,
  },
];

// masjid data moved to MapSection component

const publikasiData = [
  { title: 'Donasi Buku untuk Anak-Anak Penyintas Tsunami', description: 'Mari ikut serta menyebarkan ilmu dengan mendukung program wakaf buku.', category: 'Artikel', date: '15 Januari 2025', readTime: '5 menit', views: '1,234', likes: '50', image: '📚' },
  { title: 'Donasi Buku untuk Anak-Anak Penyintas Tsunami', description: 'Mari ikut serta menyebarkan ilmu dengan mendukung program wakaf buku.', category: 'Zakat', date: '15 Januari 2025', readTime: '5 menit', views: '1,234', likes: '50', image: '📖' },
  { title: 'Donasi Buku untuk Anak-Anak Penyintas Tsunami', description: 'Mari ikut serta menyebarkan ilmu dengan mendukung program wakaf buku.', category: 'Infak', date: '15 Januari 2025', readTime: '5 menit', views: '1,234', likes: '50', image: '📋' },
];

const testimoniData = [
  { comment: 'Aplikasi ini sangat membantu kami dalam mengelola dana masjid. Sekarang laporan keuangan lebih rapi dan transparan.', author: 'H. Ahmad Syarif', rating: 5 },
  { comment: 'Dengan MENARA, pencatatan zakat jadi lebih mudah. Warga juga bisa melihat laporan secara real-time.', author: 'Ustadz Faisal Rahman', rating: 5 },
  { comment: 'Fitur pencarian masjid sangat membantu. Saya jadi mudah menemukan masjid terdekat saat bepergian.', author: 'Aisyah Putri', rating: 5 },
];

const quickAccessData = [
  { icon: (<svg width="24" height="20" viewBox="0 0 24 20" fill="none"><path d="M0 0V20H24V0H0ZM22 2V4H2V2H22ZM2 18V6H22V18H2Z" fill="#28A71A"/><path d="M5 8H9V12H5V8ZM11 8H15V12H11V8ZM17 8H19V12H17V8ZM5 13H9V17H5V13ZM11 13H15V17H11V13ZM17 13H19V17H17V13Z" fill="#28A71A"/></svg>), title: 'Data Masjid', subtitle: 'Lihat data masjid', buttonText: 'Selengkapnya' },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#28A71A" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/></svg>), title: 'History Transaksi', subtitle: 'Lihat riwayat transaksi', buttonText: 'Selengkapnya' },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M4 12H20M4 18H12" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/></svg>), title: 'Publikasi', subtitle: 'Baca artikel terbaru', buttonText: 'Selengkapnya' },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#28A71A" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/></svg>), title: 'Doa & Amalan', subtitle: 'Kumpulan doa harian', buttonText: 'Selengkapnya' },
];

const filterKategori = ['Semua', 'Zakat', 'Infak', 'Sedekah', 'Kajian', 'Berita', 'Artikel', 'Pengumuman', 'Lainnya'];

export default function HomePage() {
  return (
    <div className="bg-[#FAFAFA]">
      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <section className="section-padding pt-[60px]">
        <div className="content-width flex flex-row justify-center items-start gap-10 max-lg:flex-col max-lg:items-center">
          {/* Hero Text */}
          <div className="flex flex-col justify-center items-start gap-6 lg:w-[640px] max-lg:w-full">
            {/* Badge */}
            <div className="badge-green">
              <Building2 size={14} />
              <span>Platform Digital Masjid Indonesia</span>
            </div>

            {/* Heading */}
            <h1 className="text-display-xl max-md:text-[36px] max-md:leading-[44px]">
              Dari Masjid,{' '}
              <span className="text-gradient-green">Tumbuh Kebaikan</span>{' '}
              Tanpa Batas
            </h1>

            {/* Sub Heading */}
            <p className="text-base leading-6 text-[#303030] max-w-[640px] max-md:text-sm">
              Platform digital untuk menghubungkan seluruh masjid dan musholla 
              di Indonesia melalui teknologi modern. Kelola, pantau, dan 
              kembangkan masjid Anda bersama MENARA.
            </p>

            {/* Buttons */}
            <div className="flex flex-row items-center gap-6 max-md:flex-col max-md:w-full">
              <Link to="#" className="btn-primary-green gap-2 max-md:w-full max-md:justify-center">
                <Download size={18} />
                Download Aplikasi
              </Link>
              <Link to="/masjid" className="btn-outline-green gap-2 max-md:w-full max-md:justify-center">
                Jelajahi Masjid
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-[520px] h-[332px] flex-shrink-0 max-lg:w-full max-lg:h-auto max-lg:aspect-[520/332] overflow-hidden">
            <img
              src="/images/banner-hero.svg"
              alt="Platform Digital Masjid Indonesia"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Section - 4 Statistical Cards */}
        <div className="content-width grid grid-cols-2 md:grid-cols-4 gap-4 mt-[60px]">
          {infoStats.map((item, index) => (
            <div
              key={index}
              className={`${
                item.bgGreen
                  ? 'bg-gradient-to-br from-[#28A71A] to-[#1f8a13] text-white'
                  : 'bg-white border border-[rgba(0,0,0,0.06)]'
              } rounded-2xl p-5 flex flex-col items-start gap-2 transition-all hover:shadow-md`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.bgGreen ? 'bg-white/20 text-white' : 'bg-[#E6F9F0] text-[#28A71A]'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-2xl font-bold ${
                  item.bgGreen ? 'text-white' : 'text-[#303030]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item.title}
              </span>
              <span
                className={`text-sm ${
                  item.bgGreen ? 'text-white/80' : 'text-[#666]'
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
          <div className="flex flex-col justify-center items-start gap-6 mb-10">
            <div className="badge-green">
              <BookOpen size={14} />
              <span>Publikasi</span>
            </div>
            <h2 className="text-display-lg text-gradient-green max-md:text-[32px] max-md:leading-[40px]">
              Cerita & Kabar dari Masjid
            </h2>

            {/* Filter buttons */}
            <div className="flex flex-row items-start gap-4 overflow-x-auto w-full pb-1">
              {filterKategori.map((k, i) => (
                <button
                  key={i}
                  className={`text-sm font-medium leading-5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    i === 0 ? 'bg-[#28A71A] text-white' : 'border border-[#28A71A] text-[#28A71A] hover:bg-[#EAF6E8]'
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
              <div key={index} className="publication-card flex-1">
                <div className="w-full h-[160px] bg-gradient-to-br from-[#E6F9F0] to-[#EAF6E8] rounded-lg flex items-center justify-center text-5xl">
                  {pub.image}
                </div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                  <div className="badge-xs">{pub.category}</div>
                  <span className="text-base font-medium leading-6 text-[#303030]">{pub.title}</span>
                  <span className="text-sm leading-5 text-[#888]">{pub.description}</span>
                </div>
                <div className="flex flex-row items-start gap-4 w-full">
                  <div className="flex items-center gap-2 flex-1">
                    <Calendar size={14} className="text-[#888]" />
                    <span className="text-xs leading-[18px] text-[#888]">{pub.date}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Clock size={14} className="text-[#888]" />
                    <span className="text-xs leading-[18px] text-[#888]">{pub.readTime}</span>
                  </div>
                </div>
                <div className="w-full border-t border-[rgba(0,0,0,0.1)]" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-start gap-6">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-[#888]" />
                      <span className="text-sm leading-5 text-[#888]">{pub.views}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={14} className="text-[#888]" />
                      <span className="text-sm leading-5 text-[#888]">{pub.likes}</span>
                    </div>
                  </div>
                  <Share2 size={14} className="text-[#888]" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Link to="/kajian" className="btn-primary-green gap-2">
              Lihat Semua Publikasi
              <ArrowRight size={18} />
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
            <div className="badge-green">
              <DownloadCloud size={14} />
              <span>Download APK</span>
            </div>
            <h2 className="text-display-lg text-center text-[#303030] max-md:text-[28px] max-md:leading-[36px]">
              Download Aplikasi Menara Masjid
            </h2>
            <p className="text-base leading-6 text-center text-[#303030] max-md:text-sm">
              Unduh aplikasi kami dan nikmati kemudahan dalam mengelola masjid.
            </p>

            <div className="flex flex-row justify-center items-center gap-6 max-md:flex-col">
              <a href="#" className="btn-primary-green gap-2">
                <Download size={18} />
                Download APK
              </a>
              <a href="#" className="btn-outline-green gap-2">
                <Download size={18} />
                App Store
              </a>
            </div>
          </div>

          <div className="w-[714px] max-w-full rounded-3xl">
            <img
              src="/images/poster.svg"
              alt="Poster MENARA Masjid"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* TESTIMONI SECTION */}
      {/* ============================== */}
      <section className="section-padding py-[60px]">
        <div className="content-width">
          <div className="flex flex-col items-start gap-6 mb-6">
            <div className="badge-green">
              <MessageCircle size={14} />
              <span>Testimoni</span>
            </div>
            <h2 className="text-display-lg text-[#303030] max-md:text-[32px] max-md:leading-[40px]">Apa Kata Mereka</h2>
          </div>

          <div className="flex flex-row items-stretch gap-6 max-lg:flex-col">
            {testimoniData.map((item, index) => (
              <div key={index} className="testimoni-card flex-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#EFB100">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-base leading-6 text-[#666] max-md:text-sm">"{item.comment}"</p>
                <span className="text-base font-medium leading-6 text-[#303030]">— {item.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* QUICK ACCESS SECTION */}
      {/* ============================== */}
      <section className="section-padding py-[60px]">
        <div className="content-width">
          <h2 className="text-2xl font-semibold leading-8 text-center text-[#303030] mb-6">Quick Access</h2>
          <div className="flex flex-row items-stretch gap-6 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1">
            {quickAccessData.map((item, index) => (
              <div key={index} className="quick-access-card flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#E6F9F0] flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <span className="text-base font-semibold leading-6 text-center text-[#303030]">{item.title}</span>
                  <span className="text-sm leading-5 text-center text-[#888]">{item.subtitle}</span>
                </div>
                <button className="px-3 py-1.5 bg-[#28A71A] rounded-[7px] text-white text-xs font-medium leading-[18px] text-center border-none cursor-pointer hover:bg-[#1f8a13] transition-colors">{item.buttonText}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* CTA SECTION */}
      {/* ============================== */}
      <section className="flex flex-col justify-center items-center py-10 px-5 gap-6 bg-[#EAF6E8]">
        <h2 className="text-display-md text-center text-[#303030] max-md:text-[28px] max-md:leading-[36px]">Butuh Bantuan?</h2>
        <p className="text-base leading-6 text-center text-[#303030] max-md:text-sm">Temukan panduan untuk memaksimalkan fitur dan layanan kami.</p>
        <Link to="/kontak" className="btn-primary-green gap-2">
          <HelpCircle size={18} />
          Pusat Bantuan
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
