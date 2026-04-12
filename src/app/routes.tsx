import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NovoAluno } from './pages/NovoAluno';
import { Alunos } from './pages/Alunos';
import { AlunosPerfil } from './pages/AlunosPerfil';
import CheckIns from './pages/CheckIns';
import ModoRecepcao from './pages/ModoRecepcao';
import { Configuracoes } from './pages/Configuracoes';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [{ index: true, Component: Home }],
  },
  { path: '/login', Component: Login },
  {
    path: '/dashboard',
    Component: RequireAuth,
    children: [
      { index: true, Component: Dashboard },
      { path: 'alunos', Component: Alunos },
      { path: 'alunos/:id', Component: AlunosPerfil },
      { path: 'novo-aluno', Component: NovoAluno },
      { path: 'checkins', Component: CheckIns },
      { path: 'recepcao', Component: ModoRecepcao },
      { path: 'configuracoes', Component: Configuracoes },
    ],
  },
  { path: '*', Component: NotFound },
]);
