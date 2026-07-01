import Link from 'next/link';
import { searchCatalogue } from '@/lib/data';
import { SearchResults } from '@/components/search-results';
import { SearchBox } from '@/components/search-box';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? '';
  const { restaurants, dishes } = searchCatalogue(q);
  const hasResults = restaurants.length > 0 || dishes.length > 0;

  return (
    <main className="container-page py-6">
      <div className="mx-auto mb-6 max-w-xl">
        <SearchBox initial={q} autoFocus />
      </div>

      {q && (
        <p className="mb-6 text-sm text-ink-muted">
          {hasResults
            ? `Results for "${q}"`
            : `No results for "${q}". Try another dish or restaurant.`}
        </p>
      )}

      {dishes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold">Dishes</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((d) => (
              <Link
                key={`${d.restaurant.slug}-${d.item.id}`}
                href={`/restaurant/${d.restaurant.slug}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card transition hover:shadow-card-hover"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.item.image}
                  alt={d.item.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{d.item.name}</p>
                  <p className="truncate text-sm text-ink-muted">
                    {d.restaurant.name}
                  </p>
                  <p className="mt-0.5 text-sm font-bold">Rs {d.item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && <SearchResults restaurants={restaurants} />}

      {!q && (
        <div className="grid min-h-[40vh] place-items-center text-center">
          <div>
            <p className="text-5xl">🔍</p>
            <h2 className="mt-3 text-xl font-bold">What are you craving?</h2>
            <p className="mt-1 text-ink-muted">
              Search for a dish, cuisine, or restaurant above.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
