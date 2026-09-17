import { useState } from "react";
import { Heart, MapPin, Ruler, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import type { Space } from "@/data/ocupa";

type SearchResultsProps = {
  spaces: Space[];
  onSpaceHover?: (id: number | null) => void;
};

export function SearchResults({
  spaces,
  onSpaceHover,
}: SearchResultsProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {spaces.map((space) => {
        const favorite = favorites.includes(space.id);

        return (
          <article
            key={space.id}
            onMouseEnter={() => onSpaceHover?.(space.id)}
            onMouseLeave={() => onSpaceHover?.(null)}
            className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-20px_var(--foreground)]"
          >
            <Link
              to="/espacos/$id"
              params={{ id: String(space.id) }}
              className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              aria-label={`Ver detalhes de ${space.name}`}
            />
            <div className="relative aspect-[1.65/1] overflow-hidden bg-muted">
              <img
                src={space.image}
                alt={`${space.name}, em ${space.neighborhood}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(space.id)}
                aria-label={
                  favorite
                    ? `Remover ${space.name} dos favoritos`
                    : `Favoritar ${space.name}`
                }
                className="absolute right-3 top-3 z-20 size-8 rounded-full bg-foreground/20 text-card backdrop-blur-sm hover:bg-card hover:text-terracotta"
              >
                <Heart
                  className="size-4"
                  fill={favorite ? "currentColor" : "none"}
                />
              </Button>

              <span className="absolute bottom-3 left-3 rounded-full bg-card/95 px-3 py-1 text-[0.58rem] font-semibold text-foreground backdrop-blur-sm">
                {space.type}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">
                    {space.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-[0.65rem] text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    {space.neighborhood}, {space.city}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-1 text-[0.62rem]">
                  <Star className="size-3 fill-terracotta text-terracotta" />
                  {space.rating.toFixed(1)}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3 text-[0.62rem] text-muted-foreground">
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

                <span className="text-[0.6rem] text-muted-foreground">
                  {space.reviews} avaliações
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
