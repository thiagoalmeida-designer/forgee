import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';
import { motion } from 'motion/react';

const pillars = [
  {
    num: '01',
    title: 'Intensidade',
    desc: 'O ambiente foi calibrado para elevar. Iluminação, acústica, temperatura — tudo serve ao treino.',
  },
  {
    num: '02',
    title: 'Precisão',
    desc: 'Protocolo individualizado desde o dia um. Nenhuma planilha genérica sai daqui.',
  },
  {
    num: '03',
    title: 'Controle',
    desc: 'Você define o objetivo. Nós fornecemos o caminho, o espaço e o suporte.',
  },
];

const stats = [
  { value: '+1.200', label: 'Alunos ativos' },
  { value: '94%', label: 'Retenção 6 meses' },
  { value: '8 anos', label: 'Em operação' },
  { value: '1.8K M²', label: 'Dedicados' },
];

const testimonials = [
  {
    text: '"Treinei em academias em São Paulo por anos. A FORGEE é a única que me fez não sentir falta de nenhuma delas."',
    name: 'Rafael M.',
    role: 'Engenheiro · Aluno há 3 anos',
  },
  {
    text: '"Entrei querendo perder peso. Fiquei pela comunidade e pela sensação de que alguém realmente acompanha."',
    name: 'Juliana T.',
    role: 'Professora · Aluna há 2 anos',
  },
  {
    text: '"A estrutura impressiona. Mas o que me mantém são os profissionais. Nunca fui tão bem orientado."',
    name: 'Lucas O.',
    role: 'Empresário · Aluno há 4 anos',
  },
];

export function AboutSection() {
  return (
    <section
      id="sobre"
      style={{ backgroundColor: '#111111', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
          <AnimateOnScroll direction="left">
            <SectionLabel>Quem somos</SectionLabel>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(52px, 7vw, 88px)',
                letterSpacing: '-2.5px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.92,
              }}
            >
              <div>FORJADOS</div>
              <div>PELA</div>
              <div>DISCIPLINA.</div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right" delay={0.1}>
            <div className="flex flex-col gap-6 pt-2 lg:pt-12">
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: '18px',
                  color: '#CCCCCC',
                  lineHeight: 1.65,
                }}
              >
                A FORGEE nasceu de uma certeza simples: ambiente mediano produz resultado mediano.
              </p>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#888888',
                  lineHeight: 1.65,
                }}
              >
                Cada metro quadrado foi pensado para que o espaço não interfira — ele desaparece. O que fica é o treino, a concentração e o progresso.
              </p>

              {/* Quote */}
              <blockquote
                style={{
                  borderLeft: '3px solid #E02020',
                  paddingLeft: '24px',
                  marginTop: '8px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 700,
                    fontStyle: 'italic',
                    fontSize: '22px',
                    color: '#CCCCCC',
                    lineHeight: 1.3,
                    letterSpacing: '-0.3px',
                  }}
                >
                  "In silence, the transformation begins."
                </p>
              </blockquote>

              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  color: '#777777',
                  lineHeight: 1.7,
                }}
              >
                Aqui não tem música forçada, espelho em excesso ou coach em cima. Tem equipamento que
                não decepciona no seu melhor dia, profissionais que aparecem quando você precisa e
                silêncio o suficiente para se ouvir.
              </p>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {pillars.map((p, i) => (
            <AnimateOnScroll key={p.num} delay={i * 0.1}>
              <motion.div
                style={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2E2E2E',
                  padding: '32px',
                  transition: 'border-color 0.3s',
                }}
                whileHover={{ borderColor: '#E02020' }}
              >
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
                    marginBottom: '12px',
                  }}
                >
                  {p.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#888888',
                    lineHeight: 1.65,
                  }}
                >
                  {p.desc}
                </p>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Stats row */}
        <AnimateOnScroll>
          <div
            style={{
              borderTop: '1px solid #2E2E2E',
              borderBottom: '1px solid #2E2E2E',
              padding: '48px 0',
              marginBottom: '80px',
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    letterSpacing: '-2px',
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 400,
                    fontSize: '13px',
                    color: '#666666',
                    letterSpacing: '0.3px',
                  }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} delay={i * 0.1}>
              <div
                style={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2E2E2E',
                  padding: '32px',
                  height: '100%',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '15px',
                    color: '#CCCCCC',
                    lineHeight: 1.65,
                    marginBottom: '20px',
                  }}
                >
                  {t.text}
                </p>
                <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '16px' }}>
                  <div
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      color: '#FFFFFF',
                    }}
                  >
                    — {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#666666',
                      marginTop: '4px',
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
