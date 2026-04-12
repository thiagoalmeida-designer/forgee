/**
 * Cria ou atualiza o administrador master no Supabase Auth e na tabela public.admins.
 * O painel usa Auth (email/senha); o RLS exige o mesmo email em admins (ativo).
 *
 * Uso:
 *   1. Coloque SUPABASE_SERVICE_ROLE_KEY no .env (Project Settings → API no Dashboard).
 *   2. SUPABASE_URL ou VITE_SUPABASE_URL
 *   3. npm run seed:admin
 *
 * Opcional: MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASSWORD (senha padrão do projeto abaixo).
 */
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadDotEnv() {
  const p = join(root, '.env');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

loadDotEnv();

const EMAIL = (process.env.MASTER_ADMIN_EMAIL ?? 'tmalmeidaweb@gmail.com').toLowerCase();
const PASSWORD = process.env.MASTER_ADMIN_PASSWORD ?? 'descobre';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || serviceKey.includes('COLE_AQUI')) {
  console.error(
    'Configure SUPABASE_URL (ou VITE_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY válida no .env',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findAuthUserIdByEmail(email) {
  let page = 1;
  const perPage = 1000;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const u = data.users.find((x) => (x.email || '').toLowerCase() === email.toLowerCase());
    if (u) return u.id;
    if (!data.users.length || data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

async function main() {
  const { data: created, error: cErr } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    app_metadata: { forgee_role: 'master' },
    user_metadata: { nome: 'Administrador master' },
  });

  let authUserId = created?.user?.id;

  if (cErr) {
    const msg = String(cErr.message || '');
    if (/already|registered|exists|duplicate/i.test(msg)) {
      authUserId = await findAuthUserIdByEmail(EMAIL);
      if (!authUserId) {
        throw new Error(
          'Não foi possível localizar o usuário Auth existente para este email.',
        );
      }
      const { error: uErr } = await supabase.auth.admin.updateUserById(authUserId, {
        password: PASSWORD,
        email_confirm: true,
        app_metadata: { forgee_role: 'master' },
        user_metadata: { nome: 'Administrador master' },
      });
      if (uErr) throw uErr;
      console.log('Supabase Auth: usuário atualizado →', EMAIL);
    } else {
      throw cErr;
    }
  } else {
    console.log('Supabase Auth: usuário criado →', EMAIL);
  }

  const senhaHash = bcrypt.hashSync(PASSWORD, 10);
  const now = new Date().toISOString();

  const { data: existingAdmin, error: selErr } = await supabase
    .from('admins')
    .select('id')
    .eq('email', EMAIL)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existingAdmin?.id) {
    const { error: upErr } = await supabase
      .from('admins')
      .update({
        senhaHash,
        nome: 'Administrador master',
        cargo: 'Master · acesso CRUD completo',
        ativo: true,
        updatedAt: now,
      })
      .eq('email', EMAIL);
    if (upErr) throw upErr;
    console.log('Tabela admins: registro atualizado (email =', EMAIL + ').');
  } else {
    const { error: insErr } = await supabase.from('admins').insert({
      id: authUserId,
      email: EMAIL,
      senhaHash,
      nome: 'Administrador master',
      cargo: 'Master · acesso CRUD completo',
      ativo: true,
      createdAt: now,
      updatedAt: now,
    });
    if (insErr) throw insErr;
    console.log('Tabela admins: registro criado (id alinhado ao Auth).');
  }

  console.log('\nLogin no painel:');
  console.log('  Email:', EMAIL);
  console.log('  Senha: (a definida no script / MASTER_ADMIN_PASSWORD)\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
