'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export interface VendorUser {
  name: string;
  email: string;
  restaurant: string;
}

// Demo credentials (no backend yet). Shown on the login screen.
const DEMO = {
  email: 'owner@studentbiryani.pk',
  password: 'vendor123',
  name: 'Ali Raza',
  restaurant: 'Student Biryani',
};

interface AuthContextValue {
  user: VendorUser | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'foodrush_vendor_user';

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null);
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
      const u: VendorUser = { name: DEMO.name, email: DEMO.email, restaurant: DEMO.restaurant };
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

export function useVendorAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useVendorAuth must be used within VendorAuthProvider');
  return ctx;
}
