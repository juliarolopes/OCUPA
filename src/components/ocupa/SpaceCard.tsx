import { Heart, MapPin, Ruler, Star } from "lucide-react";
import type { Space } from "@/data/ocupa";

export function SpaceCard({ space, favorite, onFavorite }: { space: Space; favorite: boolean; onFavorite: () => void }) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={space.image} alt={`${space.name}, espaço disponível em ${space.neighborhood}`} width={960} height={688} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
        <button type="button" onClick={onFavorite} aria-label={favorite ? `Remover ${space.name} dos favoritos` : `Favoritar ${space.name}`} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-card text-foreground shadow-sm transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Heart className="size-5" fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="border-b border-border py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><h3 className="truncate font-serif text-2xl">{space.name}</h3><span className="flex items-center gap-1 text-sm"><Star className="size-4 fill-terracotta text-terracotta" />{space.rating.toFixed(1)}</span></div>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><MapPin className="size-4" />{space.neighborhood}</span><span className="flex items-center gap-1.5"><Ruler className="size-4" />{space.area}</span></div>
        <p className="mt-4 text-sm"><strong className="text-base text-primary">{space.price.split("/")[0]}</strong>/{space.price.split("/")[1]}</p>
      </div>
    </article>
  );
}