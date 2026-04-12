import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { endOfDay, startOfDay, subDays, subMonths } from 'date-fns';
import {
  Search, Download, Sun, UserPlus, QrCode, Menu,
  User, Calendar, Users, Clock, Radio,
} from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { StudentAvatar } from '../components/StudentAvatar';
import { fetchCheckInsList, type CheckInUi } from '../../lib/forgeeApi';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_NIMBUS = "'Nimbus Sans', sans-serif";
const FONT_INTER  = "'Inter', sans-serif";
const FONT_MONO   = "'JetBrains Mono', monospace";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type PeriodoFiltro = 'hoje' | 'semana' | 'mes';

type CheckIn = CheckInUi;

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: 'em-dia' | 'vencendo' | 'atrasado' }) {
  const styles = {
    'em-dia':   'bg-[rgba(34,197,94,0.12)] text-[#22C55E]',
    'vencendo': 'bg-[rgba(250,204,21,0.12)] text-[#FACC15]',
    'atrasado': 'bg-[rgba(232,39,26,0.12)] text-[#E8271A]',
  };
  const labels = { 'em-dia': 'Em dia', 'vencendo': 'Vencendo', 'atrasado': 'Em atraso' };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] tracking-[0.4px] ${styles[status]}`}
      style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
    >
      {labels[status]}
    </span>
  );
}

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

/* ─── Metric Card ─────────────────────────────────────────────────────────── */
interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  subtitle: string;
}

function MetricCard({ icon, iconBg, label, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#1a1a1a] hover:border-[#303030] rounded-[14px] p-5 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <p
          className="text-[#606060] tracking-[0.6px] uppercase"
          style={{ fontFamily: FONT_MONO, fontSize: '10px' }}
        >
          {label}
        </p>
      </div>
      <p
        className="text-[#f2f2f2] leading-none mb-1.5"
        style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '34px' }}
      >
        {value}
      </p>
      <p
        className="text-[#606060]"
        style={{ fontFamily: FONT_INTER, fontSize: '13px' }}
      >
        {subtitle}
      </p>
    </div>
  );
}

/* ─── Check-in Row ────────────────────────────────────────────────────────── */
function CheckInItem({ checkIn, onClick }: { checkIn: CheckIn; onClick: () => void }) {
  return (
    <div
      className="bg-[#1a1a1a] border border-[#1a1a1a] hover:border-[#303030] rounded-[10px] p-4 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <StudentAvatar
          name={checkIn.aluno.nome}
          avatarUrl={checkIn.aluno.avatarUrl}
          initials={checkIn.aluno.initials}
          sizeClass="w-11 h-11"
          textClass="text-xs"
        />

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[#f2f2f2] truncate mb-1"
            style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '15px' }}
          >
            {checkIn.aluno.nome}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={checkIn.statusPagamento} />
            <span className="text-[#303030]">•</span>
            <PlanBadge plan={checkIn.plano} />
          </div>
        </div>

        {/* Date + time */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[#606060] group-hover:text-[#a8a8a8] transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            <span style={{ fontFamily: FONT_MONO, fontSize: '12px' }}>{checkIn.data}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#606060] group-hover:text-[#a8a8a8] transition-colors">
            <Clock className="w-3.5 h-3.5" />
            <span style={{ fontFamily: FONT_MONO, fontSize: '12px' }}>{checkIn.horario}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Period Tab ──────────────────────────────────────────────────────────── */
function PeriodTab({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-[8px] transition-all duration-200 ${
        active
          ? 'bg-[#E02020] text-white'
          : 'border border-[#303030] text-[#a8a8a8] hover:border-[#555] hover:text-[#f2f2f2]'
      }`}
      style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
    >
      {label.toUpperCase()}
    </button>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function CheckIns() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>('hoje');
  const [checkInsRaw, setCheckInsRaw] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await fetchCheckInsList();
      if (cancelled) return;
      if (error) setLoadError(error);
      else {
        setLoadError(null);
        setCheckInsRaw(data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const checkInsFiltrados = useMemo(() => {
    const now = new Date();
    let filtered = checkInsRaw.filter((c) => {
      if (periodoFiltro === 'hoje') {
        const s = startOfDay(now).getTime();
        const e = endOfDay(now).getTime();
        return c.timestamp >= s && c.timestamp <= e;
      }
      if (periodoFiltro === 'semana') {
        return c.timestamp >= subDays(now, 7).getTime();
      }
      return c.timestamp >= subMonths(now, 1).getTime();
    });
    if (searchTerm.trim()) {
      filtered = filtered.filter((c) =>
        c.aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [searchTerm, periodoFiltro, checkInsRaw]);

  const metricas = useMemo(() => {
    const now = new Date();
    const h0 = startOfDay(now).getTime();
    const h1 = endOfDay(now).getTime();
    const countHoje = checkInsRaw.filter((c) => c.timestamp >= h0 && c.timestamp <= h1).length;
    const ws = subDays(now, 7).getTime();
    const countSemana = checkInsRaw.filter((c) => c.timestamp >= ws).length;
    const ms = subMonths(now, 1).getTime();
    const countMes = checkInsRaw.filter((c) => c.timestamp >= ms).length;
    const buckets = new Map<number, number>();
    for (const c of checkInsRaw) {
      const h = new Date(c.timestamp).getHours();
      buckets.set(h, (buckets.get(h) ?? 0) + 1);
    }
    let bestH = -1;
    let bestC = 0;
    for (const [h, ct] of buckets) {
      if (ct > bestC) {
        bestC = ct;
        bestH = h;
      }
    }
    const pico =
      bestH >= 0
        ? `${String(bestH).padStart(2, '0')}–${String(Math.min(23, bestH + 1)).padStart(2, '0')}h`
        : '—';
    return { hoje: countHoje, semana: countSemana, mes: countMes, pico };
  }, [checkInsRaw]);

  const handleCheckInClick = (checkIn: CheckIn) => {
    navigate(`/dashboard/alunos/${checkIn.alunoId}`);
  };

  return (
    <div className="flex h-screen bg-[#111111] overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.header
          className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center gap-4 shrink-0"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="lg:hidden text-[#606060] hover:text-[#A8A8A8] transition-colors p-1"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 min-w-0">
            <h1
              className="text-[#f2f2f2] leading-none"
              style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '26px', letterSpacing: '-0.4px' }}
            >
              CHECK-INS
            </h1>
            <p
              className="text-[#606060] tracking-[0.5px] mt-0.5"
              style={{ fontFamily: FONT_MONO, fontSize: '10px' }}
            >
              HISTÓRICO E CONTROLE DE FREQUÊNCIA
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="w-9 h-9 rounded-[10px] border border-[#303030] flex items-center justify-center text-[#606060] hover:text-[#A8A8A8] hover:border-[#555] transition-all duration-200"
              aria-label="Tema"
            >
              <Sun size={16} />
            </button>

            <button
              onClick={() => navigate('/dashboard/novo-aluno')}
              className="hidden sm:flex items-center gap-2 border border-[#303030] text-[#A8A8A8] hover:border-[#E02020] hover:text-white rounded-[10px] px-3 py-2 transition-all duration-200"
              style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
            >
              <UserPlus size={13} />
              NOVO ALUNO
            </button>

            <button
              onClick={() => navigate('/dashboard/recepcao')}
              className="flex items-center gap-2 bg-[#E02020] hover:bg-[#E94040] text-white rounded-[10px] px-3 py-2 transition-all duration-200 hover:shadow-[0_0_16px_rgba(224,32,32,0.45)]"
              style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
            >
              <QrCode size={13} />
              <span className="hidden sm:inline">ATIVAR RECEPÇÃO</span>
              <span className="sm:hidden">RECEPÇÃO</span>
            </button>
          </div>
        </motion.header>

        {/* ── Scrollable Content ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5 max-w-[1400px] mx-auto">

            {/* KPI Cards */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <MetricCard
                icon={<User className="w-[18px] h-[18px] text-[#E02020]" />}
                iconBg="bg-[rgba(224,32,32,0.1)] border border-[rgba(224,32,32,0.2)]"
                label="Hoje"
                value={String(metricas.hoje)}
                subtitle="check-ins hoje"
              />
              <MetricCard
                icon={<Calendar className="w-[18px] h-[18px] text-[#22C55E]" />}
                iconBg="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]"
                label="Semana"
                value={String(metricas.semana)}
                subtitle="esta semana"
              />
              <MetricCard
                icon={<Users className="w-[18px] h-[18px] text-[#8B5CF6]" />}
                iconBg="bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]"
                label="Mês"
                value={String(metricas.mes)}
                subtitle="este mês"
              />
              <MetricCard
                icon={<Clock className="w-[18px] h-[18px] text-[#FF6B2B]" />}
                iconBg="bg-[rgba(255,107,43,0.1)] border border-[rgba(255,107,43,0.2)]"
                label="Pico"
                value={metricas.pico}
                subtitle="horário de pico"
              />
            </motion.div>

            {/* Histórico panel */}
            <motion.div
              className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[14px] p-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Panel header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <h2
                  className="text-[#f2f2f2] tracking-tight"
                  style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '18px' }}
                >
                  HISTÓRICO DE CHECK-INS
                </h2>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Período tabs */}
                  <div className="flex gap-1.5">
                    <PeriodTab label="Hoje"   active={periodoFiltro === 'hoje'}   onClick={() => setPeriodoFiltro('hoje')}   />
                    <PeriodTab label="Semana" active={periodoFiltro === 'semana'} onClick={() => setPeriodoFiltro('semana')} />
                    <PeriodTab label="Mês"    active={periodoFiltro === 'mes'}    onClick={() => setPeriodoFiltro('mes')}    />
                  </div>

                  {/* Download */}
                  <button
                    className="flex items-center gap-2 border border-[#303030] text-[#A8A8A8] hover:border-[#E02020] hover:text-white rounded-[10px] px-3 py-2 transition-all duration-200"
                    style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
                  >
                    <Download size={13} />
                    <span className="hidden sm:inline">BAIXAR RELATÓRIO</span>
                    <span className="sm:hidden">BAIXAR</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606060]" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por nome do aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#1a1a1a] focus:border-[#E02020] rounded-[10px] pl-11 pr-4 py-3 text-[#f2f2f2] placeholder:text-[#606060] focus:outline-none transition-colors"
                  style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
                />
              </div>

              {/* Count label */}
              <p
                className="text-[#606060] mb-4"
                style={{ fontFamily: FONT_MONO, fontSize: '10px', letterSpacing: '0.5px' }}
              >
                {checkInsFiltrados.length} REGISTRO{checkInsFiltrados.length !== 1 ? 'S' : ''}
              </p>

              {/* List */}
              <div className="space-y-2">
                {loading && (
                  <p className="text-[#606060] text-center py-10" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                    Carregando check-ins…
                  </p>
                )}
                {loadError && !loading && (
                  <p className="text-[#E8271A] text-center py-10 text-sm" style={{ fontFamily: FONT_INTER }}>
                    {loadError}
                  </p>
                )}
                {!loading && !loadError && checkInsFiltrados.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-[#606060]" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                      Nenhum check-in encontrado.
                    </p>
                  </motion.div>
                ) : !loading && !loadError ? (
                  checkInsFiltrados.map((checkIn, index) => (
                    <motion.div
                      key={checkIn.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.2 + index * 0.03 }}
                    >
                      <CheckInItem
                        checkIn={checkIn}
                        onClick={() => handleCheckInClick(checkIn)}
                      />
                    </motion.div>
                  ))
                ) : null}
              </div>
            </motion.div>

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
