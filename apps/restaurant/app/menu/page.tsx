'use client';

import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { menu as initialMenu, type VendorMenuItem } from '@/lib/data';

export default function MenuPage() {
  const [menu, setMenu] = useState<VendorMenuItem[]>(initialMenu);

  const toggle = (id: string) =>
    setMenu((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)),
    );

  const categories = Array.from(new Set(menu.map((m) => m.category)));

  return (
    <>
      <Topbar title="Menu" subtitle={`${menu.length} items`} />
      <main className="space-y-8 p-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>

        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="mb-3 text-lg font-bold">{cat}</h2>
            <div className="space-y-3">
              {menu
                .filter((m) => m.category === cat)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-16 w-16 rounded-xl object-cover ${
                        item.available ? '' : 'opacity-40 grayscale'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.name}</p>
                        {!item.available && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                            Sold out
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-slate-500">
                        {item.description}
                      </p>
                      <p className="mt-0.5 text-sm font-bold">Rs {item.price}</p>
                    </div>

                    <button className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Availability toggle */}
                    <button
                      onClick={() => toggle(item.id)}
                      aria-label={`Toggle ${item.name} availability`}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        item.available ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          item.available ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
