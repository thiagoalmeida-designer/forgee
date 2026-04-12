import { motion } from 'motion/react';
import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import imgAnaLuisa from '../../../imports/ana-luisa-coach.png';

const coaches = [
  {
    initials: 'RF',
    name: 'RODRIGO FARIAS',
    role: 'Head Coach',
    cref: 'CREF 045821-G/SP',
    img: 'https://images.unsplash.com/photo-1577744168855-0391d2ed2b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    initials: 'AL',
    name: 'ANA LUÍSA',
    role: 'Conditioning',
    cref: 'CREF 078342-G/SP',
    img: imgAnaLuisa,
  },
  {
    initials: 'BT',
    name: 'BRUNO T.',
    role: 'Mobility & Rehab',
    cref: 'CREF 091205-G/SP',
    img: 'https://images.unsplash.com/photo-1606335543586-137481155deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    initials: 'CD',
    name: 'CAMILA D.',
    role: 'Personal Trainer',
    cref: 'CREF 063417-G/SP',
    img: 'https://images.unsplash.com/photo-1750698545009-679820502908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export function TeamSection() {
  return (
    <section
      id="equipe"
      style={{ backgroundColor: '#111111', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <AnimateOnScroll>
          <div className="mb-16">
            <SectionLabel>Quem te acompanha</SectionLabel>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(52px, 7vw, 88px)',
                letterSpacing: '-2px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.9,
                marginBottom: '16px',
              }}
            >
              <div>COACHES QUE</div>
              <div>TREINAM.</div>
            </div>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '15px',
                color: '#666666',
              }}
            >
              Todos graduados em Educação Física. Todos registrados no CREF SP. Todos treinando.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coaches.map((coach, i) => (
            <AnimateOnScroll key={coach.name} delay={i * 0.1}>
              <motion.div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  aspectRatio: '3/4',
                  backgroundColor: '#1A1A1A',
                }}
                whileHover="hover"
              >
                {/* Photo */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    variants={{
                      hover: { scale: 1.05, filter: 'saturate(0.4)' },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={coach.img}
                      alt={coach.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        filter: 'saturate(0.2)',
                        transition: 'filter 0.4s ease',
                      }}
                    />
                  </motion.div>
                </div>

                {/* Heat rim glow on hover */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at bottom, rgba(224,32,32,0.3) 0%, transparent 70%)',
                    opacity: 0,
                  }}
                  variants={{ hover: { opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                />

                {/* Gradient overlay always */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0) 100%)',
                  }}
                />

                {/* Info */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px 20px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '20px',
                      letterSpacing: '0.5px',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}
                  >
                    {coach.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#E02020',
                      marginBottom: '6px',
                    }}
                  >
                    {coach.role}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 400,
                      fontSize: '11px',
                      color: '#555555',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {coach.cref}
                  </div>
                </div>

                {/* Initials badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(10,10,10,0.8)',
                    border: '1px solid #2E2E2E',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '13px',
                      color: '#FFFFFF',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {coach.initials}
                  </span>
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
