import { motion } from 'motion/react';
import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';

const programs = [
  {
    num: '01',
    name: 'FORGEE STRENGTH',
    desc: 'Musculação por periodização. Para quem quer construir massa e entender o próprio corpo. Disponível como treino livre com planilha ou acompanhado com coach.',
    for: 'Iniciantes a avançados em hipertrofia e força.',
    detail: '3–5× por semana.',
    detailLabel: 'Frequência',
    featured: false,
  },
  {
    num: '02',
    name: 'FORGEE CONDITIONING',
    desc: 'Sessões de 45 min com circuito de alta intensidade — remo, assault bike, força funcional e potência. Início e fim marcados. Sem improvisar.',
    for: 'Condicionamento, perda de gordura.',
    detail: '06H · 07H · 12H · 18H · 19H30',
    detailLabel: 'Turmas',
    featured: true,
  },
  {
    num: '03',
    name: 'FORGEE MOBILITY',
    desc: 'Protocolo de mobilidade, postura e cadeia posterior. Não é yoga. É trabalho de corpo para quem treina pesado e não quer se machucar.',
    for: 'Atletas e praticantes de alta carga.',
    detail: 'Incluído no plano Plus e Elite.',
    detailLabel: 'Acesso',
    featured: false,
  },
  {
    num: '04',
    name: 'PERSONAL TRAINING',
    desc: 'Sessões 1:1 com avaliação completa, protocolo personalizado e revisão a cada 4 semanas. Individual ou em dupla.',
    for: 'Quem busca resultados acelerados.',
    detail: '1:1 ou dupla',
    detailLabel: 'Modalidade',
    featured: false,
  },
];

export function ProgramsSection() {
  return (
    <section
      id="programas"
      style={{ backgroundColor: '#111111', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <AnimateOnScroll>
          <div className="mb-16">
            <SectionLabel>O que oferecemos</SectionLabel>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(48px, 6.5vw, 80px)',
                letterSpacing: '-2px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.9,
              }}
            >
              <div>UM PROTOCOLO</div>
              <div>PARA CADA</div>
              <div>OBJETIVO.</div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p, i) => (
            <AnimateOnScroll key={p.num} delay={i * 0.08}>
              <motion.div
                style={{
                  backgroundColor: p.featured ? '#E02020' : '#1A1A1A',
                  border: `1px solid ${p.featured ? '#E02020' : '#2E2E2E'}`,
                  padding: '36px',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
                whileHover={{
                  borderColor: p.featured ? '#E94040' : '#E02020',
                  y: -4,
                }}
                transition={{ duration: 0.2 }}
              >
                {p.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      backgroundColor: '#000000',
                      padding: '4px 12px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        color: '#E02020',
                        textTransform: 'uppercase',
                      }}
                    >
                      DESTAQUE
                    </span>
                  </div>
                )}

                {/* Background number */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '-10px',
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 900,
                    fontSize: '120px',
                    color: p.featured ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.03)',
                    letterSpacing: '-5px',
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {p.num}
                </div>

                <div
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '2px',
                    color: p.featured ? 'rgba(255,255,255,0.6)' : '#E02020',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  {p.num}
                </div>

                <div
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '28px',
                    letterSpacing: '-0.5px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    lineHeight: 1,
                  }}
                >
                  {p.name}
                </div>

                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    color: p.featured ? 'rgba(255,255,255,0.85)' : '#888888',
                    lineHeight: 1.65,
                    marginBottom: '20px',
                  }}
                >
                  {p.desc}
                </p>

                <div style={{ borderTop: `1px solid ${p.featured ? 'rgba(255,255,255,0.2)' : '#2E2E2E'}`, paddingTop: '16px' }}>
                  <div className="flex flex-col gap-2">
                    <div>
                      <span
                        style={{
                          fontFamily: "'Nimbus Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '10px',
                          letterSpacing: '1.5px',
                          color: p.featured ? 'rgba(255,255,255,0.5)' : '#555555',
                          textTransform: 'uppercase',
                          marginRight: '8px',
                        }}
                      >
                        Para quem é:
                      </span>
                      <span
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 400,
                          fontSize: '13px',
                          color: p.featured ? 'rgba(255,255,255,0.8)' : '#AAAAAA',
                        }}
                      >
                        {p.for}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: "'Nimbus Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '10px',
                          letterSpacing: '1.5px',
                          color: p.featured ? 'rgba(255,255,255,0.5)' : '#555555',
                          textTransform: 'uppercase',
                          marginRight: '8px',
                        }}
                      >
                        {p.detailLabel}:
                      </span>
                      <span
                        style={{
                          fontFamily: "'Nimbus Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#FFFFFF',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {p.detail}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
