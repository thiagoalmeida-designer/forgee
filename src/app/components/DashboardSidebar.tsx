import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Users, ClipboardCheck,
  Radio, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const FONT_BARLOW = "'Nimbus Sans', sans-serif";
const FONT_INTER = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Alunos', path: '/dashboard/alunos' },
  { icon: ClipboardCheck, label: 'Check-ins', path: '/dashboard/checkins' },
  { icon: Radio, label: 'Modo Recepção', path: '/dashboard/recepcao' },
  { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const adminLabel = user?.email?.split('@')[0] ?? 'Admin';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a1a1a] shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[#E02020] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(224,32,32,0.4)]">
            <span style={{ fontFamily: FONT_BARLOW, fontWeight: 900, fontSize: '14px', color: '#fff' }}>F</span>
          </div>
          <div>
            <p className="text-white leading-none" style={{ fontFamily: FONT_BARLOW, fontWeight: 900, fontSize: '20px', letterSpacing: '-0.3px' }}>
              FORGEE
            </p>
            <p className="text-[#606060] mt-0.5 tracking-[1.2px]" style={{ fontFamily: FONT_MONO, fontSize: '9px' }}>
              ADMIN PANEL
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, i) => {
            const active = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
            const Icon = item.icon;
            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.35, ease: 'easeOut' }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 group ${
                    active
                      ? 'bg-[#E02020] text-white shadow-[0_0_12px_rgba(224,32,32,0.25)]'
                      : 'text-[#A8A8A8] hover:bg-[#1a1a1a] hover:text-[#f2f2f2]'
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.6} className="shrink-0" />
                  <span style={{ fontFamily: FONT_INTER, fontWeight: active ? 500 : 400, fontSize: '14px' }}>
                    {item.label}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Admin + Logout */}
      <div className="p-3 border-t border-[#1a1a1a] shrink-0">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-8 h-8 rounded-full bg-[#E02020] flex items-center justify-center shrink-0">
            <span style={{ fontFamily: FONT_BARLOW, fontWeight: 700, fontSize: '14px', color: '#fff' }}>A</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#f2f2f2] truncate" style={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: '13px' }}>
              {adminLabel}
            </p>
            <p className="text-[#606060] tracking-[0.8px]" style={{ fontFamily: FONT_MONO, fontSize: '9px', marginTop: '2px' }}>
              {user?.email ?? '—'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate('/login', { replace: true });
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-[#606060] hover:text-[#A8A8A8] rounded-[10px] hover:bg-[#1a1a1a] transition-all duration-200 text-left"
        >
          <LogOut size={15} />
          <span style={{ fontFamily: FONT_INTER, fontSize: '13px' }}>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[200px] shrink-0 bg-[#0a0a0a] border-r border-[#1a1a1a] h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-[220px] bg-[#0a0a0a] border-r border-[#1a1a1a] z-50 lg:hidden"
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
