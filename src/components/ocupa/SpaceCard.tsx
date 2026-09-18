import { Link } from "@tanstack/react-router";
import { MapPin, Ruler, Star } from "lucide-react";

import { FavoriteButton } from "@/components/ocupa/FavoriteButton";
import { formatSpacePrice, type Space } from "@/data/ocupa";

type SpaceCardProps = {
  space: Space;
};

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-[0_8px_24px_-20px_var(--foreground)] transition-transform hover:-translate-y-0.5">
      <Link
        to="/espacos/$id"
        params={{ id: String(space.id) }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        aria-label={`Ver detalhes de ${space.name}`}
      >
        <div className="relative aspect-[1.85/1] overflow-hidden bg-muted">
          <img
            src={space.image}
            alt={`${space.name}, espaço disponível em ${space.neighborhood}`}
            width={960}
            height={688}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </div>

        <div className="p-4">
          <h3 className="truncate text-sm font-semibold">{space.name}</h3>

          <p className="mt-1 flex items-center gap-1 text-[0.65rem] text-muted-foreground">
            <MapPin className="size-3" />
            {space.neighborhood} • {space.city}
          </p>

          <div className="mt-2 flex items-center gap-3 text-[0.62rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Ruler className="size-3" />
              {space.area}
            </span>

            <span>•</span>

            <span>{space.feature}</span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{formatSpacePrice(space)}</p>

            <span className="flex items-center gap-1 text-[0.62rem]">
              <Star className="size-3 fill-terracotta text-terracotta" />

              {space.rating.toFixed(1)}

              <span className="text-muted-foreground">({space.reviews})</span>
            </span>
          </div>
        </div>
      </Link>

      <FavoriteButton spaceId={space.id} className="absolute right-2 top-2 z-20" />
    </article>
  );
}
