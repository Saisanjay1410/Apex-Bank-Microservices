import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Users, 
  Bot, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  show: boolean;
  badge?: string;
  sparkle?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user } = useAuthStore();

  const role = user?.role || 'ROLE_EMPLOYEE';
  const isAdminOrHr = role === 'ROLE_ADMIN' || role === 'ADMIN' || role === 'ROLE_HR' || role === 'HR';

  const sections: NavSection[] = [
    {
      title: 'Core Banking',
      items: [
        {
          to: '/dashboard',
          label: 'Executive Overview',
          icon: <LayoutDashboard size={19} />,
          show: true,
        },
        {
          to: '/accounts',
          label: 'Bank Accounts',
          icon: <Wallet size={19} />,
          show: true,
        },
        {
          to: '/transactions',
          label: 'Transaction Ledger',
          icon: <ArrowLeftRight size={19} />,
          show: true,
        },
      ],
    },
    {
      title: 'Operations & AI',
      items: [
        {
          to: '/employees',
          label: 'Staff Directory',
          icon: <Users size={19} />,
          show: isAdminOrHr,
          badge: 'HR / Admin',
        },
        {
          to: '/assistant',
          label: 'AI Assistant',
          icon: <Bot size={19} />,
          show: true,
          sparkle: true,
        },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        {
          to: '/health',
          label: 'Cluster Topology',
          icon: <Activity size={19} />,
          show: true,
          badge: '5 Nodes',
        },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '74px' : '250px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-card)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-smooth)',
        position: 'relative',
        zIndex: 30,
        userSelect: 'none',
      }}
    >
      {/* Navigation Groups */}
      <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, overflowY: 'auto' }}>
        {sections.map((section, sIdx) => {
          const visibleItems = section.items.filter((it) => it.show);
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    padding: '0 0.75rem 0.35rem',
                  }}
                >
                  {section.title}
                </div>
              )}

              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.84375rem',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>

                  {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {item.label}
                        {item.sparkle && <Sparkles size={13} style={{ color: 'var(--accent-amber)' }} />}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            padding: '0.125rem 0.4rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Collapse Footer */}
      <div
        style={{
          padding: '0.85rem',
          borderTop: '1px solid var(--border-card)',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
        }}
      >
        <button
          onClick={onToggleCollapse}
          className="btn-ghost"
          style={{
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>
    </aside>
  );
};