'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, Plus, Check } from 'lucide-react';
import { useAddresses } from './addresses-context';

export function AddressPicker() {
  const { addresses, defaultAddress, setDefault } = useAddresses();
  const [open, setOpen] = useState(false);

  const current = defaultAddress;

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm"
      >
        <MapPin className="h-4 w-4 text-brand" />
        <span className="text-left leading-tight">
          <span className="block text-[11px] text-ink-muted">
            {current ? 'Deliver to' : 'New address'}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="max-w-[190px] truncate">
              {current ? `${current.label} · ${current.line1}` : 'Select your address'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </span>
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-card-hover">
            <p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-gray-400">
              Delivery address
            </p>

            {addresses.length === 0 && (
              <p className="px-2 py-3 text-sm text-ink-muted">
                No saved addresses yet.
              </p>
            )}

            {addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setDefault(a.id);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-gray-50"
              >
                <MapPin
                  className={`mt-0.5 h-4 w-4 shrink-0 ${a.isDefault ? 'text-brand' : 'text-gray-400'}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{a.label}</span>
                  <span className="block truncate text-xs text-ink-muted">
                    {a.line1}, {a.city}
                  </span>
                </span>
                {a.isDefault && <Check className="h-4 w-4 shrink-0 text-brand" />}
              </button>
            ))}

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-lg border-t border-gray-100 px-2 py-2.5 text-sm font-semibold text-brand hover:bg-brand-50"
            >
              <Plus className="h-4 w-4" /> Add / manage addresses
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
