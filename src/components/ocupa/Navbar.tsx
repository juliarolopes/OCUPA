import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("#top");

  const navigateTo = (target: string) => {
    setActiveItem(target);
    setOpen(false);
  };

  const navItems = [
    { href: "#explorar", label: "Explorar" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#anunciar", label: "Disponibilizar espaço" },
  ];

  return (
    <header className="relative z-30 border-b border-primary/10 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto grid h-[4.75rem] max-w-[1120px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <a href="#top" onClick={() => navigateTo("#top")} className="font-serif text-[1.7rem] text-primary transition-opacity duration-200 active:opacity-60" aria-label="OCUPA, início">OCUPA</a>
        <nav className="ml-10 hidden h-full items-center gap-1 text-[0.72rem] font-medium lg:flex" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => navigateTo(item.href)}
              className="nav-item relative flex h-full items-center px-4 text-foreground/80 transition-colors duration-200 hover:text-primary active:scale-[0.97]"
              data-active={activeItem === item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-1 text-[0.7rem] lg:flex">
          <Button variant="nav" className="h-10 px-3"><Heart /> Favoritos</Button>
          <Button variant="nav" className="h-10 px-3">Entrar</Button>
          <Button variant="editorial" size="sm" className="ml-2 h-9 px-5 transition-transform active:scale-[0.97]" asChild><a href="#anunciar" onClick={() => navigateTo("#anunciar")}>Disponibilizar espaço</a></Button>
        </div>
        <Button variant="ghost" size="icon" className="justify-self-end lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="animate-fade-in border-t border-primary/10 bg-background px-5 py-3 shadow-sm lg:hidden" aria-label="Navegação móvel">
          <div className="mx-auto flex max-w-[1120px] flex-col text-sm">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => navigateTo(item.href)} className="border-b border-border/70 py-3.5 font-medium transition-colors active:text-primary">{item.label}</a>)}
            <a href="#explorar" onClick={() => navigateTo("#explorar")} className="py-3.5">Favoritos</a><a href="#top" onClick={() => navigateTo("#top")} className="py-3.5">Entrar</a>
          </div>
        </nav>
      )}
    </header>
  );
}