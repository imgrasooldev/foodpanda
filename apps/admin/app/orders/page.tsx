'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, X, MapPin, StickyNote, Search } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { fetchOrders, type SyncOrder } from '@/lib/order-sync';

const STATUS_STYLES: Record<string, string> = {
  PLACED: 'bg-amber-50 text-amber-700',
  ACCEPTED: 'bg-blue-50 text-blue-700',
  PREPARING: 'bg-blue-50 text-blue-700',
  ON_THE_WAY: 'bg-violet-50 text-violet-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
  REJECTED: 'bg-red-50 text-red-600',
};

const LABEL: Record<string, string> = {
  PLACED: 'Awaiting confirmation',
  ACCEPTED: 'Confirmed',
  PREPARING: 'Preparing',
  ON_THE_WAY: 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REJECTED: 'Declined',
};

const FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'PLACED', label: 'New' },
  { id: 'ACTIVE', label: 'In progress' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}
    >
      {LABEL[status] ?? status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SyncOrder[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setOrders(await fetchOrders());
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);

  const query = q.trim().toLowerCase();
  const shown = orders
    .filter((o) => {
      if (filter === 'ALL') return true;
      if (filter === 'ACTIVE')
        return ['ACCEPTED', 'PREPARING', 'ON_THE_WAY'].includes(o.status);
      return o.status === filter;
    })
    .filter(
      (o) =>
        !query ||
        o.number.toLowerCase().includes(query) ||
        (o.customerName ?? '').toLowerCase().includes(query) ||
        o.restaurantName.toLowerCase().includes(query),
    )
    .sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.placedAt - b.placedAt;
        case 'high':
          return b.total - a.total;
        case 'low':
          return a.total - b.total;
        default:
          return b.placedAt - a.placedAt; // newest
      }
    });
  const detail = orders.find((o) => o.id === detailId) ?? null;

  return (
    <>
      <Topbar title="Orders" subtitle="Live platform-wide orders" />
      <main className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === f.id
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
              placeholder="Search order, customer, restaurant"
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
            <option value="low">Lowest total</option>
          </select>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-slate-400">
          <RefreshCw className="h-4 w-4" /> Live · {shown.length} of {orders.length}{' '}
          orders
        </p>

        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Restaurant</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                      No orders yet. Place one from the customer app to see it here.
                    </td>
                  </tr>
                )}
                {shown.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setDetailId(o.id)}
                    className="cursor-pointer hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-700">{o.number}</td>
                    <td className="px-5 py-3 text-slate-600">{o.customerName ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-600">{o.restaurantName}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {o.items.reduce((n, i) => n + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3 font-semibold">Rs {o.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right text-brand">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {detail && <OrderDetail order={detail} onClose={() => setDetailId(null)} />}
    </>
  );
}

function OrderDetail({ order: o, onClose }: { order: SyncOrder; onClose: () => void }) {
  const isPickup = o.fulfillmentType === 'PICKUP';
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold">{o.number}</h2>
            <p className="text-xs text-slate-400">
              {o.restaurantName} · {isPickup ? 'Pick-up' : 'Delivery'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={o.status} />
            <span className="text-xs text-slate-400">
              {new Date(o.placedAt).toLocaleString()}
            </span>
          </div>

          <section>
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
              Customer
            </h3>
            <p className="font-semibold">{o.customerName ?? '—'}</p>
            {o.address && (
              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {isPickup ? 'Pick-up at counter' : `${o.address.line1}, ${o.address.city}`}
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Items</h3>
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

          <section className="space-y-1.5 border-t border-slate-100 pt-4 text-sm">
            {o.subtotal != null && <Row label="Subtotal" value={o.subtotal} />}
            {o.deliveryFee != null && !isPickup && <Row label="Delivery fee" value={o.deliveryFee} />}
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
            {o.cancelReason && (
              <div className="flex justify-between pt-1 text-red-600">
                <span>Reason</span>
                <span className="max-w-[60%] text-right">{o.cancelReason}</span>
              </div>
            )}
          </section>
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
