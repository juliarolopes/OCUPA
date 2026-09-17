import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Space } from "@/data/ocupa";

export type SearchFiltersState = {
  maxPrice: number | null;
  minArea: number | null;
  type: string;
  amenity: string;
};

type SearchFiltersProps = {
  spaces: Space[];
  filters: SearchFiltersState;
  onChange: (filters: SearchFiltersState) => void;
};

export function SearchFilters({
  spaces,
  filters,
  onChange,
}: SearchFiltersProps) {
  const types = [...new Set(spaces.map((space) => space.type))];

  const amenities = [
    ...new Set(spaces.flatMap((space) => space.amenities)),
  ];

  const hasFilters =
    filters.maxPrice !== null ||
    filters.minArea !== null ||
    filters.type !== "" ||
    filters.amenity !== "";

  function clearFilters() {
    onChange({
      maxPrice: null,
      minArea: null,
      type: "",
      amenity: "",
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
        <SlidersHorizontal className="size-3.5 text-primary" />
        Filtrar
      </div>

      <select
        value={filters.maxPrice ?? ""}
        onChange={(event) =>
          onChange({
            ...filters,
            maxPrice: event.target.value
              ? Number(event.target.value)
              : null,
          })
        }
        className="h-9 rounded-full border border-border bg-card px-3 text-xs outline-none transition-colors focus:border-primary"
      >
        <option value="">Preço máximo</option>
        <option value="15">Até R$ 15</option>
        <option value="20">Até R$ 20</option>
        <option value="30">Até R$ 30</option>
        <option value="50">Até R$ 50</option>
      </select>

      <select
        value={filters.minArea ?? ""}
        onChange={(event) =>
          onChange({
            ...filters,
            minArea: event.target.value
              ? Number(event.target.value)
              : null,
          })
        }
        className="h-9 rounded-full border border-border bg-card px-3 text-xs outline-none transition-colors focus:border-primary"
      >
        <option value="">Tamanho</option>
        <option value="10">10+ m²</option>
        <option value="20">20+ m²</option>
        <option value="30">30+ m²</option>
        <option value="40">40+ m²</option>
      </select>

      <select
        value={filters.type}
        onChange={(event) =>
          onChange({
            ...filters,
            type: event.target.value,
          })
        }
        className="h-9 rounded-full border border-border bg-card px-3 text-xs outline-none transition-colors focus:border-primary"
      >
        <option value="">Tipo de espaço</option>

        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={filters.amenity}
        onChange={(event) =>
          onChange({
            ...filters,
            amenity: event.target.value,
          })
        }
        className="h-9 rounded-full border border-border bg-card px-3 text-xs outline-none transition-colors focus:border-primary"
      >
        <option value="">Comodidades</option>

        {amenities.map((amenity) => (
          <option key={amenity} value={amenity}>
            {amenity}
          </option>
        ))}
      </select>

      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="h-9 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          Limpar
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}