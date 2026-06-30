'use client';

import { useState } from 'react';
import { Bike, Footprints, ShoppingCart, Store } from 'lucide-react';
import { SearchBox } from './search-box';

const TABS = [
  { id: 'delivery', label: 'Delivery', icon: Bike },
  { id: 'pickup', label: 'Pick-up', icon: Footprints },
  { id: 'mart', label: 'rushmart', icon: ShoppingCart },
  { id: 'shops', label: 'Shops', icon: Store },
];

export function TabsBar() {
  const [active, setActive] = useState('delivery');

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="container-page flex h-14 items-center gap-2">
        <nav className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition ${
                  on
                    ? 'border-ink text-ink'
                    : 'border-transparent text-gray-500 hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <SearchBox className="ml-auto hidden w-full max-w-md md:block" />
      </div>
    </div>
  );
}
