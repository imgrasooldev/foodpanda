// Talks to the in-memory order-sync server so the customer and vendor apps
// share live order state. All calls are best-effort — if the sync server
// isn't running, the app still works from local state.
const SYNC =
  process.env.NEXT_PUBLIC_SYNC_URL ?? 'http://localhost:4100';

export async function pushOrder(order: unknown): Promise<void> {
  try {
    await fetch(`${SYNC}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch {
    /* offline — keep local */
  }
}

export async function fetchServerOrder(id: string): Promise<{ status: string; cancelReason?: string } | null> {
  try {
    const r = await fetch(`${SYNC}/orders/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function patchServerOrder(id: string, patch: Record<string, unknown>): Promise<void> {
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
