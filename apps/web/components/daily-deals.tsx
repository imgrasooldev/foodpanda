const DEALS = [
  {
    title: 'Up to 30% off',
    subtitle: 'Selected restaurants',
    image: '/img/chicken-broast.jpg',
    from: 'from-brand to-brand-700',
  },
  {
    title: 'Rs. 599',
    subtitle: 'Midnight deal',
    image: '/img/jugnu-burger.jpg',
    from: 'from-violet-600 to-fuchsia-700',
  },
  {
    title: 'From Rs. 499',
    subtitle: 'Midnight deals',
    image: '/img/bbq-platter.jpg',
    from: 'from-rose-600 to-pink-700',
  },
];

export function DailyDeals() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-extrabold">Your daily deals</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEALS.map((d) => (
          <div
            key={d.title}
            className={`relative flex h-28 items-center overflow-hidden rounded-2xl bg-gradient-to-r ${d.from} p-5 text-white`}
          >
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {d.subtitle}
              </p>
              <p className="text-2xl font-extrabold leading-tight">{d.title}</p>
              <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                T&amp;Cs apply
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.image}
              alt=""
              className="absolute right-0 top-0 h-full w-32 object-cover [mask-image:linear-gradient(to_right,transparent,black_60%)]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
