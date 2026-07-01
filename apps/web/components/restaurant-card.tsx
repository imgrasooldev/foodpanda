'use client';

import Link from 'next/link';
import { Star, Clock, Bike, Footprints } from 'lucide-react';
import type { Restaurant } from '@/lib/types';
import { FavoriteButton } from './favorite-button';
import { useOrderMode } from './order-mode-context';

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const { isPickup } = useOrderMode();
  const topRated = r.ratingAvg >= 4.6;
  // Deterministic pseudo-distance for pickup context.
  const distanceKm = (0.6 + (r.avgPrepMinutes % 7) * 0.5).toFixed(1);

  return (
    <Link
      href={`/restaurant/${r.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={r.coverImage}
          alt={r.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
        />

        {/* Top row: discount + favourite */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {r.promo ? (
            <span className="rounded-lg bg-brand px-2 py-1 text-xs font-bold text-white shadow-sm">
              {r.promo}
            </span>
          ) : (
            <span />
          )}
          <FavoriteButton slug={r.slug} label={r.name} />
        </div>

        {/* Delivery-time pill (DoorDash/Wolt signature) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">
            <Clock className="h-3.5 w-3.5 text-brand" />
            {isPickup ? `Ready in ${r.avgPrepMinutes} min` : `${r.avgPrepMinutes}–${r.avgPrepMinutes + 10} min`}
          </span>
          {isPickup ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">
              {distanceKm} km
            </span>
          ) : (
            r.freeDelivery && (
              <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                Free delivery
              </span>
            )
          )}
        </div>

        {!r.isOpen && (
          <span className="absolute inset-0 grid place-items-center bg-black/55 text-sm font-semibold text-white">
            Closed · Opens tomorrow
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 truncate font-bold leading-tight">{r.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {r.ratingAvg}
            <span className="font-medium text-ink-muted">
              ({formatCount(r.ratingCount)})
            </span>
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
          {topRated && (
            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
              Top Rated
            </span>
          )}
          <span className="truncate">{r.cuisines.join(' · ')}</span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          {isPickup ? (
            <>
              <Footprints className="h-4 w-4 text-brand" />
              <span className="font-semibold text-brand">Self-pickup</span>
              <span className="text-gray-300">·</span>
              <span>{distanceKm} km away</span>
            </>
          ) : (
            <>
              <Bike className="h-4 w-4" />
              {r.freeDelivery ? (
                <span className="font-semibold text-green-600">Free delivery</span>
              ) : (
                <span>Rs {r.deliveryFee} delivery</span>
              )}
              <span className="text-gray-300">·</span>
              <span>Min Rs {r.minOrderAmount}</span>
            </>
          )}
          <span className="ml-auto font-medium text-gray-400">
            {'₨'.repeat(r.priceLevel)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k+`;
  return `${n}`;
}
