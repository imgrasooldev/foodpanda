'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Check,
  X,
  ChefHat,
  Bike,
  Clock,
  PackageCheck,
  RefreshCw,
  MapPin,
  StickyNote,
  ChevronRight,
} from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { fetchOrders, patchOrder, type SyncOrder } from '@/lib/order-sync';

// This vendor is Student Biryani — only show their orders.
const MY_SLUG = 'student-biryani';

const COLUMNS: { title: string; tint: string; statuses: string[] }[] = [
  { title: 'New — needs approval', tint: 'text-blue-600', statuses: ['PLACED'] },
  { title: 'Preparing', tint: 'text-amber-600', statuses: ['ACCEPTED', 'PREPARING'] },
  { title: 'Out for delivery', tint: 'text-violet-600', statuses: ['ON_THE_WAY'] },
];

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<SyncOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const all = await fetchOrders();
    setOrders(all.filter((o) => o.restaurantSlug === MY_SLUG));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);

  async function setStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await patchOrder(id, { status });
    load();
  }

  const active = orders.filter((o) =>
    ['PLACED', 'ACCEPTED', 'PREPARING', 'ON_THE_WAY'].includes(o.status),
  );
  const detail = orders.find((o) => o.id === detailId) ?? null;

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
                    <OrderCard
                      key={o.id}
                      order={o}
                      onSetStatus={setStatus}
                      onOpen={() => setDetailId(o.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {detail && (
        <OrderDetailModal
          order={detail}
          onClose={() => setDetailId(null)}
          onSetStatus={setStatus}
        />
      )}
    </>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)} min`;
}

function StatusActions({
  order: o,
  onSetStatus,
}: {
  order: SyncOrder;
  onSetStatus: (id: string, status: string) => void;
}) {
  if (o.status === 'PLACED')
    return (
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
    );
  if (o.status === 'ACCEPTED')
    return (
      <button
        onClick={() => onSetStatus(o.id, 'PREPARING')}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        <ChefHat className="h-4 w-4" /> Start preparing
      </button>
    );
  if (o.status === 'PREPARING')
    return (
      <button
        onClick={() => onSetStatus(o.id, 'ON_THE_WAY')}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        <Bike className="h-4 w-4" /> Ready — out for delivery
      </button>
    );
  if (o.status === 'ON_THE_WAY')
    return (
      <button
        onClick={() => onSetStatus(o.id, 'DELIVERED')}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        <PackageCheck className="h-4 w-4" /> Mark delivered
      </button>
    );
  return null;
}

function OrderCard({
  order: o,
  onSetStatus,
  onOpen,
}: {
  order: SyncOrder;
  onSetStatus: (id: string, status: string) => void;
  onOpen: () => void;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      {/* Clickable summary opens full detail */}
      <button onClick={onOpen} className="w-full text-left">
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
          <span className="flex items-center gap-1 font-semibold text-brand">
            View details <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-ink">Rs {o.total.toLocaleString()}</span>
        </div>
      </button>

      <StatusActions order={o} onSetStatus={onSetStatus} />
    </div>
  );
}

function OrderDetailModal({
  order: o,
  onClose,
  onSetStatus,
}: {
  order: SyncOrder;
  onClose: () => void;
  onSetStatus: (id: string, status: string) => void;
}) {
  const isPickup = o.fulfillmentType === 'PICKUP';
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold">{o.number}</h2>
            <p className="text-xs text-slate-400">
              {timeAgo(o.placedAt)} ago · {isPickup ? 'Pick-up' : 'Delivery'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Customer + fulfilment */}
          <section>
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
              Customer
            </h3>
            <p className="font-semibold">{o.customerName ?? 'Customer'}</p>
            {o.address && (
              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {isPickup ? 'Pick-up at counter' : `${o.address.line1}, ${o.address.city}`}
              </p>
            )}
          </section>

          {/* Items with add-ons + notes */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              Items
            </h3>
            <div className="space-y-3">
              {o.items.map((it, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {it.quantity}× {it.name}
                    </span>
                    <span className="font-semibold">
                      Rs {(it.quantity * it.price).toLocaleString()}
                    </span>
                  </div>
                  {it.addons && it.addons.length > 0 && (
                    <p className="mt-1 text-sm text-slate-500">
                      + {it.addons.map((a) => a.name).join(', ')}
                    </p>
                  )}
                  {it.notes && (
                    <p className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
                      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {it.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bill */}
          <section className="space-y-1.5 border-t border-slate-100 pt-4 text-sm">
            {o.subtotal != null && <Row label="Subtotal" value={o.subtotal} />}
            {o.deliveryFee != null && !isPickup && (
              <Row label="Delivery fee" value={o.deliveryFee} />
            )}
            {o.serviceFee != null && <Row label="Service fee" value={o.serviceFee} />}
            {o.discount ? (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>− Rs {o.discount.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-1 text-base font-bold">
              <span>Total</span>
              <span>Rs {o.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 text-slate-500">
              <span>Payment</span>
              <span className="font-medium capitalize text-ink">
                {o.paymentMethod.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-100 p-4">
          <StatusActions order={o} onSetStatus={onSetStatus} />
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-slate-500">
      <span>{label}</span>
      <span className="font-medium text-ink">Rs {value.toLocaleString()}</span>
    </div>
  );
}
