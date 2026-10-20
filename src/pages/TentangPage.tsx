import { HeroTentang } from '../components/shared/illustrations';

const milestones = [
  { year: '2020', title: 'Awal Pengembangan', description: 'BAZNAS memulai pengembangan aplikasi MENARA untuk digitalisasi UPZ Masjid.' },
  { year: '2021', title: 'Peluncuran Aplikasi', description: 'Aplikasi MENARA diluncurkan dan tersedia di Play Store untuk pengurus masjid.' },
  { year: '2022', title: 'Pengembangan Sistem', description: 'Pengembangan backend untuk skalabilitas dan performa lebih baik.' },
  { year: '2023', title: 'Ekspansi Nasional', description: 'MENARA digunakan oleh ribuan masjid di seluruh Indonesia.' },
  { year: '2024', title: 'Platform Digital', description: 'Peluncuran platform web untuk akses yang lebih luas dan terintegrasi.' },
  { year: '2025+', title: 'Pengembangan Berkelanjutan', description: 'Terus berinovasi untuk mendukung digitalisasi pengelolaan masjid.' },
];

const nilaiValues = [
  {
    title: 'Transparansi',
    description: 'Kami percaya transparansi adalah kunci kepercayaan. Setiap transaksi tercatat dan dapat diakses.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#28A71A" strokeWidth="1.5"/>
        <path d="M12 6V12L16 14" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Akuntabilitas',
    description: 'Setiap dana yang dikelola tercatat dengan baik dan dapat dipertanggungjawabkan.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Inovasi',
    description: 'Terus berinovasi untuk memberikan solusi terbaik bagi pengelolaan masjid modern.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Amanah',
    description: 'Menjaga amanah pengelolaan dana umat dengan sistem yang terpercaya.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const timData = [
  { name: 'BAZNAS RI', role: 'Pengelola & Pengembang', image: '🏛️' },
  { name: 'Tim Teknis', role: 'Pengembangan Aplikasi', image: '💻' },
  { name: 'Tim Dakwah', role: 'Konten & Publikasi', image: '📖' },
  { name: 'Tim Lapangan', role: 'Pendampingan Masjid', image: '🤝' },
];

export default function TentangPage() {
  return (
    <div style={{ background: '#FAFAFA' }}>
      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <section
        style={{
          padding: '60px 120px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 60,
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Left Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 24,
              flex: 1,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '6px 16px',
                gap: 4,
                background: '#E6F9F0',
                borderRadius: 99,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#28A71A"/>
                <path d="M12 6V12L16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  textAlign: 'center',
                  color: 'var(--color-badge-text)',
                }}
              >
                Tentang Kami
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                fontSize: 48,
                lineHeight: '60px',
                letterSpacing: '-0.02em',
                color: '#303030',
                margin: 0,
              }}
            >
              Mewujudkan Digitalisasi{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #1C7712 0%, #6FC466 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Pengelolaan Masjid
              </span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '24px',
                color: '#303030',
                margin: 0,
              }}
            >
              MENARA (Manajemen Ekonomi, Nazhir, Amal, Rumah Amal) adalah platform digital
              yang dikembangkan oleh BAZNAS RI untuk membantu pengurus masjid dalam mengelola
              administrasi, keuangan, dan kegiatan dakwah secara modern dan terintegrasi.
            </p>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 40,
                marginTop: 8,
              }}
            >
              {[
                { value: '2.500+', label: 'Masjid Terdaftar' },
                { value: '34', label: 'Provinsi' },
                { value: '15K+', label: 'Pengguna Aktif' },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 28,
                      lineHeight: '36px',
                      color: '#28A71A',
                    }}
                  >
                    {stat.value}
                  </span>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                      color: 'var(--color-text-gray)',
                      margin: '4px 0 0 0',
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div
            style={{
              width: 480,
              height: 400,
              background: 'linear-gradient(135deg, #E6F9F0 0%, #EAF6E8 100%)',
              borderRadius: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <HeroTentang size={300} />
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* VISI MISI SECTION */}
      {/* ============================== */}
      <section
        style={{
          padding: '60px 120px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 24,
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Visi */}
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: '#EAF6E8',
                borderRadius: 99,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#28A71A"/>
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 24,
                lineHeight: '32px',
                color: '#303030',
                margin: 0,
              }}
            >
              Visi
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '24px',
                color: 'var(--color-text-gray)',
                margin: 0,
              }}
            >
              Menjadi platform digital terdepan dalam pengelolaan masjid yang transparan,
              akuntabel, dan berkelanjutan untuk mewujudkan kemandirian ekonomi umat.
            </p>
          </div>

          {/* Misi */}
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: '#EAF6E8',
                borderRadius: 99,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#28A71A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#28A71A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 24,
                lineHeight: '32px',
                color: '#303030',
                margin: 0,
              }}
            >
              Misi
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '24px',
                color: 'var(--color-text-gray)',
                margin: 0,
              }}
            >
              Menyediakan solusi teknologi yang memudahkan pengurus masjid dalam mengelola
              administrasi, keuangan, dan dakwah secara digital dan terintegrasi.
            </p>
          </div>

          {/* Tujuan */}
          <div
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: '#EAF6E8',
                borderRadius: 99,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#28A71A" strokeWidth="1.5"/>
                <path d="M12 6V12L16 14" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 24,
                lineHeight: '32px',
                color: '#303030',
                margin: 0,
              }}
            >
              Tujuan
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '24px',
                color: 'var(--color-text-gray)',
                margin: 0,
              }}
            >
              Mendigitalisasi pengelolaan UPZ Masjid di seluruh Indonesia untuk meningkatkan
              transparansi dan akuntabilitas pengelolaan dana umat.
            </p>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* NILAI KAMI */}
      {/* ============================== */}
      <section
        style={{
          padding: '60px 120px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '6px 16px',
                gap: 4,
                background: '#E6F9F0',
                borderRadius: 99,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#28A71A"/>
                <path d="M12 6V12L16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  textAlign: 'center',
                  color: 'var(--color-badge-text)',
                }}
              >
                Nilai Kami
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                fontSize: 48,
                lineHeight: '60px',
                letterSpacing: '-0.02em',
                color: '#303030',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Prinsip yang Kami{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #1C7712 0%, #6FC466 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Pegang Teguh
              </span>
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 24,
            }}
          >
            {nilaiValues.map((item, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: '#EAF6E8',
                    borderRadius: 99,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                    lineHeight: '28px',
                    color: '#303030',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: 'var(--color-text-gray)',
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* TIM KAMI */}
      {/* ============================== */}
      <section
        style={{
          padding: '60px 120px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '6px 16px',
                gap: 4,
                background: '#E6F9F0',
                borderRadius: 99,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="#28A71A" strokeWidth="1.5"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  textAlign: 'center',
                  color: 'var(--color-badge-text)',
                }}
              >
                Tim Kami
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                fontSize: 48,
                lineHeight: '60px',
                letterSpacing: '-0.02em',
                color: '#303030',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Dibalik Layar{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #1C7712 0%, #6FC466 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                MENARA
              </span>
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 24,
            }}
          >
            {timData.map((member, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 16,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #E6F9F0, #EAF6E8)',
                    borderRadius: 99,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                  }}
                >
                  {member.image}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 18,
                      lineHeight: '24px',
                      color: '#303030',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {member.name}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                      color: 'var(--color-text-gray)',
                      margin: 0,
                    }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* TIMELINE / PERJALANAN */}
      {/* ============================== */}
      <section
        style={{
          padding: '60px 120px 80px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '6px 16px',
                gap: 4,
                background: '#E6F9F0',
                borderRadius: 99,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#28A71A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  textAlign: 'center',
                  color: 'var(--color-badge-text)',
                }}
              >
                Perjalanan
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                fontSize: 48,
                lineHeight: '60px',
                letterSpacing: '-0.02em',
                color: '#303030',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Perjalanan{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #1C7712 0%, #6FC466 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                MENARA
              </span>
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: 15,
                top: 0,
                bottom: 0,
                width: 2,
                background: '#E6F9F0',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {milestones.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 32,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 99,
                      background: '#28A71A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 10,
                        lineHeight: '16px',
                        color: '#FFFFFF',
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                      background: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 16,
                      padding: 24,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: '#28A71A',
                      }}
                    >
                      {item.year}
                    </span>
                    <h4
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 18,
                        lineHeight: '24px',
                        color: '#303030',
                        margin: '8px 0 4px 0',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: 'var(--color-text-gray)',
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
