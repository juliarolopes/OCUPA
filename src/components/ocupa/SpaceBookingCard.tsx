import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal";
import { AvailabilityCalendar } from "@/components/ocupa/AvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { formatSpacePrice, toLocalDateKey, type Space } from "@/data/ocupa";
import { cn } from "@/lib/utils";

export function SpaceBookingCard({ space }: { space: Space }) {
  const { isAuthenticated } = useAuth();
  const { openAuth } = useAuthModal();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const dayAvailability = selectedDate
    ? space.availability.find((item) => item.date === toLocalDateKey(selectedDate))
    : undefined;

  const confirmDemoReservation = async () => {
    setSubmitting(true);
    // TODO: substituir pela criação da reserva via API Django/DRF.
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setMessage("Solicitação registrada nesta demonstração. Nenhuma cobrança foi realizada.");
    setSubmitting(false);
  };

  const requestReservation = () => {
    if (!selectedDate || !selectedTime) return;
    if (!isAuthenticated) {
      openAuth("booking", { onSuccess: confirmDemoReservation });
      return;
    }
    void confirmDemoReservation();
  };

  return (
    <aside className="border border-border bg-card p-5 shadow-[0_18px_45px_-38px_var(--foreground)] sm:p-6 lg:sticky lg:top-6">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
        Reserve este espaço
      </p>
      <p className="mt-3 font-serif text-2xl text-primary">{formatSpacePrice(space)}</p>

      <div className="mt-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays className="size-4 text-primary" /> Escolha uma data
        </h2>
        <div className="mt-3">
          <AvailabilityCalendar
            availability={space.availability}
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(undefined);
              setMessage("");
            }}
          />
        </div>
      </div>

      {selectedDate && dayAvailability ? (
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4 text-primary" /> Horários disponíveis
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {dayAvailability.slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => {
                  setSelectedTime(slot.time);
                  setMessage("");
                }}
                className={cn(
                  "min-h-10 border px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-muted/50 disabled:text-muted-foreground/45 disabled:line-through",
                  selectedTime === slot.time
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary",
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 space-y-3 border-y border-border py-4 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Data</span>
          <strong>
            {selectedDate
              ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
              : "Selecione uma data"}
          </strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Horário</span>
          <strong>{selectedTime ?? "Selecione um horário"}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Preço</span>
          <strong>{formatSpacePrice(space)}</strong>
        </div>
      </div>

      <Button
        type="button"
        variant="editorial"
        size="editorial"
        className="mt-5 w-full rounded-md"
        disabled={!selectedDate || !selectedTime || submitting}
        onClick={requestReservation}
      >
        {submitting ? (
          <>
            <LoaderCircle className="animate-spin" /> Enviando...
          </>
        ) : (
          "Solicitar reserva"
        )}
      </Button>
      <p aria-live="polite" className="mt-3 min-h-5 text-center text-xs leading-5 text-primary">
        {message}
      </p>
    </aside>
  );
}
