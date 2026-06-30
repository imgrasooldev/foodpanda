'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export interface User {
  name: string;
  phone: string;
}

interface PendingOtp {
  phone: string;
  code: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthed: boolean;
  /** Simulated OTP request — returns the dev code (as the backend does in dev). */
  requestOtp: (phone: string) => string;
  verifyOtp: (phone: string, code: string, name: string) => boolean;
  logout: () => void;
  // Global login modal
  authOpen: boolean;
  openAuth: (onSuccess?: () => void) => void;
  closeAuth: () => void;
  onAuthSuccess?: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'foodrush_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState<PendingOtp | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [onAuthSuccess, setOnAuthSuccess] = useState<(() => void) | undefined>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function requestOtp(phone: string): string {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setPending({ phone, code });
    return code; // dev mode surfaces the code in the UI
  }

  function verifyOtp(phone: string, code: string, name: string): boolean {
    if (!pending || pending.phone !== phone || pending.code !== code) return false;
    const next = { name: name.trim() || 'Guest', phone };
    setUser(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPending(null);
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function openAuth(onSuccess?: () => void) {
    setOnAuthSuccess(() => onSuccess);
    setAuthOpen(true);
  }
  function closeAuth() {
    setAuthOpen(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthed: !!user,
        requestOtp,
        verifyOtp,
        logout,
        authOpen,
        openAuth,
        closeAuth,
        onAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
