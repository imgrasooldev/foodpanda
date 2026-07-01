'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { Restaurant } from '@/lib/types';
import { RestaurantCard } from './restaurant-card';

export function SearchResults({ restaurants }: { restaurants: Restaurant[] }) {
  const [sort, setSort] = useState('relevance');

  const sorted = [...restaurants].sort((a, b) => {
    switch (sort) {
      case 'rating':
        return b.ratingAvg - a.ratingAvg;
      case 'fastest':
        return a.avgPrepMinutes - b.avgPrepMinutes;
      case 'price_low':
        return a.priceLevel - b.priceLevel;
      case 'price_high':
        return b.priceLevel - a.priceLevel;
      default:
        return 0; // relevance = match order
    }
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Restaurants</h2>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <ArrowUpDown className="h-4 w-4" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-brand"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Top rated</option>
            <option value="fastest">Fastest</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </section>
  );
}
