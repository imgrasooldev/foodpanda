export function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-50 to-brand-100">
      <div className="flex items-center justify-between p-6 sm:p-8">
        <div>
          <h2 className="max-w-sm text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            Sign up for free delivery on your first order
          </h2>
          <button className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">
            Sign up
          </button>
        </div>
        <span className="hidden text-7xl sm:block">🐼</span>
      </div>
    </section>
  );
}
