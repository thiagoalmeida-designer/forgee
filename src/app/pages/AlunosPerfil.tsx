import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft, MessageCircle, Edit, Mail, Phone,
  CreditCard, Calendar, Clock, Activity, Menu
} from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { StudentAvatar } from '../components/StudentAvatar';
import { fetchAlunoPerfil, type AlunoPerfilUi } from '../../lib/forgeeApi';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_NIMBUS = "'Nimbus Sans', sans-serif";
const FONT_INTER = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface Pagamento {
  id: string;
  data: string;
  valor: string;
  metodo: 'Boleto' | 'PIX' | 'Cartão' | 'Dinheiro';
  status: 'pago' | 'atrasado' | 'pendente';
}

type AlunoDetalhado = AlunoPerfilUi;

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function PlanBadge({ plan }: { plan: string }) {
  const p = plan.toUpperCase();
  const styles: Record<string, string> = {
    BASIC: 'text-[#A8A8A8] border-[rgba(168,168,168,0.3)]',
    PREMIUM: 'text-[#E02020] border-[rgba(224,32,32,0.35)]',
    ELITE: 'text-[#8B5CF6] border-[rgba(139,92,246,0.35)]',
  };
  const cls = styles[p] ?? 'text-[#A8A8A8] border-[rgba(168,168,168,0.3)]';

  return (
    <span
      className={`border px-2 py-0.5 rounded text-[10px] tracking-[0.8px] ${cls}`}
      style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
    >
      {plan}
    </span>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: boolean;
}

function InfoCard({ icon, label, value, badge }: InfoCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span
          className="text-[#606060] uppercase tracking-[0.6px]"
          style={{ fontFamily: FONT_INTER, fontSize: '12px' }}
        >
          {label}
        </span>
      </div>

      {badge ? (
        <PlanBadge plan={value as 'BASIC' | 'PREMIUM' | 'ELITE'} />
      ) : (
        <p className="text-[#f2f2f2]" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
          {value}
        </p>
      )}
    </div>
  );
}

interface StatusPagamentoBadgeProps {
  status: 'pago' | 'atrasado' | 'pendente';
}

