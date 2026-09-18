import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronDown, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchBar() {
  const navigate = useNavigate();

  const [necessidade, setNecessidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [date, setDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate({
      to: "/buscar",
      search: {
        necessidade: necessidade.trim(),
        localizacao: localizacao.trim(),
        data: date ? format(date, "yyyy-MM-dd") : "",
      },
    });
  }

  return (
    <div>
      <form
        onSubmit={submit}
        className="grid overflow-visible rounded-lg border border-border bg-card p-1.5 shadow-[0_16px_40px_-24px_var(--foreground)] md:grid-cols-[minmax(16rem,1.55fr)_minmax(9.5rem,.85fr)_minmax(10.5rem,.9fr)_auto] md:rounded-full"
      >
        <label className="flex min-h-[4.25rem] min-w-0 items-center gap-3 border-b border-border px-4 py-3 md:border-b-0 md:border-r md:px-5">
          <Search className="size-[1.1rem] shrink-0 text-primary" />

          <span className="min-w-0 flex-1">
            <span className="block text-[0.68rem] font-semibold leading-none">
              O que você precisa fazer?
            </span>

            <input
              value={necessidade}
              onChange={(event) => setNecessidade(event.target.value)}
              className="mt-2 w-full bg-transparent text-xs leading-none outline-none placeholder:text-muted-foreground"
              placeholder="Ex: Guardar móveis por duas semanas..."
            />
          </span>
        </label>

        <label className="flex min-h-[4.25rem] min-w-0 items-center gap-3 border-b border-border px-4 py-3 md:border-b-0 md:border-r md:px-5">
          <MapPin className="size-[1.1rem] shrink-0 text-primary" />

          <span className="min-w-0 flex-1">
            <span className="block text-[0.68rem] font-semibold leading-none">
              Localização
            </span>

            <input
              value={localizacao}
              onChange={(event) => setLocalizacao(event.target.value)}
              className="mt-2 w-full bg-transparent text-xs leading-none outline-none placeholder:text-muted-foreground"
              placeholder="São Paulo"
            />
          </span>

          <ChevronDown className="size-3.5 text-muted-foreground" />
        </label>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="nav"
              className="h-auto min-h-[4.25rem] w-full justify-start gap-3 rounded-none border-b border-border px-4 py-3 text-left md:border-b-0 md:border-r md:px-5"
            >
              <CalendarDays className="size-[1.1rem] text-primary" />

              <span className="min-w-0 flex-1">
                <span className="block text-[0.68rem] font-semibold leading-none text-foreground">
                  Datas
                </span>

                <span
                  className={
                    date
                      ? "mt-2 block truncate text-xs font-normal text-foreground"
                      : "mt-2 block text-xs font-normal text-muted-foreground"
                  }
                >
                  {date
                    ? format(date, "dd 'de' MMM", { locale: ptBR })
                    : "Escolha uma data"}
                </span>
              </span>

              <ChevronDown
                className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                  calendarOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={10}
            className="w-auto rounded-lg border-primary/15 bg-popover p-2 shadow-lg"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);

                if (selectedDate) {
                  setCalendarOpen(false);
                }
              }}
              locale={ptBR}
              disabled={{ before: new Date() }}
              initialFocus
              className="pointer-events-auto [--cell-size:2.25rem]"
            />
          </PopoverContent>
        </Popover>

        <div className="p-1.5 md:pl-2">
          <Button
            type="submit"
            variant="editorial"
            className="h-12 w-full px-6 text-[0.72rem] md:h-full md:min-w-[9.5rem]"
          >
            Encontrar
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </form>
    </div>
  );
}