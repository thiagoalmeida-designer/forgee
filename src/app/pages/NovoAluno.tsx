import { useState, useRef } from 'react';
import { createAlunoCompleto } from '../../lib/forgeeApi';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Save, User, Target, Heart,
  Activity, FileText, Info, ChevronDown, Camera
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_NIMBUS = "'Nimbus Sans', sans-serif";
const FONT_INTER = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface FormData {
  // Dados Pessoais
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

  // Objetivos
  objetivos: string[];

  // Saúde
  possuiLimitacoes: boolean;
  limitacoesDetalhes: string;
  fazUsoMedicamentos: boolean;
  medicamentosDetalhes: string;
  possuiLesoes: boolean;
  lesoesDetalhes: string;

  // Histórico
  praticaAtividades: boolean;
  atividadesDetalhes: string;

  // Contrato
  dataInicio: string;
  dataVencimento: string;
  formaPagamento: string;
  plano: string;
  observacoes: string;

  // Informações Adicionais
  comoConheceu: string;
  aceitaTermos: boolean;
}

/* ─── Sub-components ────────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  number: string;
}

function SectionHeader({ icon, title, number }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-[#E02020] mb-6">
      <div className="w-6 h-6 flex items-center justify-center text-[#E02020]">
        {icon}
      </div>
      <h2
        className="text-[#f2f2f2] uppercase leading-none"
        style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}
      >
        {number}. {title}
      </h2>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function FormField({ label, required = false, children, fullWidth = false }: FormFieldProps) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <label
        className="block mb-2 text-[#a8a8a8] uppercase tracking-[0.7px]"
        style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: '12px' }}
      >
        {label} {required && <span className="text-[#E02020]">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export function NovoAluno() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    telefone: '',
    celular: '',
    email: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    objetivos: [],
    possuiLimitacoes: false,
    limitacoesDetalhes: '',
    fazUsoMedicamentos: false,
    medicamentosDetalhes: '',
    possuiLesoes: false,
    lesoesDetalhes: '',
    praticaAtividades: false,
    atividadesDetalhes: '',
    dataInicio: '',
    dataVencimento: '',
    formaPagamento: '',
    plano: '',
    observacoes: '',
    comoConheceu: '',
    aceitaTermos: false,
  });

  const objetivosOptions = [
    'Ganho de massa muscular',
    'Perda de peso',
    'Condicionamento físico',
    'Saúde e bem-estar',
    'Reabilitação',
    'Performance esportiva',
  ];

  const toggleObjetivo = (objetivo: string) => {
    setFormData(prev => ({
      ...prev,
      objetivos: prev.objetivos.includes(objetivo)
        ? prev.objetivos.filter(o => o !== objetivo)
        : [...prev.objetivos, objetivo]
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        window.alert('A foto deve ter no máximo 5 MB.');
        e.target.value = '';
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aceitaTermos) {
      window.alert('É necessário aceitar os termos para cadastrar o aluno.');
      return;
    }
    if (photoFile && photoFile.size > 5 * 1024 * 1024) {
      window.alert('A foto deve ter no máximo 5 MB.');
      return;
    }
    setSaving(true);
    const { error, alunoId } = await createAlunoCompleto({
      nomeCompleto: formData.nomeCompleto,
      dataNascimento: formData.dataNascimento,
      cpf: formData.cpf,
      rg: formData.rg,
      telefone: formData.telefone,
      celular: formData.celular,
      email: formData.email,
      endereco: formData.endereco,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
      objetivos: formData.objetivos,
      possuiLimitacoes: formData.possuiLimitacoes,
      limitacoesDetalhes: formData.limitacoesDetalhes,
      fazUsoMedicamentos: formData.fazUsoMedicamentos,
      medicamentosDetalhes: formData.medicamentosDetalhes,
      possuiLesoes: formData.possuiLesoes,
      lesoesDetalhes: formData.lesoesDetalhes,
      praticaAtividades: formData.praticaAtividades,
      atividadesDetalhes: formData.atividadesDetalhes,
      dataInicio: formData.dataInicio,
      dataVencimento: formData.dataVencimento,
      formaPagamento: formData.formaPagamento,
      planoNome: formData.plano,
      observacoes: formData.observacoes,
      comoConheceu: formData.comoConheceu,
      aceitaTermos: formData.aceitaTermos,
      fotoFile: photoFile ?? undefined,
    });
    setSaving(false);
    if (error) {
      window.alert(error);
      return;
    }
    navigate(alunoId ? `/dashboard/alunos/${alunoId}` : '/dashboard/alunos');
  };

  const inputClass = "w-full bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-4 py-2.5 text-[#f2f2f2] placeholder:text-[#606060] focus:border-[#E02020] focus:outline-none transition-colors text-sm";
  const selectClass = "w-full bg-[#1a1a1a] border border-[#303030] rounded-[10px] px-4 py-2.5 text-[#f2f2f2] focus:border-[#E02020] focus:outline-none transition-colors appearance-none text-sm";

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Header */}
      <motion.header
        className="bg-[#090909] border-b border-[#303030] sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back button + Title */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-[#606060] hover:text-[#A8A8A8] transition-colors"
              >
                <ArrowLeft size={18} />
                <span style={{ fontFamily: FONT_MONO, fontSize: '12px', letterSpacing: '0.6px' }} className="uppercase">
                  Voltar
                </span>
              </Link>

              <div className="w-px h-6 bg-[#303030]" />

              <h1
                className="text-[#f2f2f2] uppercase leading-none"
                style={{ fontFamily: FONT_NIMBUS, fontWeight: 700, fontSize: '24px', letterSpacing: '-0.6px' }}
              >
                Cadastrar Novo Aluno
              </h1>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-[#0d0d0d] border border-[#303030] text-[#f2f2f2] hover:border-[#555] rounded-[10px] px-4 py-2 transition-all duration-200"
                style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
              >
                CANCELAR
              </button>

              <button
                type="submit"
                form="cadastro-form"
                disabled={saving}
                className="flex items-center gap-2 bg-[#E02020] hover:bg-[#E94040] disabled:opacity-60 text-white rounded-[10px] px-4 py-2 transition-all duration-200 hover:shadow-[0_0_16px_rgba(224,32,32,0.45)]"
                style={{ fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.6px' }}
              >
                <Save size={14} />
                {saving ? 'SALVANDO…' : 'SALVAR CADASTRO'}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[900px] mx-auto px-6 py-8">
        <form id="cadastro-form" onSubmit={handleSubmit} className="space-y-10">

          {/* 1. DADOS PESSOAIS */}
          <motion.section
            className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionHeader icon={<User size={20} />} title="Dados Pessoais" number="1" />

            {/* Photo Upload */}
            <div className="mb-8">
              <label
                className="block mb-3 text-[#a8a8a8] uppercase tracking-[0.7px]"
                style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: '12px' }}
              >
                Foto do Aluno
              </label>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="relative group cursor-pointer overflow-hidden border-2 border-dashed hover:border-[#E02020] transition-all duration-300"
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '12px',
                    borderColor: photoPreview ? '#303030' : '#404040',
                    backgroundColor: photoPreview ? 'transparent' : '#1a1a1a',
                  }}
                >
                  {photoPreview ? (
                    <>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Camera size={28} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Camera size={32} className="text-[#606060] group-hover:text-[#E02020] transition-colors" />
                      <span
                        className="text-[#606060] group-hover:text-[#E02020] transition-colors uppercase tracking-wide"
                        style={{ fontFamily: FONT_MONO, fontSize: '10px', fontWeight: 500 }}
                      >
                        Upload
                      </span>
                    </div>
                  )}
                </button>

                <div className="flex-1">
                  <p
                    className="text-[#f2f2f2] mb-1"
                    style={{ fontFamily: FONT_INTER, fontSize: '14px', fontWeight: 500 }}
                  >
                    {photoPreview ? 'Foto selecionada' : 'Adicionar foto do aluno'}
                  </p>
                  <p
                    className="text-[#888888] mb-3"
                    style={{ fontFamily: FONT_INTER, fontSize: '13px' }}
                  >
                    {photoPreview
                      ? 'Clique na imagem para alterar a foto'
                      : 'Clique para fazer upload da foto (JPG, PNG — máx. 5MB)'
                    }
                  </p>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoPreview('');
                        setPhotoFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[#E02020] hover:text-[#E94040] transition-colors uppercase tracking-wide"
                      style={{ fontFamily: FONT_MONO, fontSize: '11px', fontWeight: 600 }}
                    >
                      Remover Foto
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nome completo" required fullWidth>
                <input
                  type="text"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  className={inputClass}
                  placeholder="Digite o nome completo"
                  required
                />
              </FormField>

              <FormField label="Data de nascimento" required>
                <input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="CPF" required>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className={inputClass}
                  placeholder="000.000.000-00"
                  required
                />
              </FormField>

              <FormField label="RG">
                <input
                  type="text"
                  value={formData.rg}
                  onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                  className={inputClass}
                  placeholder="00.000.000-0"
                />
              </FormField>

              <FormField label="Telefone">
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className={inputClass}
                  placeholder="(00) 0000-0000"
                />
              </FormField>

              <FormField label="Celular" required>
                <input
                  type="tel"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className={inputClass}
                  placeholder="(00) 00000-0000"
                  required
                />
              </FormField>

              <FormField label="E-mail" required fullWidth>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="exemplo@email.com"
                  required
                />
              </FormField>

              <FormField label="Endereço" required>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className={inputClass}
                  placeholder="Rua, Avenida..."
                  required
                />
              </FormField>

              <FormField label="Número" required>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className={inputClass}
                  placeholder="123"
                  required
                />
              </FormField>

              <FormField label="Complemento">
                <input
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  className={inputClass}
                  placeholder="Apto, Bloco..."
                />
              </FormField>

              <FormField label="Bairro" required>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  className={inputClass}
                  placeholder="Centro"
                  required
                />
              </FormField>

              <FormField label="Cidade" required>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className={inputClass}
                  placeholder="São Paulo"
                  required
                />
              </FormField>

              <FormField label="Estado" required>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className={selectClass}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  {/* Add more states as needed */}
                </select>
              </FormField>

              <FormField label="CEP" required>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  className={inputClass}
                  placeholder="00000-000"
                  required
                />
              </FormField>
            </div>
          </motion.section>

          {/* 2. QUAL O SEU OBJETIVO NA ACADEMIA */}
          <motion.section
            className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionHeader icon={<Target size={20} />} title="Qual o seu objetivo na academia?" number="2" />

            <div className="space-y-3">
              {objetivosOptions.map((objetivo) => (
                <label
                  key={objetivo}
                  className="flex items-center gap-3 p-3 rounded-[10px] border border-transparent hover:border-[#303030] hover:bg-[#161616] transition-all cursor-pointer"
                >
                  <Checkbox
                    checked={formData.objetivos.includes(objetivo)}
                    onCheckedChange={() => toggleObjetivo(objetivo)}
                    className="border-[#303030] data-[state=checked]:bg-[#E02020] data-[state=checked]:border-[#E02020]"
                  />
                  <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>
                    {objetivo}
                  </span>
                </label>
              ))}
            </div>
          </motion.section>

          {/* 3. INFORMAÇÕES DE SAÚDE E CONDICIONAMENTO */}
          <motion.section
            className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SectionHeader icon={<Heart size={20} />} title="Informações de Saúde e Condicionamento" number="3" />

            <div className="space-y-6">
              {/* Limitações físicas */}
              <div>
                <p className="text-[#f2f2f2] mb-3" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                  Possui alguma limitação física ou restrição médica?
                </p>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.possuiLimitacoes === true}
                      onChange={() => setFormData({ ...formData, possuiLimitacoes: true })}
                      className="w-4 h-4 accent-[#E02020]"
                    />
                    <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.possuiLimitacoes === false}
                      onChange={() => setFormData({ ...formData, possuiLimitacoes: false })}
                      className="w-4 h-4 accent-[#E02020]"
                    />
                    <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Não</span>
                  </label>
                </div>
                {formData.possuiLimitacoes && (
                  <textarea
                    value={formData.limitacoesDetalhes}
                    onChange={(e) => setFormData({ ...formData, limitacoesDetalhes: e.target.value })}
                    className={`${inputClass} min-h-[80px] resize-none`}
                    placeholder="Descreva as limitações..."
                  />
                )}
              </div>

              {/* Medicamentos */}
              <div>
                <p className="text-[#f2f2f2] mb-3" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                  Faz uso contínuo de medicamentos?
                </p>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.fazUsoMedicamentos === true}
                      onChange={() => setFormData({ ...formData, fazUsoMedicamentos: true })}
                      className="w-4 h-4 accent-[#E02020]"
                    />
                    <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.fazUsoMedicamentos === false}
                      onChange={() => setFormData({ ...formData, fazUsoMedicamentos: false })}
                      className="w-4 h-4 accent-[#E02020]"
                    />
                    <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Não</span>
                  </label>
                </div>
                {formData.fazUsoMedicamentos && (
                  <textarea
                    value={formData.medicamentosDetalhes}
                    onChange={(e) => setFormData({ ...formData, medicamentosDetalhes: e.target.value })}
                    className={`${inputClass} min-h-[80px] resize-none`}
                    placeholder="Liste os medicamentos..."
                  />
                )}
              </div>

              {/* Lesões */}
              <div>
                <p className="text-[#f2f2f2] mb-3" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                  Possui ou já teve lesões musculares/articulares?
                </p>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.possuiLesoes === true}
                      onChange={() => setFormData({ ...formData, possuiLesoes: true })}
                      className="w-4 h-4 accent-[#E02020]"
                    />
                    <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.possuiLesoes === false}
                      onChange={() => setFormData({ ...formData, possuiLesoes: false })}
                      className="w-4 h-4 accent-[#E02020]"
                    />
                    <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Não</span>
                  </label>
                </div>
                {formData.possuiLesoes && (
                  <textarea
                    value={formData.lesoesDetalhes}
                    onChange={(e) => setFormData({ ...formData, lesoesDetalhes: e.target.value })}
                    className={`${inputClass} min-h-[80px] resize-none`}
                    placeholder="Descreva as lesões..."
                  />
                )}
              </div>
            </div>
          </motion.section>

          {/* 4. HISTÓRICO DE ATIVIDADES */}
          <motion.section
            className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SectionHeader icon={<Activity size={20} />} title="Histórico de Atividades" number="4" />

            <div>
              <p className="text-[#f2f2f2] mb-3" style={{ fontFamily: FONT_INTER, fontSize: '14px' }}>
                Pratica ou praticou atividades físicas regularmente?
              </p>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.praticaAtividades === true}
                    onChange={() => setFormData({ ...formData, praticaAtividades: true })}
                    className="w-4 h-4 accent-[#E02020]"
                  />
                  <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Sim</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.praticaAtividades === false}
                    onChange={() => setFormData({ ...formData, praticaAtividades: false })}
                    className="w-4 h-4 accent-[#E02020]"
                  />
                  <span className="text-[#f2f2f2] text-sm" style={{ fontFamily: FONT_INTER }}>Não</span>
                </label>
              </div>
              {formData.praticaAtividades && (
                <FormField label="Quais atividades?" fullWidth>
                  <textarea
                    value={formData.atividadesDetalhes}
                    onChange={(e) => setFormData({ ...formData, atividadesDetalhes: e.target.value })}
                    className={`${inputClass} min-h-[80px] resize-none`}
                    placeholder="Ex: Musculação, corrida, natação..."
                  />
                </FormField>
              )}
            </div>
          </motion.section>

          {/* 5. DADOS DO CONTRATO E PLANO */}
          <motion.section
            className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SectionHeader icon={<FileText size={20} />} title="Dados do Contrato e Plano" number="5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Data de início" required>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Data de vencimento" required>
                <input
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Forma de pagamento" required>
                <select
                  value={formData.formaPagamento}
                  onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                  className={selectClass}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Débito Automático">Débito Automático</option>
                  <option value="PIX">PIX</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </FormField>

              <FormField label="Plano selecionado" required>
                <select
                  value={formData.plano}
                  onChange={(e) => setFormData({ ...formData, plano: e.target.value })}
                  className={selectClass}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="BASIC">BASIC</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="ELITE">ELITE</option>
                </select>
              </FormField>

              <FormField label="Observações do contrato" fullWidth>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="Informações adicionais sobre o contrato..."
                />
              </FormField>
            </div>
          </motion.section>

          {/* 6. INFORMAÇÕES ADICIONAIS */}
          <motion.section
            className="bg-[#0d0d0d] border border-[#303030] rounded-[14px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <SectionHeader icon={<Info size={20} />} title="Informações Adicionais" number="6" />

            <div className="space-y-5">
              <FormField label="Como conheceu a academia?" fullWidth>
                <select
                  value={formData.comoConheceu}
                  onChange={(e) => setFormData({ ...formData, comoConheceu: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Selecione</option>
                  <option value="Indicação de amigo/familiar">Indicação de amigo/familiar</option>
                  <option value="Redes sociais">Redes sociais</option>
                  <option value="Google">Google</option>
                  <option value="Panfleto/propaganda">Panfleto/propaganda</option>
                  <option value="Passei em frente">Passei em frente</option>
                  <option value="Outros">Outros</option>
                </select>
              </FormField>

              <label className="flex items-start gap-3 p-4 rounded-[10px] border border-[#303030] cursor-pointer hover:border-[#E02020] transition-colors">
                <Checkbox
                  checked={formData.aceitaTermos}
                  onCheckedChange={(checked) => setFormData({ ...formData, aceitaTermos: checked as boolean })}
                  className="mt-0.5 border-[#303030] data-[state=checked]:bg-[#E02020] data-[state=checked]:border-[#E02020]"
                />
                <div>
                  <p className="text-[#f2f2f2] text-sm mb-1" style={{ fontFamily: FONT_INTER, fontWeight: 500 }}>
                    Aceito os termos e condições
                  </p>
                  <p className="text-[#a8a8a8] text-xs leading-relaxed" style={{ fontFamily: FONT_INTER }}>
                    Declaro estar ciente e de acordo com os termos do contrato de prestação de serviços,
                    regimento interno e políticas de uso da academia FORGEE. Autorizo o uso de minha imagem
                    para fins institucionais e de marketing da academia.
                  </p>
                </div>
              </label>
            </div>
          </motion.section>

          {/* Bottom spacing */}
          <div className="h-8" />
        </form>
      </main>
    </div>
  );
}
