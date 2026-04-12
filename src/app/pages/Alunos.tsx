import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Search, ChevronDown, MoreVertical, User,
  MessageCircle, UserX, Sun, UserPlus, Radio, Filter, Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { StudentAvatar } from '../components/StudentAvatar';
import { fetchAlunosLista, type AlunoListaItem } from '../../lib/forgeeApi';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_NIMBUS = "'Nimbus Sans', sans-serif";
const FONT_INTER = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

type Aluno = AlunoListaItem;

/* ─── Sub-components ────────────────────────────────────────────────────────── */

interface StatusBadgeProps {
  status: 'em-dia' | 'vencendo' | 'atrasado';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    'em-dia': 'bg-[rgba(34,197,94,0.12)] text-[#22C55E]',
    'vencendo': 'bg-[rgba(250,204,21,0.12)] text-[#FACC15]',
    'atrasado': 'bg-[rgba(232,39,26,0.12)] text-[#E8271A]',
  };

  const labels = {
    'em-dia': 'Em dia',
    'vencendo': 'Vencendo',
    'atrasado': 'Em atraso',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-[0.4px] ${styles[status]}`}
      style={{ fontFamily: FONT_MONO }}
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

interface AlunoCardProps {
  aluno: Aluno;
  onEdit: (aluno: Aluno) => void;
  onMessage: (aluno: Aluno) => void;
  onBlock: (aluno: Aluno) => void;
}

function AlunoCard({ aluno, onEdit, onMessage, onBlock }: AlunoCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] p-4 hover:border-[#444] transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/dashboard/alunos/${aluno.id}`)}
    >
      <div className="flex items-center gap-4">
        <StudentAvatar
          name={aluno.nome}
          avatarUrl={aluno.avatarUrl}
          initials={aluno.initials}
          sizeClass="w-12 h-12"
          textClass="text-sm"
        />

        {/* Informações */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="text-[#f2f2f2] truncate"
              style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px' }}
            >
              {aluno.nome}
            </h3>
            <span
              className="bg-[rgba(232,39,26,0.1)] text-[#e8271a] px-2 py-0.5 rounded shrink-0"
              style={{ fontFamily: FONT_MONO, fontSize: '12px' }}
            >
              {aluno.numeroMatricula}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <StatusBadge status={aluno.statusPagamento} />
            <span className="text-[#606060]">•</span>
            <span className="text-[#606060]" style={{ fontFamily: FONT_INTER, fontSize: '12px' }}>
              Cadastro: {aluno.dataCadastro}
            </span>
          </div>
        </div>

        {/* Plano + Menu */}
        <div className="flex items-center gap-3 shrink-0">
          <PlanBadge plan={aluno.plano} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#222] transition-colors"
              >
                <MoreVertical size={18} className="text-[#606060] group-hover:text-[#a8a8a8] transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] min-w-[180px] p-1"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/alunos/${aluno.id}`);
                }}
                className="text-[#f2f2f2] hover:bg-[#222] cursor-pointer px-3 py-2 rounded flex items-center gap-2"
              >
                <User size={14} />
                Ver perfil
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onMessage(aluno);
                }}
                className="text-[#f2f2f2] hover:bg-[#222] cursor-pointer px-3 py-2 rounded flex items-center gap-2"
              >
                <MessageCircle size={14} />
                Enviar mensagem
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock(aluno);
                }}
                className="text-[#E8271A] hover:bg-[#222] cursor-pointer px-3 py-2 rounded flex items-center gap-2"
              >
                <UserX size={14} />
                Bloquear aluno
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export function Alunos() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroPlano, setFiltroPlano] = useState('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('mes');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [alunosRaw, setAlunosRaw] = useState<Aluno[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await fetchAlunosLista();
      if (cancelled) return;
      if (error) setLoadError(error);
      else {
        setLoadError(null);
        setAlunosRaw(data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filtrar e ordenar alunos
  const alunosFiltrados = useMemo(() => {
    let resultado = [...alunosRaw];

    // Busca
    if (searchTerm) {
      resultado = resultado.filter(
        (aluno) =>
          aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aluno.celular.includes(searchTerm)
      );
    }

    // Filtro de plano
    if (filtroPlano !== 'todos') {
      resultado = resultado.filter((aluno) => aluno.plano === filtroPlano);
    }

    // Ordenação
    if (ordenacao === 'nome-az') {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenacao === 'nome-za') {
      resultado.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    return resultado;
  }, [searchTerm, filtroPlano, ordenacao, alunosRaw]);

  const handleSendMessage = (aluno: Aluno) => {
    const phone = aluno.celular.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${aluno.nome.split(' ')[0]}! Aqui é da FORGEE Academy.`);
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const handleBlock = (aluno: Aluno) => {
    if (confirm(`Tem certeza que deseja bloquear ${aluno.nome}?\n\nEssa ação impedirá o acesso do aluno à academia.`)) {
      console.log('Bloqueando aluno:', aluno.id);
      // Implementar lógica de bloqueio
    }
  };

  return (
    <div className="flex h-screen bg-[#111111] overflow-hidden">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <motion.header
          className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center gap-4 shrink-0"
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
            <h1
              className="text-[#f2f2f2] leading-none"
              style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '26px', letterSpacing: '-0.4px' }}
            >
              ALUNOS
            </h1>
            <p
              className="text-[#606060] tracking-[0.5px] mt-0.5"
              style={{ fontFamily: FONT_MONO, fontSize: '10px' }}
            >
              GESTÃO COMPLETA DA BASE DE MEMBROS
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="w-9 h-9 rounded-[10px] border border-[#303030] flex items-center justify-center text-[#606060] hover:text-[#A8A8A8] hover:border-[#555] transition-all duration-200"
              aria-label="Tema"
            >
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
            {/* Busca */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606060]" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar aluno por nome, email ou telefone..."
                className="w-full bg-[#1a1a1a] border border-[#303030] rounded-[10px] pl-12 pr-4 py-3 text-[#f2f2f2] placeholder:text-[#606060] focus:border-[#E02020] focus:outline-none transition-colors"
                style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
              />
            </motion.div>

            {/* Filtros */}
            <motion.div
              className="flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Filter size={14} className="text-[#606060]" />

              <select
                value={filtroPlano}
                onChange={(e) => setFiltroPlano(e.target.value)}
                className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-3 py-2.5 text-[#a8a8a8] hover:border-[#555] focus:border-[#E02020] focus:outline-none transition-colors appearance-none pr-8"
                style={{
                  fontFamily: FONT_INTER,
                  fontSize: '14px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a8a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="todos">Planos</option>
                <option value="BASIC">BASIC</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="ELITE">ELITE</option>
              </select>

              <select
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
                className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-3 py-2.5 text-[#a8a8a8] hover:border-[#555] focus:border-[#E02020] focus:outline-none transition-colors appearance-none pr-8"
                style={{
                  fontFamily: FONT_INTER,
                  fontSize: '14px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a8a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="mes">Mês</option>
                <option value="trimestre">Trimestre</option>
                <option value="semestre">Semestre</option>
                <option value="ano">Ano</option>
              </select>

              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-3 py-2.5 text-[#a8a8a8] hover:border-[#555] focus:border-[#E02020] focus:outline-none transition-colors appearance-none pr-8"
                style={{
                  fontFamily: FONT_INTER,
                  fontSize: '14px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a8a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="recentes">Recentes</option>
                <option value="nome-az">Nome A-Z</option>
                <option value="nome-za">Nome Z-A</option>
                <option value="antigos">Mais antigos</option>
              </select>
            </motion.div>

            {/* Lista de Alunos */}
            <div className="space-y-3">
              {loading && (
                <p className="text-[#606060] py-8 text-center" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                  Carregando alunos…
                </p>
              )}
              {loadError && !loading && (
                <p className="text-[#E8271A] py-4 text-center text-sm" style={{ fontFamily: FONT_INTER }}>
                  {loadError}
                </p>
              )}
              {!loading &&
                !loadError &&
                alunosFiltrados.map((aluno, index) => (
                <motion.div
                  key={aluno.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <AlunoCard
                    aluno={aluno}
                    onEdit={() => navigate(`/dashboard/alunos/${aluno.id}`)}
                    onMessage={handleSendMessage}
                    onBlock={handleBlock}
                  />
                </motion.div>
              ))}

              {!loading && !loadError && alunosFiltrados.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-[#606060]" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                    Nenhum aluno encontrado com os filtros aplicados.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
