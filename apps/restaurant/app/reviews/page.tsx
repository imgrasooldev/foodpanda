'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { restaurant, reviews as seed, ratingBreakdown, type VendorReview } from '@/lib/data';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<VendorReview[]>(seed);
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const totalRatings = ratingBreakdown.reduce((n, r) => n + r.count, 0);

  function submitReply(id: string) {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText.trim() } : r)),
    );
    setReplyFor(null);
    setReplyText('');
  }

  return (
    <>
      <Topbar title="Reviews" subtitle="What customers are saying" />
      <main className="space-y-6 p-6">
        {/* Summary */}
        <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-card md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-5 md:border-b-0 md:border-r md:pb-0">
            <p className="text-5xl font-extrabold">{restaurant.rating}</p>
            <div className="mt-2 flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-5 w-5 ${s <= Math.round(restaurant.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {restaurant.ratingCount.toLocaleString()} ratings
            </p>
          </div>
          <div className="space-y-2">
            {ratingBreakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-3 text-sm">
                <span className="flex w-10 items-center gap-1 font-medium">
                  {b.stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${(b.count / totalRatings) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-slate-400">
                  {b.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand">
                  {r.author[0]}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{r.daysAgo} days ago</span>
              </div>
              <p className="mt-3 text-sm text-slate-700">{r.text}</p>

              {r.reply ? (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">Your reply</p>
                  <p className="mt-0.5 text-sm text-slate-700">{r.reply}</p>
                </div>
              ) : replyFor === r.id ? (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Write a reply…"
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => submitReply(r.id)}
                      className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setReplyFor(null)}
                      className="px-3 py-1.5 text-sm font-semibold text-slate-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyFor(r.id)}
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  <MessageSquare className="h-4 w-4" /> Reply
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
