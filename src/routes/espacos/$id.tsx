import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";

import { Footer } from "@/components/ocupa/Footer";
import { Navbar } from "@/components/ocupa/Navbar";
import { SpaceBookingCard } from "@/components/ocupa/SpaceBookingCard";
import { SpaceDetails } from "@/components/ocupa/SpaceDetails";
import { SpaceGallery } from "@/components/ocupa/SpaceGallery";
import { SpaceLocationMap } from "@/components/ocupa/SpaceLocationMap";
import { Button } from "@/components/ui/button";
import { getSpaceById } from "@/data/ocupa";

export const Route = createFileRoute("/espacos/$id")({
  component: SpaceDetailPage,
});

function SpaceDetailPage() {
  const { id } = Route.useParams();
  const space = getSpaceById(id);
  const [favorite, setFavorite] = useState(false);

  if (!space) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <Navbar compact />
        <main className="grid flex-1 place-items-center px-5 py-20">
          <div className="max-w-lg text-center">
            <p className="font-serif text-7xl text-light-green">404</p>
            <h1 className="mt-4 font-serif text-4xl text-primary">Espaço não encontrado</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Este espaço pode ter sido removido ou o endereço informado não existe.
            </p>
            <Button variant="editorial" size="editorial" className="mt-8" asChild>
              <Link to="/buscar" search={{ necessidade: "", localizacao: "", data: "" }}>
                <ArrowLeft /> Voltar para explorar
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <Navbar compact />
      <main>
        <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-7 md:px-8 md:pb-24 md:pt-10">
          <nav aria-label="Navegação estrutural" className="text-xs text-muted-foreground">
            <Link
              to="/buscar"
              search={{ necessidade: "", localizacao: "", data: "" }}
              className="transition-colors hover:text-primary"
            >
              Explorar
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-foreground">{space.name}</span>
          </nav>

          <header className="mb-7 mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                {space.type}
              </p>
              <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-[1.05] text-primary sm:text-5xl">
                {space.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  {space.neighborhood} · {space.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-terracotta text-terracotta" />
                  {space.rating.toFixed(1)} · {space.reviews} avaliações
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFavorite((current) => !current)}
              aria-pressed={favorite}
              className="w-fit rounded-full bg-background shadow-none"
            >
              <Heart className={favorite ? "fill-terracotta text-terracotta" : ""} />{" "}
              {favorite ? "Salvo" : "Favoritar"}
            </Button>
          </header>

          <SpaceGallery images={space.images} name={space.name} />

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
            <SpaceDetails space={space} />
            <SpaceBookingCard space={space} />
          </div>

          <div className="mt-16 border-t border-border pt-14 md:mt-24 md:pt-20">
            <SpaceLocationMap space={space} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
