'use client';

import { useState } from 'react';
import { Apple, Play, X, Search } from 'lucide-react';

export type SortKey = 'relevance' | 'fastest' | 'distance' | 'top_rated';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'fastest', label: 'Fastest delivery' },
  { key: 'distance', label: 'Distance' },
  { key: 'top_rated', label: 'Top rated' },
];

// Deterministic faux-QR pattern (12x12).
const QR = Array.from({ length: 144 }, (_, i) => {
  const r = Math.floor(i / 12);
  const c = i % 12;
  const corner = (r < 3 && c < 3) || (r < 3 && c > 8) || (r > 8 && c < 3);
  return corner || (r * 7 + c * 13) % 3 === 0;
});

interface Props {
  sort: SortKey;
  setSort: (s: SortKey) => void;
  ratings4: boolean;
  setRatings4: (v: boolean) => void;
  vouchers: boolean;
  setVouchers: (v: boolean) => void;
  cuisines: string[];
  selectedCuisines: string[];
  toggleCuisine: (c: string) => void;
}

export function FiltersSidebar({
  sort,
  setSort,
  ratings4,
  setRatings4,
  vouchers,
  setVouchers,
  cuisines,
  selectedCuisines,
  toggleCuisine,
}: Props) {
  const [showQr, setShowQr] = useState(true);
  const [cuisineSearch, setCuisineSearch] = useState('');

  const filteredCuisines = cuisines.filter((c) =>
    c.toLowerCase().includes(cuisineSearch.toLowerCase()),
  );

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      {/* App QR card */}
      {showQr && (
        <div className="relative mb-5 rounded-2xl bg-ink p-4 text-white">
          <button
            onClick={() => setShowQr(false)}
            className="absolute right-3 top-3 text-white/60 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto grid w-28 grid-cols-12 gap-px overflow-hidden rounded-lg bg-white p-1.5">
            {QR.map((on, i) => (
              <span
                key={i}
                className={`aspect-square ${on ? 'bg-ink' : 'bg-white'}`}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-sm font-bold leading-tight">
            Unlock more app-only deals. Download now.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/10 py-1.5 text-[11px] font-semibold hover:bg-white/20">
              <Apple className="h-3.5 w-3.5" /> App Store
            </button>
            <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/10 py-1.5 text-[11px] font-semibold hover:bg-white/20">
              <Play className="h-3.5 w-3.5" /> Play Store
            </button>
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-bold">Filters</h2>

      {/* Sort by */}
      <FilterGroup title="Sort by">
        {SORTS.map((s) => (
          <label key={s.key} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
            <input
              type="radio"
              name="sort"
              checked={sort === s.key}
              onChange={() => setSort(s.key)}
              className="h-4 w-4 accent-brand"
            />
            {s.label}
          </label>
        ))}
      </FilterGroup>

      {/* Quick filters */}
      <FilterGroup title="Quick filters">
        <button
          onClick={() => setRatings4(!ratings4)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            ratings4
              ? 'border-brand bg-brand-50 text-brand'
              : 'border-gray-200 text-gray-700 hover:border-brand'
          }`}
        >
          Ratings 4+
        </button>
      </FilterGroup>

      {/* Offers */}
      <FilterGroup title="Offers">
        <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
          <input
            type="checkbox"
            checked={vouchers}
            onChange={() => setVouchers(!vouchers)}
            className="h-4 w-4 rounded accent-brand"
          />
          Accepts vouchers
        </label>
      </FilterGroup>

      {/* Cuisines */}
      <FilterGroup title="Cuisines" last>
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            value={cuisineSearch}
            onChange={(e) => setCuisineSearch(e.target.value)}
            placeholder="Search for cuisine"
            className="w-full rounded-lg border border-gray-200 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
          {filteredCuisines.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
              <input
                type="checkbox"
                checked={selectedCuisines.includes(c)}
                onChange={() => toggleCuisine(c)}
                className="h-4 w-4 rounded accent-brand"
              />
              {c}
            </label>
          ))}
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`py-4 ${last ? '' : 'border-b border-gray-100'}`}>
      <h3 className="mb-2 text-sm font-bold text-gray-500">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
