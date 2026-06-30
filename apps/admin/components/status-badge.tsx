import type { OrderStatus } from '@/lib/data';

const ORDER_STYLES: Record<OrderStatus, string> = {
  PLACED: 'bg-blue-50 text-blue-700',
  PREPARING: 'bg-amber-50 text-amber-700',
  ON_THE_WAY: 'bg-violet-50 text-violet-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

const ORDER_LABELS: Record<OrderStatus, string> = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  ON_THE_WAY: 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {ORDER_LABELS[status]}
    </span>
  );
}

const REST_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-700',
  SUSPENDED: 'bg-red-50 text-red-600',
};

export function RestaurantStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${REST_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {status.replace('_', ' ').toLowerCase()}
    </span>
  );
}
