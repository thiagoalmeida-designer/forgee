# Implementação: Telas de Alunos e Perfil do Aluno

> **Documentação técnica para implementação no Figma Make**  
> **Projeto:** FORGEE Academy Dashboard  
> **Design System:** `/design-system.md`

---

## 📋 Visão Geral

Implementar duas telas integradas:
1. **Lista de Alunos** (`/dashboard/alunos`) - Gestão completa da base de membros
2. **Perfil do Aluno** (`/dashboard/alunos/:id`) - Detalhes e histórico individual

---

## 🎨 Design System - Referência Rápida

### Cores
```
Backgrounds:  #111111 (base), #0d0d0d (cards), #1a1a1a (inputs)
Borders:      #303030 (padrão), #E02020 (ativo/hover)
Text:         #f2f2f2 (primário), #a8a8a8 (secundário), #606060 (muted)
Primary:      #E02020 → Hover: #E94040
Success:      #22C55E (verde - ativo, pago)
Warning:      #FACC15 (amarelo - vencendo)
Error:        #E8271A (vermelho - atrasado)
WhatsApp:     #25D366
```

### Tipografia
```
Títulos:      'Nimbus Sans', sans-serif (700-900)
Body/UI:      'Inter', sans-serif (400-500)
Labels/Code:  'JetBrains Mono', monospace (500)
```

### Componentes Reutilizáveis
- `Input` - `/src/app/components/ui/input.tsx`
- `Checkbox` - `/src/app/components/ui/checkbox.tsx`
- `Select` - `/src/app/components/ui/select.tsx`
- Sidebar (Dashboard) - Já implementada
- Motion animations - `motion/react`

---

## 📄 1. TELA: LISTA DE ALUNOS

### Rota
```
/dashboard/alunos
```

### Layout
```
┌─────────────┬──────────────────────────────────────────┐
│             │  ALUNOS                          [☀] [+] │
│  SIDEBAR    │  Gestão completa da base de membros      │
│  (reuso)    │  ─────────────────────────────────────── │
│             │  [🔍 Buscar aluno...]                    │
│             │  [Planos ▼] [Mês ▼] [Recentes ▼]        │
│             │  ─────────────────────────────────────── │
│             │  📦 Card João Silva                      │
│             │  📦 Card Carlos Oliveira                 │
│             │  📦 Card Maria Santos                    │
│             │  📦 Card Ana Costa                       │
│             │  📦 Card Beatriz Lima                    │
└─────────────┴──────────────────────────────────────────┘
```

---

### 1.1. Header

```tsx
<header className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4">
  <div className="flex items-center justify-between">
    {/* Título */}
    <div>
      <h1 style={{
        fontFamily: "'Nimbus Sans', sans-serif",
        fontWeight: 700,
        fontSize: '26px',
        letterSpacing: '-0.4px',
        color: '#f2f2f2'
      }}>
        ALUNOS
      </h1>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.5px',
        color: '#606060'
      }}>
        GESTÃO COMPLETA DA BASE DE MEMBROS
      </p>
    </div>

    {/* Ações */}
    <div className="flex items-center gap-3">
      <button>☀</button> {/* Tema */}
      <Link to="/dashboard/novo-aluno">+ NOVO ALUNO</Link>
      <button>🔴 ATIVAR RECEPÇÃO</button>
    </div>
  </div>
</header>
```

**Estilos dos botões:**
- Tema: `border border-[#303030] rounded-[10px] p-2`
- Novo Aluno: `border border-[#303030] text-[#A8A8A8] hover:border-[#E02020]`
- Recepção: `bg-[#E02020] text-white hover:bg-[#E94040] shadow-glow`

---

### 1.2. Barra de Busca e Filtros

