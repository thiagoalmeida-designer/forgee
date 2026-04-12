import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/AuthContext';

export function RequireAuth() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-[#a8a8a8] text-sm">
        Carregando…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
