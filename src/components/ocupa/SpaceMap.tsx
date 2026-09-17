import { MapPin } from "lucide-react";

import type { Space } from "@/data/ocupa";

type SpaceMapProps = {
  spaces: Space[];
  activeSpaceId: number | null;
  onSpaceSelect: (id: number) => void;
};

const bounds = {
  minLat: -23.63,
  maxLat: -23.50,
  minLng: -46.73,
  maxLng: -46.57,
};

function getPosition(space: Space) {
  const left =
    ((space.longitude - bounds.minLng) /
      (bounds.maxLng - bounds.minLng)) *
    100;

  const top =
    100 -
    ((space.latitude - bounds.minLat) /
      (bounds.maxLat - bounds.minLat)) *
      100;

  return {
    left: `${Math.min(94, Math.max(6, left))}%`,
    top: `${Math.min(90, Math.max(10, top))}%`,
  };
}

export function SpaceMap({
  spaces,
  activeSpaceId,
  onSpaceSelect,
}: SpaceMapProps) {
  return (
    <div className="relative h-full min-h-[520px] overflow-hidden bg-[#E8E5DD]">
      {/* Malha urbana */}
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(18deg, transparent 47%, rgba(36,36,36,.12) 48%, rgba(36,36,36,.12) 49%, transparent 50%),
            linear-gradient(72deg, transparent 48%, rgba(36,36,36,.10) 49%, rgba(36,36,36,.10) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(255,255,255,.7) 50%, transparent 51%)
          `,
          backgroundSize: "150px 130px, 180px 160px, 100% 85px",
        }}
      />

      <div className="absolute left-6 top-6 z-10 rounded-lg border border-border/70 bg-card/95 px-4 py-3 shadow-sm backdrop-blur-sm">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary">
          Mapa
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Espaços encontrados
        </p>
      </div>

      <div className="absolute bottom-5 left-5 z-10 rounded-lg bg-card/90 px-3 py-2 text-[0.58rem] text-muted-foreground shadow-sm backdrop-blur-sm">
        São Paulo
      </div>

      {spaces.map((space) => {
        const active = activeSpaceId === space.id;
        const position = getPosition(space);

        return (
          <button
            key={space.id}
            type="button"
            onClick={() => onSpaceSelect(space.id)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-105"
            style={position}
            aria-label={`Ver ${space.name}`}
          >
            <span
              className={`block rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold shadow-md transition-all ${
                active
                  ? "border-primary bg-primary text-primary-foreground scale-110"
                  : "border-white bg-card text-foreground hover:border-primary"
              }`}
            >
              R$ {space.priceValue}/{space.priceUnit}
            </span>

            <MapPin
              className={`mx-auto mt-1 size-4 ${
                active ? "fill-primary text-primary" : "fill-card text-primary"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
