import { cuisines } from '@/lib/data';

export function CuisineRail() {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
      {cuisines.map((c) => (
        <button
          key={c.name}
          className="flex shrink-0 flex-col items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <span className="text-2xl">{c.emoji}</span>
          <span className="text-xs font-semibold text-gray-700">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