```tsx
<div className="p-6 space-y-4">
  {/* Campo de Busca */}
  <div className="relative">
    <input
      type="text"
      placeholder="Buscar aluno por nome, email ou telefone..."
      className="w-full bg-[#1a1a1a] border border-[#303030] rounded-[10px] pl-12 pr-4 py-3 text-[#f2f2f2] placeholder:text-[#606060] focus:border-[#E02020]"
    />
    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606060]" />
  </div>

  {/* Filtros */}
  <div className="flex items-center gap-3">
    <Select> {/* Planos: Todos, BASIC, PREMIUM, ELITE */}
      <option>Planos</option>
    </Select>
    
    <Select> {/* Período */}
      <option>Mês</option>
    </Select>
    
    <Select> {/* Ordenação */}
      <option>Recentes</option>
      <option>Nome A-Z</option>
      <option>Nome Z-A</option>
      <option>Mais antigos</option>
    </Select>
  </div>
</div>
```

**Select Style:**
```css
bg-[#1a1a1a]
border border-[#303030]
rounded-[10px]
px-3 py-2.5
text-[#a8a8a8]
hover:border-[#555]
```

---

### 1.3. Card de Aluno (Item da Lista)

```tsx
interface Aluno {
  id: string;
  nome: string;
  numeroMatricula: string; // Ex: "#5678"
  avatar: string;
  status: 'ativo' | 'inativo';
  statusPagamento: 'em-dia' | 'vencendo' | 'atrasado';
  plano: 'BASIC' | 'PREMIUM' | 'ELITE';
  dataCadastro: string;
}

<div className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] p-4 hover:border-[#E02020] transition-all cursor-pointer">
  <div className="flex items-center gap-4">
    {/* Avatar */}
    <img
      src={aluno.avatar}
      alt={aluno.nome}
      className="w-12 h-12 rounded-full object-cover border-2 border-[rgba(232,39,26,0.2)]"
    />

    {/* Informações */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[#f2f2f2] font-medium text-base">
          {aluno.nome}
        </h3>
        <span className="bg-[rgba(232,39,26,0.1)] text-[#e8271a] text-xs px-2 py-0.5 rounded font-mono">
          {aluno.numeroMatricula}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        {/* Status Pagamento */}
        <StatusBadge status={aluno.statusPagamento} />
        <span className="text-[#606060]">•</span>
        <span className="text-[#606060]">
          Cadastro: {aluno.dataCadastro}
        </span>
      </div>
    </div>

    {/* Plano */}
    <div className="flex items-center gap-3">
      <PlanBadge plan={aluno.plano} />
      
      {/* Menu Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="text-[#606060] hover:text-[#a8a8a8]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigate(`/dashboard/alunos/${aluno.id}`)}>
            Ver perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleWhatsApp(aluno)}>
            Enviar mensagem
          </DropdownMenuItem>
          <DropdownMenuItem className="text-[#E8271A]" onClick={() => handleBlock(aluno)}>
            Bloquear aluno
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</div>
```

---

### 1.4. Status Badges

**Status de Pagamento:**
```tsx
function StatusBadge({ status }: { status: string }) {
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
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
```

**Badge de Plano:**
```tsx
function PlanBadge({ plan }: { plan: string }) {
  const styles = {
    BASIC: 'text-[#A8A8A8] border-[rgba(168,168,168,0.3)]',
    PREMIUM: 'text-[#E02020] border-[rgba(224,32,32,0.35)]',
    ELITE: 'text-[#8B5CF6] border-[rgba(139,92,246,0.35)]',
  };

  return (
    <span 
      className={`border px-2 py-0.5 rounded text-[10px] tracking-[0.8px] font-mono font-medium ${styles[plan]}`}
    >
      {plan}
    </span>
  );
}
```

---

### 1.5. Dropdown Menu (More Vert)

