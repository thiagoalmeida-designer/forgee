import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';

const plans = [
  {
    name: 'LIVRE',
    price: 'R$149',
    period: '/mês',
    badge: null,
    items: [
      'Acesso ilimitado 05H–23H',
      'Avaliação física de entrada',
      'Planilha de treino inicial',
      'App FORGEE',
    ],
    featured: false,
  },
  {
    name: 'PLUS',
    price: 'R$229',
    period: '/mês',
    badge: 'MAIS ESCOLHIDO',
    items: [
      'Tudo do Livre +',
      '2 sessões de Personal / mês',
      '1 aula Conditioning / semana',
      'Revisão planilha 4 semanas',
      'Acesso ao Mobility',
    ],
    featured: true,
  },
  {
    name: 'ELITE',
    price: 'R$389',
    period: '/mês',
    badge: null,
    items: [
      'Tudo do Plus +',
      '4 sessões Personal / mês',
      'Acesso ilimitado classes',
      'Bioimpedância mensal',
      'WhatsApp coach dedicado',
    ],
    featured: false,
  },
];

export function PlansSection() {
  return (
    <section
      id="planos"
      style={{ backgroundColor: '#0A0A0A', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>Investimento</SectionLabel>
            <div
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(44px, 6vw, 72px)',
                letterSpacing: '-2px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.92,
                marginBottom: '20px',
              }}
            >
              <div>SEM MATRÍCULA.</div>
              <div>SEM FIDELIDADE.</div>
              <div>SEM ENROLAÇÃO.</div>
            </div>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '16px',
                color: '#666666',
                maxWidth: '420px',
                margin: '0 auto',
                lineHeight: 1.65,
              }}
            >
              Mude de plano quando quiser. Cancele com 30 dias. Sem justificativa.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan, i) => (
            <AnimateOnScroll key={plan.name} delay={i * 0.1}>
              <motion.div
                style={{
                  backgroundColor: plan.featured ? '#1A1A1A' : '#111111',
                  border: `1px solid ${plan.featured ? '#E02020' : '#2E2E2E'}`,
                  padding: '40px 32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#E02020',
                      padding: '4px 20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Left accent border for featured */}
                {plan.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: '#E02020',
                    }}
                  />
                )}

                <div style={{ marginTop: plan.badge ? '20px' : '0' }}>
                  <div
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '22px',
                      letterSpacing: '1.5px',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      marginBottom: '20px',
                    }}
                  >
                    {plan.name}
                  </div>

                  <div className="flex items-end gap-1 mb-8">
                    <span
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 900,
                        fontSize: '52px',
                        letterSpacing: '-2px',
                        color: '#FFFFFF',
                        lineHeight: 1,
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#666666',
                        marginBottom: '6px',
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 mb-10">
                    {plan.items.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <Check
                          size={14}
                          style={{ color: '#4ADE80', flexShrink: 0, marginTop: '3px' }}
                        />
                        <span
                          style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 400,
                            fontSize: '14px',
                            color: '#AAAAAA',
                            lineHeight: 1.4,
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '1.5px',
                    color: plan.featured ? '#FFFFFF' : '#CCCCCC',
                    textTransform: 'uppercase',
                    backgroundColor: plan.featured ? '#E02020' : 'transparent',
                    border: plan.featured ? '1px solid #E02020' : '1px solid #333333',
                    padding: '14px',
                    width: '100%',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    transition: 'background-color 0.2s, border-color 0.2s',
                  }}
                  whileHover={{
                    backgroundColor: plan.featured ? '#E94040' : 'rgba(255,255,255,0.05)',
                    borderColor: '#E02020',
                  }}
                >
                  QUERO ESSE PLANO
                </motion.button>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Payment info + daily option */}
        <AnimateOnScroll delay={0.3}>
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1A1A1A',
              padding: '24px 32px',
            }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '13px',
                color: '#555555',
              }}
            >
              Pagamento via PIX ou cartão (3× sem juros) · Cancelamento com 30 dias de aviso · Plano anual com 15% de desconto
            </p>
            <div className="flex items-center gap-4 shrink-0">
              <div>
                <span
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 900,
                    fontSize: '18px',
                    color: '#FFFFFF',
                    letterSpacing: '-0.5px',
                  }}
                >
                  DIÁRIA: R$ 39
                </span>
                <span
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#555555',
                    marginLeft: '6px',
                  }}
                >
                  Acesso por 1 dia
                </span>
              </div>
              <motion.button
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1.2px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  backgroundColor: 'transparent',
                  border: '1px solid #333333',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                whileHover={{ borderColor: '#E02020', color: '#E02020' }}
              >
                AGENDAR
              </motion.button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
