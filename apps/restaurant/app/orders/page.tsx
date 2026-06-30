'use client';

import { useState } from 'react';
import { Check, X, ChefHat, Bike, Clock, StickyNote } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import {
  incomingOrders,
  type VendorOrder,
  type VendorOrderStatus,
} from '@/lib/data';

const COLUMNS: { status: VendorOrderStatus; title: string; tint: string }[] = [
  { status: 'NEW', title: 'New', tint: 'text-blue-600' },
  { status: 'PREPARING', title: 'Preparing', tint: 'text-amber-600' },
  { status: 'READY', title: 'Ready for pickup', tint: 'text-green-600' },
];

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>(incomingOrders);

  const setStatus = (id: string, status: VendorOrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const remove = (id: string) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <>
      <Topbar title="Live Orders" subtitle="Accept and manage incoming orders" />
      <main className="p-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = orders.filter((o) => o.status === col.status);
            return (
              <div key={col.status} className="rounded-2xl bg-slate-100/70 p-3">
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
                    <OrderCard
                      key={o.id}
                      order={o}
                      onAccept={() => setStatus(o.id, 'PREPARING')}
                      onReject={() => remove(o.id)}
                      onReady={() => setStatus(o.id, 'READY')}
                      onHandover={() => remove(o.id)}
                    />
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

function OrderCard({
  order: o,
  onAccept,
  onReject,
  onReady,
  onHandover,
}: {
  order: VendorOrder;
  onAccept: () => void;
  onReject: () => void;
  onReady: () => void;
  onHandover: () => void;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold">{o.number}</p>
          <p className="text-sm text-slate-500">{o.customer}</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" /> {o.placedAgo} ago
        </span>
      </div>

      <div className="my-3 space-y-1 border-y border-slate-50 py-2.5">
        {o.items.map((it, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="font-medium">
              {it.qty}× {it.name}
            </span>
            <span className="text-slate-500">Rs {(it.qty * it.price).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {o.note && (
        <p className="mb-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-800">
          <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {o.note}
        </p>
      )}

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-slate-400">{o.payment}</span>
        <span className="font-bold">Rs {o.total.toLocaleString()}</span>
      </div>

      {o.status === 'NEW' && (
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={onAccept}
            className="flex flex-[2] items-center justify-center gap-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Check className="h-4 w-4" /> Accept
          </button>
        </div>
      )}
      {o.status === 'PREPARING' && (
        <button
          onClick={onReady}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <ChefHat className="h-4 w-4" /> Mark as ready
        </button>
      )}
      {o.status === 'READY' && (
        <button
          onClick={onHandover}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Bike className="h-4 w-4" /> Hand to rider
        </button>
      )}
    </div>
  );
}
