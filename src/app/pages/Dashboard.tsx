import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  LayoutDashboard, Users, ClipboardCheck,
  Radio, Settings, LogOut, Sun,
  ChevronDown, TrendingUp, ArrowRight,
  UserPlus, Menu, ChevronRight, Filter,
  UserCheck, UserX, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { StudentAvatar } from '../components/StudentAvatar';
import { fetchDashboardData, type DashboardData } from '../../lib/forgeeApi';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_BARLOW = "'Nimbus Sans', sans-serif";
const FONT_INTER = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

/* ─── Counter animation hook ─────────────────────────────────────────────────── */
function useCounterAnimation(target: number, duration = 1600, delay = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [inView, target, duration, delay]);

  return { count, ref };
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: '/dashboard' },
  { icon: Users,            label: 'Alunos',         path: '/dashboard/alunos' },
  { icon: ClipboardCheck,   label: 'Check-ins',      path: '/dashboard/checkins' },
  { icon: Radio,            label: 'Modo Recepção',  path: '/dashboard/recepcao' },
  { icon: Settings,         label: 'Configurações',  path: '/dashboard/configuracoes' },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function PlanBadge({ plan }: { plan: string }) {
  const p = plan.toUpperCase();
  const map: Record<string, string> = {
    PREMIUM: 'text-[#E02020] border-[rgba(224,32,32,0.35)]',
    BASIC: 'text-[#A8A8A8] border-[rgba(168,168,168,0.3)]',
    ELITE: 'text-[#8B5CF6] border-[rgba(139,92,246,0.35)]',
  };
  const cls = map[p] ?? 'text-[#A8A8A8] border-[rgba(168,168,168,0.3)]';
  return (
    <span
      className={`border px-2 py-0.5 rounded text-[10px] tracking-[0.8px] ${cls}`}
      style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  const map: Record<string, string> = {
    green:  'bg-[rgba(74,222,128,0.12)]  text-[#4ADE80]',
    yellow: 'bg-[rgba(250,204,21,0.12)]  text-[#FACC15]',
    red:    'bg-[rgba(232,39,26,0.12)]   text-[#E8271A]',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] tracking-[0.4px] ${map[color] ?? map.green}`}
      style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
    >
      {status}
    </span>
  );
}

/* ─── KPI Card ──────────────────────────────────────────────────────────────── */
interface KPICardProps {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  description: string;
  iconBg: string;
  iconBorder: string;
  icon: React.ReactNode;
  delay?: number;
}

function KPICard({ label, value, decimals = 0, suffix, description, iconBg, iconBorder, icon, delay = 0 }: KPICardProps) {
  const intTarget = decimals > 0 ? Math.round(value * Math.pow(10, decimals)) : Math.round(value);
  const { count, ref } = useCounterAnimation(intTarget, 1600, delay);
  const displayValue = decimals > 0
    ? (count / Math.pow(10, decimals)).toFixed(decimals)
    : count;

  return (
    <motion.div
      ref={ref}
      className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6 flex flex-col gap-5 hover:border-[#444] transition-colors duration-300"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="rounded-[10px] p-2.5 flex items-center justify-center"
          style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
        >
          {icon}
        </div>
        <span className="text-[#606060] text-[11px] tracking-[0.8px]" style={{ fontFamily: FONT_MONO }}>
          {label}
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="text-[#f2f2f2] leading-none"
            style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '38px' }}
          >
            {displayValue}
          </span>
          {suffix && (
            <span className="text-[#606060] text-[15px]" style={{ fontFamily: FONT_INTER }}>
              {suffix}
            </span>
          )}
        </div>
        <p className="text-[#a8a8a8] text-[13px] leading-snug" style={{ fontFamily: FONT_INTER }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Chart Tooltip ─────────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-4 py-3 shadow-lg">
      <p className="text-[#606060] text-[11px] mb-1 tracking-[0.4px]" style={{ fontFamily: FONT_MONO }}>{label}</p>
      <p style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '24px', color: '#f2f2f2', lineHeight: 1 }}>
        {payload[0].value}
        <span className="text-[#A8A8A8] ml-1" style={{ fontSize: '14px', fontFamily: FONT_INTER, fontWeight: 400 }}>membros</span>
      </p>
    </div>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────────────────── */
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a1a1a] shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[#E02020] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(224,32,32,0.4)]">
            <span style={{ fontFamily: FONT_BARLOW, fontWeight: 900, fontSize: '14px', color: '#fff' }}>F</span>
          </div>
          <div>
            <p className="text-white leading-none" style={{ fontFamily: FONT_BARLOW, fontWeight: 900, fontSize: '20px', letterSpacing: '-0.3px' }}>
              FORGEE
            </p>
            <p className="text-[#606060] mt-0.5 tracking-[1.2px]" style={{ fontFamily: FONT_MONO, fontSize: '9px' }}>
              ADMIN PANEL
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, i) => {
            const active = item.path === currentPath;
            const Icon = item.icon;
            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.35, ease: 'easeOut' }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 group ${
                    active
                      ? 'bg-[#E02020] text-white shadow-[0_0_12px_rgba(224,32,32,0.25)]'
                      : 'text-[#A8A8A8] hover:bg-[#1a1a1a] hover:text-[#f2f2f2]'
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.6} className="shrink-0" />
                  <span style={{ fontFamily: FONT_INTER, fontWeight: active ? 500 : 400, fontSize: '14px' }}>
                    {item.label}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Admin + Logout */}
      <div className="p-3 border-t border-[#1a1a1a] shrink-0">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-8 h-8 rounded-full bg-[#E02020] flex items-center justify-center shrink-0">
            <span style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '14px', color: '#fff' }}>A</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#f2f2f2] truncate" style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '13px' }}>
              Admin FORGEE
            </p>
            <p className="text-[#606060] tracking-[0.8px]" style={{ fontFamily: FONT_MONO, fontSize: '9px', marginTop: '2px' }}>
              GESTOR
            </p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 px-3 py-2 text-[#606060] hover:text-[#A8A8A8] rounded-[10px] hover:bg-[#1a1a1a] transition-all duration-200"
        >
          <LogOut size={15} />
          <span style={{ fontFamily: FONT_INTER, fontSize: '13px' }}>Sair</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[200px] shrink-0 bg-[#0a0a0a] border-r border-[#1a1a1a] h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-[220px] bg-[#0a0a0a] border-r border-[#1a1a1a] z-50 lg:hidden"
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────────────────────── */
export function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const gradientId = useRef(`gradient-${Math.random().toString(36).substr(2, 9)}`);
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDashLoading(true);
      const { data, error } = await fetchDashboardData();
      if (cancelled) return;
      if (error) setDashError(error);
      else setDashError(null);
      setDash(data);
      setDashLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = dash?.chartData ?? [];
  const students = dash?.ultimosCheckins ?? [];
  const turistas = dash?.turistas ?? [];

  const today = new Date();
  const DAYS    = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
  const MONTHS  = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const dateStr = `${DAYS[today.getDay()]}, ${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <div className="flex h-screen bg-[#111111] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <motion.header
          className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-5 py-4 flex items-center gap-4 shrink-0"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="lg:hidden text-[#606060] hover:text-[#A8A8A8] transition-colors p-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-[#f2f2f2] leading-none" style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '26px', letterSpacing: '-0.4px' }}>
              DASHBOARD
            </h1>
            <p className="text-[#606060] tracking-[0.5px] mt-0.5" style={{ fontFamily: FONT_MONO, fontSize: '10px' }}>
              VISÃO GERAL — {dateStr}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="w-9 h-9 rounded-[10px] border border-[#303030] flex items-center justify-center text-[#606060] hover:text-[#A8A8A8] hover:border-[#555] transition-all duration-200" aria-label="Tema">
              <Sun size={16} />
            </button>

            <Link
              to="/dashboard/novo-aluno"
              className="hidden sm:flex items-center gap-2 border border-[#303030] text-[#A8A8A8] hover:border-[#E02020] hover:text-white rounded-[10px] px-3 py-2 transition-all duration-200"
              style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
            >
              <UserPlus size={13} />
              NOVO ALUNO
            </Link>

            <button
              onClick={() => navigate('/dashboard/recepcao')}
              className="flex items-center gap-2 bg-[#E02020] hover:bg-[#E94040] text-white rounded-[10px] px-3 py-2 transition-all duration-200 hover:shadow-[0_0_16px_rgba(224,32,32,0.45)]"
              style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
            >
              <Radio size={13} />
              <span className="hidden sm:inline">ATIVAR RECEPÇÃO</span>
              <span className="sm:hidden">RECEPÇÃO</span>
            </button>
          </div>
        </motion.header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6 space-y-5 max-w-[1400px] mx-auto">
            {dashLoading && (
              <p className="text-[#606060] text-sm" style={{ fontFamily: FONT_INTER }}>
                Carregando dados do painel…
              </p>
            )}
            {dashError && !dashLoading && (
              <p className="text-[#E8271A] text-sm" style={{ fontFamily: FONT_INTER }}>
                {dashError}
              </p>
            )}

            {/* Filters */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              <Filter size={14} className="text-[#606060]" />
              {['Mês', 'Ativos'].map((label) => (
                <button
                  key={label}
                  className="flex items-center gap-2 bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-3 py-2 text-[#A8A8A8] hover:border-[#555] transition-colors"
                >
                  <span style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>{label}</span>
                  <ChevronDown size={15} />
                </button>
              ))}
            </motion.div>

            {/* KPI Cards: só monta após `dash` para o contador não travar em 0 durante o loading */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {!dashLoading && dash && (
                <>
              <KPICard
                label="ATIVOS"
                value={dash.kpis.ativos}
                description="Alunos ativos"
                iconBg="rgba(74,222,128,0.1)"
                iconBorder="rgba(74,222,128,0.2)"
                icon={<UserCheck size={18} className="text-[#4ADE80]" />}
                delay={0}
              />
              <KPICard
                label="INATIVOS"
                value={dash.kpis.inativos}
                description="Alunos inativos na base"
                iconBg="rgba(250,204,21,0.1)"
                iconBorder="rgba(250,204,21,0.2)"
                icon={<UserX size={18} className="text-[#FACC15]" />}
                delay={100}
              />
              <KPICard
                label="HOJE"
                value={dash.kpis.checkinsHoje}
                description="Check-ins hoje"
                iconBg="rgba(232,39,26,0.1)"
                iconBorder="rgba(232,39,26,0.2)"
                icon={<ClipboardCheck size={18} className="text-[#E02020]" />}
                delay={200}
              />
              <KPICard
                label="FREQUÊNCIA"
                value={dash.kpis.freqMediaSemanal}
                decimals={1}
                suffix="x/sem"
                description="Média semanal (estimada)"
                iconBg="rgba(139,92,246,0.1)"
                iconBorder="rgba(139,92,246,0.2)"
                icon={<Activity size={18} className="text-[#8B5CF6]" />}
                delay={300}
              />
                </>
              )}
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Turistas alert */}
              <motion.div
                className="rounded-[14px] p-6 border border-[rgba(232,39,26,0.3)] relative overflow-hidden"
                style={{ background: 'linear-gradient(134deg, rgba(232,39,26,0.18) 0%, rgba(232,39,26,0.04) 100%)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 bg-[#E02020] rounded-[10px] flex items-center justify-center shadow-[0_0_12px_rgba(224,32,32,0.35)]">
                    <span className="text-lg leading-none">🕶️</span>
                  </div>
                  <span className="text-[#E02020] tracking-[1px]" style={{ fontFamily: FONT_MONO, fontSize: '11px' }}>— — —</span>
                </div>
                <p className="text-[#f2f2f2] leading-none mb-2" style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '40px' }}>{dash?.turistasCount ?? 0}</p>
                <p className="text-[rgba(242,242,242,0.75)]" style={{ fontFamily: FONT_INTER, fontSize: '13px', lineHeight: 1.45 }}>
                  Alunos sem check-in no período de risco
                </p>
              </motion.div>

              {/* Novos */}
              <motion.div
                className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <UserPlus size={18} className="text-[#06B6D4]" />
                  </div>
                  <span className="text-[#606060] tracking-[0.8px]" style={{ fontFamily: FONT_MONO, fontSize: '11px' }}>NOVOS</span>
                </div>
                <p className="text-[#f2f2f2] leading-none mb-2" style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '40px' }}>{dash?.novosMes ?? 0}</p>
                <p className="text-[#a8a8a8]" style={{ fontFamily: FONT_INTER, fontSize: '13px' }}>Novos este mês</p>
              </motion.div>
            </div>

            {/* Growth Chart */}
            <motion.div
              className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
              {/* Chart header */}
              <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h2 style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '30px', color: '#f2f2f2', letterSpacing: '-0.5px', lineHeight: 1 }}>
                    {dash?.membrosTotal ?? 0} MEMBROS
                  </h2>
                  <p className="text-[#a8a8a8] mt-1" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                    Evolução acumulada (cadastros)
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[rgba(34,197,94,0.1)] rounded-[10px] px-3 py-2 shrink-0">
                  <TrendingUp size={15} className="text-[#22C55E]" />
                  <span className="text-[#22C55E]" style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px' }}>
                    {(dash?.pctCrescimento ?? 0) >= 0 ? '+' : ''}{dash?.pctCrescimento ?? 0}%
                  </span>
                </div>
              </div>

              {/* Chart area */}
              <div className="h-[220px] -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradientId.current} x1="0" y1="0" x2="0" y2="1">
                        <stop key="stop-0" offset="0%"  stopColor="#E02020" stopOpacity={0.42} />
                        <stop key="stop-1" offset="95%" stopColor="#E02020" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#252525" vertical={false} />
                    <XAxis
                      key="xaxis"
                      dataKey="month"
                      tick={{ fill: '#A8A8A8', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      key="yaxis"
                      tick={{ fill: '#A8A8A8', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 20', 'dataMax + 15']}
                    />
                    <Tooltip
                      key="tooltip"
                      content={<ChartTooltip />}
                      cursor={{ stroke: '#E02020', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      key="area"
                      type="monotone"
                      dataKey="membros"
                      stroke="#E02020"
                      strokeWidth={2.5}
                      fill={`url(#${gradientId.current})`}
                      dot={false}
                      activeDot={{ r: 5, fill: '#E02020', stroke: '#111', strokeWidth: 2 }}
                      isAnimationActive
                      animationDuration={1800}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1a1a1a] flex-wrap gap-3">
                <button className="flex items-center gap-2 text-[#A8A8A8] hover:text-white transition-colors">
                  <span style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>Últimos 12 meses</span>
                  <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 text-[#E02020] hover:text-[#E94040] transition-colors">
                  <span style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>Ver todos os membros</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* Bottom: Recent Students + Turistas Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Recent Students */}
              <motion.div
                className="lg:col-span-2 bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[#f2f2f2] tracking-[0.7px]" style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: '13px' }}>
                    ALUNOS RECENTES
                  </h3>
                  <Link to="/dashboard/alunos" className="flex items-center gap-1 text-[#606060] hover:text-[#A8A8A8] transition-colors">
                    <span style={{ fontFamily: FONT_INTER, fontSize: '13px' }}>Ver todos</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="space-y-1">
                  {students.length === 0 && !dashLoading && (
                    <p className="text-[#606060] py-6 text-center text-sm" style={{ fontFamily: FONT_INTER }}>
                      Nenhum check-in recente.
                    </p>
                  )}
                  {students.map((student, i) => (
                    <motion.div
                      key={student.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/dashboard/alunos/${student.alunoId}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/dashboard/alunos/${student.alunoId}`);
                        }
                      }}
                      className="flex items-center gap-3 p-3 rounded-[10px] border border-transparent hover:border-[#303030] hover:bg-[#161616] transition-all duration-200 cursor-pointer group"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
                    >
                      <StudentAvatar
                        name={student.name}
                        avatarUrl={student.avatarUrl}
                        initials={student.initials}
                        sizeClass="w-10 h-10"
                        textClass="text-xs"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[#f2f2f2]" style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px' }}>
                            {student.name}
                          </span>
                          <StatusBadge status={student.status} color={student.statusColor} />
                        </div>
                        <p className="text-[#606060] mt-0.5" style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                          {student.timeAgo}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <PlanBadge plan={student.plan} />
                        <ChevronRight size={14} className="text-[#2a2a2a] group-hover:text-[#606060] transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Turistas Panel */}
              <motion.div
                className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6 flex flex-col relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E02020] via-[#E02020]/50 to-transparent" />

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#E02020] rounded-[8px] flex items-center justify-center shrink-0">
                    <span className="text-sm leading-none">🕶️</span>
                  </div>
                  <span className="text-[#f2f2f2] tracking-[1px]" style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: '12px' }}>
                    TURISTAS
                  </span>
                  <span className="text-[#606060] tracking-[1px]" style={{ fontFamily: FONT_MONO, fontSize: '11px' }}>— —</span>
                </div>

                <p className="text-[#606060] mb-6" style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                  Sem check-in há 10+ dias
                </p>

                <div className="flex-1 space-y-5">
                  {turistas.length === 0 && !dashLoading && (
                    <p className="text-[#606060] text-sm" style={{ fontFamily: FONT_INTER }}>
                      Nenhum aluno em risco no momento.
                    </p>
                  )}
                  {turistas.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.78 + i * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[#f2f2f2]" style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px' }}>
                          {t.name}
                        </span>
                        <PlanBadge plan={t.plan === '—' ? '—' : t.plan} />
                      </div>
                      <p className="text-[#606060]" style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
                        Último check-in: {t.lastCheckin}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <Link
                  to="/dashboard/alunos"
                  className="mt-6 pt-4 border-t border-[#1a1a1a] flex items-center justify-center gap-2 text-[#E02020] hover:text-[#E94040] transition-colors w-full"
                >
                  <span style={{ fontFamily: FONT_INTER, fontSize: '13px' }}>
                    Ver todos os {dash?.turistasCount ?? 0} em risco
                  </span>
                  <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>

            {/* Bottom spacing */}
            <div className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
