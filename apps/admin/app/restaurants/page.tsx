import { Star, Check, X } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { RestaurantStatusBadge } from '@/components/status-badge';
import { restaurants } from '@/lib/data';

export default function RestaurantsPage() {
  const pending = restaurants.filter((r) => r.status === 'PENDING_APPROVAL');

  return (
    <>
      <Topbar title="Restaurants" subtitle={`${restaurants.length} partners`} />
      <main className="space-y-6 p-6">
        {pending.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <h2 className="mb-3 text-sm font-bold text-amber-800">
              {pending.length} restaurants awaiting approval
            </h2>
            <div className="space-y-2">
              {pending.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.cuisine} · {r.city}
                    </p>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {restaurants.map((r) => (
                  <tr key={r.name} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-700">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.image}
                          alt={r.name}
                          className="h-9 w-9 rounded-lg object-cover"
                        />
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
