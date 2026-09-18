import { SpaceCard } from "./SpaceCard";
import { spaces } from "@/data/ocupa";

export function SpaceGrid() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{spaces.map((space) => <SpaceCard key={space.id} space={space} />)}</div>;
}
