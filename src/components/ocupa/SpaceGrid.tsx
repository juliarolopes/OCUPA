import { useState } from "react";
import { SpaceCard } from "./SpaceCard";
import { spaces } from "@/data/ocupa";

export function SpaceGrid() {
  const [favorites, setFavorites] = useState<number[]>([]);
  return <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{spaces.map((space) => <SpaceCard key={space.id} space={space} favorite={favorites.includes(space.id)} onFavorite={() => setFavorites((current) => current.includes(space.id) ? current.filter((id) => id !== space.id) : [...current, space.id])} />)}</div>;
}