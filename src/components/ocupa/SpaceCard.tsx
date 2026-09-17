import { Heart, MapPin, Ruler, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Space } from "@/data/ocupa";

type SpaceCardProps = {
  space: Space;
  favorite: boolean;
  onFavorite: () => void;
};

export function SpaceCard({
  space,
  favorite,
  onFavorite,
}: SpaceCardProps) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-[0_8px_24px_-20px_var(--foreground)] transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-[1.85/1] overflow-hidden bg-muted">
        <img
          src={space.image}
          alt={`${space.name}, espaço disponível em ${space.neighborhood}`}
          width={960}
          height={688}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onFavorite}
          aria-label={
            favorite
              ? `Remover ${space.name} dos favoritos`
              : `Favoritar ${space.name}`
          }
          className="absolute right-2 top-2 size-8 rounded-full bg-foreground/20 text-card backdrop-blur-sm hover:bg-card hover:text-terracotta"
        >
          <Heart
            className="size-5"
            fill={favorite ? "currentColor" : "none"}
          />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-semibold">
          {space.name}
        </h3>

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
          <p className="text-xs">
            <strong className="text-sm text-foreground">
              R$ {space.priceValue}
            </strong>
            <span className="text-muted-foreground">
              /{space.priceUnit}
            </span>
          </p>

          <span className="flex items-center gap-1 text-[0.62rem]">
            <Star className="size-3 fill-terracotta text-terracotta" />

            {space.rating.toFixed(1)}

            <span className="text-muted-foreground">
              ({space.reviews})
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}