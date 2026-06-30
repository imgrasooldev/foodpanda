'use client';

import { useState } from 'react';
import { Plus, Flame } from 'lucide-react';
import { ItemModal } from './item-modal';
import type { MenuItem } from '@/lib/types';

export function MenuItemRow({
  item,
  restaurantSlug,
  restaurantName,
}: {
  item: MenuItem;
  restaurantSlug: string;
  restaurantName: string;
}) {
  const [open, setOpen] = useState(false);
  const hasAddons = (item.addons?.length ?? 0) > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{item.name}</h4>
            {item.popular && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand">
                Popular
              </span>
            )}
            {item.spicy && <Flame className="h-3.5 w-3.5 text-red-500" />}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">
            {item.description}
          </p>
          <p className="mt-1.5 text-sm font-bold">Rs {item.price}</p>
          {hasAddons && (
            <p className="mt-0.5 text-xs font-medium text-brand">Customisable</p>
          )}
        </div>

        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-24 rounded-xl object-cover"
          />
          <span
            aria-hidden
            className="absolute -bottom-2 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-white bg-white text-brand shadow-md transition group-hover:bg-brand"
          >
            <Plus className="h-5 w-5" />
          </span>
        </div>
      </button>

      <ItemModal
        item={item}
        restaurantSlug={restaurantSlug}
        restaurantName={restaurantName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
