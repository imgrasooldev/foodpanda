'use client';

import { useCart } from './cart-context';

export function CartReplaceDialog() {
  const { pending, restaurantName, confirmReplace, cancelReplace } = useCart();

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[58] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={cancelReplace} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <p className="text-4xl">🛒</p>
        <h2 className="mt-3 text-lg font-extrabold">Start a new order?</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your cart has items from{' '}
          <span className="font-semibold text-ink">{restaurantName}</span>. You can
          only order from one restaurant at a time. Adding{' '}
          <span className="font-semibold text-ink">{pending.name}</span> will clear
          your current cart.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={cancelReplace}
            className="flex-1 rounded-full border border-gray-300 py-2.5 font-semibold hover:bg-gray-50"
          >
            Keep cart
          </button>
          <button onClick={confirmReplace} className="btn-brand flex-1 justify-center py-2.5">
            Start new
          </button>
        </div>
      </div>
    </div>
  );
}
