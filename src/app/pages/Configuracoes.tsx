import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun, UserPlus, QrCode, Menu, Settings,
  User, Mail, Phone, MapPin, Lock, Eye, EyeOff,
  FileText, Shield, CreditCard, Zap,
  Clock, Calendar, Database, ExternalLink,
  Plus, Trash2, Save, X, DollarSign, Check,
} from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import {
  createPlanoNovo,
  fetchPlanosConfig,
  persistPlanosConfig,
  type PlanoConfigUi,
} from '../../lib/forgeeApi';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_NIMBUS = "'Nimbus Sans', sans-serif";
const FONT_INTER  = "'Inter', sans-serif";
const FONT_MONO   = "'JetBrains Mono', monospace";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type Tab = 'geral' | 'perfil' | 'planos' | 'sistema';

type Beneficio = { id: string; texto: string };
type Plano = PlanoConfigUi;

/* ─── Input component ────────────────────────────────────────────────────────── */
function FormInput({
  label, value, onChange, placeholder, icon: Icon, type = 'text', disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px', color: '#f2f2f2' }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#1a1a1a] text-[#f2f2f2] placeholder-[#606060] outline-none transition-colors focus:border-[#E02020] ${Icon ? 'pl-10' : 'pl-4'} pr-4`}
          style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
        />
      </div>
    </div>
  );
}

/* ─── Password Input ─────────────────────────────────────────────────────────── */
function PasswordInput({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-2 w-full">
      <label style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px', color: '#f2f2f2' }}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
          <Lock size={16} />
        </div>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#1a1a1a] text-[#f2f2f2] placeholder-[#606060] outline-none transition-colors focus:border-[#E02020] pl-10 pr-10"
          style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#A8A8A8] transition-colors"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ─── Section card ────────────────────────────────────────────────────────────── */
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] rounded-[14px] border border-[#303030] w-full overflow-hidden">
      {children}
    </div>
  );
}

/* ─── Action buttons ─────────────────────────────────────────────────────────── */
function ActionButtons({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#303030] mt-6">
      <button
        onClick={onCancel}
        className="h-[46px] px-6 rounded-[10px] border border-[#303030] text-[#f2f2f2] hover:bg-[#1a1a1a] transition-colors"
        style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px' }}
      >
        Cancelar
      </button>
      <button
        onClick={onSave}
        className="h-[46px] px-6 rounded-[10px] bg-[#E02020] text-[#f2f2f2] hover:bg-[#c41b1b] transition-colors flex items-center gap-2"
        style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px' }}
      >
        <Save size={16} />
        Salvar Alterações
      </button>
    </div>
  );
}

/* ─── Tab: Geral ─────────────────────────────────────────────────────────────── */
function TabGeral() {
  const [form, setForm] = useState({
    nome: 'FORGEE Academia',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 3456-7890',
    email: 'contato@forgee.com.br',
    endereco: 'Rua das Academias, 123 - Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <SectionCard>
      <div className="p-6">
        <div className="mb-6">
          <h2 style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px', color: '#f2f2f2', letterSpacing: '-0.5px' }}>
            INFORMAÇÕES DA ACADEMIA
          </h2>
          <p style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8', marginTop: '4px' }}>
            Configure os dados básicos da sua academia
          </p>
        </div>

        <div className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Nome da Academia" value={form.nome} onChange={set('nome')} icon={FileText} />
            <FormInput label="CNPJ" value={form.cnpj} onChange={set('cnpj')} icon={Shield} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Telefone" value={form.telefone} onChange={set('telefone')} icon={Phone} />
            <FormInput label="Email" value={form.email} onChange={set('email')} icon={Mail} type="email" />
          </div>

          {/* Row 3 */}
          <FormInput label="Endereço" value={form.endereco} onChange={set('endereco')} icon={MapPin} />

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInput label="Cidade" value={form.cidade} onChange={set('cidade')} />
            <FormInput label="Estado" value={form.estado} onChange={set('estado')} />
            <FormInput label="CEP" value={form.cep} onChange={set('cep')} />
          </div>
        </div>

        <ActionButtons onCancel={() => {}} onSave={() => {}} />
      </div>
    </SectionCard>
  );
}

/* ─── Tab: Perfil Admin ──────────────────────────────────────────────────────── */
function TabPerfilAdmin() {
  const [form, setForm] = useState({
    nome: 'Admin FORGEE',
    email: 'admin@forgee.com.br',
    telefone: '(11) 98765-4321',
    senhaAtual: '',
    novaSenha: '',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <SectionCard>
      <div className="p-6">
        <div className="mb-6">
          <h2 style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px', color: '#f2f2f2', letterSpacing: '-0.5px' }}>
            PERFIL DO ADMINISTRADOR
          </h2>
          <p style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8', marginTop: '4px' }}>
            Gerencie suas informações pessoais e credenciais
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Nome Completo" value={form.nome} onChange={set('nome')} icon={User} />
            <FormInput label="Email" value={form.email} onChange={set('email')} icon={Mail} type="email" />
          </div>
          <div className="md:w-1/2">
            <FormInput label="Telefone" value={form.telefone} onChange={set('telefone')} icon={Phone} />
          </div>
        </div>

        {/* Change password */}
        <div className="mt-6 pt-6 border-t border-[#303030]">
          <h3 style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '18px', color: '#f2f2f2', letterSpacing: '-0.45px', marginBottom: '16px' }}>
            ALTERAR SENHA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PasswordInput label="Senha Atual" value={form.senhaAtual} onChange={set('senhaAtual')} placeholder="Digite sua senha atual" />
            <PasswordInput label="Nova Senha" value={form.novaSenha} onChange={set('novaSenha')} placeholder="Digite a nova senha" />
          </div>
        </div>

        <ActionButtons onCancel={() => {}} onSave={() => {}} />
      </div>
    </SectionCard>
  );
}