function StatusPagamentoBadge({ status }: StatusPagamentoBadgeProps) {
  const styles = {
    pago: 'bg-[rgba(34,197,94,0.12)] text-[#22C55E]',
    atrasado: 'bg-[rgba(232,39,26,0.12)] text-[#E8271A]',
    pendente: 'bg-[rgba(250,204,21,0.12)] text-[#FACC15]',
  };

  const labels = {
    pago: 'Pago',
    atrasado: 'Atrasado',
    pendente: 'Pendente',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export function AlunosPerfil() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aluno, setAluno] = useState<AlunoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setAluno(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await fetchAlunoPerfil(id);
      if (cancelled) return;
      if (error) setLoadError(error);
      else setLoadError(null);
      setAluno(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#111111] overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center text-[#606060]" style={{ fontFamily: FONT_INTER }}>
          Carregando perfil…
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#E8271A] mb-4" style={{ fontFamily: FONT_INTER, fontSize: '16px' }}>
            {loadError}
          </p>
          <Link to="/dashboard/alunos" className="text-[#E02020] hover:text-[#E94040] transition-colors" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#606060] mb-4" style={{ fontFamily: FONT_INTER, fontSize: '16px' }}>
            Aluno não encontrado
          </p>
          <Link
            to="/dashboard/alunos"
            className="text-[#E02020] hover:text-[#E94040] transition-colors"
            style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
          >
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const phone = aluno.celular.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${aluno.nome.split(' ')[0]}! Aqui é da FORGEE Academy.`);
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-[#111111] overflow-hidden">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-[900px] mx-auto">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-[#606060] hover:text-[#A8A8A8] transition-colors p-1"
                aria-label="Abrir menu"
              >
                <Menu size={22} />
              </button>
            </div>
            {/* Botão Voltar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/dashboard/alunos"
                className="inline-flex items-center gap-2 text-[#a8a8a8] hover:text-[#f2f2f2] transition-colors"
              >
                <ChevronLeft size={18} />
                <span style={{ fontFamily: FONT_INTER, fontSize: '16px', fontWeight: 500 }}>
                  Voltar para lista
                </span>
              </Link>
            </motion.div>

            {/* Header do Perfil */}
            <motion.div
              className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                {/* Informações do Aluno */}
                <div className="flex items-center gap-4">
                  <StudentAvatar
                    name={aluno.nome}
                    avatarUrl={aluno.avatarUrl}
                    initials={aluno.initials}
                    sizeClass="w-16 h-16"
                    textClass="text-lg"
                  />

                  <div>
                    <h1
                      className="text-[#f2f2f2] leading-none mb-1"
                      style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '24px', letterSpacing: '-0.6px' }}
                    >
                      {aluno.nome}
                    </h1>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={
                          aluno.statusAtivo
                            ? 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] px-2.5 py-1 rounded-full'
                            : 'bg-[rgba(168,168,168,0.12)] text-[#A8A8A8] px-2.5 py-1 rounded-full'
                        }
                        style={{ fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 500 }}
                      >
                        {aluno.statusAtivo ? 'ATIVO' : 'INATIVO'}
                      </span>

                      {aluno.statusPagamento === 'atrasado' && (
                        <span
                          className="bg-[rgba(232,39,26,0.1)] text-[#E8271A] px-2.5 py-1 rounded-full"
                          style={{ fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 500 }}
                        >
                          Em atraso
                        </span>
                      )}
                      {aluno.statusPagamento === 'vencendo' && (
                        <span
                          className="bg-[rgba(250,204,21,0.12)] text-[#FACC15] px-2.5 py-1 rounded-full"
                          style={{ fontFamily: FONT_INTER, fontSize: '12px', fontWeight: 500 }}
                        >
                          Vencendo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-[10px] hover:bg-[#1fb855] transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span style={{ fontFamily: FONT_INTER, fontSize: '14px', fontWeight: 500 }}>
                      WhatsApp
                    </span>
                  </button>

                  <button className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-[#303030] text-[#606060] hover:text-[#a8a8a8] hover:border-[#555] transition-all">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <InfoCard
                  icon={<Mail size={16} className="text-[#606060]" />}
                  label="EMAIL"
                  value={aluno.email}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <InfoCard
                  icon={<Phone size={16} className="text-[#606060]" />}
                  label="TELEFONE"
                  value={aluno.celular}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <InfoCard
                  icon={<CreditCard size={16} className="text-[#606060]" />}
                  label="PLANO"
                  value={aluno.plano}
                  badge
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <InfoCard
                  icon={<Calendar size={16} className="text-[#606060]" />}
                  label="DATA DE INÍCIO"
                  value={aluno.dataInicio}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <InfoCard
                  icon={<Clock size={16} className="text-[#606060]" />}
                  label="ÚLTIMO CHECK-IN"
                  value={aluno.ultimoCheckin}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <InfoCard
                  icon={<Activity size={16} className="text-[#606060]" />}
                  label="TOTAL DE CHECK-INS"
                  value={aluno.totalCheckins.toString()}
                />
              </motion.div>
            </div>

            {/* Histórico de Pagamentos */}
            {aluno.pagamentos.length > 0 && (
              <motion.div
                className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <h2
                  className="uppercase mb-4"
                  style={{
                    fontFamily: FONT_NIMBUS,
                    fontWeight: 700,
                    fontSize: '20px',
                    letterSpacing: '-0.5px',
                    color: '#f2f2f2',
                  }}
                >
                  Histórico de Pagamentos
                </h2>

                <div className="space-y-3">
                  {aluno.pagamentos.map((pagamento) => (
                    <div
                      key={pagamento.id}
                      className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] p-4 flex items-center justify-between hover:border-[#444] transition-colors"
                    >
                      <div>
                        <p
                          className="text-[#f2f2f2] font-medium mb-1"
                          style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
                        >
                          {pagamento.data}
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusPagamentoBadge status={pagamento.status} />
                          <span className="text-[#606060] text-xs">•</span>
                          <span className="text-[#606060] text-xs">{pagamento.metodo}</span>
                        </div>
                      </div>

                      <p
                        className="text-[#f2f2f2] font-medium"
                        style={{ fontFamily: FONT_INTER, fontSize: '16px' }}
                      >
                        R$ {pagamento.valor}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
