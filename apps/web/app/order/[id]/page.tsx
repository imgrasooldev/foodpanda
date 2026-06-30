'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  ChefHat,
  Bike,
  PackageCheck,
  Receipt,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  useOrders,
  STATUS_FLOW,
  type OrderStatus,
} from '@/components/orders-context';

const STEPS: { status: OrderStatus; label: string; icon: typeof Check }[] = [
  { status: 'PLACED', label: 'Order placed', icon: Receipt },
  { status: 'ACCEPTED', label: 'Restaurant accepted', icon: Check },
  { status: 'PREPARING', label: 'Preparing your food', icon: ChefHat },
  { status: 'ON_THE_WAY', label: 'Rider on the way', icon: Bike },
  { status: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, advanceStatus } = useOrders();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const order = getOrder(id);
  const currentIdx = order ? STATUS_FLOW.indexOf(order.status) : 0;

  // Simulate kitchen + delivery progress.
  useEffect(() => {
    if (!order || order.status === 'DELIVERED') return;
    const t = setTimeout(() => advanceStatus(order.id), 6000);
    return () => clearTimeout(t);
  }, [order, advanceStatus]);

  if (!hydrated) {
    return <main className="container-page py-16 text-center text-ink-muted">Loading…</main>;
  }

  if (!order) {
    return (
      <main className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <p className="text-5xl">🔍</p>
          <h1 className="mt-3 text-xl font-bold">Order not found</h1>
          <Link href="/orders" className="btn-brand mt-5 inline-flex px-6 py-2.5">
            View your orders
          </Link>
        </div>
      </main>
    );
  }

  const delivered = order.status === 'DELIVERED';
  const progress = currentIdx / (STATUS_FLOW.length - 1);

  return (
    <main className="container-page py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-900 p-6 text-white">
          <p className="text-sm text-white/80">Order {order.number}</p>
          <h1 className="mt-1 text-2xl font-extrabold">
            {delivered ? 'Delivered — enjoy your meal! 🎉' : 'Your order is on its way'}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-white/90">
            <Clock className="h-4 w-4" />
            {delivered
              ? 'Completed just now'
              : `Estimated arrival in ~${order.etaMinutes} min`}
          </p>
        </div>

        {/* Map-style tracker */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-card">
          <div className="relative mb-2 h-24 rounded-xl bg-gradient-to-br from-green-50 to-blue-50">
            {/* route line */}
            <div className="absolute left-10 right-10 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-brand transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            {/* restaurant */}
            <span className="absolute left-6 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-lg shadow">
              🏪
            </span>
            {/* home */}
            <span className="absolute right-6 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-lg shadow">
              🏠
            </span>
            {/* rider */}
            <span
              className="absolute top-1/2 -translate-y-[150%] text-2xl transition-all duration-700"
              style={{ left: `calc(${12 + progress * 76}% )` }}
            >
              🛵
            </span>
          </div>
        </div>

        {/* Status timeline */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <ol className="space-y-5">
            {STEPS.map((step, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const Icon = step.icon;
              return (
                <li key={step.status} className="flex items-center gap-4">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full transition ${
                      done || active
                        ? 'bg-brand text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${active ? 'ring-4 ring-brand-100' : ''}`}
                  >
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        done || active ? 'text-ink' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {active && !delivered && (
                      <p className="text-sm text-brand">In progress…</p>
                    )}
                  </div>
                  {active && !delivered && (
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Order details */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold">Order details</h2>
          <p className="mb-1 font-semibold">{order.restaurantName}</p>
          <p className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4" /> {order.address.line1}, {order.address.city}
          </p>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            {order.items.map((l) => (
              <div key={l.id} className="flex justify-between text-sm">
                <span>
                  {l.quantity} × {l.name}
                </span>
                <span className="font-medium">
                  Rs {(l.quantity * l.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>Payment</span>
              <span className="font-medium text-ink">
                {order.paymentMethod.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>Rs {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/orders"
            className="flex-1 rounded-full border border-gray-300 py-3 text-center font-semibold hover:bg-gray-50"
          >
            My orders
          </Link>
          <Link href="/" className="btn-brand flex-1 justify-center py-3">
            Order again
          </Link>
        </div>
      </div>
    </main>
  );
}
