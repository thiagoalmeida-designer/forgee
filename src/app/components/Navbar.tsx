import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Espaço', href: '#espaco' },
  { label: 'Programas', href: '#programas' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Planos', href: '#planos' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(17,17,17,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(46,46,46,0.8)' : '1px solid transparent',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex flex-col group">
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: '28px',
                letterSpacing: '-0.5px',
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              FORGEE
            </span>
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '9px',
                letterSpacing: '1.5px',
                color: '#888888',
                lineHeight: 1,
                marginTop: '3px',
                textTransform: 'uppercase',
              }}
            >
              Beyond Limits Known™ · Indaiatuba, SP · Est. 2018
            </span>
          </a>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '1.5px',
                  color: '#CCCCCC',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#CCCCCC')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1.4px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '8px 16px',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sou Membro
            </Link>
            <a
              href="#visita"
              onClick={(e) => handleLinkClick(e, '#cta-final')}
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1.4px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '8px 20px',
                backgroundColor: '#E02020',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E94040')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E02020')}
            >
              Agendar Visita
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-20"
            style={{ backgroundColor: '#0A0A0A' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-2 px-8 pt-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '42px',
                    letterSpacing: '-1px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    lineHeight: 1.1,
                    display: 'block',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(46,46,46,0.6)',
                  }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="flex flex-col gap-3 px-8 mt-8">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1.4px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '14px 24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                }}
              >
                Sou Membro
              </Link>
              <a
                href="#cta-final"
                onClick={(e) => handleLinkClick(e, '#cta-final')}
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1.4px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '14px 24px',
                  backgroundColor: '#E02020',
                  textAlign: 'center',
                }}
              >
                Agendar Visita
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
