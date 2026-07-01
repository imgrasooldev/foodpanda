// Admin client for the shared order-sync server — reads ALL platform orders.
const SYNC = process.env.NEXT_PUBLIC_SYNC_URL ?? 'http://localhost:4100';

export interface SyncItem {
  name: string;
  quantity: number;
  price: number;
  addons?: { id: string; name: string; price: number }[];
  notes?: string;
}

export interface SyncOrder {
  id: string;
  number: string;
  customerName?: string;
  restaurantName: string;
  restaurantSlug: string;
  items: SyncItem[];
  subtotal?: number;
  deliveryFee?: number;
  serviceFee?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  address?: { label: string; line1: string; city: string };
  fulfillmentType?: 'DELIVERY' | 'PICKUP';
  status: string;
  placedAt: number;
  cancelReason?: string;
}

export async function fetchOrders(): Promise<SyncOrder[]> {
  try {
    const r = await fetch(`${SYNC}/orders`, { cache: 'no-store' });
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}
