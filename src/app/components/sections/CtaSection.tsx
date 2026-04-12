import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const marqueeItems = Array(6).fill([
  'AGENDE UMA VISITA',
  '·',
  'GRATUITA',
  '·',
  'SEM COMPROMISSO',
  '·',
  'TRAGA TÊNIS',
  '·',
]).flat();

export function CtaSection() {
  return (
    <section
      id="cta-final"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #E02020 100%)',
        paddingTop: '100px',
        paddingBottom: '0',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '560px',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(255,69,0,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main CTA text */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              fontFamily: "'Nimbus Sans', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(52px, 8vw, 104px)',
              letterSpacing: '-3px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              lineHeight: 0.88,
              marginBottom: '48px',
            }}
          >
            <div>A DECISÃO</div>
            <div>JÁ FOI TOMADA.</div>
            <div>AGORA É A AÇÃO.</div>
          </div>

          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#localizacao')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              fontFamily: "'Nimbus Sans', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '1.8px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '18px 36px',
              border: '2px solid rgba(255,255,255,0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.25s',
            }}
            whileHover={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.8)',
              scale: 1.02,
            }}
          >
            AGENDAR VISITA GRATUITA
            <ArrowUpRight size={18} />
          </motion.a>
        </motion.div>
      </div>

      {/* Marquee ticker */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          padding: '14px 0',
          marginTop: '48px',
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            gap: '24px',
            whiteSpace: 'nowrap',
          }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '2px',
                color: item === '·' ? '#FF6B2B' : 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
