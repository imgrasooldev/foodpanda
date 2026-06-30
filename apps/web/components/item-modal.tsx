'use client';

import { useState } from 'react';
import { X, Minus, Plus, Flame } from 'lucide-react';
import { useCart } from './cart-context';
import type { MenuItem } from '@/lib/types';

export function ItemModal({
  item,
  restaurantSlug,
  restaurantName,
  open,
  onClose,
}: {
  item: MenuItem;
  restaurantSlug: string;
  restaurantName: string;
  open: boolean;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const addons = item.addons ?? [];
  const chosen = addons.filter((a) => selected.includes(a.id));
  const unit = item.price + chosen.reduce((s, a) => s + a.price, 0);
  const total = unit * qty;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleAdd() {
    addItem({
      id: item.id,
      name: item.name,
      basePrice: item.price,
      image: item.image,
      restaurantSlug,
      restaurantName,
      addons: chosen.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      notes: notes.trim() || undefined,
      quantity: qty,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl">
        {/* Image header */}
        <div className="relative h-44 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ink shadow hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold">{item.name}</h2>
            {item.spicy && <Flame className="h-4 w-4 text-red-500" />}
          </div>
          <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
          <p className="mt-2 font-bold">Rs {item.price}</p>

          {addons.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold">Add extras</h3>
              <p className="mb-2 text-xs text-ink-muted">Optional</p>
              <div className="space-y-2">
                {addons.map((a) => (
                  <label
                    key={a.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(a.id)}
                      onChange={() => toggle(a.id)}
                      className="h-4 w-4 rounded accent-brand"
                    />
                    <span className="flex-1 text-sm font-medium">{a.name}</span>
                    <span className="text-sm text-ink-muted">+ Rs {a.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold">Special instructions</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. less spicy, no onions…"
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 p-4">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 px-1.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-8 w-8 place-items-center rounded-full text-brand hover:bg-brand-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button onClick={handleAdd} className="btn-brand flex-1 justify-between px-5 py-3">
            <span>Add to cart</span>
            <span>Rs {total.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
