'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export function FavoriteButton({ label }: { label: string }) {
  const [fav, setFav] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFav((v) => !v);
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
