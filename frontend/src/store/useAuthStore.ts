import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import type { User, UserRole } from '../types';
import { config } from '../config/env';

interface JwtPayload {
  sub: string;
  role?: string;
  exp?: number;
  iat?: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mockMode: boolean;
  theme: 'dark' | 'light';

  // Actions
  setAuth: (token: string, user?: Partial<User>) => void;
  logout: () => void;
  toggleMockMode: (forceValue?: boolean) => void;
  toggleTheme: (forceTheme?: 'dark' | 'light') => void;
  setDemoUser: (role: 'ROLE_ADMIN' | 'ROLE_HR' | 'ROLE_EMPLOYEE') => void;
}

const TOKEN_KEY = 'apex_auth_token';
const USER_KEY = 'apex_auth_user';
const MOCK_KEY = 'apex_mock_mode';
const THEME_KEY = 'apex_theme';

// Helper to decode user from token
const decodeToken = (token: string): User | null => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    const role = (payload.role || 'ROLE_EMPLOYEE') as UserRole;
    return {
      username: payload.sub || 'User',
      role,
      token,
    };
  } catch (e) {
    console.warn('Failed to decode JWT token:', e);
    return null;
  }
};

// Apply theme to DOM
const applyThemeToDom = (theme: 'dark' | 'light') => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize from localStorage (default to crisp modern 'light' fintech theme)
const storedToken = localStorage.getItem(TOKEN_KEY);
const storedUser = localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null;
const storedMock = localStorage.getItem(MOCK_KEY) !== null 
  ? localStorage.getItem(MOCK_KEY) === 'true' 
  : config.defaultMockFallback;
const storedTheme = (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'light';

// Apply on startup
applyThemeToDom(storedTheme);

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: storedToken,
  user: storedUser || (storedToken ? decodeToken(storedToken) : null),
  isAuthenticated: Boolean(storedToken),
  mockMode: storedMock,
  theme: storedTheme,

  setAuth: (token, userOverrides) => {
    let user: User | null = null;
    const decoded = decodeToken(token);

    if (decoded) {
      user = {
        ...decoded,
        ...userOverrides,
      };
    } else if (userOverrides?.username && userOverrides?.role) {
      user = {
        username: userOverrides.username,
        role: userOverrides.role,
        email: userOverrides.email,
        token,
      };
    }

    localStorage.setItem(TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  toggleMockMode: (forceValue) => {
    const nextMode = forceValue !== undefined ? forceValue : !get().mockMode;
    localStorage.setItem(MOCK_KEY, String(nextMode));
    set({ mockMode: nextMode });
  },

  toggleTheme: (forceTheme) => {
    const nextTheme = forceTheme || (get().theme === 'dark' ? 'light' : 'dark');
    localStorage.setItem(THEME_KEY, nextTheme);
    applyThemeToDom(nextTheme);
    set({ theme: nextTheme });
  },

  setDemoUser: (role) => {
    const demoConfigs: Record<string, { username: string; email: string; token: string }> = {
      ROLE_ADMIN: {
        username: 'admin',
        email: 'admin@bank.com',
        token: 'mock-jwt-admin-token-' + Date.now(),
      },
      ROLE_HR: {
        username: 'hr_manager',
        email: 'hr@bank.com',
        token: 'mock-jwt-hr-token-' + Date.now(),
      },
      ROLE_EMPLOYEE: {
        username: 'john_doe',
        email: 'john.doe@bank.com',
        token: 'mock-jwt-emp-token-' + Date.now(),
      },
    };

    const target = demoConfigs[role];
    if (target) {
      get().setAuth(target.token, {
        username: target.username,
        email: target.email,
        role,
      });
    }
  },
}));