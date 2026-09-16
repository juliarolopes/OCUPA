import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, KeyRound, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ocupa/CategoryCard";
import { Footer } from "@/components/ocupa/Footer";
import { Navbar } from "@/components/ocupa/Navbar";
import { SearchBar } from "@/components/ocupa/SearchBar";
import { SectionHeader } from "@/components/ocupa/SectionHeader";
import { SpaceGrid } from "@/components/ocupa/SpaceGrid";
import { categories } from "@/data/ocupa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OCUPA — Espaços para o que você precisa" },
      { name: "description", content: "Encontre espaços disponíveis perto de você para guardar, criar, trabalhar ou realizar o que precisar." },
      { property: "og:title", content: "OCUPA — Todo espaço pode ter uma função" },
      { property: "og:description", content: "Descubra espaços urbanos disponíveis para atividades, trabalho, armazenamento e criação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="min-h-screen overflow-hidden bg-background">
      <Navbar />
      <main>
        <section className="relative border-b border-border">
          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[28%] bg-light-green lg:block" />
          <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
            <div className="max-w-4xl">
              <p className="mb-5 text-xs font-semibold uppercase text-terracotta">Espaços que voltam a fazer sentido</p>
              <h1 className="max-w-4xl font-serif text-6xl leading-[0.98] text-foreground sm:text-7xl lg:text-[6.7rem]">Todo espaço pode ter uma função.</h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-ink-soft md:text-lg">Encontre lugares disponíveis perto de você para guardar, criar, trabalhar ou realizar o que precisar.</p>
            </div>
            <div className="relative mt-12 max-w-6xl"><SearchBar /></div>
          </div>
        </section>

        <section id="explorar" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
          <SectionHeader title="Encontre um espaço para..." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{categories.map((category) => <CategoryCard key={category.label} category={category} />)}</div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
            <SectionHeader eyebrow="Perto de você" title="Espaços em destaque" />
            <SpaceGrid />
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
          <SectionHeader eyebrow="Simples, do começo ao fim" title="Como a OCUPA funciona" />
          <div className="grid border-y border-border md:grid-cols-3">
            {[
              { n: "01", title: "Encontre", text: "Busque pelo uso, pelo bairro e pelo tempo que você precisa.", icon: Search },
              { n: "02", title: "Reserve", text: "Escolha o espaço que combina com a sua necessidade.", icon: KeyRound },
              { n: "03", title: "Ocupe", text: "Use o lugar, realize sua ideia e devolva a cidade ao movimento.", icon: Sparkles },
            ].map((step) => <article key={step.n} className="border-b border-border py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-terracotta">{step.n}</span><step.icon className="size-6 text-primary" strokeWidth={1.5} /></div><h3 className="mt-12 font-serif text-3xl">{step.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{step.text}</p></article>)}
          </div>
        </section>

        <section id="anunciar" className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-[1.2fr_.8fr] md:items-end md:px-10 md:py-28">
            <div><p className="mb-4 text-xs font-semibold uppercase text-secondary">Uma nova função para o que está parado</p><h2 className="font-serif text-5xl leading-tight md:text-7xl">Tem um espaço parado?</h2><p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/75 md:text-lg">Transforme um espaço que você não está usando em uma oportunidade para alguém.</p></div>
            <div className="md:text-right"><Button variant="inverse" size="editorial">Disponibilizar meu espaço <ArrowRight /></Button><p className="mt-5 flex items-center gap-2 text-xs text-primary-foreground/70 md:justify-end"><Check className="size-4" /> Você decide quando e como disponibilizar</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
