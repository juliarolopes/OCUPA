import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, DoorOpen, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ocupa/CategoryCard";
import { Footer } from "@/components/ocupa/Footer";
import { Navbar } from "@/components/ocupa/Navbar";
import { SearchBar } from "@/components/ocupa/SearchBar";
import { SectionHeader } from "@/components/ocupa/SectionHeader";
import { SpaceGrid } from "@/components/ocupa/SpaceGrid";
import { categories } from "@/data/ocupa";
import oficinaVerde from "@/assets/oficina-verde.jpg";

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
        <section className="hero-scene relative -mt-20 overflow-hidden pt-20">
          <div className="shape shape-left" aria-hidden="true" /><div className="shape shape-right" aria-hidden="true" />
          <div className="relative mx-auto max-w-[920px] px-5 pb-14 pt-12 md:px-8 md:pb-16 md:pt-10">
            <div className="max-w-xl">
              <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">Marketplace de espaços ocupados</p>
              <h1 className="max-w-xl font-serif text-[2.9rem] leading-[0.98] text-primary sm:text-[3.6rem]">Todo espaço pode<br className="hidden sm:block" /> ter uma função.</h1>
              <p className="mt-5 max-w-lg text-sm leading-5 text-ink-soft">Encontre lugares disponíveis perto de você para guardar,<br className="hidden sm:block" /> criar, trabalhar ou realizar o que precisar.</p>
            </div>
            <div className="relative mt-6"><SearchBar /></div>
          </div>
        </section>

        <section id="explorar" className="mx-auto max-w-[1120px] px-5 py-10 md:px-8 md:py-12">
          <SectionHeader title="Encontre um espaço para..." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{categories.map((category) => <CategoryCard key={category.label} category={category} />)}</div>
        </section>

        <section>
          <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-8 md:py-10">
            <div className="flex items-end justify-between gap-5"><SectionHeader title="Espaços em destaque" /><a href="#explorar" className="mb-7 hidden text-[0.65rem] font-semibold text-primary sm:block">Ver todos os espaços →</a></div>
            <SpaceGrid />
          </div>
        </section>

        <section id="como-funciona" className="process-band relative mt-8 bg-light-green/70">
          <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-14 md:grid-cols-[1.1fr_2.3fr] md:px-8">
            <div><SectionHeader eyebrow="Como funciona" title="É simples e rápido." /><p className="max-w-xs text-[0.7rem] leading-5 text-muted-foreground">Em poucos cliques, você encontra o espaço ideal para o que precisa fazer.</p></div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Encontre", text: "Busque pelo uso, pelo bairro e pelo tempo que você precisa.", icon: Search },
              { n: "02", title: "Reserve", text: "Escolha as datas, confirme e pronto.", icon: CalendarDays },
              { n: "03", title: "Ocupe", text: "Aproveite o espaço e faça acontecer.", icon: DoorOpen },
            ].map((step, index) => <article key={step.n} className="relative"><div className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">{index + 1}</span><step.icon className="size-6 text-primary" strokeWidth={1.5} /></div><h3 className="mt-4 font-serif text-xl text-primary">{step.title}</h3><p className="mt-2 max-w-[11rem] text-[0.66rem] leading-4 text-muted-foreground">{step.text}</p>{index < 2 && <ArrowRight className="absolute -right-2 top-2 hidden size-4 text-primary/50 sm:block" />}</article>)}
          </div>
          </div>
        </section>

        <section id="anunciar" className="mx-auto max-w-[1120px] px-5 py-10 md:px-8 md:py-12">
          <div className="grid overflow-hidden rounded-lg bg-light-green/55 md:grid-cols-[17rem_1fr]">
            <img src={oficinaVerde} alt="Espaço versátil disponível para novos usos" className="h-full min-h-52 w-full object-cover" />
            <div className="relative flex items-center px-7 py-10 md:px-12"><div><p className="mb-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">Para anfitriões</p><h2 className="font-serif text-3xl leading-tight text-primary">Tem um espaço parado?</h2><p className="mt-3 max-w-md text-[0.7rem] leading-5 text-muted-foreground">Transforme um espaço que você não está usando em uma oportunidade para alguém.</p><Button variant="editorial" size="sm" className="mt-5 px-5 text-[0.65rem]">Disponibilizar meu espaço <ArrowRight /></Button></div><div className="cta-leaf" aria-hidden="true" /></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
