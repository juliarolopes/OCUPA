import { Heart, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 bg-transparent">
      <div className="mx-auto grid h-20 max-w-[1120px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <a href="#top" className="font-serif text-[1.7rem] text-primary" aria-label="OCUPA, início">OCUPA</a>
        <nav className="ml-10 hidden items-center gap-8 text-[0.7rem] font-medium lg:flex" aria-label="Navegação principal">
          <a className="transition-colors hover:text-primary" href="#explorar">Explorar</a>
          <a className="transition-colors hover:text-primary" href="#como-funciona">Como funciona</a>
          <a className="transition-colors hover:text-primary" href="#anunciar">Disponibilizar espaço</a>
        </nav>
        <div className="hidden items-center gap-2 text-[0.7rem] lg:flex">
          <Button variant="nav"><Heart /> Favoritos</Button>
          <Button variant="nav">Entrar</Button>
          <Button variant="editorial" size="sm" className="px-5" asChild><a href="#anunciar">Disponibilizar espaço</a></Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu" aria-expanded={open}>
          <Menu />
        </Button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Navegação móvel">
          <div className="flex flex-col items-start gap-4 text-sm">
            <a href="#explorar">Explorar</a><a href="#como-funciona">Como funciona</a><a href="#anunciar">Disponibilizar espaço</a><a href="#explorar">Favoritos</a><a href="#top">Entrar</a>
          </div>
        </nav>
      )}
    </header>
  );
}