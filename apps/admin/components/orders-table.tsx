import { OrderStatusBadge } from './status-badge';
import type { AdminOrder } from '@/lib/data';

export function OrdersTable({ rows }: { rows: AdminOrder[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-5 py-3 font-semibold">Order</th>
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Restaurant</th>
            <th className="px-5 py-3 font-semibold">Rider</th>
            <th className="px-5 py-3 font-semibold">Items</th>
            <th className="px-5 py-3 font-semibold">Total</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold">Placed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((o) => (
            <tr key={o.number} className="hover:bg-slate-50/60">
              <td className="px-5 py-3 font-semibold text-slate-700">{o.number}</td>
              <td className="px-5 py-3 text-slate-600">{o.customer}</td>
              <td className="px-5 py-3 text-slate-600">{o.restaurant}</td>
              <td className="px-5 py-3 text-slate-500">
                {o.rider ?? <span className="text-amber-600">Unassigned</span>}
              </td>
              <td className="px-5 py-3 text-slate-500">{o.items}</td>
              <td className="px-5 py-3 font-semibold">
                Rs {o.total.toLocaleString()}
              </td>
              <td className="px-5 py-3">
                <OrderStatusBadge status={o.status} />
              </td>
              <td className="px-5 py-3 text-slate-400">{o.placedAgo} ago</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
