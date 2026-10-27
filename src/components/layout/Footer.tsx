import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '48px 120px 40px',
        gap: 28,
        background: '#0F172A',
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
          gap: 32,
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
            gap: 14,
            flex: 1.2,
            maxWidth: 400,
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
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
              }}
            >
              <GraduationCap size={20} color="#FFFFFF" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                UPZ Sekolah
              </span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  lineHeight: '12px',
                  color: '#38BDF8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                BAZNAS RI
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '22px',
              color: '#94A3B8',
              margin: 0,
              maxWidth: 340,
            }}
          >
            Platform digital resmi pengelolaan Unit Pengumpul Zakat (UPZ) berbasis lingkungan sekolah di seluruh Indonesia binaan Badan Amil Zakat Nasional (BAZNAS).
          </p>
        </div>

        {/* Menu Navigasi */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 12,
            flex: 1,
            maxWidth: 280,
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            Menu Navigasi
          </span>
          {[
            { label: 'Beranda', to: '/' },
            { label: 'Tentang Kami', to: '/tentang' },
            { label: 'Direktori UPZ Sekolah', to: '/masjid' },
            { label: 'Publikasi & Kajian', to: '/kajian' },
            { label: 'Ajukan UPZ Sekolah', to: '/ajukan-masjid' },
            { label: 'Microfinance BMM', to: '/microfinance' },
            { label: 'Founder', to: '/founder' },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '20px',
                color: '#CBD5E1',
                textDecoration: 'none',
                width: '100%',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Kontak + Media Sosial */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 20,
            flex: 1.2,
            maxWidth: 380,
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
                fontSize: 15,
                lineHeight: '24px',
                color: '#FFFFFF',
              }}
            >
              Kontak Layanan
            </span>

            {/* Phone */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#CBD5E1',
                }}
              >
                0811 8882 1818 (Call Center BAZNAS)
              </span>
            </div>

            {/* Email */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#38BDF8" strokeWidth="1.5"/>
                <polyline points="22,6 12,13 2,6" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#CBD5E1',
                }}
              >
                upzsekolah@baznas.go.id
              </span>
            </div>

            {/* Address */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
                width: '100%',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#38BDF8" strokeWidth="1.5"/>
                <circle cx="12" cy="10" r="3" stroke="#38BDF8" strokeWidth="1.5"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#94A3B8',
                }}
              >
                Jl. Matraman Raya No.134, Kebon Manggis, Matraman, Jakarta Timur
              </span>
            </div>
          </div>

          {/* Media Sosial */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 10,
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                lineHeight: '20px',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Media Sosial
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
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
                  width: 32,
                  height: 32,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 99,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0284C7')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
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
                  width: 32,
                  height: 32,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 99,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0284C7')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
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
                  width: 32,
                  height: 32,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 99,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0284C7')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
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
          borderTop: '1px solid #1E293B',
        }}
      />

      {/* Bottom Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <Link
            to="/kebijakan-privasi"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: '20px',
              color: '#94A3B8',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            Kebijakan Privasi
          </Link>
          <Link
            to="/disclaimer"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: '20px',
              color: '#94A3B8',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            Disclaimer
          </Link>
          <Link
            to="/syarat-ketentuan"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: '20px',
              color: '#94A3B8',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            Syarat & Ketentuan
          </Link>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: '20px',
              color: '#94A3B8',
              cursor: 'pointer',
            }}
          >
            Panduan UPZ Sekolah
          </span>
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '20px',
            color: '#64748B',
          }}
        >
          &copy; 2026 UPZ Sekolah - BAZNAS. Seluruh hak cipta dilindungi undang-undang.
        </span>
      </div>
    </footer>
  );
}
