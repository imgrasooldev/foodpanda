import { Topbar } from '@/components/topbar';
import { OrdersTable } from '@/components/orders-table';
import { recentOrders } from '@/lib/data';

const FILTERS = ['All', 'Placed', 'Preparing', 'On the way', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  return (
    <>
      <Topbar title="Orders" subtitle={`${recentOrders.length} live & recent orders`} />
      <main className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                i === 0
                  ? 'bg-brand text-white'
                  : 'bg-white text-slate-600 shadow-card hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <OrdersTable rows={recentOrders} />
        </section>
      </main>
    </>
  );
}
