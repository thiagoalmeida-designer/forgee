export function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: '40px',
                letterSpacing: '-1px',
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              FORGEE
            </div>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '2px',
                color: '#888888',
                textTransform: 'uppercase',
                marginTop: '6px',
              }}
            >
              BEYOND LIMITS KNOWN™
            </div>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '14px',
                color: '#555555',
                marginTop: '20px',
                lineHeight: 1.6,
                maxWidth: '320px',
              }}
            >
              Um espaço desenhado para quem treina com intenção. Sem distrações. Sem promessas vazias.
            </p>
          </div>

          {/* Academia Links */}
          <div>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '2px',
                color: '#E02020',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Academia
            </div>
            <div className="flex flex-col gap-3">
              {['#espaco', '#programas', '#equipe', '#planos'].map((href, i) => {
                const labels = ['Espaço', 'Programas', 'Equipe', 'Planos'];
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleLinkClick(e, href)}
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#888888',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                  >
                    {labels[i]}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '2px',
                color: '#E02020',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Legal & Redes
            </div>
            <div className="flex flex-col gap-3">
              {['Política de Privacidade', 'Termos de Uso', '@forgee.academy'].map((label) => (
                <a
                  key={label}
                  href="#"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#888888',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: '1px solid #1A1A1A', paddingTop: '24px' }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              color: '#444444',
            }}
          >
            FORGEE ACADEMIA LTDA. · CNPJ 00.000.000/0001-00 · CREF SP
          </p>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              color: '#444444',
            }}
          >
            DESIGN SYSTEM © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
