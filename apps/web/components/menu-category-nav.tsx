'use client';

import { useEffect, useState } from 'react';

export function MenuCategoryNav({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace('cat-', ''));
      },
      { rootMargin: '-120px 0px -65% 0px', threshold: 0 },
    );
    categories.forEach((c) => {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 z-30 -mx-4 mb-2 border-b border-gray-100 bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <nav className="no-scrollbar container-page flex gap-1 overflow-x-auto py-2">
        {categories.map((c) => {
          const on = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => scrollTo(c.id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                on ? 'bg-ink text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
