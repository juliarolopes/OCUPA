import { Link } from "@tanstack/react-router";
import { Heart, LogIn, Menu, X } from "lucide-react";
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
    <header className="relative z-30 border-b border-border bg-background">
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-6">
        <a href="#top" onClick={() => navigateTo("#top")} className="font-serif text-[1.45rem] text-primary transition-opacity duration-200 active:opacity-60" aria-label="OCUPA, início">OCUPA</a>
        <nav className="ml-14 hidden h-full items-center gap-8 text-sm font-normal lg:flex" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => navigateTo(item.href)}
              className="relative flex h-full items-center text-muted-foreground transition-[color,transform] duration-200 hover:text-primary active:scale-[0.96]"
              data-active={activeItem === item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-1 text-sm lg:flex">
          <Button variant="nav" className="h-10 gap-2 px-3 text-muted-foreground transition-[color,transform] active:scale-[0.96]"><Heart strokeWidth={1.7} /> Favoritos</Button>
          <Button variant="nav" className="h-10 gap-2 px-3 text-muted-foreground transition-[color,transform] active:scale-[0.96]" asChild><Link to="/entrar"><LogIn strokeWidth={1.7} /> Entrar</Link></Button>
          <Button variant="editorial" className="ml-2 h-10 px-5 text-xs transition-[background-color,transform] active:scale-[0.97]" asChild><a href="#anunciar" onClick={() => navigateTo("#anunciar")}>Disponibilizar espaço</a></Button>
        </div>
        <Button variant="ghost" size="icon" className="justify-self-end lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="animate-fade-in border-t border-border bg-background px-5 py-3 shadow-sm lg:hidden" aria-label="Navegação móvel">
          <div className="mx-auto flex max-w-[1120px] flex-col text-sm">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => navigateTo(item.href)} className="border-b border-border/70 py-3.5 font-medium transition-colors active:text-primary">{item.label}</a>)}
             <a href="#explorar" onClick={() => navigateTo("#explorar")} className="flex items-center gap-2 py-3.5"><Heart className="size-4" strokeWidth={1.7} /> Favoritos</a><Link to="/entrar" onClick={() => setOpen(false)} className="flex items-center gap-2 py-3.5"><LogIn className="size-4" strokeWidth={1.7} /> Entrar</Link>
          </div>
        </nav>
      )}
    </header>
  );
}