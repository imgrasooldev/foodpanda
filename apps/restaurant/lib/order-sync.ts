// Vendor client for the shared order-sync server.
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

export async function patchOrder(
  id: string,
  patch: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch(`${SYNC}/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  } catch {
    /* offline */
  }
}

export interface RestaurantState {
  isOpen: boolean;
  soldOut: string[]; // sold-out item names
}

export async function fetchState(slug: string): Promise<RestaurantState> {
  try {
    const r = await fetch(`${SYNC}/restaurant-state/${slug}`, { cache: 'no-store' });
    if (!r.ok) return { isOpen: true, soldOut: [] };
    return r.json();
  } catch {
    return { isOpen: true, soldOut: [] };
  }
}

export async function patchState(
  slug: string,
  patch: Partial<RestaurantState>,
): Promise<void> {
  try {
    await fetch(`${SYNC}/restaurant-state/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  } catch {
    /* offline */
  }
}
