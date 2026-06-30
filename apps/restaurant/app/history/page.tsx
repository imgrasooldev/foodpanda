import { Topbar } from '@/components/topbar';
import { historyOrders } from '@/lib/data';

const STATUS: Record<string, string> = {
  COMPLETED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-600',
};

export default function HistoryPage() {
  return (
    <>
      <Topbar title="Order History" subtitle="Completed and past orders" />
      <main className="p-6">
        <section className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historyOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-700">{o.number}</td>
                    <td className="px-5 py-3 text-slate-600">{o.customer}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{o.payment}</td>
                    <td className="px-5 py-3 font-semibold">Rs {o.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[o.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {o.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{o.placedAgo} ago</td>
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