/* ─── Modal: Criar Novo Plano ────────────────────────────────────────────────── */
function ModalCriarPlano({
  onClose,
  onCriar,
}: {
  onClose: () => void;
  onCriar: (plano: Omit<Plano, 'id' | 'cor'>) => void;
}) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [destaque, setDestaque] = useState(false);

  const handleCriar = () => {
    if (!nome.trim()) return;
    onCriar({
      nome: nome.toUpperCase(),
      preco: preco || '0',
      descricao,
      destaque,
      beneficios: [],
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-[672px] bg-[#1a1a1a] rounded-[10px] border border-[#303030] p-6 z-10"
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <h3
          className="mb-6"
          style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '18px', color: '#f2f2f2', letterSpacing: '-0.45px' }}
        >
          CRIAR NOVO PLANO
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px', color: '#f2f2f2' }}>
                Nome do Plano
              </label>
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: PREMIUM"
                className="h-[46px] rounded-[10px] border border-[#303030] bg-[#0d0d0d] text-[#f2f2f2] placeholder-[#606060] outline-none px-4 transition-colors focus:border-[#E02020]"
                style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px', color: '#f2f2f2' }}>
                Preço Mensal
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
                  <DollarSign size={16} />
                </div>
                <input
                  type="number"
                  value={preco}
                  onChange={e => setPreco(e.target.value)}
                  placeholder="0"
                  className="w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#0d0d0d] text-[#f2f2f2] placeholder-[#606060] outline-none pl-10 pr-4 transition-colors focus:border-[#E02020]"
                  style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px', color: '#f2f2f2' }}>
              Descrição
            </label>
            <input
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Breve descrição do plano"
              className="h-[46px] rounded-[10px] border border-[#303030] bg-[#0d0d0d] text-[#f2f2f2] placeholder-[#606060] outline-none px-4 transition-colors focus:border-[#E02020]"
              style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setDestaque(d => !d)}
              className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                destaque ? 'bg-[#E02020] border-[#E02020]' : 'bg-[#0d0d0d] border-[#303030]'
              }`}
            >
              {destaque && <Check size={10} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px', color: '#f2f2f2' }}>
              Marcar como plano em destaque
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="h-[46px] px-6 rounded-[10px] border border-[#303030] text-[#f2f2f2] hover:bg-[#303030] transition-colors"
            style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleCriar}
            className="h-[46px] px-6 rounded-[10px] bg-[#E02020] text-[#f2f2f2] hover:bg-[#c41b1b] transition-colors flex items-center gap-2"
            style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px' }}
          >
            <Plus size={16} />
            Criar Plano
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Plan Card ──────────────────────────────────────────────────────────────── */
function PlanCard({
  plano,
  onPrecoChange,
  onAddBeneficio,
  onRemoveBeneficio,
}: {
  plano: Plano;
  onPrecoChange: (id: string, preco: string) => void;
  onAddBeneficio: (planoId: string) => void;
  onRemoveBeneficio: (planoId: string, benefId: string) => void;
}) {
  const isDestaque = plano.destaque;

  return (
    <div
      className={`rounded-[10px] border p-5 transition-colors ${
        isDestaque ? 'border-[#E02020] bg-[#1a0a0a]' : 'border-[#303030] bg-[#1a1a1a]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            style={{
              fontFamily: FONT_NIMBUS,
              fontWeight: 700,
              fontSize: '18px',
              color: isDestaque ? '#e8271a' : '#f2f2f2',
              letterSpacing: '-0.45px',
            }}
          >
            {plano.nome}
          </h3>
          <p style={{ fontFamily: FONT_INTER, fontSize: '13px', color: '#606060', marginTop: '2px' }}>
            {plano.descricao}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#606060]">
            <DollarSign size={16} />
          </span>
          <input
            type="number"
            value={plano.preco}
            onChange={e => onPrecoChange(plano.id, e.target.value)}
            className="h-9 w-24 rounded-[8px] border border-[#303030] bg-[#0d0d0d] text-[#f2f2f2] outline-none px-3 text-right transition-colors focus:border-[#E02020]"
            style={{ fontFamily: FONT_MONO, fontSize: '14px' }}
          />
        </div>
      </div>

      <ul className="space-y-1.5 mb-3">
        {plano.beneficios.map(b => (
          <li key={b.id} className="flex items-center gap-2 group">
            <span style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8' }}>•</span>
            <span className="flex-1" style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8' }}>
              {b.texto}
            </span>
            <button
              onClick={() => onRemoveBeneficio(plano.id, b.id)}
              className="opacity-0 group-hover:opacity-100 text-[#606060] hover:text-[#E02020] transition-all"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onAddBeneficio(plano.id)}
        className="flex items-center gap-1.5 text-[#606060] hover:text-[#A8A8A8] transition-colors"
        style={{ fontFamily: FONT_INTER, fontSize: '13px' }}
      >
        <Plus size={14} />
        Adicionar benefício
      </button>
    </div>
  );
}

