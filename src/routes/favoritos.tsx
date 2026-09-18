import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";

import { Footer } from "@/components/ocupa/Footer";
import { Navbar } from "@/components/ocupa/Navbar";
import { SpaceCard } from "@/components/ocupa/SpaceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/context/FavoritesContext";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — OCUPA" },
      {
        name: "description",
        content: "Seus espaços favoritos no OCUPA.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, isReady } = useFavorites();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Navbar compact />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 pb-20 pt-10 md:px-8 md:pb-24">
        <header className="border-b border-border pb-8 md:pb-10">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            Sua coleção
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl leading-none text-primary sm:text-5xl">
                Favoritos
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Espaços que você guardou para encontrar depois.
              </p>
            </div>
            {isReady && favorites.length > 0 ? (
              <p className="text-xs font-medium text-primary">
                {favorites.length} {favorites.length === 1 ? "espaço salvo" : "espaços salvos"}
              </p>
            ) : null}
          </div>
        </header>

        {!isReady ? (
          <div
            className="grid gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Carregando favoritos"
          >
            {[0, 1, 2].map((item) => (
              <div key={item} className="space-y-4 border border-border bg-card p-3">
                <Skeleton className="aspect-[1.85/1] w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        ) : (
          <section className="relative mx-auto flex min-h-[32rem] max-w-2xl flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
            <div
              className="absolute left-2 top-20 size-28 rotate-12 rounded-[48%_52%_20%_60%] border border-terracotta/35"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-16 right-0 size-36 -rotate-12 rounded-[58%_42%_50%_20%] border-[1.5rem] border-light-green"
              aria-hidden="true"
            />
            <div className="relative grid size-20 place-items-center rounded-full bg-light-green text-primary">
              <Heart className="size-8" strokeWidth={1.4} />
            </div>
            <h2 className="relative mt-7 font-serif text-3xl text-primary sm:text-4xl">
              Você ainda não salvou nenhum espaço
            </h2>
            <p className="relative mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Quando encontrar um lugar que combine com o que você procura, salve-o aqui para voltar
              depois.
            </p>
            <Button variant="editorial" size="editorial" className="relative mt-8" asChild>
              <Link to="/buscar" search={{ necessidade: "", localizacao: "", data: "" }}>
                Explorar espaços <ArrowRight />
              </Link>
            </Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
