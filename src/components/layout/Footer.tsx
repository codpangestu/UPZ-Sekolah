import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 120px',
        gap: 24,
        background: '#000000',
        maxWidth: 1440,
        margin: '0 auto',
      }}
    >
      {/* Frame 2395 - Top Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Profile */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 11,
            flex: 1,
            maxWidth: 390,
          }}
        >
          {/* Logo + Name */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: '#28A71A',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: '24px',
                color: '#FFFFFF',
              }}
            >
              Menara Masjid
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#FFFFFF',
              margin: 0,
              maxWidth: 319,
            }}
          >
            Platform digital untuk menghubungkan seluruh masjid dan musholla di Indonesia melalui teknologi modern.
          </p>
        </div>

        {/* Menu Navigasi */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 11,
            flex: 1,
            maxWidth: 320,
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            Menu Navigasi
          </span>
          {['Beranda', 'Tentang Kami', 'Masjid', 'Publikasi', 'Microfinance'].map((item, i) => (
            <Link
              key={i}
              to={i === 0 ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '20px',
                color: '#FFFFFF',
                textDecoration: 'none',
                width: '100%',
              }}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Kontak + Media Sosial */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 24,
            flex: 1,
            maxWidth: 390,
          }}
        >
          {/* Kontak */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 12,
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: '24px',
                color: '#FFFFFF',
              }}
            >
              Kontak
            </span>

            {/* Phone */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                0811 8882 1818
              </span>
            </div>

            {/* Email */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="1.5"/>
                <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                baznas@baznas.go.id
              </span>
            </div>

            {/* Address */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                width: '100%',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="1.5"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                Jl. Matraman Raya No.134, Kb. Manggis, Kec. Matraman, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta
              </span>
            </div>
          </div>

          {/* Media Sosial */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 11,
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: '24px',
                color: '#FFFFFF',
              }}
            >
              Media Sosial
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 11,
              }}
            >
              {/* YouTube */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 6,
                  width: 28,
                  height: 28,
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 99,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 6,
                  width: 28,
                  height: 28,
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 99,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 6,
                  width: 28,
                  height: 28,
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 99,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          height: 0,
          borderTop: '1px solid #D4D4D4',
        }}
      />

      {/* Bottom Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 24,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 24,
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            Kebijakan Privasi
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            Syarat & Ketentuan
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            Panduan Pengguna
          </span>
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '20px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          &copy; 2024 Menara Masjid. Semua hak cipta dilindungi undang-undang.
        </span>
      </div>
    </footer>
  );
}