Usar o componente `DropdownMenu` do Radix UI (já instalado):

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#1a1a1a] transition-colors">
      <MoreVertical size={18} className="text-[#606060]" />
    </button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent 
    align="end"
    className="bg-[#1a1a1a] border border-[#303030] rounded-[10px] min-w-[180px]"
  >
    <DropdownMenuItem 
      onClick={() => navigate(`/dashboard/alunos/${aluno.id}`)}
      className="text-[#f2f2f2] hover:bg-[#222] cursor-pointer px-3 py-2"
    >
      <User size={14} className="mr-2" />
      Ver perfil
    </DropdownMenuItem>
    
    <DropdownMenuItem 
      onClick={() => handleSendMessage(aluno)}
      className="text-[#f2f2f2] hover:bg-[#222] cursor-pointer px-3 py-2"
    >
      <MessageCircle size={14} className="mr-2" />
      Enviar mensagem
    </DropdownMenuItem>
    
    <DropdownMenuItem 
      onClick={() => handleBlock(aluno)}
      className="text-[#E8271A] hover:bg-[#222] cursor-pointer px-3 py-2"
    >
      <UserX size={14} className="mr-2" />
      Bloquear aluno
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Funções de Ação:**
```tsx
const handleSendMessage = (aluno: Aluno) => {
  // Abrir WhatsApp Web
  const phone = aluno.celular.replace(/\D/g, '');
  window.open(`https://wa.me/55${phone}`, '_blank');
};

const handleBlock = (aluno: Aluno) => {
  // Mostrar modal de confirmação
  if (confirm(`Deseja bloquear ${aluno.nome}?`)) {
    // Lógica de bloqueio
  }
};
```

---

### 1.6. Estados e Dados

```tsx
const [alunos, setAlunos] = useState<Aluno[]>([]);
const [filtros, setFiltros] = useState({
  busca: '',
  plano: 'todos',
  periodo: 'mes',
  ordenacao: 'recentes'
});

// Dados mockados (substituir por API)
const alunosMock: Aluno[] = [
  {
    id: '1',
    nome: 'João Silva',
    numeroMatricula: '#5678',
    avatar: imgJoaoSilva,
    status: 'ativo',
    statusPagamento: 'atrasado',
    plano: 'BASIC',
    dataCadastro: '09/03/2024',
    email: 'joao@email.com',
    celular: '(11) 98765-1234',
  },
  // ... mais alunos
];

// Filtrar alunos
const alunosFiltrados = useMemo(() => {
  return alunos.filter(aluno => {
    // Busca
    if (filtros.busca && !aluno.nome.toLowerCase().includes(filtros.busca.toLowerCase())) {
      return false;
    }
    // Plano
    if (filtros.plano !== 'todos' && aluno.plano !== filtros.plano) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // Ordenação
    if (filtros.ordenacao === 'nome-az') return a.nome.localeCompare(b.nome);
    if (filtros.ordenacao === 'nome-za') return b.nome.localeCompare(a.nome);
    return 0;
  });
}, [alunos, filtros]);
```

---

## 📄 2. TELA: PERFIL DO ALUNO

### Rota
```
/dashboard/alunos/:id
```

### Layout
```
┌─────────────┬──────────────────────────────────────────┐
│             │  ← Voltar para lista                     │
│  SIDEBAR    │  ─────────────────────────────────────── │
│  (reuso)    │  [🖼️ João Silva] [WhatsApp] [✏️]       │
│             │       ATIVO  Em atraso                   │
│             │  ─────────────────────────────────────── │
│             │  📧 EMAIL      📞 TELEFONE    📋 PLANO   │
│             │  📅 INÍCIO     🕒 ÚLTIMO      📊 TOTAL   │
│             │  ─────────────────────────────────────── │
│             │  HISTÓRICO DE PAGAMENTOS                 │
│             │  💳 09/02/2026 - Atrasado - R$ 89,90    │
│             │  ✅ 09/01/2026 - Pago - R$ 89,90        │
└─────────────┴──────────────────────────────────────────┘
```

---

### 2.1. Botão Voltar

```tsx
<Link 
  to="/dashboard/alunos"
  className="flex items-center gap-2 text-[#a8a8a8] hover:text-[#f2f2f2] transition-colors mb-6"
>
  <ChevronLeft size={18} />
  <span style={{
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 500
  }}>
    Voltar para lista
  </span>
