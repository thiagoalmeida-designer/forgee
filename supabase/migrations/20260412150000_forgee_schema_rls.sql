-- FORGEE Academia — schema alinhado a prisma/schema.prisma.prisma
-- + RLS para role authenticated (staff via email = admins.email)
-- + buckets Storage + policies
-- + funções auxiliares (staff + check-in por QR para recepção)

-- ═══════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════
CREATE TYPE "StatusContrato" AS ENUM ('ATIVO', 'SUSPENSO', 'CANCELADO', 'VENCIDO');
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');
CREATE TYPE "MetodoCheckIn" AS ENUM ('QR_CODE', 'CODIGO_MEMBRO', 'EMAIL', 'MANUAL');
CREATE TYPE "TipoCheckIn" AS ENUM ('NORMAL', 'EXPERIMENTAL', 'REPOSICAO', 'CORTESIA');
CREATE TYPE "TipoObservacao" AS ENUM ('GERAL', 'SAUDE', 'TREINO', 'FINANCEIRO', 'COMPORTAMENTO');
CREATE TYPE "TipoNotificacao" AS ENUM (
  'PAGAMENTO_VENCENDO',
  'PAGAMENTO_ATRASADO',
  'SEM_CHECKIN',
  'ANIVERSARIO',
  'CONTRATO_VENCENDO',
  'NOVO_ALUNO',
  'SISTEMA'
);

