// Reads live per-restaurant state (open/closed + sold-out items) set by the
// vendor, from the shared sync server. Best-effort — falls back to open.
const SYNC = process.env.NEXT_PUBLIC_SYNC_URL ?? 'http://localhost:4100';

export interface RestaurantLiveState {
  isOpen: boolean;
  soldOut: string[];
}

export async function fetchRestaurantState(
  slug: string,
): Promise<RestaurantLiveState> {
  try {
    const r = await fetch(`${SYNC}/restaurant-state/${slug}`, { cache: 'no-store' });
    if (!r.ok) return { isOpen: true, soldOut: [] };
    return r.json();
  } catch {
    return { isOpen: true, soldOut: [] };
  }
}