</Link>
```

---

### 2.2. Header do Perfil

```tsx
<div className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6 mb-6">
  <div className="flex items-start justify-between">
    {/* Informações do Aluno */}
    <div className="flex items-center gap-4">
      <img
        src={aluno.avatar}
        alt={aluno.nome}
        className="w-16 h-16 rounded-full object-cover border-2 border-[rgba(232,39,26,0.2)]"
      />
      
      <div>
        <h1 style={{
          fontFamily: "'Nimbus Sans', sans-serif",
          fontWeight: 700,
          fontSize: '24px',
          letterSpacing: '-0.6px',
          color: '#f2f2f2'
        }}>
          {aluno.nome}
        </h1>
        
        <div className="flex items-center gap-2 mt-1">
          {/* Badge Status */}
          <span className="bg-[rgba(34,197,94,0.1)] text-[#22C55E] text-xs px-2.5 py-1 rounded-full font-medium">
            ATIVO
          </span>
          
          {/* Badge Pagamento */}
          <span className="bg-[rgba(232,39,26,0.1)] text-[#E8271A] text-xs px-2.5 py-1 rounded-full font-medium">
            Em atraso
          </span>
        </div>
      </div>
    </div>

    {/* Ações */}
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/55${aluno.celular.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-[10px] hover:bg-[#1fb855] transition-colors"
      >
        <MessageCircle size={16} />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500 }}>
          WhatsApp
        </span>
      </a>
      
      <button className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-[#303030] text-[#606060] hover:text-[#a8a8a8] hover:border-[#555] transition-all">
        <Edit size={16} />
      </button>
    </div>
  </div>
</div>
```

---

### 2.3. Grid de Informações

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* Card Email */}
  <InfoCard
    icon={<Mail size={16} className="text-[#606060]" />}
    label="EMAIL"
    value={aluno.email}
  />
  
  {/* Card Telefone */}
  <InfoCard
    icon={<Phone size={16} className="text-[#606060]" />}
    label="TELEFONE"
    value={aluno.celular}
  />
  
  {/* Card Plano */}
  <InfoCard
    icon={<CreditCard size={16} className="text-[#606060]" />}
    label="PLANO"
    value={aluno.plano}
    badge
  />
  
  {/* Card Data de Início */}
  <InfoCard
    icon={<Calendar size={16} className="text-[#606060]" />}
    label="DATA DE INÍCIO"
    value={aluno.dataInicio}
  />
  
  {/* Card Último Check-in */}
  <InfoCard
    icon={<Clock size={16} className="text-[#606060]" />}
    label="ÚLTIMO CHECK-IN"
    value={aluno.ultimoCheckin}
  />
  
  {/* Card Total de Check-ins */}
  <InfoCard
    icon={<Activity size={16} className="text-[#606060]" />}
    label="TOTAL DE CHECK-INS"
    value={aluno.totalCheckins.toString()}
  />
</div>
```

**Componente InfoCard:**
```tsx
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
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px' }}
        >
          {label}
        </span>
      </div>
      
      {badge ? (
        <PlanBadge plan={value} />
      ) : (
        <p 
          className="text-[#f2f2f2]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
        >
          {value}
        </p>
      )}
    </div>
  );
}
```

---

### 2.4. Histórico de Pagamentos

```tsx
<div className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6">
  <h2 
    className="uppercase mb-4"
    style={{
      fontFamily: "'Nimbus Sans', sans-serif",
      fontWeight: 700,
      fontSize: '20px',
      letterSpacing: '-0.5px',
      color: '#f2f2f2'
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
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
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
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}
        >
          R$ {pagamento.valor}
        </p>
      </div>
    ))}
  </div>
</div>
```

**Status de Pagamento Badge:**
```tsx
function StatusPagamentoBadge({ status }: { status: 'pago' | 'atrasado' | 'pendente' }) {
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
```

---

## 🔄 3. INTEGRAÇÕES E NAVEGAÇÃO

### 3.1. Atualizar Sidebar

Adicionar item "Alunos" ativo na sidebar:

```tsx
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Alunos', path: '/dashboard/alunos' }, // NOVO
  { icon: ClipboardCheck, label: 'Check-ins', path: '/dashboard/checkins' },
  { icon: Radio, label: 'Modo Recepção', path: '/dashboard/recepcao' },
  { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes' },
];
```

---

### 3.2. Adicionar Rotas

```tsx
// src/app/routes.tsx
import { Alunos } from './pages/Alunos';
import { AlunosPerfil } from './pages/AlunosPerfil';

{
  path: '/dashboard/alunos',
  Component: Alunos,
},
{
  path: '/dashboard/alunos/:id',
  Component: AlunosPerfil,
}
```

---

### 3.3. Navegação entre Telas

**Da lista para perfil:**
```tsx
// Ao clicar no card ou "Ver perfil" no menu
navigate(`/dashboard/alunos/${aluno.id}`);
```

**Do perfil para lista:**
```tsx
// Botão "Voltar para lista"
<Link to="/dashboard/alunos">...</Link>
```

---

## 📊 4. ESTRUTURA DE DADOS

### Interface Aluno (completa)

```tsx
interface Aluno {
  // Identificação
  id: string;
  numeroMatricula: string; // Ex: "#5678"
  
  // Dados Pessoais
  nome: string;
  avatar: string;
  email: string;
  telefone?: string;
  celular: string;
  cpf: string;
  dataNascimento: string;
  
  // Endereço
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  
  // Status
  status: 'ativo' | 'inativo' | 'bloqueado';
  statusPagamento: 'em-dia' | 'vencendo' | 'atrasado';
  
  // Plano
  plano: 'BASIC' | 'PREMIUM' | 'ELITE';
  dataInicio: string;
  dataVencimento: string;
  
  // Atividades
  ultimoCheckin?: string;
  totalCheckins: number;
  
  // Histórico
  dataCadastro: string;
  pagamentos: Pagamento[];
}

interface Pagamento {
  id: string;
  data: string; // "09/02/2026"
  valor: string; // "89.90"
  metodo: 'Boleto' | 'PIX' | 'Cartão' | 'Dinheiro';
  status: 'pago' | 'atrasado' | 'pendente';
}
```

---

## 🎯 5. FUNCIONALIDADES ESPECÍFICAS

### 5.1. Busca em Tempo Real

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch] = useDebounce(searchTerm, 300);

