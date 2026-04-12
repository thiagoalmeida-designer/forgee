# Schema Prisma — Academia FORGEE
> **Revisado e validado campo a campo contra todas as telas do frontend**

O arquivo definitivo está em `/prisma/schema.prisma`.

---

## Validação por tela

| Tela | Modelos utilizados | Status |
|------|--------------------|--------|
| `Login.tsx` | `Admin` (email + senhaHash) | ✅ |
| `Dashboard.tsx` | `Aluno`, `CheckIn`, `Contrato`, `Pagamento` | ✅ |
| `Alunos.tsx` | `Aluno` (codigoMembro, status, statusPagamento→Contrato/Pagamento, plano) | ✅ |
| `AlunosPerfil.tsx` | `Aluno`, `Contrato`, `Pagamento`, `CheckIn` | ✅ |
| `NovoAluno.tsx` | `Aluno`, `ObjetivoAluno`, `SaudeAluno`, `HistoricoAtividade`, `Contrato` | ✅ |
| `CheckIns.tsx` | `CheckIn`, `Aluno` (statusPagamento, plano) | ✅ |
| `ModoRecepcao.tsx` | `CheckIn` (via codigoMembro ou email), `Aluno.qrToken` | ✅ |
| `Configuracoes.tsx › Geral` | `Academia` | ✅ |
| `Configuracoes.tsx › Perfil Admin` | `Admin` | ✅ |
| `Configuracoes.tsx › Planos` | `Plano`, `Beneficio` | ✅ |
| `Configuracoes.tsx › Sistema` | `ConfiguracaoSistema` | ✅ |

---

## Campos adicionados na revisão

### `Aluno`
- `codigoMembro String @unique` — número de matrícula exibido como `#5678` em `Alunos.tsx`
- `qrToken String @unique @default(uuid())` — token para leitura do QR Code em `ModoRecepcao.tsx`

### `Plano`
- `cor String?` — cor hex usada nos `PlanCard` em `Configuracoes.tsx` (ex: `"#e8271a"`)

### Novos modelos
- **`Academia`** — dados da academia para `Configuracoes.tsx › Geral` (nome, cnpj, telefone, email, endereço completo)
- **`ConfiguracaoSistema`** — parâmetros operacionais do `Configuracoes.tsx › Sistema` (horaAbertura, horaFechamento, diasSemCheckinParaRisco, diasAntesVencimentoParaAlerta, integrações)
- **`Notificacao`** — alertas automáticos gerados pelo sistema (turistas, pagamentos vencendo, etc.)

### Novos enums
- **`MetodoCheckIn`** — `QR_CODE | CODIGO_MEMBRO | EMAIL | MANUAL` (toggle em `ModoRecepcao.tsx`)
- **`TipoNotificacao`** — tipos de alertas do sistema

### Índices adicionados
Otimizações de query para as KPIs do Dashboard e filtros por período em CheckIns:
- `Aluno`: `ativo`, `codigoMembro`, `email`
- `Contrato`: `alunoId`, `status`
- `Pagamento`: `contratoId`, `status`, `dataVencimento`
- `CheckIn`: `alunoId`, `horaEntrada`
- `Avaliacao`: `alunoId`
- `Observacao`: `alunoId`
- `Notificacao`: `(adminId, lida)`, `createdAt`

---

## Estrutura completa dos modelos

```
Academia
  ├── ConfiguracaoSistema (1:1)

Admin
  ├── CheckIn[] (checkInsRegistrados)
  └── Observacao[]

Aluno
  ├── codigoMembro (único — busca na Recepção)
  ├── qrToken (único — leitura QR Code)
  ├── ObjetivoAluno[] (checkboxes NovoAluno)
  ├── SaudeAluno? (radios + textareas NovoAluno)
  ├── HistoricoAtividade? (radio + textarea NovoAluno)
  ├── Contrato[]
  │     └── Pagamento[]
  ├── CheckIn[]
  ├── Observacao[]
  └── Avaliacao[]

Plano
  ├── nome, preco, cor, destaque (TabPlanos)
  ├── Beneficio[] (lista editável TabPlanos)
  └── Contrato[]

CheckIn
  ├── MetodoCheckIn (QR_CODE | CODIGO_MEMBRO | EMAIL | MANUAL)
  └── TipoCheckIn (NORMAL | EXPERIMENTAL | REPOSICAO | CORTESIA)

Notificacao (alertas automáticos)
Configuracao (key-value extensível)
```

---

## Como conectar ao Supabase

### 1. Variáveis de ambiente `.env`
```env
# Pool de conexões (para queries do app)
DATABASE_URL="postgresql://postgres.[ref]:[senha]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexão direta (para migrations Prisma)
DIRECT_URL="postgresql://postgres:[senha]@db.[ref].supabase.co:5432/postgres"
```

### 2. Instalar Prisma
```bash
pnpm add -D prisma
pnpm add @prisma/client
```

### 3. Rodar a migration inicial
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Seed inicial (academia + planos padrão)
```bash
npx prisma db seed
```

### 5. Supabase Storage Buckets necessários
| Bucket | Uso |
|--------|-----|
| `avatares-alunos` | `Aluno.foto` (upload em NovoAluno) |
| `avatares-admin` | `Admin.foto` |
| `comprovantes` | `Pagamento.comprovante` |
| `logos` | `Academia.logo` |

---

## Lógica de negócio derivada (não no banco)

| KPI / Campo UI | Como calcular |
|---------------|---------------|
| `statusPagamento` do Aluno (`em-dia`/`vencendo`/`atrasado`) | Query no `Pagamento` ativo do contrato atual |
| `ultimoCheckin` (AlunosPerfil) | `MAX(CheckIn.horaEntrada)` onde `alunoId = id` |
| `totalCheckins` (AlunosPerfil) | `COUNT(CheckIn)` onde `alunoId = id` |
| "Turistas" (Dashboard) | Alunos onde último check-in > `diasSemCheckinParaRisco` dias |
| "Novos este mês" (Dashboard) | `COUNT(Aluno)` onde `createdAt >= início do mês` |
| `pico horário` (CheckIns KPI) | Agregação por hora em `CheckIn.horaEntrada` |
| QR Code URL | `https://forgee.academy/checkin?token={Aluno.qrToken}` |
