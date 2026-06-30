'use client';

import { useMemo, useState } from 'react';
import type { Restaurant } from '@/lib/types';
import { RestaurantCard } from './restaurant-card';
import { FiltersSidebar, type SortKey } from './filters-sidebar';
import { CuisinesForYou } from './cuisines-for-you';
import { DailyDeals } from './daily-deals';
import { PromoBanner } from './promo-banner';

export function HomeBrowser({ restaurants }: { restaurants: Restaurant[] }) {
  const [sort, setSort] = useState<SortKey>('relevance');
  const [ratings4, setRatings4] = useState(false);
  const [vouchers, setVouchers] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const allCuisines = useMemo(
    () => Array.from(new Set(restaurants.flatMap((r) => r.cuisines))).sort(),
    [restaurants],
  );

  const toggleCuisine = (c: string) =>
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (selectedCuisines.length)
      list = list.filter((r) =>
        r.cuisines.some((c) => selectedCuisines.includes(c)),
      );
    if (ratings4) list = list.filter((r) => r.ratingAvg >= 4);
    if (vouchers) list = list.filter((r) => !!r.promo);

    switch (sort) {
      case 'fastest':
        list.sort((a, b) => a.avgPrepMinutes - b.avgPrepMinutes);
        break;
      case 'distance':
        list.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case 'top_rated':
        list.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
    }
    return list;
  }, [restaurants, selectedCuisines, ratings4, vouchers, sort]);

  const homechefs = filtered.slice(0, 4);

  return (
    <div className="container-page flex gap-8 py-6">
      <FiltersSidebar
        sort={sort}
        setSort={setSort}
        ratings4={ratings4}
        setRatings4={setRatings4}
        vouchers={vouchers}
        setVouchers={setVouchers}
        cuisines={allCuisines}
        selectedCuisines={selectedCuisines}
        toggleCuisine={toggleCuisine}
      />

      <main className="min-w-0 flex-1 space-y-10">
        <PromoBanner />
        <CuisinesForYou selected={selectedCuisines} onToggle={toggleCuisine} />
        <DailyDeals />

        {homechefs.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-extrabold">
              Homechefs — flat 15% off
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {homechefs.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">
              {selectedCuisines.length || ratings4 || vouchers
                ? 'Matching restaurants'
                : 'All restaurants'}
            </h2>
            <span className="text-sm text-ink-muted">{filtered.length} places</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-card">
              <p className="text-4xl">🍽️</p>
              <p className="mt-2 font-semibold">No restaurants match your filters</p>
              <p className="text-sm text-ink-muted">
                Try removing a cuisine or the Ratings 4+ filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