-- ═══════════════════════════════════════════════════════════════
-- TABELAS (nomes/colunas = Prisma @@map / campos)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE "academia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL DEFAULT 'FORGEE Academia',
    "cnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "site" TEXT,
    "logo" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "academia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "configuracoes_sistema" (
    "id" TEXT NOT NULL,
    "academiaId" TEXT NOT NULL,
    "horaAbertura" TEXT NOT NULL DEFAULT '06:00',
    "horaFechamento" TEXT NOT NULL DEFAULT '22:00',
    "diasSemCheckinParaRisco" INTEGER NOT NULL DEFAULT 10,
    "diasAntesVencimentoParaAlerta" INTEGER NOT NULL DEFAULT 5,
    "notificacaoEmailAtivo" BOOLEAN NOT NULL DEFAULT false,
    "notificacaoWhatsAppAtivo" BOOLEAN NOT NULL DEFAULT false,
    "whatsappToken" TEXT,
    "whatsappNumero" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "configuracoes_sistema_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT,
    "telefone" TEXT,
    "foto" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcesso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "alunos" (
    "id" TEXT NOT NULL,
    "codigoMembro" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "telefone" TEXT,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "foto" TEXT,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "comoConheceu" TEXT,
    "aceitouTermos" BOOLEAN NOT NULL DEFAULT false,
    "dataAceiteTermos" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "objetivos_aluno" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "objetivos_aluno_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "saude_aluno" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "possuiLimitacoes" BOOLEAN NOT NULL DEFAULT false,
    "limitacoesDetalhes" TEXT,
    "fazUsoMedicamentos" BOOLEAN NOT NULL DEFAULT false,
    "medicamentosDetalhes" TEXT,
    "possuiLesoes" BOOLEAN NOT NULL DEFAULT false,
    "lesoesDetalhes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "saude_aluno_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "historico_atividades" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "praticaAtividades" BOOLEAN NOT NULL DEFAULT false,
    "atividadesDetalhes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "historico_atividades_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "planos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracaoMeses" INTEGER NOT NULL DEFAULT 1,
    "cor" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "planos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "beneficios_plano" (
    "id" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "beneficios_plano_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataCancelamento" TIMESTAMP(3),
    "formaPagamento" TEXT NOT NULL,
    "valorMensal" DECIMAL(10,2) NOT NULL,
    "diaVencimento" INTEGER NOT NULL,
    "status" "StatusContrato" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "formaPagamento" TEXT,
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "adminId" TEXT,
    "horaEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaSaida" TIMESTAMP(3),
    "metodoEntrada" "MetodoCheckIn" NOT NULL DEFAULT 'QR_CODE',
    "tipo" "TipoCheckIn" NOT NULL DEFAULT 'NORMAL',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peso" DECIMAL(5,2),
    "altura" DECIMAL(5,2),
    "imc" DECIMAL(5,2),
    "pescoco" DECIMAL(5,2),
    "torax" DECIMAL(5,2),
    "cintura" DECIMAL(5,2),
    "abdomen" DECIMAL(5,2),
    "quadril" DECIMAL(5,2),
    "coxaDir" DECIMAL(5,2),
    "coxaEsq" DECIMAL(5,2),
    "bracoDir" DECIMAL(5,2),
    "bracoEsq" DECIMAL(5,2),
    "percentualGordura" DECIMAL(5,2),
    "massaMagra" DECIMAL(5,2),
    "massaGorda" DECIMAL(5,2),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "observacoes" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "titulo" TEXT,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoObservacao" NOT NULL DEFAULT 'GERAL',
    "importante" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "observacoes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT,
    "adminId" TEXT,
    "tipo" "TipoNotificacao" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "configuracoes" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- Default Prisma: qrToken = uuid() no insert
ALTER TABLE "alunos" ALTER COLUMN "qrToken" SET DEFAULT (gen_random_uuid()::text);

-- ═══════════════════════════════════════════════════════════════
-- ÍNDICES & FKs
-- ═══════════════════════════════════════════════════════════════
CREATE UNIQUE INDEX "configuracoes_sistema_academiaId_key" ON "configuracoes_sistema"("academiaId");
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE UNIQUE INDEX "alunos_codigoMembro_key" ON "alunos"("codigoMembro");
CREATE UNIQUE INDEX "alunos_qrToken_key" ON "alunos"("qrToken");
CREATE UNIQUE INDEX "alunos_cpf_key" ON "alunos"("cpf");
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");
CREATE INDEX "alunos_ativo_idx" ON "alunos"("ativo");
CREATE INDEX "alunos_codigoMembro_idx" ON "alunos"("codigoMembro");
CREATE INDEX "alunos_email_idx" ON "alunos"("email");
CREATE UNIQUE INDEX "saude_aluno_alunoId_key" ON "saude_aluno"("alunoId");
CREATE UNIQUE INDEX "historico_atividades_alunoId_key" ON "historico_atividades"("alunoId");
CREATE UNIQUE INDEX "planos_nome_key" ON "planos"("nome");
CREATE INDEX "contratos_alunoId_idx" ON "contratos"("alunoId");
CREATE INDEX "contratos_status_idx" ON "contratos"("status");
CREATE INDEX "pagamentos_contratoId_idx" ON "pagamentos"("contratoId");
CREATE INDEX "pagamentos_status_idx" ON "pagamentos"("status");
CREATE INDEX "pagamentos_dataVencimento_idx" ON "pagamentos"("dataVencimento");
CREATE INDEX "check_ins_alunoId_idx" ON "check_ins"("alunoId");
CREATE INDEX "check_ins_horaEntrada_idx" ON "check_ins"("horaEntrada");
CREATE INDEX "avaliacoes_alunoId_idx" ON "avaliacoes"("alunoId");
CREATE INDEX "observacoes_alunoId_idx" ON "observacoes"("alunoId");
CREATE INDEX "notificacoes_adminId_lida_idx" ON "notificacoes"("adminId", "lida");
CREATE INDEX "notificacoes_createdAt_idx" ON "notificacoes"("createdAt");
CREATE UNIQUE INDEX "configuracoes_chave_key" ON "configuracoes"("chave");

ALTER TABLE "configuracoes_sistema" ADD CONSTRAINT "configuracoes_sistema_academiaId_fkey" FOREIGN KEY ("academiaId") REFERENCES "academia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "objetivos_aluno" ADD CONSTRAINT "objetivos_aluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saude_aluno" ADD CONSTRAINT "saude_aluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_atividades" ADD CONSTRAINT "historico_atividades_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "beneficios_plano" ADD CONSTRAINT "beneficios_plano_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "observacoes" ADD CONSTRAINT "observacoes_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "observacoes" ADD CONSTRAINT "observacoes_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- Funções: staff (Supabase Auth email = admins.email) + recepção QR
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.is_staff_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE lower(a.email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
      AND a.ativo = true
  );
$$;

CREATE OR REPLACE FUNCTION public.register_checkin_por_qr(p_token text, p_tipo "TipoCheckIn" DEFAULT 'NORMAL')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_aluno text;
  v_id text;
BEGIN
  IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
    RAISE EXCEPTION 'token_invalido' USING ERRCODE = 'P0001';
  END IF;
  SELECT a.id INTO v_aluno
  FROM public.alunos a
  WHERE a."qrToken" = p_token AND a.ativo = true
  LIMIT 1;
  IF v_aluno IS NULL THEN
    RAISE EXCEPTION 'aluno_nao_encontrado' USING ERRCODE = 'P0001';
  END IF;
  v_id := gen_random_uuid()::text;
  INSERT INTO public.check_ins (id, "alunoId", "adminId", "horaEntrada", "metodoEntrada", tipo)
  VALUES (v_id, v_aluno, NULL, now(), 'QR_CODE', p_tipo);
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_staff_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_checkin_por_qr(text, "TipoCheckIn") TO anon, authenticated;

COMMENT ON FUNCTION public.is_staff_admin IS 'true se auth.uid() corresponde a um admin ativo (email igual a admins.email)';
COMMENT ON FUNCTION public.register_checkin_por_qr IS 'Check-in por token QR (ModoRecepcao); não expõe tabela alunos via RLS anon';

-- ═══════════════════════════════════════════════════════════════
-- RLS: staff = is_staff_admin(); anon sem acesso direto às tabelas
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE "academia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "configuracoes_sistema" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "alunos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "objetivos_aluno" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "saude_aluno" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "historico_atividades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "planos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "beneficios_plano" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contratos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pagamentos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "check_ins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "avaliacoes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "observacoes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notificacoes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "configuracoes" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_all" ON "academia" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "configuracoes_sistema" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "admins" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "alunos" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "objetivos_aluno" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "saude_aluno" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "historico_atividades" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "planos" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "beneficios_plano" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "contratos" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "pagamentos" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "check_ins" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "avaliacoes" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "observacoes" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "notificacoes" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());
CREATE POLICY "staff_all" ON "configuracoes" FOR ALL TO authenticated USING (public.is_staff_admin()) WITH CHECK (public.is_staff_admin());

