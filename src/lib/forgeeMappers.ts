import { addDays, format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type UiPagamentoStatus = 'em-dia' | 'vencendo' | 'atrasado';

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0] ?? '?').slice(0, 2).toUpperCase();
}

/** Deriva status de cobrança para UI a partir de parcelas do contrato. */
export function derivePagamentoUi(
  pagamentos: Array<{ status: string; dataVencimento: string }>,
): UiPagamentoStatus {
  const now = new Date();
  const limit = addDays(now, 5);
  for (const p of pagamentos) {
    if (p.status === 'ATRASADO') return 'atrasado';
  }
  for (const p of pagamentos) {
    if (p.status !== 'PENDENTE') continue;
    const due = parseISO(p.dataVencimento);
    if (!isValid(due)) continue;
    if (due < now) return 'atrasado';
    if (due <= limit) return 'vencendo';
  }
  return 'em-dia';
}

export function formatDatePt(d: string | Date | null | undefined): string {
  if (!d) return '—';
  const dt = typeof d === 'string' ? parseISO(d) : d;
  if (!isValid(dt)) return '—';
  return format(dt, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTimePt(iso: string): { data: string; horario: string; timestamp: number } {
  const dt = parseISO(iso);
  if (!isValid(dt)) {
    return { data: '—', horario: '—', timestamp: 0 };
  }
  return {
    data: format(dt, 'dd/MM/yyyy', { locale: ptBR }),
    horario: format(dt, 'HH:mm', { locale: ptBR }),
    timestamp: dt.getTime(),
  };
}

export function mapPagamentoDbToUi(p: {
  id: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: number | string;
  status: string;
  formaPagamento: string | null;
}): {
  id: string;
  data: string;
  valor: string;
  metodo: 'Boleto' | 'PIX' | 'Cartão' | 'Dinheiro';
  status: 'pago' | 'atrasado' | 'pendente';
} {
  const st =
    p.status === 'PAGO'
      ? 'pago'
      : p.status === 'ATRASADO'
        ? 'atrasado'
        : 'pendente';
  const met = (p.formaPagamento ?? 'PIX').toLowerCase();
  const metodo: 'Boleto' | 'PIX' | 'Cartão' | 'Dinheiro' =
    met.includes('boleto')
      ? 'Boleto'
      : met.includes('cart')
        ? 'Cartão'
        : met.includes('dinheiro')
          ? 'Dinheiro'
          : 'PIX';
  const valorNum = typeof p.valor === 'string' ? parseFloat(p.valor) : p.valor;
  return {
    id: p.id,
    data: formatDatePt(p.dataPagamento ?? p.dataVencimento),
    valor: Number.isFinite(valorNum) ? valorNum.toFixed(2) : String(p.valor),
    metodo,
    status: st,
  };
}
