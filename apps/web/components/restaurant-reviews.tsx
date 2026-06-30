'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useReviews } from './reviews-context';
import { useAuth } from './auth-context';

export function RestaurantReviews({
  slug,
  ratingAvg,
  ratingCount,
}: {
  slug: string;
  ratingAvg: number;
  ratingCount: number;
}) {
  const { getReviews, addReview } = useReviews();
  const { user, isAuthed, openAuth } = useAuth();
  const reviews = getReviews(slug);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!isAuthed) {
      openAuth();
      return;
    }
    if (!text.trim()) return;
    addReview(slug, { author: user?.name ?? 'Guest', rating, text: text.trim() });
    setText('');
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Ratings & reviews</h2>

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-card md:grid-cols-[200px_1fr]">
        {/* Summary */}
        <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <p className="text-4xl font-extrabold">{ratingAvg}</p>
          <div className="mt-1 flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${s <= Math.round(ratingAvg) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {ratingCount.toLocaleString()} ratings
          </p>
        </div>

        {/* Write a review */}
        <div>
          <h3 className="mb-2 text-sm font-bold">Leave a review</h3>
          <div className="mb-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                aria-label={`${s} star`}
              >
                <Star
                  className={`h-6 w-6 transition ${
                    s <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience…"
            rows={2}
            className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
          <div className="mt-2 flex items-center gap-3">
            <button onClick={submit} className="btn-brand px-5 py-2 text-sm">
              {isAuthed ? 'Post review' : 'Log in to review'}
            </button>
            {submitted && (
              <span className="text-sm font-medium text-green-600">
                Thanks for your review!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="mt-4 space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink-muted shadow-card">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand">
                  {r.author[0]?.toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-ink-muted">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{r.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
