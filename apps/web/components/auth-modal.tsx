'use client';

import { useState } from 'react';
import { X, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from './auth-context';

export function AuthModal() {
  const { authOpen, closeAuth, requestOtp, verifyOtp, onAuthSuccess } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [error, setError] = useState('');

  if (!authOpen) return null;

  function reset() {
    setStep('phone');
    setName('');
    setPhone('+92');
    setCode('');
    setDevCode('');
    setError('');
  }

  function handleClose() {
    reset();
    closeAuth();
  }

  function handleRequest() {
    setError('');
    if (phone.replace(/\D/g, '').length < 11) {
      setError('Enter a valid phone number');
      return;
    }
    const c = requestOtp(phone);
    setDevCode(c);
    setStep('otp');
  }

  function handleVerify() {
    setError('');
    if (verifyOtp(phone, code, name)) {
      const cb = onAuthSuccess;
      reset();
      closeAuth();
      cb?.();
    } else {
      setError('Incorrect code. Try again.');
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-lg">
            🛵
          </span>
          <h2 className="text-lg font-extrabold">
            Welcome to Food<span className="text-brand">Rush</span>
          </h2>
        </div>

        {step === 'phone' ? (
          <>
            <p className="mb-4 text-sm text-ink-muted">
              Log in or sign up to order. We&apos;ll send a one-time code.
            </p>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Khan"
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Phone number
            </label>
            <div className="relative mb-3">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+923001234567"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
              />
            </div>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <button onClick={handleRequest} className="btn-brand w-full py-3">
              Send code
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-muted">
              Enter the 6-digit code sent to{' '}
              <span className="font-semibold text-ink">{phone}</span>.
            </p>
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <ShieldCheck className="h-4 w-4" />
              Dev mode — your code is <b className="tracking-widest">{devCode}</b>
            </div>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••••"
              inputMode="numeric"
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-3 text-center text-lg font-bold tracking-[0.5em] outline-none focus:border-brand"
            />
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <button onClick={handleVerify} className="btn-brand w-full py-3">
              Verify &amp; continue
            </button>
            <button
              onClick={() => setStep('phone')}
              className="mt-2 w-full text-sm font-medium text-ink-muted hover:text-ink"
            >
              Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
