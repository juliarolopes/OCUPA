import { Check, DoorOpen, Ruler, Users } from "lucide-react";

import type { Space } from "@/data/ocupa";

export function SpaceDetails({ space }: { space: Space }) {
  const facts = [
    { icon: Ruler, label: space.area },
    ...(space.capacity ? [{ icon: Users, label: `Até ${space.capacity} pessoas` }] : []),
    { icon: DoorOpen, label: space.type },
  ];

  return (
    <div className="space-y-12">
      <section className="border-b border-border pb-10">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
          Informações principais
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 border-l-2 border-light-green pl-4">
              <Icon className="size-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-primary">Sobre o espaço</h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-ink-soft">{space.description}</p>
        <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {space.highlights.map((highlight) => (
            <span key={highlight} className="flex items-center gap-3 text-sm">
              <Check className="size-4 text-terracotta" />
              {highlight}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-light-green/60 p-6 sm:p-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
          Possibilidades
        </p>
        <h2 className="mt-2 font-serif text-3xl text-primary">Este espaço funciona bem para</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {space.purposes.map((purpose) => (
            <span
              key={purpose}
              className="border border-primary/25 bg-background px-4 py-2 text-xs font-medium text-primary"
            >
              {purpose}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-primary">Comodidades</h2>
        <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {space.amenities.map((amenity) => (
            <span
              key={amenity}
              className="flex items-center gap-3 border-b border-border pb-3 text-sm"
            >
              <Check className="size-4 text-primary" />
              {amenity}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-primary">Informações importantes</h2>
        <ul className="mt-6 space-y-3 text-sm leading-6 text-ink-soft">
          {space.rules.map((rule) => (
            <li key={rule} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-terracotta"
              />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
