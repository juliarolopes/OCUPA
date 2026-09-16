import { CalendarDays, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Busca pronta — os resultados serão conectados em breve.");
  }

  return (
    <div>
      <form onSubmit={submit} className="grid overflow-hidden border border-foreground/20 bg-card shadow-[0_18px_55px_-35px_var(--foreground)] md:grid-cols-[1.35fr_1fr_.8fr_auto]">
        <label className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-4 md:border-b-0 md:border-r">
          <Search className="size-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">O que você precisa fazer?</span><input className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Fotografar, guardar, criar..." /></span>
        </label>
        <label className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-4 md:border-b-0 md:border-r">
          <MapPin className="size-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">Local</span><input className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Bairro ou cidade" /></span>
        </label>
        <label className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-4 md:border-b-0 md:border-r">
          <CalendarDays className="size-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">Data</span><input type="date" className="mt-1 w-full bg-transparent text-sm outline-none" /></span>
        </label>
        <Button type="submit" variant="editorial" className="h-full min-h-16 px-7">Encontrar espaço</Button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs text-primary">{message}</p>
    </div>
  );
}