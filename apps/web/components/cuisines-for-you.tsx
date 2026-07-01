'use client';

import { useRef } from 'react';
import { ChevronRight } from 'lucide-react';

const CUISINE_TILES: { name: string; image: string }[] = [
  { name: 'Pizza', image: '/img/pepperoni-pizza.jpg' },
  { name: 'Fast Food', image: '/img/zinger-burger.jpg' },
  { name: 'Burgers', image: '/img/jugnu-burger.jpg' },
  { name: 'Biryani', image: '/img/chicken-biryani.jpg' },
  { name: 'BBQ', image: '/img/bbq-platter.jpg' },
  { name: 'Karahi', image: '/img/chicken-karahi.jpg' },
  { name: 'Fried Chicken', image: '/img/chicken-broast.jpg' },
  { name: 'Desi', image: '/img/seekh-kebab.jpg' },
  { name: 'Dessert', image: '/img/kheer.jpg' },
  { name: 'Pulao', image: '/img/chicken-pulao.jpg' },
];

export function CuisinesForYou({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (c: string) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section>
      <h2 className="mb-4 text-2xl font-extrabold">Cuisines for you</h2>
      {/* Wrapper is relative to the rail only, so the arrow centres on the circles */}
      <div className="relative">
        <div
          ref={railRef}
          className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {CUISINE_TILES.map((c) => {
            const on = selected.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => onToggle(c.name)}
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <span
                  className={`overflow-hidden rounded-full ring-2 transition ${
                    on ? 'ring-brand' : 'ring-transparent hover:ring-brand/40'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-20 w-20 object-cover"
                  />
                </span>
                <span
                  className={`text-sm font-semibold ${on ? 'text-brand' : 'text-ink'}`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Centred on the 80px circle images (top-10), hidden on touch */}
        <button
          onClick={() =>
            railRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
          }
          className="absolute right-0 top-10 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gray-100 bg-white shadow-card-hover transition hover:bg-gray-50 sm:grid"
          aria-label="Scroll cuisines"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
