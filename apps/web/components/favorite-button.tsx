'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from './favorites-context';

export function FavoriteButton({ slug, label }: { slug: string; label: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-label={fav ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-110 active:scale-95"
    >
      <Heart
        className={`h-[18px] w-[18px] transition ${
          fav ? 'fill-brand text-brand' : 'text-ink'
        }`}
      />
    </button>
  );
}
