import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Clock,
  Bike,
  ShoppingBag,
  ChevronLeft,
  MapPin,
  BadgePercent,
} from 'lucide-react';
import { getRestaurantBySlug } from '@/lib/data';
import { MenuItemRow } from '@/components/menu-item-row';
import { MenuCategoryNav } from '@/components/menu-category-nav';
import { FavoriteButton } from '@/components/favorite-button';
import { RestaurantReviews } from '@/components/restaurant-reviews';

export default function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const r = getRestaurantBySlug(params.slug);
  if (!r) notFound();

  return (
    <main className="pb-24">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={r.coverImage}
          alt={r.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <div className="container-page relative flex h-full flex-col justify-between py-4">
          <div className="flex items-start justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-ink shadow"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
            <FavoriteButton slug={r.slug} label={r.name} />
          </div>
        </div>
      </div>

      <div className="container-page">
        {/* Restaurant header card */}
        <div className="relative z-10 -mt-12 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-50 text-3xl ring-1 ring-gray-100">
              {r.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                {r.name}
              </h1>
              <p className="mt-1 truncate text-sm text-ink-muted">
                {r.cuisines.join(' · ')} · {r.description}
              </p>
            </div>
          </div>

          {/* Info pills */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Pill className="bg-green-50 text-green-700">
              <Star className="h-4 w-4 fill-green-600 text-green-600" />
              <b>{r.ratingAvg}</b>
              <span className="font-medium opacity-70">
                ({r.ratingCount.toLocaleString()} ratings)
              </span>
            </Pill>
            <Pill className="bg-gray-50 text-gray-700">
              <Clock className="h-4 w-4 text-brand" />
              {r.avgPrepMinutes}–{r.avgPrepMinutes + 10} min
            </Pill>
            <Pill className="bg-gray-50 text-gray-700">
              <Bike className="h-4 w-4 text-brand" />
              {r.freeDelivery ? 'Free delivery' : `Rs ${r.deliveryFee} delivery`}
            </Pill>
            <Pill className="bg-gray-50 text-gray-700">
              <ShoppingBag className="h-4 w-4 text-brand" />
              Min Rs {r.minOrderAmount}
            </Pill>
            <Pill className="bg-gray-50 text-gray-700">
              <MapPin className="h-4 w-4 text-brand" />
              {r.city}
            </Pill>
          </div>

          {r.promo && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand">
              <BadgePercent className="h-5 w-5" />
              {r.promo} — applied automatically at checkout
            </div>
          )}
        </div>

        {/* Sticky category nav */}
        <div className="mt-6">
          <MenuCategoryNav
            categories={r.categories.map((c) => ({ id: c.id, name: c.name }))}
          />
        </div>

        {/* Menu */}
        <div className="mt-4 space-y-10">
          {r.categories.map((cat) => (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28">
              <h2 className="mb-3 text-xl font-bold">
                {cat.name}
                <span className="ml-2 text-sm font-medium text-ink-muted">
                  {cat.items.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white p-1 shadow-card"
                  >
                    <MenuItemRow
                      item={item}
                      restaurantSlug={r.slug}
                      restaurantName={r.name}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <RestaurantReviews
          slug={r.slug}
          ratingAvg={r.ratingAvg}
          ratingCount={r.ratingCount}
        />
      </div>
    </main>
  );
}

function Pill({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${className}`}
    >
      {children}
    </span>
  );
}
