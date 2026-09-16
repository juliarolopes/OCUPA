import { CalendarDays, ChevronDown, MapPin, Search } from "lucide-react";
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
      <form onSubmit={submit} className="grid overflow-hidden rounded-[2rem] border border-border bg-card p-1.5 shadow-[0_16px_40px_-24px_var(--foreground)] md:grid-cols-[1.45fr_.75fr_.75fr_auto]">
        <label className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-3 md:border-b-0 md:border-r">
          <Search className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1"><span className="block text-[0.62rem] font-semibold">O que você precisa fazer?</span><input className="mt-1 w-full bg-transparent text-[0.7rem] outline-none placeholder:text-muted-foreground" placeholder="Ex: Guardar móveis por duas semanas..." /></span>
        </label>
        <label className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-3 md:border-b-0 md:border-r">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1"><span className="block text-[0.62rem] font-semibold">Localização</span><input className="mt-1 w-full bg-transparent text-[0.7rem] outline-none placeholder:text-muted-foreground" placeholder="São Paulo" /></span><ChevronDown className="size-3 text-muted-foreground" />
        </label>
        <label className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-3 md:border-b-0 md:border-r">
          <CalendarDays className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1"><span className="block text-[0.62rem] font-semibold">Datas</span><input type="date" className="mt-1 w-full bg-transparent text-[0.7rem] outline-none" /></span>
        </label>
        <Button type="submit" variant="editorial" className="h-full min-h-12 px-6 text-[0.68rem]">Encontrar espaço <span aria-hidden="true">→</span></Button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs text-primary">{message}</p>
    </div>
  );
}