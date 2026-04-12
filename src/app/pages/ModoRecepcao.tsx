import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { supabase } from '../../lib/supabase';
import {
  X, Hash, Mail, Search, Lock
} from 'lucide-react';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_NIMBUS = "'Nimbus Sans', sans-serif";
const FONT_INTER  = "'Inter', sans-serif";
const FONT_MONO   = "'JetBrains Mono', monospace";

/* ─── Logo ──────────────────────────────────────────────────────────────────── */
function ForgeeLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[#E02020] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(224,32,32,0.4)]">
        <span style={{ fontFamily: FONT_NIMBUS, fontWeight: 900, fontSize: '13px', color: '#fff' }}>F</span>
      </div>
      <p className="text-white leading-none" style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
        MODO RECEPÇÃO ATIVO
      </p>
    </div>
  );
}

/* ─── Password Modal ────────────────────────────────────────────────────────── */
interface PasswordModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function PasswordModal({ onConfirm, onCancel }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_RECEPCAO_EXIT_PIN ?? '1234';
    if (password === expected) {
      onConfirm();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6 w-full max-w-md mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(224,32,32,0.1)] border border-[rgba(224,32,32,0.2)] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#E02020]" />
          </div>
          <div>
            <h2
              className="text-[#f2f2f2]"
              style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px' }}
            >
              Confirmar Saída
            </h2>
            <p
              className="text-[#606060]"
              style={{ fontFamily: FONT_MONO, fontSize: '10px', letterSpacing: '0.6px' }}
            >
              DIGITE A SENHA PARA SAIR
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha..."
              autoFocus
              className={`w-full bg-[#1a1a1a] border ${
                error ? 'border-[#E8271A]' : 'border-[#303030]'
              } focus:border-[#E02020] rounded-[10px] px-4 py-3 text-[#f2f2f2] placeholder:text-[#606060] focus:outline-none transition-colors`}
              style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
            />
            {error && (
              <p
                className="text-[#E8271A] mt-2"
                style={{ fontFamily: FONT_MONO, fontSize: '11px' }}
              >
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-[#303030] text-[#A8A8A8] hover:border-[#555] hover:text-[#f2f2f2] rounded-[10px] px-4 py-2.5 transition-all duration-200"
              style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#E02020] hover:bg-[#E94040] text-white rounded-[10px] px-4 py-2.5 transition-all duration-200 hover:shadow-[0_0_16px_rgba(224,32,32,0.45)]"
              style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
            >
              CONFIRMAR
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function ModoRecepcao() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<'codigo' | 'email'>('codigo');
  const [searchValue, setSearchValue] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPasswordModal(true);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setShowPasswordModal(true);
  };

  const handleConfirmExit = () => {
    navigate('/dashboard');
  };

  const handleDemoQR = async () => {
    const token = import.meta.env.VITE_DEMO_QR_TOKEN;
    if (!token) {
      window.alert(
        'Defina VITE_DEMO_QR_TOKEN no .env com o qrToken de um aluno de teste para simular check-in.',
      );
      return;
    }
    const { data, error } = await supabase.rpc('register_checkin_por_qr', {
      p_token: token,
      p_tipo: 'NORMAL',
    });
    if (error) {
      window.alert(error.message);
      return;
    }
    window.alert(`Check-in registrado (id: ${data ?? 'ok'})`);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#090909] z-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-[rgba(13,13,13,0.5)] border-b border-black px-4 py-3 flex items-center justify-between shrink-0">
          <ForgeeLogo />
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center text-[#f2f2f2] hover:text-white opacity-50 hover:opacity-100 transition-all duration-200"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
          <motion.div
            className="w-full max-w-[600px] space-y-9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <div className="text-center space-y-2">
              <h1
                className="text-[#f2f2f2] leading-none"
                style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '60px', letterSpacing: '-1.5px' }}
              >
                APROXIME O QR CODE
              </h1>
              <p
                className="text-[#a8a8a8]"
                style={{ fontFamily: FONT_INTER, fontSize: '20px' }}
              >
                ou digite seu código de membro / email
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <motion.div
                className="bg-[#0d0d0d] border-[3.75px] border-[#303030] rounded-[10px] p-12 inline-flex"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <QRCode
                  value={`${import.meta.env.VITE_APP_URL ?? window.location.origin}/checkin`}
                  size={256}
                  bgColor="#0d0d0d"
                  fgColor="#303030"
                  level="M"
                />
              </motion.div>
            </div>

            {/* Search Mode Toggle */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setSearchMode('codigo')}
                className={`flex items-center gap-2 rounded-[10px] px-4 py-2 transition-all duration-200 ${
                  searchMode === 'codigo'
                    ? 'bg-[#E8271A] text-white'
                    : 'bg-[#1a1a1a] text-[#606060] hover:bg-[#222]'
                }`}
                style={{ fontFamily: FONT_MONO, fontSize: '12px', letterSpacing: '0.6px', fontWeight: 500 }}
              >
                <Hash size={16} />
                CÓDIGO
              </button>
              <button
                onClick={() => setSearchMode('email')}
                className={`flex items-center gap-2 rounded-[10px] px-4 py-2 transition-all duration-200 ${
                  searchMode === 'email'
                    ? 'bg-[#E8271A] text-white'
                    : 'bg-[#1a1a1a] text-[#606060] hover:bg-[#222]'
                }`}
                style={{ fontFamily: FONT_MONO, fontSize: '12px', letterSpacing: '0.6px', fontWeight: 500 }}
              >
                <Mail size={16} />
                EMAIL
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606060]" size={20} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchMode === 'codigo' ? 'Digite o código...' : 'Digite o email...'}
                  className="w-full bg-[#0d0d0d] border border-[#303030] focus:border-[#E02020] rounded-[14px] pl-12 pr-4 py-3 text-[#f2f2f2] placeholder:text-[#606060] focus:outline-none transition-colors"
                  style={{ fontFamily: FONT_INTER, fontSize: '16px' }}
                />
              </div>
              <p
                className="text-[#606060] text-center"
                style={{ fontFamily: FONT_MONO, fontSize: '12px', letterSpacing: '0.6px' }}
              >
                Ex: 12345
              </p>
            </div>

            {/* Demo Button */}
            <button
              onClick={handleDemoQR}
              className="w-full bg-[#1a1a1a] border border-[#303030] hover:border-[#555] text-[#606060] hover:text-[#f2f2f2] rounded-[14px] py-3 transition-all duration-200"
              style={{ fontFamily: FONT_MONO, fontSize: '14px', letterSpacing: '1.4px', fontWeight: 500 }}
            >
              SIMULAR QR CODE (DEMO)
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-[rgba(13,13,13,0.5)] border-t border-[#303030] px-6 py-3 flex items-center justify-between shrink-0 text-[#606060]">
          <p
            className="opacity-70"
            style={{ fontFamily: FONT_MONO, fontSize: '12px', letterSpacing: '0.6px' }}
          >
            SCANNER QR CODE ATIVO • VALIDAÇÃO AUTOMÁTICA • ENTRADA MANUAL DISPONÍVEL
          </p>
          <p
            className="opacity-70"
            style={{ fontFamily: FONT_MONO, fontSize: '12px', letterSpacing: '0.6px' }}
          >
            PRESSIONE ESC PARA VOLTAR
          </p>
        </div>
      </motion.div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordModal
            onConfirm={handleConfirmExit}
            onCancel={() => setShowPasswordModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
