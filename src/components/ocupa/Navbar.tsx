import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal";
import { MobileUserMenu, UserMenu } from "@/components/ocupa/UserMenu";
import { Button } from "@/components/ui/button";

export function Navbar({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("#top");
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const navigate = useNavigate();

  const navigateTo = (target: string) => {
    setActiveItem(target);
    setOpen(false);
  };

  const openLogin = () => {
    setOpen(false);
    openAuth("default");
  };

  const offerSpace = () => {
    setOpen(false);
    if (user) {
      void navigate({ to: "/espacos/novo" });
      return;
    }
    openAuth("host", {
      onSuccess: () => navigate({ to: "/espacos/novo" }),
    });
  };

  const navItems = [
    { href: "/#explorar", label: "Explorar" },
    { href: "/#como-funciona", label: "Como funciona" },
    { href: "/#anunciar", label: "Disponibilize seu espaço" },
  ];

  return (
    <header className="relative z-30 border-b border-border bg-background">
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-6">
        <Link to="/" onClick={() => setOpen(false)} className="font-serif text-[1.45rem] text-primary transition-opacity duration-200 active:opacity-60" aria-label="OCUPA, início">OCUPA</Link>
        <nav className={`ml-14 hidden h-full items-center gap-8 text-sm font-normal ${compact ? "" : "lg:flex"}`} aria-label="Navegação principal">
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
        <div className={`hidden items-center gap-1 text-sm ${compact ? "" : "lg:flex"}`}>
          <Button variant="nav" className="h-10 gap-2 px-3 text-muted-foreground transition-[color,transform] active:scale-[0.96]" asChild><Link to="/favoritos"><Heart strokeWidth={1.7} /> Favoritos</Link></Button>
          {user ? (
            <UserMenu />
          ) : (
            <Button variant="nav" className="h-10 gap-2 px-3 text-muted-foreground transition-[color,transform] active:scale-[0.96]" onClick={openLogin}><LogIn strokeWidth={1.7} /> Entrar</Button>
          )}
          <Button variant="editorial" className="ml-2 h-10 px-5 text-xs transition-[background-color,transform] active:scale-[0.97]" onClick={offerSpace}>Disponibilizar meu espaço</Button>
        </div>
        <Button variant="ghost" size="icon" className={`justify-self-end ${compact ? "" : "lg:hidden"}`} onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className={`animate-fade-in border-t border-border bg-background px-5 py-3 shadow-sm ${compact ? "" : "lg:hidden"}`} aria-label="Navegação móvel">
          <div className="mx-auto flex max-w-[1120px] flex-col text-sm">
            {user ? <MobileUserMenu onNavigate={() => setOpen(false)} /> : null}
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => navigateTo(item.href)} className="border-b border-border/70 py-3.5 font-medium transition-colors active:text-primary">{item.label}</a>)}
            {!user ? <Link to="/favoritos" onClick={() => setOpen(false)} className="flex items-center gap-2 py-3.5"><Heart className="size-4" strokeWidth={1.7} /> Favoritos</Link> : null}
            {!user ? (
              <button type="button" onClick={openLogin} className="flex items-center gap-2 py-3.5 text-left"><LogIn className="size-4" strokeWidth={1.7} /> Entrar</button>
            ) : null}
            <Button type="button" variant="editorial" className="my-2 w-full" onClick={offerSpace}>Disponibilizar meu espaço</Button>
          </div>
        </nav>
      )}
    </header>
  );
}
