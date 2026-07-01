'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

// Demo credentials (no backend yet). Shown on the login screen.
const DEMO = {
  email: 'admin@foodrush.pk',
  password: 'admin123',
  name: 'Ghulam Rasool',
  role: 'Super Admin',
};

interface AuthContextValue {
  user: AdminUser | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'foodrush_admin_user';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function login(email: string, password: string) {
    if (email.trim().toLowerCase() === DEMO.email && password === DEMO.password) {
      const u: AdminUser = { name: DEMO.name, email: DEMO.email, role: DEMO.role };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, error: 'Invalid email or password' };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
