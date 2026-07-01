'use client';

import { useState } from 'react';
import { Star, Check, X, Ban, RotateCcw, Search } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { RestaurantStatusBadge } from '@/components/status-badge';
import { restaurants as seed, type AdminRestaurant } from '@/lib/data';

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PENDING_APPROVAL', label: 'Pending' },
  { id: 'SUSPENDED', label: 'Suspended' },
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(seed);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState('orders');

  const pending = restaurants.filter((r) => r.status === 'PENDING_APPROVAL');

  const setStatus = (name: string, status: AdminRestaurant['status']) =>
    setRestaurants((prev) => prev.map((r) => (r.name === name ? { ...r, status } : r)));
  const reject = (name: string) =>
    setRestaurants((prev) => prev.filter((r) => r.name !== name));

  const query = q.trim().toLowerCase();
  const shown = restaurants
    .filter((r) => statusFilter === 'ALL' || r.status === statusFilter)
    .filter(
      (r) =>
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query) ||
        r.city.toLowerCase().includes(query),
    )
    .sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.orders - a.orders;
      }
    });

  return (
    <>
      <Topbar title="Restaurants" subtitle={`${restaurants.length} partners`} />
      <main className="space-y-6 p-6">
        {pending.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <h2 className="mb-3 text-sm font-bold text-amber-800">
              {pending.length} restaurant(s) awaiting approval
            </h2>
            <div className="space-y-2">
              {pending.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.name} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.cuisine} · {r.city}
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus(r.name, 'ACTIVE')}
                    className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => reject(r.name)}
                    className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search + filter + sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === f.id
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
              placeholder="Search name, cuisine, city"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-brand"
          >
            <option value="orders">Most orders</option>
            <option value="rating">Top rated</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Restaurant</th>
                  <th className="px-5 py-3 font-semibold">Cuisine</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">Orders</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                      No restaurants match your filters.
                    </td>
                  </tr>
                )}
                {shown.map((r) => (
                  <tr key={r.name} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-700">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.image} alt={r.name} className="h-9 w-9 rounded-lg object-cover" />
                        {r.name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{r.cuisine}</td>
                    <td className="px-5 py-3 text-slate-500">{r.city}</td>
                    <td className="px-5 py-3 font-medium text-slate-600">
                      {r.orders.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      {r.rating > 0 ? (
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {r.rating}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <RestaurantStatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {r.status === 'ACTIVE' && (
                        <button
                          onClick={() => setStatus(r.name, 'SUSPENDED')}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </button>
                      )}
                      {r.status === 'SUSPENDED' && (
                        <button
                          onClick={() => setStatus(r.name, 'ACTIVE')}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
