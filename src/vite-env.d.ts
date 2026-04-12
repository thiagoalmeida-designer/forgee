/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_URL: string;
  /** PIN para sair do Modo Recepção (opcional; padrão no código se vazio) */
  readonly VITE_RECEPCAO_EXIT_PIN?: string;
  /** Token QR de um aluno de teste para o botão demo (opcional) */
  readonly VITE_DEMO_QR_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
