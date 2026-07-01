'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Phone, Mail, MessageSquare } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Once you place an order, open it from “My orders” to see live status — from the restaurant confirming it, to preparing, to out for delivery.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes — you can cancel for free from the order tracking screen while the order is still being prepared (before it goes out for delivery).',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Cash on Delivery, Credit/Debit Card, JazzCash and Easypaisa. You can choose your method at checkout.',
  },
  {
    q: 'How does Pick-up work?',
    a: 'Switch to the Pick-up tab, order as usual, and collect it yourself from the restaurant — with no delivery fee.',
  },
  {
    q: 'A menu item shows “Sold out” — why?',
    a: 'Restaurants mark items unavailable in real time. Sold-out items can’t be added until the restaurant restocks them.',
  },
  {
    q: 'How do I apply a voucher?',
    a: 'Enter your voucher code in the “Voucher code” box at checkout and tap Apply. Try FIRST100, FOODRUSH50 or SAVE20.',
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold">Help Center</h1>
        <p className="mt-2 text-ink-muted">
          Answers to common questions. Still stuck? Reach us below.
        </p>

        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-sm text-ink-muted">{f.a}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <ContactCard icon={Phone} title="Call us" value="+92 21 111 366 366" />
          <ContactCard icon={Mail} title="Email" value="support@foodrush.pk" />
          <ContactCard icon={MessageSquare} title="Live chat" value="9am – 12am daily" />
        </div>

        <p className="mt-8 text-sm text-ink-muted">
          See also our{' '}
          <Link href="/terms" className="font-semibold text-brand">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-semibold text-brand">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Phone;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-card">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-bold">{title}</p>
      <p className="mt-0.5 text-sm text-ink-muted">{value}</p>
    </div>
  );
}
