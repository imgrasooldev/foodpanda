'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Receipt } from 'lucide-react';
import { useOrders, type OrderStatus } from '@/components/orders-context';

const STATUS_LABEL: Record<OrderStatus, { text: string; cls: string }> = {
  PLACED: { text: 'Placed', cls: 'bg-blue-50 text-blue-700' },
  ACCEPTED: { text: 'Accepted', cls: 'bg-blue-50 text-blue-700' },
  PREPARING: { text: 'Preparing', cls: 'bg-amber-50 text-amber-700' },
  ON_THE_WAY: { text: 'On the way', cls: 'bg-violet-50 text-violet-700' },
  DELIVERED: { text: 'Delivered', cls: 'bg-green-50 text-green-700' },
};

export default function OrdersHistoryPage() {
  const { orders } = useOrders();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <main className="container-page py-6">
      <h1 className="mb-6 text-2xl font-extrabold">Your orders</h1>

      {!hydrated ? (
        <p className="text-ink-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="grid min-h-[40vh] place-items-center text-center">
          <div>
            <p className="text-5xl">🧾</p>
            <h2 className="mt-3 text-xl font-bold">No orders yet</h2>
            <p className="mt-1 text-ink-muted">Your past orders will appear here.</p>
            <Link href="/" className="btn-brand mt-5 inline-flex px-6 py-2.5">
              Start ordering
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-3">
          {orders.map((o) => {
            const s = STATUS_LABEL[o.status];
            return (
              <Link
                key={o.id}
                href={`/order/${o.id}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition hover:shadow-card-hover"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                  <Receipt className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold">{o.restaurantName}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.cls}`}>
                      {s.text}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted">
                    {o.number} · {o.items.reduce((n, i) => n + i.quantity, 0)} item(s) ·{' '}
                    {new Date(o.placedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-bold">Rs {o.total.toLocaleString()}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
