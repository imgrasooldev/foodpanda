export const metadata = { title: 'Privacy Policy — FoodRush' };

const SECTIONS = [
  {
    h: '1. Information we collect',
    p: 'We collect the details you provide — your name, phone number, delivery addresses, and order history — so we can process and deliver your orders and improve your experience.',
  },
  {
    h: '2. How we use it',
    p: 'Your information is used to place orders with restaurants, arrange delivery, provide support, send order updates, and personalise recommendations. We do not sell your personal data.',
  },
  {
    h: '3. Sharing',
    p: 'We share only what is necessary — for example, your delivery address and order with the restaurant and rider fulfilling it. Payment details are handled by secure payment providers.',
  },
  {
    h: '4. Your choices',
    p: 'You can view and manage your saved addresses and profile in the app, and you may request deletion of your account. You can opt out of promotional messages at any time.',
  },
  {
    h: '5. Security',
    p: 'We use reasonable technical and organisational measures to protect your data. No method of transmission or storage is completely secure, but we work to safeguard your information.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
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
          This policy is a demo for the FoodRush project.
        </p>
      </div>
    </main>
  );
}
