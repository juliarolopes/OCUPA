import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  spaceId: number;
  showLabel?: boolean;
  className?: string;
};

export function FavoriteButton({ spaceId, showLabel = false, className }: FavoriteButtonProps) {
  const { isFavorite, isReady, toggleFavorite } = useFavorites();
  const favorite = isFavorite(spaceId);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(spaceId);
  };

  return (
    <Button
      type="button"
      variant={showLabel ? "outline" : "ghost"}
      size={showLabel ? "default" : "icon"}
      onClick={toggle}
      disabled={!isReady}
      aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={favorite}
      className={cn(
        showLabel
          ? "w-fit rounded-full bg-background shadow-none"
          : "size-10 rounded-full bg-foreground/25 text-card backdrop-blur-sm hover:bg-card hover:text-terracotta [&_svg]:size-5",
        className,
      )}
    >
      <Heart className={cn(favorite && "fill-terracotta text-terracotta")} />
      {showLabel ? (favorite ? "Favoritado" : "Favoritar") : null}
    </Button>
  );
}
