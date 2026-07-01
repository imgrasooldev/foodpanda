'use client';

import { useCallback, useEffect, useState } from 'react';
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

  const load = useCallback(async () => {
    const all = await fetchOrders();
    setOrders(
      all
        .filter((o) => o.restaurantSlug === MY_SLUG && TERMINAL.includes(o.status))
        .sort((a, b) => b.placedAt - a.placedAt),
    );
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <>
      <Topbar title="Order History" subtitle={`${orders.length} completed & past orders`} />
      <main className="p-6">
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
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                      No completed orders yet.
                    </td>
                  </tr>
                )}
                {orders.map((o) => {
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
