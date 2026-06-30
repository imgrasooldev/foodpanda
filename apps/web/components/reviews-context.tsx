'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  createdAt: number;
}

// Seed reviews per restaurant slug.
const SEED: Record<string, Review[]> = {
  'student-biryani': [
    { id: 's1', author: 'Ahsan R.', rating: 5, text: 'Best biryani in Karachi, hands down. Always fresh.', createdAt: Date.now() - 86400000 * 2 },
    { id: 's2', author: 'Mahnoor', rating: 4, text: 'Great flavour but delivery was a bit slow.', createdAt: Date.now() - 86400000 * 5 },
    { id: 's3', author: 'Bilal K.', rating: 5, text: 'The aloo and raita combo is perfect. Highly recommend.', createdAt: Date.now() - 86400000 * 9 },
  ],
  'johnny-and-jugnu': [
    { id: 'j1', author: 'Hassan', rating: 5, text: 'Smash burgers are unreal. Loaded fries too good.', createdAt: Date.now() - 86400000 * 1 },
    { id: 'j2', author: 'Zara A.', rating: 4, text: 'Tasty but a bit pricey. Worth it occasionally.', createdAt: Date.now() - 86400000 * 4 },
  ],
};

interface ReviewsContextValue {
  getReviews: (slug: string) => Review[];
  addReview: (slug: string, review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);
const STORAGE_KEY = 'foodrush_reviews';

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Record<string, Review[]>>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReviews({ ...SEED, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews, hydrated]);

  function getReviews(slug: string) {
    return reviews[slug] ?? [];
  }

  function addReview(slug: string, r: Omit<Review, 'id' | 'createdAt'>) {
    const review: Review = { ...r, id: `r${Date.now()}`, createdAt: Date.now() };
    setReviews((prev) => ({ ...prev, [slug]: [review, ...(prev[slug] ?? [])] }));
  }

  return (
    <ReviewsContext.Provider value={{ getReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews(): ReviewsContextValue {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
