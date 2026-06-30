import {
  ShoppingBag,
  Wallet,
  Store,
  Bike,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { OrdersTable } from '@/components/orders-table';
import {
  kpis,
  ordersByHour,
  recentOrders,
  restaurants,
} from '@/lib/data';

export default function DashboardPage() {
  const maxBar = Math.max(...ordersByHour.map((o) => o.value));
  const topRestaurants = [...restaurants]
    .filter((r) => r.status === 'ACTIVE')
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Live operations overview" />
      <main className="space-y-6 p-6">
        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Orders today"
            value={kpis.ordersToday.toLocaleString()}
            delta={kpis.ordersDelta}
            icon={ShoppingBag}
            tint="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Revenue today"
            value={`Rs ${(kpis.revenueToday / 1000).toFixed(0)}k`}
            delta={kpis.revenueDelta}
            icon={Wallet}
            tint="bg-green-50 text-green-600"
          />
          <StatCard
            label="Active restaurants"
            value={kpis.activeRestaurants.toLocaleString()}
            delta={kpis.restaurantsDelta}
            icon={Store}
            tint="bg-brand-50 text-brand"
          />
          <StatCard
            label="Riders online"
            value={kpis.onlineRiders.toLocaleString()}
            delta={kpis.ridersDelta}
            icon={Bike}
            tint="bg-violet-50 text-violet-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Orders chart */}
          <section className="rounded-2xl bg-white p-5 shadow-card xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Orders today</h2>
                <p className="text-xs text-slate-400">By hour · last 12 hours</p>
              </div>
              <span className="rounded-lg bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                Peak 7–8pm
              </span>
            </div>
            <div className="flex h-48 items-stretch gap-2">
              {ordersByHour.map((o) => (
                <div key={o.hour} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-brand/70 to-brand transition-all hover:from-brand hover:to-brand-700"
                      style={{ height: `${(o.value / maxBar) * 100}%` }}
                      title={`${o.value} orders`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {o.hour}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Top restaurants */}
          <section className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-4 font-bold">Top restaurants</h2>
            <div className="space-y-3">
              {topRestaurants.map((r, i) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.city}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    {r.orders.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent orders */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold">Recent orders</h2>
            <a href="/orders" className="text-sm font-semibold text-brand">
              View all
            </a>
          </div>
          <OrdersTable rows={recentOrders.slice(0, 6)} />
        </section>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tint,
}: {
  label: string;
  value: string;
  delta: number;
  icon: typeof ShoppingBag;
  tint: string;
}) {
  const up = delta >= 0;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-bold ${
            up ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {up ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="mt-4 text-2xl font-extrabold">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
