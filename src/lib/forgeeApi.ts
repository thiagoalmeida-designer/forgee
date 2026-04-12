/**
 * Consultas ao Supabase para o painel admin.
 * Escopo: dados operacionais (alunos, check-ins, planos, métricas).
 * A landing (Home) permanece com copy estática — ver plano de inventário.
 */
import {
  addMonths,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from './supabase';
import {
  derivePagamentoUi,
  formatDatePt,
  formatDateTimePt,
  mapPagamentoDbToUi,
} from './forgeeMappers';

type AlunoRow = {
  id: string;
  codigoMembro: string;
  nomeCompleto: string;
  email: string;
  celular: string;
  ativo: boolean;
  foto: string | null;
  createdAt: string;
};

type ContratoRow = {
  id: string;
  alunoId: string;
  status: string;
  planoId: string;
  planos: { nome: string } | null;
};

type PagamentoRow = {
  id: string;
  contratoId: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: number | string;
  status: string;
  formaPagamento: string | null;
};

export type AlunoListaItem = {
  id: string;
  nome: string;
  numeroMatricula: string;
  avatarUrl: string | null;
  initials: string;
  status: 'ativo' | 'inativo';
  statusPagamento: 'em-dia' | 'vencendo' | 'atrasado';
  plano: string;
  dataCadastro: string;
  email: string;
  celular: string;
};

export async function fetchAlunosLista(): Promise<{ data: AlunoListaItem[]; error: string | null }> {
  const { data: alunos, error: e1 } = await supabase
    .from('alunos')
    .select('id, codigoMembro, nomeCompleto, email, celular, ativo, foto, createdAt')
    .order('createdAt', { ascending: false });

  if (e1) return { data: [], error: e1.message };
  if (!alunos?.length) return { data: [], error: null };

  const ids = alunos.map((a) => a.id);
  const { data: contratos, error: e2 } = await supabase
    .from('contratos')
    .select('id, alunoId, status, planoId, planos(nome)')
    .in('alunoId', ids)
    .eq('status', 'ATIVO');

  if (e2) return { data: [], error: e2.message };

  const contratoByAluno = new Map<string, ContratoRow>();
  for (const c of contratos ?? []) {
    const row = c as unknown as ContratoRow;
    contratoByAluno.set(row.alunoId, row);
  }

  const contratoIds = [...contratoByAluno.values()].map((c) => c.id);
  let pagamentos: PagamentoRow[] = [];
  if (contratoIds.length) {
    const { data: pays, error: e3 } = await supabase
      .from('pagamentos')
      .select('id, contratoId, dataVencimento, dataPagamento, valor, status, formaPagamento')
      .in('contratoId', contratoIds);
    if (e3) return { data: [], error: e3.message };
    pagamentos = (pays ?? []) as PagamentoRow[];
  }

  const pagByContrato = new Map<string, PagamentoRow[]>();
  for (const p of pagamentos) {
    const arr = pagByContrato.get(p.contratoId) ?? [];
    arr.push(p);
    pagByContrato.set(p.contratoId, arr);
  }

  const out: AlunoListaItem[] = (alunos as AlunoRow[]).map((a) => {
    const c = contratoByAluno.get(a.id);
    const pays = c ? pagByContrato.get(c.id) ?? [] : [];
    const statusPagamento = pays.length ? derivePagamentoUi(pays) : 'em-dia';
    const planoNome = c?.planos?.nome?.toUpperCase() ?? '—';
    const foto = a.foto?.startsWith('http') ? a.foto : null;

    return {
      id: a.id,
      nome: a.nomeCompleto,
      numeroMatricula: `#${a.codigoMembro}`,
      avatarUrl: foto,
      initials: a.nomeCompleto
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?',
      status: a.ativo ? 'ativo' : 'inativo',
      statusPagamento,
      plano: planoNome,
      dataCadastro: formatDatePt(a.createdAt),
      email: a.email,
      celular: a.celular,
    };
  });

  return { data: out, error: null };
}

export type AlunoPerfilUi = {
  id: string;
  nome: string;
  avatarUrl: string | null;
  initials: string;
  email: string;
  celular: string;
  plano: string;
  dataInicio: string;
  ultimoCheckin: string;
  totalCheckins: number;
  statusAtivo: boolean;
  statusPagamento: 'em-dia' | 'vencendo' | 'atrasado';
  pagamentos: ReturnType<typeof mapPagamentoDbToUi>[];
};

export async function fetchAlunoPerfil(
  alunoId: string,
): Promise<{ data: AlunoPerfilUi | null; error: string | null }> {
  const { data: aluno, error: e1 } = await supabase
    .from('alunos')
    .select('id, nomeCompleto, email, celular, ativo, foto, createdAt')
    .eq('id', alunoId)
    .maybeSingle();

  if (e1) return { data: null, error: e1.message };
  if (!aluno) return { data: null, error: null };

  const a = aluno as AlunoRow;

  const { data: contrato } = await supabase
    .from('contratos')
    .select('id, dataInicio, planoId, planos(nome)')
    .eq('alunoId', alunoId)
    .eq('status', 'ATIVO')
    .maybeSingle();

  const cRow = contrato as (ContratoRow & { dataInicio: string }) | null;

  let pagamentosUi: ReturnType<typeof mapPagamentoDbToUi>[] = [];
  let statusPagamento: 'em-dia' | 'vencendo' | 'atrasado' = 'em-dia';

  if (cRow?.id) {
    const { data: pays } = await supabase
      .from('pagamentos')
      .select('id, dataVencimento, dataPagamento, valor, status, formaPagamento')
      .eq('contratoId', cRow.id)
      .order('dataVencimento', { ascending: false });

    const plist = (pays ?? []) as PagamentoRow[];
    pagamentosUi = plist.map(mapPagamentoDbToUi);
    statusPagamento = plist.length ? derivePagamentoUi(plist) : 'em-dia';
  }

  const { count: totalCheckins } = await supabase
    .from('check_ins')
    .select('id', { count: 'exact', head: true })
    .eq('alunoId', alunoId);

  const { data: lastCi } = await supabase
    .from('check_ins')
    .select('horaEntrada')
    .eq('alunoId', alunoId)
    .order('horaEntrada', { ascending: false })
    .limit(1)
    .maybeSingle();

  const last = (lastCi as { horaEntrada: string } | null)?.horaEntrada;

  const nome = a.nomeCompleto;
  const initials =
    nome
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  return {
    data: {
      id: a.id,
      nome,
      avatarUrl: a.foto?.startsWith('http') ? a.foto : null,
      initials,
      email: a.email,
      celular: a.celular,
      plano: (cRow?.planos?.nome ?? 'BASIC').toUpperCase(),
      dataInicio: cRow?.dataInicio ? formatDatePt(cRow.dataInicio) : formatDatePt(a.createdAt),
      ultimoCheckin: last ? formatDatePt(last) : '—',
      totalCheckins: totalCheckins ?? 0,
      statusAtivo: a.ativo,
      statusPagamento,
      pagamentos: pagamentosUi,
    },
    error: null,
  };
}

export type CheckInUi = {
  id: string;
  alunoId: string;
  aluno: { nome: string; avatarUrl: string | null; initials: string };
  statusPagamento: 'em-dia' | 'vencendo' | 'atrasado';
  plano: string;
  data: string;
  horario: string;
  timestamp: number;
};

export async function fetchCheckInsList(params?: {
  from?: Date;
  to?: Date;
}): Promise<{ data: CheckInUi[]; error: string | null }> {
  let q = supabase
    .from('check_ins')
    .select(
      `
      id,
      horaEntrada,
      alunoId,
      alunos ( id, nomeCompleto, foto )
    `,
    )
    .order('horaEntrada', { ascending: false })
    .limit(500);

  if (params?.from) {
    q = q.gte('horaEntrada', startOfDay(params.from).toISOString());
  }
  if (params?.to) {
    q = q.lte('horaEntrada', endOfDay(params.to).toISOString());
  }

  const { data: rows, error: e1 } = await q;
  if (e1) return { data: [], error: e1.message };
  if (!rows?.length) return { data: [], error: null };

  type Row = {
    id: string;
    horaEntrada: string;
    alunoId: string;
    alunos: { id: string; nomeCompleto: string; foto: string | null } | null;
  };

  const alunoIds = [...new Set((rows as Row[]).map((r) => r.alunoId))];
  const { data: contratos } = await supabase
    .from('contratos')
    .select('id, alunoId, planos(nome)')
    .in('alunoId', alunoIds)
    .eq('status', 'ATIVO');

  const cByAluno = new Map<string, { id: string; planos: { nome: string } | null }>();
  for (const c of contratos ?? []) {
    const row = c as { id: string; alunoId: string; planos: { nome: string } | null };
    cByAluno.set(row.alunoId, row);
  }
  const cids = [...cByAluno.values()].map((c) => c.id);
  let pays: PagamentoRow[] = [];
  if (cids.length) {
    const { data } = await supabase
      .from('pagamentos')
      .select('contratoId, dataVencimento, dataPagamento, valor, status')
      .in('contratoId', cids);
    pays = (data ?? []) as PagamentoRow[];
  }

  const payByContrato = new Map<string, PagamentoRow[]>();
  for (const p of pays) {
    const arr = payByContrato.get(p.contratoId) ?? [];
    arr.push(p);
    payByContrato.set(p.contratoId, arr);
  }

  const out: CheckInUi[] = (rows as Row[]).map((r) => {
    const al = r.alunos;
    const nome = al?.nomeCompleto ?? 'Aluno';
    const initials =
      nome
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?';
    const c = cByAluno.get(r.alunoId);
    const plist = c ? payByContrato.get(c.id) ?? [] : [];
    const { data, horario, timestamp } = formatDateTimePt(r.horaEntrada);
    return {
      id: r.id,
      alunoId: r.alunoId,
      aluno: {
        nome,
        avatarUrl: al?.foto?.startsWith('http') ? al.foto : null,
        initials,
      },
      statusPagamento: plist.length ? derivePagamentoUi(plist) : 'em-dia',
      plano: (c?.planos?.nome ?? 'BASIC').toUpperCase(),
      data,
      horario,
      timestamp,
    };
  });

  return { data: out, error: null };
}

export type PlanoConfigUi = {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  destaque: boolean;
  cor: string;
  beneficios: { id: string; texto: string }[];
};

export async function fetchPlanosConfig(): Promise<{ data: PlanoConfigUi[]; error: string | null }> {
  const { data: planos, error: e1 } = await supabase
    .from('planos')
    .select('id, nome, descricao, preco, destaque, cor, ordem')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  if (e1) return { data: [], error: e1.message };
  if (!planos?.length) return { data: [], error: null };

  const ids = planos.map((p) => (p as { id: string }).id);
  const { data: ben, error: e2 } = await supabase
    .from('beneficios_plano')
    .select('id, planoId, texto, ordem')
    .in('planoId', ids)
    .order('ordem', { ascending: true });

  if (e2) return { data: [], error: e2.message };

  const byPlano = new Map<string, { id: string; texto: string }[]>();
  for (const b of ben ?? []) {
    const row = b as { id: string; planoId: string; texto: string };
    const arr = byPlano.get(row.planoId) ?? [];
    arr.push({ id: row.id, texto: row.texto });
    byPlano.set(row.planoId, arr);
  }

  const out: PlanoConfigUi[] = (planos as {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number | string;
    destaque: boolean;
    cor: string | null;
  }[]).map((p) => {
    const precoNum = typeof p.preco === 'string' ? parseFloat(p.preco) : p.preco;
    return {
      id: p.id,
      nome: p.nome,
      descricao: p.descricao ?? '',
      preco: Number.isFinite(precoNum) ? precoNum.toFixed(2) : String(p.preco),
      destaque: p.destaque,
      cor: p.cor ?? '#f2f2f2',
      beneficios: byPlano.get(p.id) ?? [],
    };
  });

  return { data: out, error: null };
}

export async function persistPlanosConfig(planos: PlanoConfigUi[]): Promise<{ error: string | null }> {
  for (const p of planos) {
    const preco = parseFloat(p.preco.replace(',', '.'));
    const { error: e1 } = await supabase
      .from('planos')
      .update({
        descricao: p.descricao || null,
        preco: Number.isFinite(preco) ? preco : 0,
        destaque: p.destaque,
        cor: p.cor,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', p.id);
    if (e1) return { error: e1.message };

    const { data: existing } = await supabase.from('beneficios_plano').select('id').eq('planoId', p.id);
    const existingIds = new Set((existing ?? []).map((x: { id: string }) => x.id));
    const currentIds = new Set(p.beneficios.map((b) => b.id));

    for (const bid of existingIds) {
      if (!currentIds.has(bid)) {
        const { error: ed } = await supabase.from('beneficios_plano').delete().eq('id', bid);
        if (ed) return { error: ed.message };
      }
    }

    let ordem = 0;
    for (const b of p.beneficios) {
      if (existingIds.has(b.id)) {
        const { error: eu } = await supabase
          .from('beneficios_plano')
          .update({ texto: b.texto, ordem })
          .eq('id', b.id);
        if (eu) return { error: eu.message };
      } else {
        const { error: ei } = await supabase.from('beneficios_plano').insert({
          id: crypto.randomUUID(),
          planoId: p.id,
          texto: b.texto,
          ordem,
        });
        if (ei) return { error: ei.message };
      }
      ordem += 1;
    }
  }
  return { error: null };
}

export async function createPlanoNovo(dados: {
  nome: string;
  descricao: string;
  preco: string;
  destaque: boolean;
  beneficios: { texto: string }[];
}): Promise<{ error: string | null }> {
  const preco = parseFloat(dados.preco.replace(',', '.'));
  const id = crypto.randomUUID();
  const { error: e1 } = await supabase.from('planos').insert({
    id,
    nome: dados.nome.toUpperCase(),
    descricao: dados.descricao || null,
    preco: Number.isFinite(preco) ? preco : 0,
    duracaoMeses: 1,
    cor: dados.destaque ? '#e8271a' : '#f2f2f2',
    destaque: dados.destaque,
    ordem: 99,
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (e1) return { error: e1.message };

  let ordem = 0;
  for (const b of dados.beneficios) {
    const { error: e2 } = await supabase.from('beneficios_plano').insert({
      id: crypto.randomUUID(),
      planoId: id,
      texto: b.texto,
      ordem,
    });
    if (e2) return { error: e2.message };
    ordem += 1;
  }
  return { error: null };
}

export type DashboardData = {
  kpis: {
    ativos: number;
    inativos: number;
    checkinsHoje: number;
    freqMediaSemanal: number;
  };
  turistasCount: number;
  novosMes: number;
  membrosTotal: number;
  pctCrescimento: number;
  chartData: { month: string; membros: number }[];
  ultimosCheckins: {
    id: string;
    alunoId: string;
    name: string;
    avatarUrl: string | null;
    initials: string;
    status: string;
    statusColor: 'green' | 'yellow' | 'red';
    plan: string;
    timeAgo: string;
  }[];
  turistas: { id: string; name: string; plan: string; lastCheckin: string }[];
};

function timeAgoPt(iso: string): string {
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `${Math.floor(s / 60)} min atrás`;
  if (s < 86400) return `${Math.floor(s / 3600)} hora(s) atrás`;
  return `${Math.floor(s / 86400)} dia(s) atrás`;
}

function paymentColor(
  s: 'em-dia' | 'vencendo' | 'atrasado',
): { status: string; color: 'green' | 'yellow' | 'red' } {
  if (s === 'atrasado') return { status: 'Em atraso', color: 'red' };
  if (s === 'vencendo') return { status: 'Vencendo', color: 'yellow' };
  return { status: 'Em dia', color: 'green' };
}

export async function fetchDashboardData(): Promise<{ data: DashboardData | null; error: string | null }> {
  const { data: allAlunos, error: eAl } = await supabase
    .from('alunos')
    .select('id, nomeCompleto, ativo, createdAt');

  if (eAl) return { data: null, error: eAl.message };

  const alunos = (allAlunos ?? []) as {
    id: string;
    nomeCompleto: string;
    ativo: boolean;
    createdAt: string;
  }[];

  const nomeById = new Map(alunos.map((a) => [a.id, a.nomeCompleto]));
  const ativosList = alunos.filter((a) => a.ativo);
  const ativos = ativosList.length;
  const totalAlunos = alunos.length;
  const inativos = Math.max(0, totalAlunos - ativos);

  const startToday = startOfDay(new Date()).toISOString();
  const endToday = endOfDay(new Date()).toISOString();
  const { count: checkinsHoje } = await supabase
    .from('check_ins')
    .select('id', { count: 'exact', head: true })
    .gte('horaEntrada', startToday)
    .lte('horaEntrada', endToday);

  const since = subMonths(new Date(), 1).toISOString();
  const { data: recentChecks } = await supabase
    .from('check_ins')
    .select('alunoId')
    .gte('horaEntrada', since);

  const freqMediaSemanal =
    ativos > 0
      ? Math.round(((recentChecks?.length ?? 0) / Math.max(ativos, 1) / 4) * 10) / 10
      : 0;

  const { data: cfg } = await supabase
    .from('configuracoes_sistema')
    .select('diasSemCheckinParaRisco')
    .limit(1)
    .maybeSingle();

  const diasRisco =
    (cfg as { diasSemCheckinParaRisco: number } | null)?.diasSemCheckinParaRisco ?? 10;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - diasRisco);

  const { data: checkRows } = await supabase
    .from('check_ins')
    .select('alunoId, horaEntrada')
    .order('horaEntrada', { ascending: false })
    .limit(8000);

  const lastMap = new Map<string, string>();
  for (const row of (checkRows ?? []) as { alunoId: string; horaEntrada: string }[]) {
    if (!lastMap.has(row.alunoId)) lastMap.set(row.alunoId, row.horaEntrada);
  }

  const { data: alunosComContrato } = await supabase
    .from('contratos')
    .select('id, alunoId, planos(nome)')
    .eq('status', 'ATIVO');

  const planByAluno = new Map<string, string>();
  const contratoIdByAluno = new Map<string, string>();
  for (const c of alunosComContrato ?? []) {
    const row = c as { id: string; alunoId: string; planos: { nome: string } | null };
    planByAluno.set(row.alunoId, (row.planos?.nome ?? 'BASIC').toUpperCase());
    contratoIdByAluno.set(row.alunoId, row.id);
  }

  const cids = [...new Set([...contratoIdByAluno.values()])];
  let allPays: PagamentoRow[] = [];
  if (cids.length) {
    const { data } = await supabase
      .from('pagamentos')
      .select('contratoId, status, dataVencimento')
      .in('contratoId', cids);
    allPays = (data ?? []) as PagamentoRow[];
  }

  const paysByContrato = new Map<string, PagamentoRow[]>();
  for (const p of allPays) {
    const arr = paysByContrato.get(p.contratoId) ?? [];
    arr.push(p);
    paysByContrato.set(p.contratoId, arr);
  }

  const payUiByAluno = new Map<string, 'em-dia' | 'vencendo' | 'atrasado'>();
  for (const [aid, cid] of contratoIdByAluno) {
    const plist = paysByContrato.get(cid) ?? [];
    payUiByAluno.set(aid, plist.length ? derivePagamentoUi(plist) : 'em-dia');
  }

  const turistas: DashboardData['turistas'] = [];
  for (const a of ativosList) {
    const last = lastMap.get(a.id);
    if (!last || new Date(last) < cutoff) {
      const days = last ? Math.floor((Date.now() - new Date(last).getTime()) / 86400000) : 999;
      turistas.push({
        id: a.id,
        name: nomeById.get(a.id) ?? 'Aluno',
        plan: planByAluno.get(a.id) ?? '—',
        lastCheckin: last ? `${days} dias` : `${diasRisco}+ dias`,
      });
    }
  }

  const startMes = startOfMonth(new Date()).toISOString();
  const novosMes = alunos.filter((a) => a.createdAt >= startMes).length;

  const months = eachMonthOfInterval({
    start: subMonths(startOfMonth(new Date()), 11),
    end: startOfMonth(new Date()),
  });

  const chartData: { month: string; membros: number }[] = [];
  for (const m of months) {
    const next = addMonths(m, 1);
    const cum = alunos.filter((a) => new Date(a.createdAt) < next).length;
    chartData.push({
      month: format(m, 'MMM yy', { locale: ptBR }).replace('.', ''),
      membros: cum,
    });
  }

  const membrosTotal = totalAlunos;
  const endPrev = endOfMonth(subMonths(new Date(), 1));
  const prevTotal = alunos.filter((a) => new Date(a.createdAt) <= endPrev).length;
  const pctCrescimento =
    prevTotal > 0
      ? Math.round(((membrosTotal - prevTotal) / prevTotal) * 100)
      : membrosTotal > 0
        ? 100
        : 0;

  const { data: ultimosRows } = await supabase
    .from('check_ins')
    .select(
      `
      id,
      horaEntrada,
      alunoId,
      alunos ( nomeCompleto, foto )
    `,
    )
    .order('horaEntrada', { ascending: false })
    .limit(8);

  const ultimosCheckins: DashboardData['ultimosCheckins'] = [];
  for (const r of (ultimosRows ?? []) as {
    id: string;
    horaEntrada: string;
    alunoId: string;
    alunos: { nomeCompleto: string; foto: string | null };
  }[]) {
    const uiPay = payUiByAluno.get(r.alunoId) ?? 'em-dia';
    const { status, color } = paymentColor(uiPay);
    const nome = r.alunos?.nomeCompleto ?? 'Aluno';
    const initials =
      nome
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?';
    ultimosCheckins.push({
      id: r.id,
      alunoId: r.alunoId,
      name: nome,
      avatarUrl: r.alunos?.foto?.startsWith('http') ? r.alunos.foto : null,
      initials,
      status,
      statusColor: color,
      plan: planByAluno.get(r.alunoId) ?? 'BASIC',
      timeAgo: timeAgoPt(r.horaEntrada),
    });
  }

  return {
    data: {
      kpis: {
        ativos,
        inativos,
        checkinsHoje: checkinsHoje ?? 0,
        freqMediaSemanal,
      },
      turistasCount: turistas.length,
      novosMes,
      membrosTotal,
      pctCrescimento,
      chartData,
      ultimosCheckins,
      turistas: turistas.slice(0, 5),
    },
    error: null,
  };
}

const BUCKET_AVATARES_ALUNOS = 'avatares-alunos';

function extensaoFotoAluno(file: File): string {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

async function uploadFotoAlunoPublica(
  alunoId: string,
  file: File,
): Promise<{ publicUrl: string } | { error: string }> {
  const ext = extensaoFotoAluno(file);
  const path = `${alunoId}/avatar.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET_AVATARES_ALUNOS).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || 'image/jpeg',
  });
  if (upErr) return { error: upErr.message };
  const { data } = supabase.storage.from(BUCKET_AVATARES_ALUNOS).getPublicUrl(path);
  if (!data?.publicUrl) return { error: 'Não foi possível obter a URL pública da foto.' };
  return { publicUrl: data.publicUrl };
}

export async function createAlunoCompleto(input: {
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  celular: string;
  email: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  objetivos: string[];
  possuiLimitacoes: boolean;
  limitacoesDetalhes: string;
  fazUsoMedicamentos: boolean;
  medicamentosDetalhes: string;
  possuiLesoes: boolean;
  lesoesDetalhes: string;
  praticaAtividades: boolean;
  atividadesDetalhes: string;
  dataInicio: string;
  dataVencimento: string;
  formaPagamento: string;
  planoNome: string;
  observacoes: string;
  comoConheceu: string;
  aceitaTermos: boolean;
  fotoFile?: File | null;
}): Promise<{ error: string | null; alunoId?: string }> {
  const alunoId = crypto.randomUUID();
  const codigoMembro = `F${alunoId.replace(/-/g, '').slice(0, 10).toUpperCase()}`;

  const nasc = new Date(input.dataNascimento);
  if (Number.isNaN(nasc.getTime())) {
    return { error: 'Data de nascimento inválida' };
  }

  const { error: e1 } = await supabase.from('alunos').insert({
    id: alunoId,
    codigoMembro,
    nomeCompleto: input.nomeCompleto.trim(),
    dataNascimento: nasc.toISOString(),
    cpf: input.cpf.replace(/\D/g, ''),
    rg: input.rg || null,
    telefone: input.telefone || null,
    celular: input.celular,
    email: input.email.trim().toLowerCase(),
    foto: null,
    endereco: input.endereco,
    numero: input.numero,
    complemento: input.complemento || null,
    bairro: input.bairro,
    cidade: input.cidade,
    estado: input.estado,
    cep: input.cep.replace(/\D/g, ''),
    ativo: true,
    comoConheceu: input.comoConheceu || null,
    aceitouTermos: input.aceitaTermos,
    dataAceiteTermos: input.aceitaTermos ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (e1) return { error: e1.message };

  const { data: planoRow } = await supabase
    .from('planos')
    .select('id, preco')
    .eq('nome', input.planoNome.toUpperCase())
    .maybeSingle();

  const planoId = (planoRow as { id: string; preco: number } | null)?.id;
  const valorMensal =
    (planoRow as { id: string; preco: number } | null)?.preco ?? 0;

  let ordem = 0;
  for (const obj of input.objetivos) {
    const { error: eo } = await supabase.from('objetivos_aluno').insert({
      id: crypto.randomUUID(),
      alunoId,
      objetivo: obj,
      ordem,
    });
    if (eo) return { error: eo.message };
    ordem += 1;
  }

  const { error: es } = await supabase.from('saude_aluno').insert({
    id: crypto.randomUUID(),
    alunoId,
    possuiLimitacoes: input.possuiLimitacoes,
    limitacoesDetalhes: input.limitacoesDetalhes || null,
    fazUsoMedicamentos: input.fazUsoMedicamentos,
    medicamentosDetalhes: input.medicamentosDetalhes || null,
    possuiLesoes: input.possuiLesoes,
    lesoesDetalhes: input.lesoesDetalhes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (es) return { error: es.message };

  const { error: eh } = await supabase.from('historico_atividades').insert({
    id: crypto.randomUUID(),
    alunoId,
    praticaAtividades: input.praticaAtividades,
    atividadesDetalhes: input.atividadesDetalhes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (eh) return { error: eh.message };

  if (planoId && input.dataInicio && input.dataVencimento) {
    const di = new Date(input.dataInicio);
    const dv = new Date(input.dataVencimento);
    const contratoId = crypto.randomUUID();
    const { error: ec } = await supabase.from('contratos').insert({
      id: contratoId,
      alunoId,
      planoId,
      dataInicio: di.toISOString(),
      dataVencimento: dv.toISOString(),
      formaPagamento: input.formaPagamento,
      valorMensal,
      diaVencimento: dv.getDate(),
      status: 'ATIVO',
      observacoes: input.observacoes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (ec) return { error: ec.message };

    const { error: ep } = await supabase.from('pagamentos').insert({
      id: crypto.randomUUID(),
      contratoId,
      dataVencimento: dv.toISOString(),
      valor: valorMensal,
      status: 'PENDENTE',
      formaPagamento: input.formaPagamento,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (ep) return { error: ep.message };
  }

  if (input.fotoFile && input.fotoFile.size > 0) {
    const up = await uploadFotoAlunoPublica(alunoId, input.fotoFile);
    if ('error' in up) return { error: up.error, alunoId };
    const { error: eFoto } = await supabase
      .from('alunos')
      .update({ foto: up.publicUrl, updatedAt: new Date().toISOString() })
      .eq('id', alunoId);
    if (eFoto) return { error: eFoto.message, alunoId };
  }

  return { error: null, alunoId };
}
