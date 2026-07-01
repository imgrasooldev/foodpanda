'use client';

import { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { Topbar } from '@/components/topbar';

interface Ticket {
  id: string;
  from: string;
  role: 'Customer' | 'Restaurant' | 'Rider';
  subject: string;
  ago: string;
  status: 'OPEN' | 'RESOLVED';
}

const SEED: Ticket[] = [
  { id: 't1', from: 'Sara Ahmed', role: 'Customer', subject: 'Order arrived cold', ago: '10 min', status: 'OPEN' },
  { id: 't2', from: 'Student Biryani', role: 'Restaurant', subject: 'Payout not received', ago: '1 hr', status: 'OPEN' },
  { id: 't3', from: 'Bilal K.', role: 'Rider', subject: 'App crashes on pickup', ago: '2 hr', status: 'OPEN' },
  { id: 't4', from: 'Hamza Ali', role: 'Customer', subject: 'Refund request for FR-8H4G2D', ago: '3 hr', status: 'RESOLVED' },
  { id: 't5', from: 'Kababjees', role: 'Restaurant', subject: 'Menu not updating', ago: '5 hr', status: 'RESOLVED' },
];

const ROLE_TINT: Record<string, string> = {
  Customer: 'bg-blue-50 text-blue-700',
  Restaurant: 'bg-brand-50 text-brand',
  Rider: 'bg-violet-50 text-violet-700',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(SEED);
  const open = tickets.filter((t) => t.status === 'OPEN').length;

  const resolve = (id: string) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t)));

  return (
    <>
      <Topbar title="Support" subtitle={`${open} open ticket(s)`} />
      <main className="space-y-3 p-6">
        {tickets.map((t) => (
          <div key={t.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
              <LifeBuoy className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{t.subject}</p>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ROLE_TINT[t.role]}`}>
                  {t.role}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {t.from} · {t.ago} ago
              </p>
            </div>
            {t.status === 'OPEN' ? (
              <button
                onClick={() => resolve(t.id)}
                className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Resolve
              </button>
            ) : (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                Resolved
              </span>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
