'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  ChefHat,
  Bike,
  PackageCheck,
  Receipt,
  MapPin,
  Clock,
  Star,
  XCircle,
} from 'lucide-react';
import {
  useOrders,
  STATUS_FLOW,
  CANCELLABLE,
  CANCEL_REASONS,
  type OrderStatus,
} from '@/components/orders-context';
import { useCart } from '@/components/cart-context';
import { useReviews } from '@/components/reviews-context';
import { useAuth } from '@/components/auth-context';

const STEPS: { status: OrderStatus; label: string; icon: typeof Check }[] = [
  { status: 'PLACED', label: 'Order placed', icon: Receipt },
  { status: 'ACCEPTED', label: 'Restaurant accepted', icon: Check },
  { status: 'PREPARING', label: 'Preparing your food', icon: ChefHat },
  { status: 'ON_THE_WAY', label: 'Rider on the way', icon: Bike },
  { status: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, advanceStatus, cancelOrder } = useOrders();
  const { reorder } = useCart();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => setHydrated(true), []);

  const order = getOrder(id);
  const currentIdx = order ? STATUS_FLOW.indexOf(order.status) : 0;

  // Simulate kitchen + delivery progress (stops once delivered or cancelled).
  useEffect(() => {
    if (!order || order.status === 'DELIVERED' || order.status === 'CANCELLED')
      return;
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
  const cancelled = order.status === 'CANCELLED';
  const cancellable = CANCELLABLE.includes(order.status);
  const isPickup = order.fulfillmentType === 'PICKUP';
  const progress = currentIdx / (STATUS_FLOW.length - 1);

  const pickupLabel: Partial<Record<OrderStatus, string>> = {
    ON_THE_WAY: 'Ready for pickup',
    DELIVERED: 'Collected',
  };

  // --- Cancelled view ---
  if (cancelled) {
    return (
      <main className="container-page py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
            <p className="text-sm text-white/80">Order {order.number}</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold">
              <XCircle className="h-6 w-6" /> Order cancelled
            </h1>
            <p className="mt-2 text-white/90">
              This order was cancelled{order.cancelReason ? ` — ${order.cancelReason}` : ''}.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            {order.paymentMethod === 'CASH_ON_DELIVERY' ? (
              <p className="text-sm text-ink-muted">
                No charge — this was a cash-on-delivery order, so nothing was paid.
              </p>
            ) : (
              <p className="text-sm text-ink-muted">
                Any amount charged will be refunded to your original payment method
                within 5–7 business days.
              </p>
            )}
            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
              <p className="font-semibold">{order.restaurantName}</p>
              {order.items.map((l) => (
                <div key={l.lineId} className="flex justify-between text-ink-muted">
                  <span>{l.quantity} × {l.name}</span>
                  <span>Rs {(l.quantity * l.price).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-bold text-ink">
                <span>Order total</span>
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
            <button
              onClick={() => {
                reorder(order.items);
                router.push('/checkout');
              }}
              className="btn-brand flex-1 justify-center py-3"
            >
              Order again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-900 p-6 text-white">
          <p className="text-sm text-white/80">
            Order {order.number} · {isPickup ? 'Pick-up' : 'Delivery'}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">
            {delivered
              ? isPickup
                ? 'Collected — enjoy your meal! 🎉'
                : 'Delivered — enjoy your meal! 🎉'
              : isPickup
                ? 'Getting your order ready'
                : 'Your order is on its way'}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-white/90">
            <Clock className="h-4 w-4" />
            {delivered
              ? 'Completed just now'
              : isPickup
                ? `Ready for pickup in ~${order.etaMinutes} min`
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
            {/* home / you */}
            <span className="absolute right-6 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-lg shadow">
              {isPickup ? '🧍' : '🏠'}
            </span>
            {/* rider / pickup bag */}
            <span
              className="absolute top-1/2 -translate-y-[150%] text-2xl transition-all duration-700"
              style={{ left: `calc(${12 + progress * 76}% )` }}
            >
              {isPickup ? '🛍️' : '🛵'}
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
                      {(isPickup && pickupLabel[step.status]) || step.label}
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
            <MapPin className="h-4 w-4" />
            {isPickup ? 'Pick-up from ' : 'Deliver to '}
            {order.address.line1}
            {order.address.city ? `, ${order.address.city}` : ''}
          </p>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            {order.items.map((l) => (
              <div key={l.lineId} className="flex justify-between text-sm">
                <span>
                  {l.quantity} × {l.name}
                  {(l.addons?.length ?? 0) > 0 && (
                    <span className="text-ink-muted">
                      {' '}
                      (+ {(l.addons ?? []).map((a) => a.name).join(', ')})
                    </span>
                  )}
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
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Voucher discount</span>
                <span className="font-medium">− Rs {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>Rs {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {delivered && (
          <RateOrder slug={order.restaurantSlug} restaurant={order.restaurantName} />
        )}

        {/* Cancel — only before the order is out for delivery */}
        {cancellable && (
          <button
            onClick={() => setShowCancel(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" /> Cancel order
          </button>
        )}

        <div className="flex gap-3">
          <Link
            href="/orders"
            className="flex-1 rounded-full border border-gray-300 py-3 text-center font-semibold hover:bg-gray-50"
          >
            My orders
          </Link>
          <button
            onClick={() => {
              reorder(order.items);
              router.push('/checkout');
            }}
            className="btn-brand flex-1 justify-center py-3"
          >
            Reorder
          </button>
        </div>
      </div>

      {showCancel && (
        <CancelDialog
          onClose={() => setShowCancel(false)}
          onConfirm={(reason) => {
            cancelOrder(order.id, reason);
            setShowCancel(false);
          }}
        />
      )}
    </main>
  );
}

function CancelDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-extrabold">Cancel this order?</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Tell us why you&apos;re cancelling. This can&apos;t be undone.
        </p>

        <div className="mt-4 space-y-1">
          {CANCEL_REASONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-gray-50"
            >
              <input
                type="radio"
                name="cancel-reason"
                checked={reason === r}
                onChange={() => setReason(r)}
                className="h-4 w-4 accent-brand"
              />
              {r}
            </label>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-300 py-2.5 font-semibold hover:bg-gray-50"
          >
            Keep order
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason}
            className="flex-1 rounded-full bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Cancel order
          </button>
        </div>
      </div>
    </div>
  );
}

function RateOrder({ slug, restaurant }: { slug: string; restaurant: string }) {
  const { addReview } = useReviews();
  const { user, isAuthed, openAuth } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl bg-green-50 p-5 text-center text-sm font-semibold text-green-700">
        Thanks for rating {restaurant}! ⭐
      </div>
    );
  }

  function rate(value: number) {
    setRating(value);
    if (!isAuthed) {
      openAuth();
      return;
    }
    addReview(slug, {
      author: user?.name ?? 'Guest',
      rating: value,
      text: 'Rated from order',
    });
    setDone(true);
  }

  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-card">
      <p className="font-bold">How was your order from {restaurant}?</p>
      <div className="mt-3 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => rate(s)}
            aria-label={`Rate ${s} stars`}
          >
            <Star
              className={`h-8 w-8 transition ${
                s <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
