'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Wallet,
  Timer,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { kpis } from '@/lib/data';
import { fetchOrders, type SyncOrder } from '@/lib/order-sync';

const MY_SLUG = 'student-biryani';

export default function DashboardPage() {
  const [orders, setOrders] = useState<SyncOrder[]>([]);

  const load = useCallback(async () => {
    const all = await fetchOrders();
    setOrders(all.filter((o) => o.restaurantSlug === MY_SLUG));
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);

  const newCount = orders.filter((o) => o.status === 'PLACED').length;
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const today = orders.filter((o) => o.placedAt >= startOfDay);
  const ordersToday = today.length;
  const revenueToday = today
    .filter((o) => o.status === 'DELIVERED')
    .reduce((s, o) => s + o.total, 0);
  const decided = orders.filter((o) =>
    ['ACCEPTED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'REJECTED'].includes(o.status),
  );
  const accepted = decided.filter((o) => o.status !== 'REJECTED').length;
  const acceptanceRate = decided.length
    ? Math.round((accepted / decided.length) * 100)
    : kpis.acceptanceRate;
  const recent = [...orders].sort((a, b) => b.placedAt - a.placedAt).slice(0, 8);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Student Biryani · Tariq Road" />
      <main className="space-y-6 p-6">
        {newCount > 0 && (
          <Link
            href="/orders"
            className="flex items-center gap-3 rounded-2xl bg-brand px-5 py-4 text-white shadow-card transition hover:bg-brand-700"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-bold">{newCount} new order(s) waiting</p>
              <p className="text-sm text-white/80">Tap to review and accept</p>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Orders today" value={ordersToday.toString()} icon={ShoppingBag} tint="bg-blue-50 text-blue-600" />
          <StatCard label="Revenue today" value={`Rs ${revenueToday.toLocaleString()}`} icon={Wallet} tint="bg-green-50 text-green-600" />
          <StatCard label="Avg prep time" value={`${kpis.avgPrepMinutes} min`} icon={Timer} tint="bg-amber-50 text-amber-600" />
          <StatCard label="Acceptance rate" value={`${acceptanceRate}%`} icon={CheckCircle2} tint="bg-brand-50 text-brand" />
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold">Recent orders</h2>
            <Link href="/orders" className="text-sm font-semibold text-brand">
              Go to live orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No orders yet.
                    </td>
                  </tr>
                )}
                {recent.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-700">{o.number}</td>
                    <td className="px-5 py-3 text-slate-600">{o.customerName ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                    </td>
                    <td className="px-5 py-3 font-semibold">Rs {o.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {o.status.toLowerCase().replace(/_/g, ' ')}
                      </span>
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

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tint,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: typeof ShoppingBag;
  tint: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
          <Icon className="h-5 w-5" />
        </span>
        {delta != null && (
          <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {delta}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-extrabold">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
