/**
 * Live-backend client. The storefront currently renders from lib/data.ts demo
 * data so it works without a running API. To switch to the real backend, set
 * NEXT_PUBLIC_API_URL and call these functions from the page components.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  browseRestaurants: () => apiGet('/restaurants'),
  restaurant: (slug: string) => apiGet(`/restaurants/${slug}`),
};
