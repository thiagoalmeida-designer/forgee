import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';

const faqs = [
  {
    q: 'Preciso ter experiência?',
    a: 'Não. Todos passam pela avaliação inicial — do iniciante ao atleta. O ponto de partida é individual.',
  },
  {
    q: 'Posso treinar sozinho?',
    a: 'Sim. A maioria dos alunos treina de forma autônoma com planilha. Coaches estão disponíveis para dúvidas pontuais — não ficam em cima.',
  },
  {
    q: 'Como funciona o cancelamento?',
    a: 'Avise com 30 dias. Plano encerrado no próximo ciclo. Sem multa, sem justificativa obrigatória.',
  },
  {
    q: 'Posso visitar antes de assinar?',
    a: 'Sim — e incentivamos. Agende pelo site. Você conhece o espaço, conversa com um coach e faz uma aula experimental gratuita.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{ backgroundColor: '#0A0A0A', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left heading */}
          <AnimateOnScroll direction="left">
            <SectionLabel>Dúvidas</SectionLabel>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(52px, 7vw, 88px)',
                letterSpacing: '-2px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.9,
              }}
            >
              <div>PERGUNTAS</div>
              <div>DIRETAS.</div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  color: '#555555',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}
              >
                Não encontrou o que precisava? Fale com a gente diretamente.
              </p>
              <motion.a
                href="https://wa.me/5519982345678"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1.5px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '14px 24px',
                  backgroundColor: '#E02020',
                  display: 'inline-block',
                }}
                whileHover={{ backgroundColor: '#E94040' }}
              >
                FALAR NO WHATSAPP
              </motion.a>
            </div>
          </AnimateOnScroll>

          {/* Right: accordion */}
          <div className="flex flex-col gap-0">
            {faqs.map((faq, i) => (
              <AnimateOnScroll key={faq.q} delay={i * 0.07}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #1A1A1A',
                    padding: '24px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '18px',
                      letterSpacing: '-0.3px',
                      color: openIndex === i ? '#FFFFFF' : '#CCCCCC',
                      textTransform: 'uppercase',
                      transition: 'color 0.2s',
                      lineHeight: 1.2,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span style={{ color: '#E02020', flexShrink: 0, marginTop: '2px' }}>
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 400,
                          fontSize: '15px',
                          color: '#888888',
                          lineHeight: 1.65,
                          paddingBottom: '20px',
                          paddingTop: '4px',
                          borderBottom: '1px solid #1A1A1A',
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
