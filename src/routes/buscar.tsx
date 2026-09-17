import { useMemo, useState } from "react";
import { ArrowLeft, List, Map, SearchX } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ocupa/Navbar";
import {
  SearchFilters,
  type SearchFiltersState,
} from "@/components/ocupa/SearchFilters";
import { SearchResults } from "@/components/ocupa/SearchResults";
import { SpaceMap } from "@/components/ocupa/SpaceMap";
import { spaces } from "@/data/ocupa";

export const Route = createFileRoute("/buscar")({
  validateSearch: (search: Record<string, unknown>) => ({
    necessidade:
      typeof search["necessidade"] === "string"
        ? search["necessidade"]
        : "",
    localizacao:
      typeof search["localizacao"] === "string"
        ? search["localizacao"]
        : "",
    data: typeof search["data"] === "string" ? search["data"] : "",
  }),
  component: SearchPage,
});

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function SearchPage() {
  const { necessidade, localizacao, data } = Route.useSearch();

  const [filters, setFilters] = useState<SearchFiltersState>({
    maxPrice: null,
    minArea: null,
    type: "",
    amenity: "",
  });

  const [activeSpaceId, setActiveSpaceId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const filteredSpaces = useMemo(() => {
    const normalizedNeed = normalize(necessidade);
    const normalizedLocation = normalize(localizacao);

    return spaces.filter((space) => {
      const searchableText = normalize(
        [
          space.name,
          space.neighborhood,
          space.city,
          space.type,
          space.feature,
          ...space.purposes,
          ...space.amenities,
        ].join(" "),
      );

      const matchesNeed =
        !normalizedNeed ||
        normalizedNeed
          .split(/\s+/)
          .filter(Boolean)
          .some((word) => searchableText.includes(word));

      const matchesLocation =
        !normalizedLocation ||
        normalize(space.neighborhood).includes(normalizedLocation) ||
        normalize(space.city).includes(normalizedLocation);

      const matchesPrice =
        filters.maxPrice === null ||
        space.priceValue <= filters.maxPrice;

      const matchesArea =
        filters.minArea === null ||
        space.areaValue >= filters.minArea;

      const matchesType =
        !filters.type || space.type === filters.type;

      const matchesAmenity =
        !filters.amenity ||
        space.amenities.includes(filters.amenity);

      return (
        matchesNeed &&
        matchesLocation &&
        matchesPrice &&
        matchesArea &&
        matchesType &&
        matchesAmenity
      );
    });
  }, [necessidade, localizacao, filters]);

  const searchDescription = [
    necessidade && `"${necessidade}"`,
    localizacao,
    data,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1400px] px-5 py-7 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <Link
                  to="/"
                  className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="size-3.5" />
                  Voltar para a página inicial
                </Link>

                <h1 className="font-serif text-3xl leading-none text-primary md:text-4xl">
                  Espaços para o que você precisa.
                </h1>

                {searchDescription && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Busca: {searchDescription}
                  </p>
                )}
              </div>

              <div className="flex rounded-full border border-border bg-card p-1 md:hidden">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMobileView("list")}
                  className={`h-8 rounded-full px-4 text-xs ${
                    mobileView === "list"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <List className="size-3.5" />
                  Lista
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMobileView("map")}
                  className={`h-8 rounded-full px-4 text-xs ${
                    mobileView === "map"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <Map className="size-3.5" />
                  Mapa
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <SearchFilters
                spaces={spaces}
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] lg:grid-cols-[1fr_0.92fr]">
          <div
            className={`min-w-0 px-5 py-6 md:px-8 lg:max-h-[calc(100vh-240px)] lg:overflow-y-auto ${
              mobileView === "map" ? "hidden lg:block" : ""
            }`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  Resultados
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {filteredSpaces.length === 1
                    ? "1 espaço encontrado"
                    : `${filteredSpaces.length} espaços encontrados`}
                </p>
              </div>

              <span className="hidden text-[0.6rem] text-muted-foreground sm:block">
                Ordenado por relevância
              </span>
            </div>

            {filteredSpaces.length > 0 ? (
              <SearchResults
                spaces={filteredSpaces}
                onSpaceHover={setActiveSpaceId}
              />
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 text-center">
                <div className="grid size-12 place-items-center rounded-full bg-light-green">
                  <SearchX className="size-5 text-primary" />
                </div>

                <h2 className="mt-5 font-serif text-2xl text-primary">
                  Nenhum espaço encontrado.
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
                  Tente mudar a localização, remover algum filtro ou procurar
                  por outra finalidade.
                </p>
              </div>
            )}
          </div>

          <div
            className={`min-h-[calc(100vh-220px)] border-l border-border lg:sticky lg:top-20 lg:h-[calc(100vh-220px)] ${
              mobileView === "list" ? "hidden lg:block" : ""
            }`}
          >
            <SpaceMap
              spaces={filteredSpaces}
              activeSpaceId={activeSpaceId}
              onSpaceSelect={setActiveSpaceId}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
