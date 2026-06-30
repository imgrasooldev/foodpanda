'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getRestaurants } from '@/lib/data';
import { useFavorites } from '@/components/favorites-context';
import { RestaurantCard } from '@/components/restaurant-card';

export default function FavouritesPage() {
  const { favorites } = useFavorites();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const all = getRestaurants();
  const favRestaurants = all.filter((r) => favorites.includes(r.slug));

  return (
    <main className="container-page py-6">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-extrabold">
        <Heart className="h-6 w-6 fill-brand text-brand" /> Your favourites
      </h1>

      {!hydrated ? (
        <p className="text-ink-muted">Loading…</p>
      ) : favRestaurants.length === 0 ? (
        <div className="grid min-h-[40vh] place-items-center text-center">
          <div>
            <p className="text-5xl">💔</p>
            <h2 className="mt-3 text-xl font-bold">No favourites yet</h2>
            <p className="mt-1 text-ink-muted">
              Tap the heart on any restaurant to save it here.
            </p>
            <Link href="/" className="btn-brand mt-5 inline-flex px-6 py-2.5">
              Discover restaurants
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </main>
  );
}
