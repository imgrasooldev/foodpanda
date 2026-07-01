'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, X, ChefHat, Bike, Clock, PackageCheck, RefreshCw } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { fetchOrders, patchOrder, type SyncOrder } from '@/lib/order-sync';

// This vendor is Student Biryani — only show their orders.
const MY_SLUG = 'student-biryani';

const COLUMNS: {
  title: string;
  tint: string;
  statuses: string[];
}[] = [
  { title: 'New — needs approval', tint: 'text-blue-600', statuses: ['PLACED'] },
  { title: 'Preparing', tint: 'text-amber-600', statuses: ['ACCEPTED', 'PREPARING'] },
  { title: 'Out for delivery', tint: 'text-violet-600', statuses: ['ON_THE_WAY'] },
];

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<SyncOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const all = await fetchOrders();
    setOrders(all.filter((o) => o.restaurantSlug === MY_SLUG));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000); // poll for new customer orders
    return () => clearInterval(t);
  }, [load]);

  async function setStatus(id: string, status: string) {
    // optimistic update, then persist
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await patchOrder(id, { status });
    load();
  }

  const active = orders.filter((o) =>
    ['PLACED', 'ACCEPTED', 'PREPARING', 'ON_THE_WAY'].includes(o.status),
  );

  return (
    <>
      <Topbar title="Live Orders" subtitle="Accept and manage incoming orders" />
      <main className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw className="h-4 w-4" />
          Live — updates automatically as customers order
          {loading && <span className="text-slate-400">· loading…</span>}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = active.filter((o) => col.statuses.includes(o.status));
            return (
              <div key={col.title} className="rounded-2xl bg-slate-100/70 p-3">
                <div className="mb-3 flex items-center justify-between px-2">
                  <h2 className={`text-sm font-bold uppercase tracking-wide ${col.tint}`}>
                    {col.title}
                  </h2>
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-slate-600">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length === 0 && (
                    <p className="px-2 py-8 text-center text-sm text-slate-400">
                      No orders here
                    </p>
                  )}
                  {items.map((o) => (
                    <OrderCard key={o.id} order={o} onSetStatus={setStatus} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)} min`;
}

function OrderCard({
  order: o,
  onSetStatus,
}: {
  order: SyncOrder;
  onSetStatus: (id: string, status: string) => void;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold">{o.number}</p>
          <p className="text-sm text-slate-500">{o.customerName ?? 'Customer'}</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" /> {timeAgo(o.placedAt)} ago
        </span>
      </div>

      <div className="my-3 space-y-1 border-y border-slate-50 py-2.5">
        {o.items.map((it, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="font-medium">
              {it.quantity}× {it.name}
            </span>
            <span className="text-slate-500">
              Rs {(it.quantity * it.price).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {o.paymentMethod.replace(/_/g, ' ').toLowerCase()}
        </span>
        <span className="font-bold">Rs {o.total.toLocaleString()}</span>
      </div>

      {o.status === 'PLACED' && (
        <div className="flex gap-2">
          <button
            onClick={() => onSetStatus(o.id, 'REJECTED')}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => onSetStatus(o.id, 'ACCEPTED')}
            className="flex flex-[2] items-center justify-center gap-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Check className="h-4 w-4" /> Accept
          </button>
        </div>
      )}
      {o.status === 'ACCEPTED' && (
        <button
          onClick={() => onSetStatus(o.id, 'PREPARING')}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <ChefHat className="h-4 w-4" /> Start preparing
        </button>
      )}
      {o.status === 'PREPARING' && (
        <button
          onClick={() => onSetStatus(o.id, 'ON_THE_WAY')}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Bike className="h-4 w-4" /> Ready — out for delivery
        </button>
      )}
      {o.status === 'ON_THE_WAY' && (
        <button
          onClick={() => onSetStatus(o.id, 'DELIVERED')}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <PackageCheck className="h-4 w-4" /> Mark delivered
        </button>
      )}
    </div>
  );
}
