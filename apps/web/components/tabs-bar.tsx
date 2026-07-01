'use client';

import { useState } from 'react';
import { Bike, Footprints, ShoppingCart, Store } from 'lucide-react';
import { SearchBox } from './search-box';
import { useOrderMode, type OrderMode } from './order-mode-context';

export function TabsBar() {
  const { mode, setMode } = useOrderMode();
  // rushmart / shops are placeholders; delivery & pickup drive the order mode.
  const [otherTab, setOtherTab] = useState<string | null>(null);

  const tabs: {
    id: string;
    label: string;
    icon: typeof Bike;
    mode?: OrderMode;
  }[] = [
    { id: 'delivery', label: 'Delivery', icon: Bike, mode: 'DELIVERY' },
    { id: 'pickup', label: 'Pick-up', icon: Footprints, mode: 'PICKUP' },
    { id: 'mart', label: 'rushmart', icon: ShoppingCart },
    { id: 'shops', label: 'Shops', icon: Store },
  ];

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="container-page flex h-14 items-center gap-2">
        <nav className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = t.mode ? mode === t.mode && !otherTab : otherTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (t.mode) {
                    setMode(t.mode);
                    setOtherTab(null);
                  } else {
                    setOtherTab(t.id);
                  }
                }}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition ${
                  on
                    ? 'border-ink text-ink'
                    : 'border-transparent text-gray-500 hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {!t.mode && (
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-400">
                    soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <SearchBox className="ml-auto hidden w-full max-w-md md:block" />
      </div>

      {mode === 'PICKUP' && !otherTab && (
        <div className="border-t border-gray-100 bg-amber-50">
          <div className="container-page flex h-9 items-center gap-2 text-xs font-medium text-amber-800">
            <Footprints className="h-3.5 w-3.5" />
            Pick-up mode — collect your order yourself. No delivery fee.
          </div>
        </div>
      )}
    </div>
  );
}
