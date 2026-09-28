import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Server,
  Zap,
  Shield,
  Briefcase,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, mockMode, toggleMockMode } = useAuthStore();
  const { addToast } = useToastStore();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@bank.com');
  const [password, setPassword] = useState('Admin@123');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        const message = await authApi.register({
          username: username.trim(),
          email: email.trim(),
          password,
        });
        addToast({
          type: 'success',
          title: 'Registration Complete',
          description: message || 'Account registered! Please sign in.',
        });
        setIsRegister(false);
      } else {
        const response = await authApi.login({
          email: email.trim(),
          password,
        });

        setAuth(response.token, { email: email.trim() });
        addToast({
          type: 'success',
          title: 'Authentication Successful',
          description: response.message || 'Welcome to Apex Bank Enterprise Portal',
        });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsRegister(false);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        background: 'var(--bg-app)',
        position: 'relative',
      }}
      className="bg-mesh"
    >
      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 2 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 35px rgba(99, 102, 241, 0.45)',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <ShieldCheck size={34} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            Apex<span style={{ color: 'var(--primary)' }}>Bank</span> Enterprise
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Spring Boot Microservices & AI Gateway Console
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="card" style={{ padding: '2.25rem' }}>
          {/* Tabs: Sign In vs Register */}
          <div
            style={{
              display: 'flex',
              padding: '4px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
              border: '1px solid var(--border-card)',
            }}
          >
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: !isRegister ? 'var(--primary)' : 'transparent',
                color: !isRegister ? '#FFFFFF' : 'var(--text-muted)',
                boxShadow: !isRegister ? '0 2px 10px var(--primary-glow)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: isRegister ? 'var(--primary)' : 'transparent',
                color: isRegister ? '#FFFFFF' : 'var(--text-muted)',
                boxShadow: isRegister ? '0 2px 10px var(--primary-glow)' : 'none',
              }}
            >
              Register New User
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '0.85rem 1.15rem',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: 'var(--radius-md)',
                color: '#FDA4AF',
                fontSize: '0.8125rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose username"
                leftIcon={<User size={16} />}
                required
              />
            )}

            <Input
              label="Corporate Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@bank.com"
              leftIcon={<Mail size={16} />}
              required
            />

            <Input
              label="Account Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              helperText={isRegister ? 'Minimum 8 characters required' : undefined}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              style={{ width: '100%', marginTop: '0.75rem', height: '44px' }}
              rightIcon={<ArrowRight size={16} />}
            >
              {isRegister ? 'Complete Registration' : 'Authenticate with JWT'}
            </Button>
          </form>

          {/* Quick Demo Logins Section */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-card)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
              One-Click Seed Accounts (DataInitializer):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@bank.com', 'Admin@123')}
                style={{
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)',
                }}
                className="hover:border-indigo-500/60"
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                  <Shield size={16} style={{ color: 'var(--accent-rose)' }} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Full Access</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('hr@bank.com', 'Hr@123456')}
                style={{
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)',
                }}
                className="hover:border-indigo-500/60"
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                  <Briefcase size={16} style={{ color: 'var(--accent-amber)' }} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>HR Mgr</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Staff Mgmt</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('john.doe@bank.com', 'Emp@123456')}
                style={{
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)',
                }}
                className="hover:border-indigo-500/60"
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                  <User size={16} style={{ color: 'var(--accent-emerald)' }} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Employee</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Banking</div>
              </button>
            </div>
          </div>

          {/* Mode toggle indicator */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Server size={14} />
              Backend Target:
            </span>
            <button
              type="button"
              onClick={() => toggleMockMode()}
              style={{
                background: 'none',
                border: 'none',
                color: mockMode ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                cursor: 'pointer',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
            >
              {mockMode ? 'Mock Fallback Mode' : 'Live Spring Boot Direct'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
