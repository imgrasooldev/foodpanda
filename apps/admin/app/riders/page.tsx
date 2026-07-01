'use client';

import { useState } from 'react';
import { Bike, Circle, Search } from 'lucide-react';
import { Topbar } from '@/components/topbar';

const riders = [
  { name: 'Bilal K.', vehicle: 'Motorbike', zone: 'DHA', status: 'ON_DELIVERY', deliveries: 14, rating: 4.9 },
  { name: 'Usman R.', vehicle: 'Motorbike', zone: 'Gulshan', status: 'ONLINE', deliveries: 11, rating: 4.7 },
  { name: 'Asad M.', vehicle: 'Bicycle', zone: 'Clifton', status: 'ON_DELIVERY', deliveries: 9, rating: 4.8 },
  { name: 'Hassan T.', vehicle: 'Motorbike', zone: 'Saddar', status: 'ONLINE', deliveries: 16, rating: 4.6 },
  { name: 'Kamran P.', vehicle: 'Car', zone: 'Malir', status: 'OFFLINE', deliveries: 7, rating: 4.5 },
  { name: 'Faizan N.', vehicle: 'Motorbike', zone: 'North Nazimabad', status: 'ONLINE', deliveries: 12, rating: 4.8 },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  ON_DELIVERY: { label: 'On delivery', cls: 'text-violet-600' },
  ONLINE: { label: 'Online', cls: 'text-green-600' },
  OFFLINE: { label: 'Offline', cls: 'text-slate-400' },
};

const FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'ONLINE', label: 'Online' },
  { id: 'ON_DELIVERY', label: 'On delivery' },
  { id: 'OFFLINE', label: 'Offline' },
];

export default function RidersPage() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('deliveries');

  const online = riders.filter((r) => r.status !== 'OFFLINE').length;
  const query = q.trim().toLowerCase();

  const shown = riders
    .filter((r) => filter === 'ALL' || r.status === filter)
    .filter(
      (r) =>
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.zone.toLowerCase().includes(query) ||
        r.vehicle.toLowerCase().includes(query),
    )
    .sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : b.deliveries - a.deliveries,
    );

  return (
    <>
      <Topbar title="Riders" subtitle={`${online} of ${riders.length} online`} />
      <main className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === f.id
                    ? 'bg-brand text-white'
                    : 'bg-white text-slate-600 shadow-card hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, zone, vehicle"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-brand"
          >
            <option value="deliveries">Most deliveries</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.length === 0 && (
            <p className="col-span-full py-10 text-center text-slate-400">
              No riders match your filters.
            </p>
          )}
          {shown.map((r) => {
            const s = STATUS[r.status];
            return (
              <div key={r.name} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand">
                    <Bike className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.vehicle} · {r.zone}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${s.cls}`}>
                    <Circle className="h-2 w-2 fill-current" />
                    {s.label}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-sm">
                  <span className="text-slate-500">{r.deliveries} deliveries today</span>
                  <span className="font-semibold text-slate-600">⭐ {r.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