-- ═══════════════════════════════════════════════════════════════
-- Storage: buckets (prisma-schema.md)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatares-alunos', 'avatares-alunos', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('avatares-admin', 'avatares-admin', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('comprovantes', 'comprovantes', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]),
  ('logos', 'logos', false, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']::text[])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "staff_select_storage" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('avatares-alunos', 'avatares-admin', 'comprovantes', 'logos') AND public.is_staff_admin());
CREATE POLICY "staff_insert_storage" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('avatares-alunos', 'avatares-admin', 'comprovantes', 'logos') AND public.is_staff_admin());
CREATE POLICY "staff_update_storage" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('avatares-alunos', 'avatares-admin', 'comprovantes', 'logos') AND public.is_staff_admin())
  WITH CHECK (bucket_id IN ('avatares-alunos', 'avatares-admin', 'comprovantes', 'logos') AND public.is_staff_admin());
CREATE POLICY "staff_delete_storage" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('avatares-alunos', 'avatares-admin', 'comprovantes', 'logos') AND public.is_staff_admin());

-- ═══════════════════════════════════════════════════════════════
-- Seed mínimo: 1 academia + config sistema + planos padrão
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  aid text := gen_random_uuid()::text;
  cid text := gen_random_uuid()::text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.academia LIMIT 1) THEN
    INSERT INTO public.academia (id, nome, "createdAt", "updatedAt")
    VALUES (aid, 'FORGEE Academia', now(), now());
    INSERT INTO public.configuracoes_sistema (id, "academiaId", "createdAt", "updatedAt")
    VALUES (cid, aid, now(), now());
  END IF;
END $$;

INSERT INTO public.planos (id, nome, descricao, preco, "duracaoMeses", cor, destaque, ordem, ativo, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'BASIC', 'Plano básico', 99.90, 1, '#f2f2f2', false, 1, true, now(), now()),
  (gen_random_uuid()::text, 'PREMIUM', 'Plano premium', 149.90, 1, '#e8271a', true, 2, true, now(), now()),
  (gen_random_uuid()::text, 'ELITE', 'Plano elite', 199.90, 1, '#8B5CF6', false, 3, true, now(), now())
ON CONFLICT (nome) DO NOTHING;
