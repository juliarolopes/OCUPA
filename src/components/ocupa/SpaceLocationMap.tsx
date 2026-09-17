import { MapPin } from "lucide-react";

import type { Space } from "@/data/ocupa";

export function SpaceLocationMap({ space }: { space: Space }) {
  const longitudePosition = Math.min(82, Math.max(18, 50 + (space.longitude + 46.65) * 120));
  const latitudePosition = Math.min(75, Math.max(22, 48 + (space.latitude + 23.56) * 180));

  return (
    <section>
      <h2 className="font-serif text-3xl text-primary">Onde fica</h2>
      <div
        className="relative mt-6 h-80 overflow-hidden border border-border bg-light-green/55 md:h-[26rem]"
        aria-label={`Mapa aproximado de ${space.neighborhood}, coordenadas ${space.latitude}, ${space.longitude}`}
      >
        <svg
          className="absolute inset-0 h-full w-full text-primary/15"
          viewBox="0 0 800 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-40 90 C130 20 210 170 390 105 S650 60 850 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="22"
          />
          <path
            d="M80 -20 C120 110 255 180 220 460"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
          />
          <path
            d="M520 -30 C470 95 580 220 500 450"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
          />
          <path
            d="M-20 310 C200 260 330 370 850 285"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
          />
        </svg>
        <div
          className="absolute h-px w-full rotate-[-8deg] bg-background/80"
          style={{ top: "52%" }}
          aria-hidden="true"
        />
        <div
          className="absolute w-px bg-background/80"
          style={{ left: "37%", height: "100%" }}
          aria-hidden="true"
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${longitudePosition}%`, top: `${latitudePosition}%` }}
        >
          <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
            <MapPin className="size-5" />
          </span>
          <span className="mt-2 block whitespace-nowrap bg-background px-2 py-1 text-[0.65rem] font-semibold text-primary shadow-sm">
            Região aproximada
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-background/90 px-2 py-1 text-[0.6rem] text-muted-foreground">
          Mapa ilustrativo · futura integração OpenStreetMap
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold">
        {space.neighborhood}, {space.city}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        A localização exata pode ser informada após a confirmação da reserva.
      </p>
    </section>
  );
}
