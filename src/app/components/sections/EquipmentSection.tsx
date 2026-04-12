import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimateOnScroll, SectionLabel } from '../AnimateOnScroll';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import imgGymEquipment from '../../../imports/image-4.png';

const categories = [
  {
    id: 'cardio',
    num: '01',
    name: 'CARDIO & CONDITIONING',
    items: [
      'Assault Bike Concept2 — 8 UNIDADES',
      'Remo Concept2 Model D — 6 UNIDADES',
      'SkiErg Concept2 — 4 UNIDADES',
      'Esteiras NordicTrack com inclinação negativa',
      'Cordas de batalha 15m e 20m',
    ],
  },
  {
    id: 'forca',
    num: '02',
    name: 'FORÇA LIVRE',
    items: [
      'Barras olímpicas de competição — 10 unidades',
      'Anilhas borrachadas de 1.25 a 25kg',
      'Power rack com pull-up bar — 6 estações',
      'Halteres de 2 a 60kg',
      'Barras retas, EZ e hexagonal',
    ],
  },
  {
    id: 'maquinas',
    num: '03',
    name: 'MÁQUINAS',
    items: [
      'Pec Deck, Fly e Crossover com polia dupla',
      'Leg press 45°, Cadeira extensora e Flexora',
      'Pulley alto e baixo — pesos seletor',
      'Smith machine com barra counterbalanced',
      'Hack squat e Glúteo isolador',
    ],
  },
  {
    id: 'funcional',
    num: '04',
    name: 'FUNCIONAL & MOBILITY',
    items: [
      'Kettlebells de 8 a 48kg — linha completa',
      'Medicina balls de 3 a 12kg',
      'TRX e anéis de ginástica',
      'Colchões de yoga e foam rollers',
      'Bandas de resistência e faixas elásticas',
    ],
  },
  {
    id: 'infra',
    num: '05',
    name: 'INFRAESTRUTURA',
    items: [
      '1.800m² de área útil climatizada',
      'Vestiários premium com duchas individuais',
      'Armários com fechadura digital',
      'Estacionamento coberto — 60 vagas',
      'Bebedouros com água gelada e temperatura',
    ],
  },
];

export function EquipmentSection() {
  const [activeCategory, setActiveCategory] = useState('cardio');
  const active = categories.find((c) => c.id === activeCategory)!;

  return (
    <section
      id="estrutura"
      style={{ backgroundColor: '#0A0A0A', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Heading + description + category list */}
          <div>
            <AnimateOnScroll direction="left">
              <SectionLabel>Estrutura</SectionLabel>
              <div
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 6.5vw, 80px)',
                  letterSpacing: '-2px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  lineHeight: 0.9,
                  marginBottom: '24px',
                }}
              >
                <div>EQUIPAMENTO</div>
                <div>QUE NÃO TE</div>
                <div>LIMITA.</div>
              </div>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#888888',
                  lineHeight: 1.65,
                  maxWidth: '420px',
                  marginBottom: '48px',
                }}
              >
                Cada peça selecionada com um critério: aguentar seu melhor dia todos os dias.
              </p>
            </AnimateOnScroll>

            {/* Category tabs */}
            <AnimateOnScroll delay={0.1}>
              <div className="flex flex-col gap-0">
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex items-center gap-4 text-left w-full py-4"
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #1A1A1A',
                      cursor: 'pointer',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                  >
                    <span
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '11px',
                        letterSpacing: '1.5px',
                        color: activeCategory === cat.id ? '#E02020' : '#444444',
                        textTransform: 'uppercase',
                        minWidth: '28px',
                        transition: 'color 0.2s',
                      }}
                    >
                      {cat.num}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '15px',
                        letterSpacing: '1.2px',
                        color: activeCategory === cat.id ? '#FFFFFF' : '#555555',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s',
                        flex: 1,
                      }}
                    >
                      {cat.name}
                    </span>
                    {activeCategory === cat.id && (
                      <motion.div
                        style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E02020' }}
                        layoutId="activeDot"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Image + equipment list */}
          <div className="flex flex-col gap-8">
            {/* Equipment image */}
            <AnimateOnScroll direction="right">
              <div className="relative" style={{ height: '320px' }}>
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ filter: 'saturate(0.2)' }}
                >
                  <ImageWithFallback
                    src={imgGymEquipment}
                    alt="Equipamentos FORGEE"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(0deg, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0) 60%)',
                    }}
                  />
                </div>
              </div>
            </AnimateOnScroll>

            {/* Equipment list */}
            <AnimateOnScroll delay={0.15}>
              <div
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #2E2E2E',
                  padding: '32px',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      style={{
                        fontFamily: "'Nimbus Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: '20px',
                        letterSpacing: '1px',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        marginBottom: '20px',
                        borderBottom: '1px solid #2E2E2E',
                        paddingBottom: '16px',
                      }}
                    >
                      {active.num} · {active.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {active.items.map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <div
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: '#E02020',
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'Barlow', sans-serif",
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#AAAAAA',
                            }}
                          >
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}