export const metadata = { title: 'Terms & Conditions — FoodRush' };

const SECTIONS = [
  {
    h: '1. Using FoodRush',
    p: 'FoodRush is a platform that connects you with independent restaurants and delivery riders. By placing an order you agree to these terms and to pay the total shown at checkout, including item prices, delivery and service fees, and any applicable taxes.',
  },
  {
    h: '2. Orders & acceptance',
    p: 'An order is a request to a restaurant, which may accept or decline it. If a restaurant declines or cannot fulfil your order, any amount charged is refunded. Prices and availability are set by restaurants and may change.',
  },
  {
    h: '3. Cancellations & refunds',
    p: 'You may cancel free of charge while an order is still being prepared. Once an order is out for delivery it can no longer be cancelled from the app. Refunds for eligible cancellations are returned to your original payment method within 5–7 business days.',
  },
  {
    h: '4. Delivery & pick-up',
    p: 'Estimated times are indicative, not guarantees. For pick-up orders you are responsible for collecting your order from the restaurant. Please provide accurate delivery details.',
  },
  {
    h: '5. Payments',
    p: 'We accept Cash on Delivery, cards, and mobile wallets. You are responsible for any charges incurred. Vouchers are subject to their own conditions and minimum order values.',
  },
  {
    h: '6. Conduct & liability',
    p: 'You agree to use the service lawfully and respectfully towards restaurants and riders. To the extent permitted by law, FoodRush is not liable for the quality or preparation of food, which is the responsibility of the restaurant.',
  },
];

export default function TermsPage() {
  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: 1 July 2026</p>
        <div className="mt-8 space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="mb-1.5 text-lg font-bold">{s.h}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{s.p}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-muted">
          These terms are a demo for the FoodRush project and are not a real
          legal agreement.
        </p>
      </div>
    </main>
  );
}
