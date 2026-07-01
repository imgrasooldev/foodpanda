'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { fetchOrders, type SyncOrder } from '@/lib/order-sync';

const MY_SLUG = 'student-biryani';
const TERMINAL = ['DELIVERED', 'CANCELLED', 'REJECTED'];

const STATUS: Record<string, { text: string; cls: string }> = {
  DELIVERED: { text: 'Completed', cls: 'bg-green-50 text-green-700' },
  CANCELLED: { text: 'Cancelled', cls: 'bg-red-50 text-red-600' },
  REJECTED: { text: 'Declined', cls: 'bg-red-50 text-red-600' },
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<SyncOrder[]>([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState('newest');

  const load = useCallback(async () => {
    const all = await fetchOrders();
    setOrders(all.filter((o) => o.restaurantSlug === MY_SLUG && TERMINAL.includes(o.status)));
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);

  const query = q.trim().toLowerCase();
  const shown = orders
    .filter((o) => statusFilter === 'ALL' || o.status === statusFilter)
    .filter(
      (o) =>
        !query ||
        o.number.toLowerCase().includes(query) ||
        (o.customerName ?? '').toLowerCase().includes(query),
    )
    .sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.placedAt - b.placedAt;
        case 'high':
          return b.total - a.total;
        default:
          return b.placedAt - a.placedAt;
      }
    });

  return (
    <>
      <Topbar title="Order History" subtitle={`${orders.length} completed & past orders`} />
      <main className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'DELIVERED', label: 'Completed' },
              { id: 'CANCELLED', label: 'Cancelled' },
              { id: 'REJECTED', label: 'Declined' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === f.id
                    ? 'bg-brand text-white'
                    : 'bg-white text-slate-600 shadow-card hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search order or customer"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-brand"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="high">Highest total</option>
          </select>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                      No matching orders.
                    </td>
                  </tr>
                )}
                {shown.map((o) => {
                  const s = STATUS[o.status] ?? { text: o.status, cls: 'bg-slate-100 text-slate-600' };
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-semibold text-slate-700">{o.number}</td>
                      <td className="px-5 py-3 text-slate-600">{o.customerName ?? '—'}</td>
                      <td className="px-5 py-3 text-slate-500">
                        {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="px-5 py-3 capitalize text-slate-500">
                        {o.paymentMethod.replace(/_/g, ' ').toLowerCase()}
                      </td>
                      <td className="px-5 py-3 font-semibold">Rs {o.total.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
                          {s.text}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">
                        {new Date(o.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
