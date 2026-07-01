'use client';

import { useState } from 'react';
import { Ban, RotateCcw, Search } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { customers as seed, type AdminCustomer } from '@/lib/data';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>(seed);
  const [q, setQ] = useState('');

  const toggle = (name: string) =>
    setCustomers((prev) =>
      prev.map((c) =>
        c.name === name
          ? { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
          : c,
      ),
    );

  const shown = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <Topbar title="Customers" subtitle={`${customers.length} registered`} />
      <main className="space-y-5 p-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customers…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">Orders</th>
                  <th className="px-5 py-3 font-semibold">Spent</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shown.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand">
                          {c.name[0]}
                        </span>
                        <span className="font-semibold text-slate-700">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{c.phone}</td>
                    <td className="px-5 py-3 text-slate-500">{c.city}</td>
                    <td className="px-5 py-3 font-medium text-slate-600">{c.orders}</td>
                    <td className="px-5 py-3 font-medium text-slate-600">
                      Rs {c.spent.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-slate-400">{c.joined}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          c.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {c.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggle(c.name)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                          c.status === 'ACTIVE'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {c.status === 'ACTIVE' ? (
                          <>
                            <Ban className="h-3.5 w-3.5" /> Block
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-3.5 w-3.5" /> Unblock
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