const alunosFiltrados = useMemo(() => {
  if (!debouncedSearch) return alunos;
  
  return alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    aluno.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    aluno.celular.includes(debouncedSearch)
  );
}, [alunos, debouncedSearch]);
```

---

### 5.2. Ações do Menu Dropdown

**Bloquear Aluno:**
```tsx
const handleBlock = async (aluno: Aluno) => {
  const confirmacao = confirm(
    `Tem certeza que deseja bloquear ${aluno.nome}?\n\nEssa ação impedirá o acesso do aluno à academia.`
  );
  
  if (confirmacao) {
    try {
      // await api.patch(`/alunos/${aluno.id}/bloquear`);
      toast.success(`${aluno.nome} foi bloqueado com sucesso.`);
      // Atualizar lista
    } catch (error) {
      toast.error('Erro ao bloquear aluno.');
    }
  }
};
```

**Enviar Mensagem (WhatsApp):**
```tsx
const handleSendMessage = (aluno: Aluno) => {
  const phone = aluno.celular.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Olá ${aluno.nome.split(' ')[0]}! Aqui é da FORGEE Academy.`
  );
  window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
};
```

---

### 5.3. Animações (Motion)

```tsx
// Lista de alunos
{alunosFiltrados.map((aluno, index) => (
  <motion.div
    key={aluno.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <AlunoCard aluno={aluno} />
  </motion.div>
))}

// Perfil do aluno
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
>
  {/* Conteúdo do perfil */}
</motion.div>
```

---

## ✅ 6. CHECKLIST DE IMPLEMENTAÇÃO

### Tela de Lista (Alunos)
- [ ] Criar arquivo `/src/app/pages/Alunos.tsx`
- [ ] Implementar header com título e ações
- [ ] Campo de busca com ícone
- [ ] 3 dropdowns de filtro (Planos, Mês, Ordenação)
- [ ] Grid/lista de cards de alunos
- [ ] Card com avatar, nome, matrícula, status, plano
- [ ] Menu dropdown (MoreVertical) com 3 opções
- [ ] Função de busca em tempo real
- [ ] Função de filtros
- [ ] Animações de entrada (Motion)
- [ ] Responsividade mobile

### Tela de Perfil (AlunosPerfil)
- [ ] Criar arquivo `/src/app/pages/AlunosPerfil.tsx`
- [ ] Botão "Voltar para lista"
- [ ] Header com avatar maior, nome, badges
- [ ] Botão WhatsApp (funcional)
- [ ] Botão Editar
- [ ] Grid 3x2 de cards de informação
- [ ] Seção "Histórico de Pagamentos"
- [ ] Lista de pagamentos com status visual
- [ ] Animações de entrada
- [ ] Responsividade mobile

### Navegação
- [ ] Adicionar rotas em `/src/app/routes.tsx`
- [ ] Atualizar sidebar com item "Alunos" ativo
- [ ] Link no card da lista para perfil
- [ ] Link "Voltar" no perfil para lista

### Componentes Auxiliares
- [ ] `StatusBadge` - Status de pagamento
- [ ] `PlanBadge` - Badge de plano
- [ ] `InfoCard` - Card de informação do perfil
- [ ] `StatusPagamentoBadge` - Status individual de pagamento

### Integrações
- [ ] Mock de dados de alunos
- [ ] Mock de histórico de pagamentos
- [ ] Função WhatsApp Web
- [ ] Função de bloqueio (com confirmação)
- [ ] Toast notifications (usando `sonner`)

---

## 🎨 7. ASSETS NECESSÁRIOS

### Imagens Importadas do Figma
```tsx
import imgJoaoSilva from 'figma:asset/81e581e8bdbf8c9f2fa02e4c20dce774b1a1bb76.png';
import imgCarlosOliveira from 'figma:asset/4631e0b3856fc2d697783d063af0506770940150.png';
import imgMariaSantos from 'figma:asset/c370e1db29c9956574be3ed78df1b2c14bcdb239.png';
import imgAnaCosta from 'figma:asset/e243fca66b972890241de9a6542eedb4acdb0d0f.png';
import imgBeatrizLima from 'figma:asset/a8d9836506bb678008af0be8a848b247e3386b00.png';
```

### Ícones Lucide React
```tsx
import {
  Users, Search, ChevronDown, MoreVertical, User,
  MessageCircle, UserX, Mail, Phone, CreditCard,
  Calendar, Clock, Activity, Edit, ChevronLeft
} from 'lucide-react';
```

---

## 🚀 8. PRÓXIMOS PASSOS

1. **Implementar as duas páginas** seguindo esta spec
2. **Testar navegação** entre lista e perfil
3. **Validar responsividade** em mobile/tablet
4. **Integrar com API** (substituir mocks)
5. **Adicionar loading states** durante fetch
6. **Implementar paginação** na lista (se > 50 alunos)
7. **Adicionar filtros avançados** (data, status, etc.)
8. **Implementar edição de perfil** (modal ou página)

---

## 📝 NOTAS FINAIS

- **Reuso máximo**: Sidebar, inputs, badges já existem
- **Consistência visual**: 100% fiel ao design system
- **Animações**: Usar Motion em entradas/transições
- **Acessibilidade**: Contraste, labels, keyboard navigation
- **Performance**: useMemo para filtros, lazy load de imagens
- **Mobile-first**: Grid responsivo, touch-friendly

---

**Versão:** 1.0  
**Data:** 2026-04-11  
**Autor:** Claude Code (Anthropic)  
**Projeto:** FORGEE Academy - Sistema de Gestão
