'use client';

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { MenuItemRow } from './menu-item-row';
import {
  fetchRestaurantState,
  type RestaurantLiveState,
} from '@/lib/restaurant-state';
import type { MenuCategory } from '@/lib/types';

export function RestaurantMenu({
  slug,
  restaurantName,
  categories,
}: {
  slug: string;
  restaurantName: string;
  categories: MenuCategory[];
}) {
  const [state, setState] = useState<RestaurantLiveState>({
    isOpen: true,
    soldOut: [],
  });

  useEffect(() => {
    let alive = true;
    const load = () => fetchRestaurantState(slug).then((s) => alive && setState(s));
    load();
    const t = setInterval(load, 8000); // reflect vendor changes live
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [slug]);

  return (
    <>
      {!state.isOpen && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <Lock className="h-5 w-5 shrink-0" />
          <p>
            <b>{restaurantName} is currently closed</b> and not accepting orders
            right now. You can still browse the menu.
          </p>
        </div>
      )}

      <div className="mt-4 space-y-10">
        {categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28">
            <h2 className="mb-3 text-xl font-bold">
              {cat.name}
              <span className="ml-2 text-sm font-medium text-ink-muted">
                {cat.items.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {cat.items.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-1 shadow-card">
                  <MenuItemRow
                    item={item}
                    restaurantSlug={slug}
                    restaurantName={restaurantName}
                    soldOut={!state.isOpen || state.soldOut.includes(item.name)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
