'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchState, patchState } from '@/lib/order-sync';

const MY_SLUG = 'student-biryani';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchState(MY_SLUG).then((s) => setOpen(s.isOpen));
  }, []);

  function toggleOpen() {
    setOpen((v) => {
      const next = !v;
      patchState(MY_SLUG, { isOpen: next });
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-bold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Open / Closed toggle */}
        <button
          onClick={toggleOpen}
          className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-3 pr-1.5 text-sm font-semibold"
        >
          <span className={open ? 'text-green-600' : 'text-slate-400'}>
            {open ? 'Open' : 'Closed'}
          </span>
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              open ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                open ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <button className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
        </button>
      </div>
    </header>
  );
}
