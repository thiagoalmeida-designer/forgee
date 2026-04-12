import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100svh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          style={{
            fontFamily: "'Nimbus Sans', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(80px, 15vw, 160px)',
            letterSpacing: '-5px',
            color: '#1A1A1A',
            lineHeight: 1,
            marginBottom: '8px',
          }}
        >
          404
        </div>
        <div
          style={{
            fontFamily: "'Nimbus Sans', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 42px)',
            letterSpacing: '-1px',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Página não encontrada.
        </div>
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 400,
            fontSize: '15px',
            color: '#666666',
            marginBottom: '40px',
            lineHeight: 1.65,
          }}
        >
          Essa página não existe ou foi movida.
        </p>
        <motion.button
          onClick={() => navigate('/')}
          style={{
            fontFamily: "'Nimbus Sans', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '1.5px',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            backgroundColor: '#E02020',
            border: 'none',
            padding: '14px 28px',
            cursor: 'pointer',
          }}
          whileHover={{ backgroundColor: '#E94040' }}
        >
          VOLTAR PARA O INÍCIO
        </motion.button>
      </motion.div>
    </div>
  );
}
