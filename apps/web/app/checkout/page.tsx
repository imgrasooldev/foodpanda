'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Plus, Check, Store } from 'lucide-react';
import { useCart } from '@/components/cart-context';
import { useAuth } from '@/components/auth-context';
import { useOrders } from '@/components/orders-context';
import { useAddresses } from '@/components/addresses-context';
import { useOrderMode } from '@/components/order-mode-context';
import { getRestaurantBySlug } from '@/lib/data';
import {
  DEFAULT_DELIVERY_FEE,
  SERVICE_FEE,
  PAYMENT_METHODS,
  applyVoucher,
} from '@/lib/fees';

export default function CheckoutPage() {
  const { lines, subtotal, setQty } = useCart();
  const { user, isAuthed, openAuth } = useAuth();
  const { placeOrder } = useOrders();
  const { addresses, addAddress, defaultAddress } = useAddresses();
  const { isPickup } = useOrderMode();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [draft, setDraft] = useState({ line1: '', city: 'Karachi' });
  const [payment, setPayment] = useState<string>('CASH_ON_DELIVERY');
  const [placing, setPlacing] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const deliveryFee = isPickup ? 0 : DEFAULT_DELIVERY_FEE;
  const total = subtotal + deliveryFee + SERVICE_FEE - discount;

  function handleApplyVoucher() {
    const result = applyVoucher(voucherCode, subtotal);
    if ('error' in result) {
      setDiscount(0);
      setVoucherMsg({ ok: false, text: result.error });
    } else {
      setDiscount(result.discount);
      setVoucherMsg({ ok: true, text: `${result.voucher.label} applied!` });
    }
  }
  const restaurantName = lines[0]?.restaurantName ?? '';
  const restaurantSlug = lines[0]?.restaurantSlug ?? '';
  const pickupRestaurant = restaurantSlug ? getRestaurantBySlug(restaurantSlug) : undefined;
  const pickupAddress = {
    label: 'Pick-up point',
    line1: restaurantName,
    city: pickupRestaurant?.city ?? '',
  };

  if (lines.length === 0) {
    return (
      <main className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <p className="text-5xl">🛒</p>
          <h1 className="mt-3 text-xl font-bold">Your cart is empty</h1>
          <p className="mt-1 text-ink-muted">Add some food to get started.</p>
          <Link href="/" className="btn-brand mt-5 inline-flex px-6 py-2.5">
            Browse restaurants
          </Link>
        </div>
      </main>
    );
  }

  const chosenAddress =
    addresses.find((a) => a.id === selectedId) ?? defaultAddress ?? addresses[0];

  function saveNewAddress() {
    if (!draft.line1.trim()) return;
    const created = addAddress({ label: 'Other', line1: draft.line1, city: draft.city });
    setSelectedId(created.id);
    setShowNewAddr(false);
    setDraft({ line1: '', city: 'Karachi' });
  }

  function handlePlaceOrder() {
    if (!isAuthed) {
      openAuth();
      return;
    }
    setPlacing(true);
    const order = placeOrder({
      restaurantName,
      restaurantSlug,
      items: lines,
      subtotal,
      deliveryFee,
      serviceFee: SERVICE_FEE,
      discount,
      total,
      paymentMethod: payment,
      address: isPickup ? pickupAddress : chosenAddress,
      fulfillmentType: isPickup ? 'PICKUP' : 'DELIVERY',
      etaMinutes: isPickup ? (pickupRestaurant?.avgPrepMinutes ?? 20) : 35,
    });
    // Clear the cart by zeroing quantities.
    lines.forEach((l) => setQty(l.lineId, 0));
    router.push(`/order/${order.id}`);
  }

  return (
    <main className="container-page py-6">
      <Link
        href={`/restaurant/${restaurantSlug}`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" /> Back to {restaurantName}
      </Link>

      <h1 className="mb-6 text-2xl font-extrabold">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Account */}
          <Section title="1. Your details">
            {isAuthed ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-ink-muted">{user?.phone}</p>
                </div>
                <Check className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <button onClick={() => openAuth()} className="btn-brand px-5 py-2.5">
                Log in to continue
              </button>
            )}
          </Section>

          {/* Address (delivery) or Pickup location */}
          {isPickup ? (
            <Section title="2. Pick-up location">
              <div className="flex items-start gap-3 rounded-xl border border-brand bg-brand-50 p-4">
                <Store className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold">{restaurantName}</p>
                  <p className="text-sm text-ink-muted">
                    {pickupAddress.city
                      ? `Collect from the restaurant · ${pickupAddress.city}`
                      : 'Collect from the restaurant'}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-green-600">
                    No delivery fee — ready in ~{pickupRestaurant?.avgPrepMinutes ?? 20} min
                  </p>
                </div>
              </div>
            </Section>
          ) : (
          <Section title="2. Delivery address">
            <div className="space-y-2">
              {addresses.map((a) => {
                const active = chosenAddress?.id === a.id;
                return (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-brand bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin
                    className={`mt-0.5 h-5 w-5 ${active ? 'text-brand' : 'text-gray-400'}`}
                  />
                  <div>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="text-sm text-ink-muted">
                      {a.line1}, {a.city}
                    </p>
                  </div>
                </button>
                );
              })}

              {showNewAddr ? (
                <div className="rounded-xl border border-gray-200 p-3">
                  <input
                    value={draft.line1}
                    onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
                    placeholder="Street address"
                    className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <input
                    value={draft.city}
                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                    placeholder="City"
                    className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveNewAddress} className="btn-brand px-4 py-2 text-sm">
                      Save
                    </button>
                    <button
                      onClick={() => setShowNewAddr(false)}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewAddr(true)}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 p-3 text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
                >
                  <Plus className="h-4 w-4" /> Add a new address
                </button>
              )}
            </div>
          </Section>
          )}

          {/* Payment */}
          <Section title="3. Payment method">
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    payment === m.id
                      ? 'border-brand bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-ink-muted">{m.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-card lg:sticky lg:top-20">
          <h2 className="mb-1 font-bold">{restaurantName}</h2>
          <p className="mb-4 text-sm text-ink-muted">{lines.length} item(s)</p>

          <div className="mb-4 space-y-3">
            {lines.map((l) => (
              <div key={l.lineId} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt={l.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.name}</p>
                  {(l.addons?.length ?? 0) > 0 && (
                    <p className="truncate text-xs text-ink-muted">
                      + {(l.addons ?? []).map((a) => a.name).join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-ink-muted">
                    {l.quantity} × Rs {l.price}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  Rs {(l.quantity * l.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Voucher */}
          <div className="mb-4 border-t border-gray-100 pt-4">
            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Voucher code"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm uppercase outline-none focus:border-brand"
              />
              <button
                onClick={handleApplyVoucher}
                className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Apply
              </button>
            </div>
            {voucherMsg && (
              <p className={`mt-2 text-xs font-medium ${voucherMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                {voucherMsg.text}
              </p>
            )}
            <p className="mt-2 text-xs text-ink-muted">
              Try <b>FIRST100</b>, <b>FOODRUSH50</b> or <b>SAVE20</b>
            </p>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
            <Row label="Subtotal" value={subtotal} />
            {isPickup ? (
              <div className="flex justify-between text-ink-muted">
                <span>Pick-up</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            ) : (
              <Row label="Delivery fee" value={deliveryFee} />
            )}
            <Row label="Service fee" value={SERVICE_FEE} />
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Voucher discount</span>
                <span className="font-medium">− Rs {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold">
              <span>Total</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="btn-brand mt-4 w-full py-3 text-base disabled:opacity-60"
          >
            {placing ? 'Placing order…' : `Place order · Rs ${total.toLocaleString()}`}
          </button>
          <p className="mt-2 text-center text-xs text-ink-muted">
            By placing your order you agree to our terms.
          </p>
        </aside>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="mb-3 font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-ink-muted">
      <span>{label}</span>
      <span className="font-medium text-ink">Rs {value.toLocaleString()}</span>
    </div>
  );
}
