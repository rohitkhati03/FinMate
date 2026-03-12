import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Users, PiggyBank, BarChart2, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { path: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/expenses',  icon: Receipt,         label: 'Expenses'  },
  { path: '/groups',    icon: Users,           label: 'Groups'    },
  { path: '/savings',   icon: PiggyBank,       label: 'Savings'   },
  { path: '/analytics', icon: BarChart2,       label: 'Analytics' },
];

function SidebarContent({ onClose }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💰</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>FinMate</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Smart Finance</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={20}/>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link key={path} to={path} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: active ? 600 : 400,
              color: active ? 'white' : 'var(--text-muted)',
              background: active ? 'var(--primary)' : 'transparent',
              transition: 'all 0.15s'
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
            >
              <Icon size={18}/>{label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16}/> Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', zIndex: 100 }} className="desktop-sidebar">
        <SidebarContent/>
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(true)} className="mobile-menu-btn" style={{ position: 'fixed', top: 16, left: 16, zIndex: 200, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', color: 'var(--text)', display: 'none' }}>
        <Menu size={20}/>
      </button>

      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}/>}

      {/* Mobile drawer */}
      <aside className="mobile-sidebar" style={{ position: 'fixed', left: open ? 0 : '-260px', top: 0, bottom: 0, width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', zIndex: 200, transition: 'left 0.25s ease', display: 'none' }}>
        <SidebarContent onClose={() => setOpen(false)}/>
      </aside>

      <style>{`
        @media (min-width: 769px) {
          .desktop-sidebar { display: block !important; }
          .mobile-menu-btn  { display: none  !important; }
          .mobile-sidebar   { display: none  !important; }
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none  !important; }
          .mobile-menu-btn  { display: flex !important; }
          .mobile-sidebar   { display: block !important; }
          main { margin-left: 0 !important; }
        }
      `}</style>
    </>
  );
}
