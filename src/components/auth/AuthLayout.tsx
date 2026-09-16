import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import garageImage from "@/assets/garagem-central.jpg";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-dvh bg-background lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-dvh overflow-hidden bg-light-green/70 p-8 lg:flex lg:flex-col xl:p-12" aria-label="OCUPA">
        <div className="absolute -left-20 top-[18%] h-48 w-36 rotate-12 rounded-[48%_52%_42%_58%] border-[2rem] border-primary/15" aria-hidden="true" />
        <div className="absolute -right-16 bottom-16 h-48 w-40 -rotate-12 rounded-[58%_42%_20%_60%] bg-terracotta/65" aria-hidden="true" />

        <Link to="/" className="relative z-10 w-fit font-serif text-[1.55rem] text-primary transition-opacity hover:opacity-70" aria-label="OCUPA, página inicial">
          OCUPA
        </Link>

        <div className="relative z-10 my-auto mx-auto w-full max-w-[35rem]">
          <div className="relative ml-auto w-[88%]">
            <div className="absolute -left-8 -top-8 h-20 w-20 rounded-[50%_50%_15%_50%] border border-terracotta" aria-hidden="true" />
            <img
              src={garageImage}
              alt="Garagem urbana vazia com luz natural"
              className="relative aspect-[5/4] w-full rounded-md object-cover"
            />
          </div>
          <div className="relative -mt-10 max-w-md bg-light-green/95 py-6 pr-8">
            <p className="font-serif text-[2.45rem] leading-[1.02] text-primary xl:text-[2.8rem]">
              Todo espaço pode ter uma função.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
              Encontre um lugar para aquilo que você precisa fazer.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-[0.62rem] uppercase tracking-[0.2em] text-primary/70">Espaços que ganham novos usos</p>
      </section>

      <section className="flex min-h-dvh items-center px-5 py-7 sm:px-10 md:px-16 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-[27rem]">
          <div className="mb-8 border-b border-border pb-6 lg:hidden">
            <Link to="/" className="font-serif text-[1.5rem] text-primary" aria-label="OCUPA, página inicial">OCUPA</Link>
            <p className="mt-2 font-serif text-xl leading-tight text-primary">Todo espaço pode ter uma função.</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}