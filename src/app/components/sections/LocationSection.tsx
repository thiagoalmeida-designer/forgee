import { motion } from 'motion/react';
import { MapPin, Clock, Phone, Mail, Instagram } from 'lucide-react';
import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';

const schedule = [
  { day: 'Segunda a Sexta', time: '05H00 – 23H00' },
  { day: 'Sábado', time: '07H00 – 20H00' },
  { day: 'Domingo e Feriados', time: '08H00 – 14H00' },
];

const contacts = [
  { icon: Phone, label: 'WhatsApp', value: '(19) 98234-5678', href: 'https://wa.me/5519982345678' },
  { icon: Mail, label: 'E-mail', value: 'contato@forgee.academy', href: 'mailto:contato@forgee.academy' },
  { icon: Instagram, label: 'Instagram', value: '@forgee.academy', href: 'https://instagram.com/forgee.academy' },
];

export function LocationSection() {
  return (
    <section
      id="localizacao"
      style={{ backgroundColor: '#111111', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div>
            <AnimateOnScroll direction="left">
              <SectionLabel>Onde estamos</SectionLabel>
              <div
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 6vw, 76px)',
                  letterSpacing: '-2px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  lineHeight: 0.9,
                  marginBottom: '40px',
                }}
              >
                <div>NO CORAÇÃO</div>
                <div>DE INDAIATUBA.</div>
              </div>
            </AnimateOnScroll>

            {/* Address */}
            <AnimateOnScroll delay={0.1}>
              <div
                style={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2E2E2E',
                  padding: '24px 28px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <MapPin style={{ color: '#E02020', marginTop: '2px', flexShrink: 0 }} size={18} />
                <div>
                  <p
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      lineHeight: 1.4,
                    }}
                  >
                    Rua das Esmeraldas, 742<br />
                    Jardim Morada do Sol — Indaiatuba, SP<br />
                    CEP 13.334-210
                  </p>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#555555',
                      marginTop: '8px',
                    }}
                  >
                    200m do Carrefour · Próximo à saída SP-075
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Schedule */}
            <AnimateOnScroll delay={0.15}>
              <div
                style={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2E2E2E',
                  padding: '24px 28px',
                  marginBottom: '16px',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock style={{ color: '#E02020' }} size={16} />
                  <span
                    style={{
                      fontFamily: "'Nimbus Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      letterSpacing: '2px',
                      color: '#E02020',
                      textTransform: 'uppercase',
                    }}
                  >
                    Horários
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {schedule.map((s) => (
                    <div key={s.day} className="flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#888888',
                        }}
                      >
                        {s.day}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Nimbus Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#FFFFFF',
                          letterSpacing: '0.8px',
                        }}
                      >
                        {s.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Contacts */}
            <AnimateOnScroll delay={0.2}>
              <div className="flex flex-col gap-3 mb-8">
                {contacts.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      backgroundColor: '#1A1A1A',
                      border: '1px solid #2E2E2E',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#E02020')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2E2E2E')}
                  >
                    <c.icon size={15} style={{ color: '#E02020', flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '11px',
                        letterSpacing: '1.5px',
                        color: '#555555',
                        textTransform: 'uppercase',
                        width: '80px',
                      }}
                    >
                      {c.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#CCCCCC',
                      }}
                    >
                      {c.value}
                    </span>
                  </a>
                ))}
              </div>
            </AnimateOnScroll>

            {/* CTAs */}
            <AnimateOnScroll delay={0.25}>
              <div className="flex flex-wrap gap-3">
                <motion.a
                  href="https://wa.me/5519982345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1.5px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    backgroundColor: '#E02020',
                  }}
                  whileHover={{ backgroundColor: '#E94040' }}
                >
                  FALAR NO WHATSAPP
                </motion.a>
                <motion.a
                  href="https://www.google.com/maps/dir//Rua+das+Esmeraldas,+742+-+Jardim+Morada+do+Sol,+Indaiatuba+-+SP,+13334-210"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1.5px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    border: '1px solid #333333',
                  }}
                  whileHover={{ borderColor: '#FFFFFF' }}
                >
                  COMO CHEGAR
                </motion.a>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Google Maps */}
          <AnimateOnScroll direction="right">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                height: '560px',
                border: '1px solid #2E2E2E',
              }}
            >
              {/* Google Maps Embed */}
              <iframe
                title="Localização FORGEE Academia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8!2d-47.2!3d-23.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA2JzAwLjAiUyA0N8KwMTInMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'saturate(0.3) brightness(0.7) grayscale(0.3)',
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Dark overlay for better integration */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(17,17,17,0.4) 0%, transparent 40%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Floating pin badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  padding: '10px 16px',
                  border: '1px solid #E02020',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <MapPin size={16} style={{ color: '#E02020' }} />
                <span
                  style={{
                    fontFamily: "'Nimbus Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '1px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  FORGEE ACADEMIA
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
