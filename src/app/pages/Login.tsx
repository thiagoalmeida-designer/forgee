import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { session, signIn } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setAuthError(error);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col">
      {/* Header */}
      <motion.header
        className="border-b border-[#1a1a1a] py-4 md:py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#1a1a1a] flex items-center justify-center">
              <span
                style={{
                  fontFamily: "'Nimbus Sans', sans-serif",
                  fontWeight: 900,
                  fontSize: '14px',
                  color: '#E02020',
                }}
              >
                F
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Nimbus Sans', sans-serif",
                fontWeight: 900,
                fontSize: '24px',
                letterSpacing: '-0.5px',
                color: '#FFFFFF',
              }}
            >
              FORGEE
            </span>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <motion.div
          className="w-full max-w-[440px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-[rgba(224,32,32,0.1)] border border-[rgba(224,32,32,0.2)] flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#E02020]" strokeWidth={2} />
            </div>
          </div>

          {/* Heading */}
          <h1
            className="text-center mb-4"
            style={{
              fontFamily: "'Nimbus Sans', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 48px)',
              letterSpacing: '-1.2px',
              color: '#F2F2F2',
              lineHeight: 1,
            }}
          >
            PAINEL ADMIN
          </h1>

          {/* Subtitle */}
          <p
            className="text-center mb-12"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: '16px',
              color: '#A8A8A8',
              lineHeight: 1.5,
            }}
          >
            Acesso restrito ao sistema de gestão{' '}
            <span style={{ color: '#E02020' }}>FORGEE</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  fontSize: '12px',
                  letterSpacing: '1.2px',
                  color: '#A8A8A8',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#606060]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@forgee.com"
                  className="w-full bg-[#0d0d0d] border border-[#303030] rounded-[10px] pl-12 pr-4 py-3.5 text-[#F2F2F2] placeholder:text-[#606060] focus:border-[#E02020] focus:outline-none transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  fontSize: '12px',
                  letterSpacing: '1.2px',
                  color: '#A8A8A8',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#606060]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d0d0d] border border-[#303030] rounded-[10px] pl-12 pr-12 py-3.5 text-[#F2F2F2] placeholder:text-[#606060] focus:border-[#E02020] focus:outline-none transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#A8A8A8] transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <p
                className="text-[#E8271A] text-sm text-center"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {authError}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E02020] hover:bg-[#E94040] disabled:opacity-60 rounded-[10px] py-4 flex items-center justify-center gap-2 transition-colors group"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: '14px',
                letterSpacing: '1.4px',
                color: '#F2F2F2',
                textTransform: 'uppercase',
              }}
            >
              <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {submitting ? 'Entrando…' : 'Acessar Painel'}
            </button>
          </form>

          {/* Footer */}
          <div className="space-y-4 text-center">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                letterSpacing: '0.6px',
                color: '#606060',
              }}
            >
              ACESSO EXCLUSIVO PARA ADMINISTRADORES
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#606060] hover:text-[#A8A8A8] transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para área do membro
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(224,32,32,0.05)] to-transparent pointer-events-none" />
    </div>
  );
}