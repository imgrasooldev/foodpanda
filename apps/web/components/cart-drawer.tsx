'use client';

import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './cart-context';
import { useAuth } from './auth-context';
import { DEFAULT_DELIVERY_FEE, SERVICE_FEE } from '@/lib/fees';

const DELIVERY_FEE = DEFAULT_DELIVERY_FEE;

export function CartDrawer() {
  const { lines, isOpen, setOpen, setQty, subtotal, count } = useCart();
  const { isAuthed, openAuth } = useAuth();
  const router = useRouter();

  const total = lines.length ? subtotal + DELIVERY_FEE + SERVICE_FEE : 0;

  function handleCheckout() {
    setOpen(false);
    if (isAuthed) {
      router.push('/checkout');
    } else {
      openAuth(() => router.push('/checkout'));
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-brand" /> Your order
            {count > 0 && (
              <span className="text-sm font-medium text-ink-muted">({count})</span>
            )}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-5xl">🛒</span>
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm text-ink-muted">
              Add items from a restaurant to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((l) => (
                <div key={l.lineId} className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.image}
                    alt={l.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.name}</p>
                    {l.addons.length > 0 && (
                      <p className="truncate text-xs text-ink-muted">
                        + {l.addons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {l.notes && (
                      <p className="truncate text-xs italic text-gray-400">
                        “{l.notes}”
                      </p>
                    )}
                    <p className="text-xs font-medium text-ink-muted">Rs {l.price}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 px-1">
                    <button
                      onClick={() => setQty(l.lineId, l.quantity - 1)}
                      className="grid h-7 w-7 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold">
                      {l.quantity}
                    </span>
                    <button
                      onClick={() => setQty(l.lineId, l.quantity + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full text-brand hover:bg-brand-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 px-5 py-4 text-sm">
              <Row label="Subtotal" value={subtotal} />
              <Row label="Delivery fee" value={DELIVERY_FEE} />
              <Row label="Service fee" value={SERVICE_FEE} />
              <div className="flex justify-between pt-2 text-base font-bold">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn-brand mt-2 w-full py-3 text-base"
              >
                Checkout · Rs {total.toLocaleString()}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
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
