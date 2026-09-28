import React from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  Database, 
  Menu
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, mockMode, toggleMockMode, theme, toggleTheme, setDemoUser } = useAuthStore();

  const getRoleBadgeVariant = (role?: string) => {
    if (role === 'ROLE_ADMIN' || role === 'ADMIN') return 'rose';
    if (role === 'ROLE_HR' || role === 'HR') return 'amber';
    return 'indigo';
  };

  const getRoleDisplayName = (role?: string) => {
    if (role === 'ROLE_ADMIN' || role === 'ADMIN') return 'Administrator';
    if (role === 'ROLE_HR' || role === 'HR') return 'HR Manager';
    return 'Employee';
  };

  return (
    <header
      style={{
        height: '60px',
        borderBottom: '1px solid var(--border-card)',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left: Mobile Toggle & Brand Emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn-ghost"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
            }}
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text-primary)' }}>
              Apex<span style={{ color: 'var(--primary)' }}>Bank</span>
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
              Microservices Portal
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Connectivity, Demo Switcher, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Backend Connection Indicator & Toggle */}
        <div
          onClick={() => toggleMockMode()}
          title="Click to toggle between Live Spring Boot backend and offline Mock Fallback"
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: mockMode ? 'var(--accent-amber-light)' : 'var(--accent-emerald-light)',
            border: `1px solid ${mockMode ? 'rgba(217, 119, 6, 0.25)' : 'rgba(5, 150, 105, 0.25)'}`,
            transition: 'all var(--transition-fast)',
            fontSize: '0.71875rem',
            fontWeight: 600,
          }}
        >
          {mockMode ? (
            <>
              <Database size={12} style={{ color: 'var(--accent-amber)' }} />
              <span style={{ color: 'var(--accent-amber-text)' }}>Mock Mode</span>
            </>
          ) : (
            <>
              <span className="pulse-dot" style={{ backgroundColor: 'var(--accent-emerald)', width: '6px', height: '6px' }} />
              <span style={{ color: 'var(--accent-emerald-text)' }}>Live Backend (:8081)</span>
            </>
          )}
        </div>

        {/* Quick Demo Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            value={user?.role || 'ROLE_EMPLOYEE'}
            onChange={(e) => setDemoUser(e.target.value as any)}
            title="Switch active role"
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-card)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ROLE_ADMIN">Role: Admin</option>
            <option value="ROLE_HR">Role: HR Manager</option>
            <option value="ROLE_EMPLOYEE">Role: Employee</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => toggleTheme()}
          className="btn-ghost"
          style={{
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-secondary)',
          }}
          aria-label="Toggle dark/light theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Profile Pill */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              paddingLeft: '0.55rem',
              borderLeft: '1px solid var(--border-card)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)' }}>
                {user.username}
              </span>
              <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="btn-ghost"
          style={{
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--accent-rose)',
          }}
          aria-label="Log out"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};