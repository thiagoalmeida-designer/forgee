import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import imgAtleta from '../../../imports/image-3.png';

const metrics = [
  { label: 'Horário', value: '05H–23H' },
  { label: 'Dias', value: '7 DIAS' },
  { label: 'Espaço', value: '1.800M²' },
  { label: 'Alunos', value: '+1.200' },
  { label: 'Desde', value: '2018', accent: true },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.5]);

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      id="espaco"
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100svh',
        backgroundColor: '#0A0A0A',
      }}
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: imgY }}
      >
        <motion.div
          className="absolute w-full h-full"
          initial={{ scale: 1.08, opacity: 0, x: -24 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ImageWithFallback
            src={imgAtleta}
            alt=""
            className="w-full h-full object-cover object-[65%_center] md:object-center"
          />
        </motion.div>
        {/* Dark veil — responsive: stronger gradient on left for desktop, softer for mobile */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.7) 30%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.2) 100%)',
          }}
        />
        {/* Mobile: extra center veil for text readability */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.3) 30%, rgba(10,10,10,0.5) 70%, rgba(10,10,10,0.8) 100%)',
          }}
        />
        {/* Bottom fade to section */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 35%)',
          }}
        />
        {/* Red cinematic glow */}
        <div
          className="absolute"
          style={{
            bottom: 0,
            right: 0,
            width: '60%',
            height: '70%',
            background: 'radial-gradient(ellipse at bottom right, rgba(224,32,32,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        {/* Scroll-driven extra darkening */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0a]"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Background watermark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          bottom: '15%',
          right: '-5%',
          fontFamily: "'Nimbus Sans', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(120px, 20vw, 280px)',
          color: 'rgba(255,255,255,0.03)',
          textTransform: 'uppercase',
          letterSpacing: '-5px',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        WORKOUT
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-24 pb-28 flex flex-col gap-8">
        {/* Rating */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="#FF4500">
                <path d="M6.102 3.60533C6.94667 2.09067 7.36867 1.33333 8 1.33333C8.63133 1.33333 9.05333 2.09067 9.898 3.60533L10.1167 3.99733C10.3567 4.428 10.4767 4.64333 10.6633 4.78533C10.85 4.92733 11.0833 4.98 11.55 5.08533L11.974 5.18133C13.614 5.55267 14.4333 5.738 14.6287 6.36533C14.8233 6.992 14.2647 7.646 13.1467 8.95333L12.8573 9.29133C12.54 9.66267 12.3807 9.84867 12.3093 10.078C12.238 10.308 12.262 10.556 12.31 11.0513L12.354 11.5027C12.5227 13.2473 12.6073 14.1193 12.0967 14.5067C11.586 14.894 10.818 14.5407 9.28333 13.834L8.88533 13.6513C8.44933 13.45 8.23133 13.35 8 13.35C7.76867 13.35 7.55067 13.45 7.11467 13.6513L6.71733 13.834C5.182 14.5407 4.414 14.894 3.904 14.5073C3.39267 14.1193 3.47733 13.2473 3.646 11.5027L3.69 11.052C3.738 10.556 3.762 10.308 3.69 10.0787C3.61933 9.84867 3.46 9.66267 3.14267 9.292L2.85333 8.95333C1.73533 7.64667 1.17667 6.99267 1.37133 6.36533C1.566 5.738 2.38667 5.552 4.02667 5.18133L4.45067 5.08533C4.91667 4.98 5.14933 4.92733 5.33667 4.78533C5.524 4.64333 5.64333 4.428 5.88333 3.99733L6.102 3.60533" />
              </svg>
            ))}
          </div>
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              color: '#A3A3A3',
              letterSpacing: '0.3px',
            }}
          >
            4.9 · BASEADO EM +1.200 ALUNOS
          </span>
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col gap-1 md:gap-2">
          {/* Line 1 */}
          <motion.div
            className="flex flex-wrap items-baseline gap-2 md:gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(56px, 9vw, 108px)',
                color: '#FFFFFF',
                letterSpacing: '-3px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
              }}
            >
              SEM
            </span>
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 'clamp(56px, 9vw, 108px)',
                color: '#555555',
                letterSpacing: '-3px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
              }}
            >
              MÁGICA
            </span>
          </motion.div>

          {/* Line 2 */}
          <motion.div
            className="flex flex-wrap items-baseline gap-2 md:gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(56px, 9vw, 108px)',
                color: '#FFFFFF',
                letterSpacing: '-3px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
              }}
            >
              SEM
            </span>
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 'clamp(56px, 9vw, 108px)',
                color: '#555555',
                letterSpacing: '-3px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
              }}
            >
              ATALHOS
            </span>
          </motion.div>

          {/* Line 3 — Red */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(56px, 9vw, 108px)',
                color: '#E02020',
                letterSpacing: '-3px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                display: 'inline-block',
              }}
            >
              SEM DESCULPAS
            </span>
          </motion.div>
        </div>

        {/* Subtitle & body */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3"
          style={{ maxWidth: '460px' }}
        >
          <p
            style={{
              fontFamily: "'Nimbus Sans', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
              letterSpacing: '1px',
              color: '#CCCCCC',
              textTransform: 'uppercase',
            }}
          >
            Treinos progressivos e acompanhamento real!
          </p>
          <div
            style={{
              borderLeft: '2px solid #E02020',
              paddingLeft: '20px',
            }}
          >
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '16px',
                color: '#AAAAAA',
                lineHeight: 1.65,
              }}
            >
              Um espaço desenhado para quem treina com intenção. Sem distrações. Sem promessas vazias.
              Só você, o equipamento e o trabalho.
            </p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => handleScroll('#planos')}
            style={{
              fontFamily: "'Nimbus Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '1.6px',
              color: '#000000',
              textTransform: 'uppercase',
              padding: '14px 28px',
              backgroundColor: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            COMEÇAR AGORA
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#FF4500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M5 15L15 5M15 5H7.5M15 5V12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          <button
            onClick={() => handleScroll('#espaco')}
            style={{
              fontFamily: "'Nimbus Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '1.6px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            CONHECER O ESPAÇO
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2.66667 8H13.3333M13.3333 8L9.33333 4M13.3333 8L9.33333 12" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Metrics Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          backgroundColor: 'rgba(17,17,17,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(46,46,46,0.8)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <div
          className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-start justify-between flex-wrap gap-4"
        >
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  color: '#666666',
                  textTransform: 'uppercase',
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1.2px',
                  color: m.accent ? '#E02020' : '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}