/* ─── Tab: Planos ────────────────────────────────────────────────────────────── */
function TabPlanos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchPlanosConfig();
    if (error) setLoadErr(error);
    else {
      setLoadErr(null);
      setPlanos(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handlePrecoChange = (id: string, preco: string) => {
    setPlanos(ps => ps.map(p => (p.id === id ? { ...p, preco } : p)));
  };

  const handleAddBeneficio = (planoId: string) => {
    const texto = prompt('Nome do benefício:');
    if (!texto) return;
    setPlanos(ps =>
      ps.map(p =>
        p.id === planoId
          ? { ...p, beneficios: [...p.beneficios, { id: `new-${Date.now()}`, texto }] }
          : p,
      ),
    );
  };

  const handleRemoveBeneficio = (planoId: string, benefId: string) => {
    setPlanos(ps =>
      ps.map(p =>
        p.id === planoId
          ? { ...p, beneficios: p.beneficios.filter(b => b.id !== benefId) }
          : p,
      ),
    );
  };

  const handleSave = async () => {
    setSaveMsg(null);
    const { error } = await persistPlanosConfig(planos);
    if (error) setSaveMsg(`Erro ao salvar: ${error}`);
    else setSaveMsg('Planos salvos.');
    await reload();
  };

  const handleCriarPlano = async (dados: Omit<Plano, 'id' | 'cor'>) => {
    const { error } = await createPlanoNovo({
      nome: dados.nome,
      descricao: dados.descricao,
      preco: dados.preco,
      destaque: dados.destaque,
      beneficios: dados.beneficios.map(b => ({ texto: b.texto })),
    });
    if (error) {
      window.alert(error);
      return;
    }
    await reload();
    setShowModal(false);
  };

  return (
    <>
      <SectionCard>
        <div className="p-6">
          <div className="mb-6">
            <h2 style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px', color: '#f2f2f2', letterSpacing: '-0.5px' }}>
              PLANOS E PREÇOS
            </h2>
            <p style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8', marginTop: '4px' }}>
              Configure os planos disponíveis para os alunos. As alterações refletem em todo o sistema.
            </p>
          </div>

          {loading && (
            <p className="text-[#606060] text-sm mb-4" style={{ fontFamily: FONT_INTER }}>
              Carregando planos…
            </p>
          )}
          {loadErr && (
            <p className="text-[#E8271A] text-sm mb-4" style={{ fontFamily: FONT_INTER }}>
              {loadErr}
            </p>
          )}
          {saveMsg && (
            <p className="text-[#a8a8a8] text-sm mb-4" style={{ fontFamily: FONT_INTER }}>
              {saveMsg}
            </p>
          )}

          <div className="space-y-4">
            {planos.map(plano => (
              <PlanCard
                key={plano.id}
                plano={plano}
                onPrecoChange={handlePrecoChange}
                onAddBeneficio={handleAddBeneficio}
                onRemoveBeneficio={handleRemoveBeneficio}
              />
            ))}
          </div>

          <div className="mt-5">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 h-[46px] px-5 rounded-[10px] bg-[#E02020] text-[#f2f2f2] hover:bg-[#c41b1b] transition-colors"
              style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px' }}
            >
              <Plus size={16} />
              Criar Novo Plano
            </button>
          </div>

          <ActionButtons onCancel={() => setSaveMsg(null)} onSave={handleSave} />
        </div>
      </SectionCard>

      <AnimatePresence>
        {showModal && (
          <ModalCriarPlano
            onClose={() => setShowModal(false)}
            onCriar={(dados) => {
              void handleCriarPlano(dados);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Tab: Sistema ───────────────────────────────────────────────────────────── */
function TabSistema() {
  const [abertura, setAbertura] = useState('06:00');
  const [fechamento, setFechamento] = useState('22:00');
  const [diasSemCheckin, setDiasSemCheckin] = useState('10');
  const [diasVencimento, setDiasVencimento] = useState('5');

  return (
    <SectionCard>
      <div className="p-6">
        <div className="mb-6">
          <h2 style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px', color: '#f2f2f2', letterSpacing: '-0.5px' }}>
            CONFIGURAÇÕES DO SISTEMA
          </h2>
          <p style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8', marginTop: '4px' }}>
            Configure parâmetros operacionais do sistema
          </p>
        </div>

        {/* Horário de Funcionamento */}
        <div className="mb-8">
          <h3 style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px', color: '#f2f2f2', marginBottom: '16px' }}>
            Horário de Funcionamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: FONT_INTER, fontWeight: 400, fontSize: '14px', color: '#A8A8A8' }}>
                Abertura
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
                  <Clock size={16} />
                </div>
                <input
                  type="time"
                  value={abertura}
                  onChange={e => setAbertura(e.target.value)}
                  className="w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#1a1a1a] text-[#f2f2f2] outline-none pl-10 pr-4 transition-colors focus:border-[#E02020]"
                  style={{ fontFamily: FONT_INTER, fontSize: '14px', colorScheme: 'dark' }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: FONT_INTER, fontWeight: 400, fontSize: '14px', color: '#A8A8A8' }}>
                Fechamento
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
                  <Clock size={16} />
                </div>
                <input
                  type="time"
                  value={fechamento}
                  onChange={e => setFechamento(e.target.value)}
                  className="w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#1a1a1a] text-[#f2f2f2] outline-none pl-10 pr-4 transition-colors focus:border-[#E02020]"
                  style={{ fontFamily: FONT_INTER, fontSize: '14px', colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas Automáticos */}
        <div className="mb-8 pt-6 border-t border-[#303030]">
          <h3 style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px', color: '#f2f2f2', marginBottom: '16px' }}>
            Alertas Automáticos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: FONT_INTER, fontWeight: 400, fontSize: '14px', color: '#A8A8A8' }}>
                Dias sem check-in para risco
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
                  <Calendar size={16} />
                </div>
                <input
                  type="number"
                  value={diasSemCheckin}
                  onChange={e => setDiasSemCheckin(e.target.value)}
                  className="w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#1a1a1a] text-[#f2f2f2] outline-none pl-10 pr-4 transition-colors focus:border-[#E02020]"
                  style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
                />
              </div>
              <p style={{ fontFamily: FONT_INTER, fontSize: '12px', color: '#606060' }}>
                Dias sem frequência para considerar aluno em risco
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: FONT_INTER, fontWeight: 400, fontSize: '14px', color: '#A8A8A8' }}>
                Dias antes do vencimento para alertar
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
                  <Calendar size={16} />
                </div>
                <input
                  type="number"
                  value={diasVencimento}
                  onChange={e => setDiasVencimento(e.target.value)}
                  className="w-full h-[46px] rounded-[10px] border border-[#303030] bg-[#1a1a1a] text-[#f2f2f2] outline-none pl-10 pr-4 transition-colors focus:border-[#E02020]"
                  style={{ fontFamily: FONT_INTER, fontSize: '14px' }}
                />
              </div>
              <p style={{ fontFamily: FONT_INTER, fontSize: '12px', color: '#606060' }}>
                Antecedência para notificar vencimento
              </p>
            </div>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="mb-8 pt-6 border-t border-[#303030]">
          <h3 style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px', color: '#f2f2f2', marginBottom: '16px' }}>
            Informações do Sistema
          </h3>
          <div className="rounded-[10px] border border-[#303030] bg-[#1a1a1a] p-4 space-y-3">
            {[
              { label: 'Versão:', value: '1.0.0', color: '#f2f2f2' },
              { label: 'Última atualização:', value: '11 de abril, 2026', color: '#f2f2f2' },
              { label: 'Banco de dados:', value: 'Conectado', color: '#22C55E' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8' }}>{row.label}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: '14px', color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design System */}
        <div className="pt-6 border-t border-[#303030]">
          <h3 style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '16px', color: '#f2f2f2', marginBottom: '16px' }}>
            Design System
          </h3>
          <div className="rounded-[10px] border border-[#303030] bg-[#1a1a1a] p-4">
            <p style={{ fontFamily: FONT_INTER, fontSize: '14px', color: '#A8A8A8', marginBottom: '16px' }}>
              Acesse a documentação completa do Design System com tokens, componentes e guias de estilo.
            </p>
            <button
              className="flex items-center gap-2 h-[42px] px-5 rounded-[10px] bg-[#E02020] text-[#f2f2f2] hover:bg-[#c41b1b] transition-colors"
              style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px' }}
            >
              <Settings size={15} />
              Abrir Design System
            </button>
          </div>
        </div>

        <ActionButtons onCancel={() => {}} onSave={() => {}} />
      </div>
    </SectionCard>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export function Configuracoes() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('geral');

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'geral',   label: 'Geral',        icon: FileText  },
    { id: 'perfil',  label: 'Perfil Admin', icon: User      },
    { id: 'planos',  label: 'Planos',       icon: CreditCard },
    { id: 'sistema', label: 'Sistema',      icon: Zap       },
  ];

  return (
    <div className="flex min-h-screen bg-[#090909]">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-[#090909] border-b border-[#1a1a1a] px-5 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              className="lg:hidden text-[#A8A8A8] hover:text-[#f2f2f2] transition-colors p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1
                className="leading-none"
                style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '24px', color: '#f2f2f2', letterSpacing: '-0.6px' }}
              >
                CONFIGURAÇÕES
              </h1>
              <p
                className="mt-0.5"
                style={{ fontFamily: FONT_MONO, fontSize: '11px', color: '#606060', letterSpacing: '0.5px' }}
              >
                CONFIGURAÇÕES DO SISTEMA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-[10px] border border-[#303030] flex items-center justify-center text-[#f2f2f2] hover:bg-[#1a1a1a] transition-colors">
              <Sun size={16} />
            </button>
            <button
              onClick={() => navigate('/dashboard/novo-aluno')}
              className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-[10px] border border-[#303030] text-[#f2f2f2] hover:bg-[#1a1a1a] transition-colors"
              style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '13px' }}
            >
              <UserPlus size={15} />
              NOVO ALUNO
            </button>
            <button
              onClick={() => navigate('/dashboard/recepcao')}
              className="flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#E02020] text-[#f2f2f2] hover:bg-[#c41b1b] transition-colors"
              style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '13px' }}
            >
              <QrCode size={15} />
              <span className="hidden sm:inline">ATIVAR RECEPÇÃO</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          {/* Page title */}
          <div className="mb-6">
            <h2 style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '30px', color: '#f2f2f2', letterSpacing: '-0.75px' }}>
              CONFIGURAÇÕES
            </h2>
            <p style={{ fontFamily: FONT_INTER, fontSize: '16px', color: '#A8A8A8', marginTop: '4px' }}>
              Gerencie as configurações da academia
            </p>
          </div>

          {/* Tabs */}
          <div className="relative mb-6 border-b border-[#303030]">
            <div className="flex gap-1 overflow-x-auto pb-px">
              {tabs.map(tab => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-[10px] shrink-0 transition-all duration-200 relative ${
                      active
                        ? 'bg-[#E02020] text-[#f2f2f2]'
                        : 'text-[#A8A8A8] hover:text-[#f2f2f2] hover:bg-[#1a1a1a]'
                    }`}
                    style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '14px' }}
                  >
                    <Icon size={15} strokeWidth={active ? 2.2 : 1.6} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'geral'   && <TabGeral />}
              {activeTab === 'perfil'  && <TabPerfilAdmin />}
              {activeTab === 'planos'  && <TabPlanos />}
              {activeTab === 'sistema' && <TabSistema />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
