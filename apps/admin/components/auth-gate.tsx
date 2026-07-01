'use client';

import { useState, type ReactNode } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAdminAuth } from './auth-context';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready } = useAdminAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-slate-400">
        Loading…
      </div>
    );
  }
  if (!user) return <LoginScreen />;
  return <>{children}</>;
}

function LoginScreen() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) setError(res.error ?? 'Login failed');
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-xl">
            🛵
          </span>
          <div>
            <p className="text-lg font-extrabold leading-tight">FoodRush</p>
            <p className="text-xs font-medium text-slate-400">Admin Console</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-card">
          <h1 className="mb-1 text-xl font-extrabold">Sign in</h1>
          <p className="mb-5 text-sm text-slate-400">
            Access the FoodRush operations console.
          </p>

          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Email
          </label>
          <div className="relative mb-3">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@foodrush.pk"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>

          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Password
          </label>
          <div className="relative mb-4">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>

          {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </button>

          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Demo credentials</p>
            <p>Email: admin@foodrush.pk</p>
            <p>Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
