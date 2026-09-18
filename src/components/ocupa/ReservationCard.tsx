import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getSpaceById } from "@/data/ocupa";
import type { Reservation, ReservationStatus } from "@/data/account";
import { cn } from "@/lib/utils";

const statusCopy: Record<ReservationStatus, string> = {
  confirmed: "Confirmada",
  pending: "Pendente",
  cancelled: "Cancelada",
};

export function ReservationCard({ reservation }: { reservation: Reservation }) {
  const space = getSpaceById(reservation.spaceId);
  if (!space) return null;

  return (
    <article className="grid overflow-hidden border border-border bg-card sm:grid-cols-[12rem_1fr]">
      <img src={space.image} alt={space.name} className="h-48 w-full object-cover sm:h-full" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl text-primary">{space.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {space.neighborhood}, {space.city}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3 py-1 font-medium",
              reservation.status === "confirmed" && "border-primary/30 bg-light-green text-primary",
              reservation.status === "pending" &&
                "border-terracotta/30 bg-terracotta/10 text-terracotta",
              reservation.status === "cancelled" && "text-muted-foreground line-through",
            )}
          >
            {statusCopy[reservation.status]}
          </Badge>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-4 text-xs">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            {format(parseISO(reservation.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            {reservation.startTime}–{reservation.endTime}
          </span>
          <strong className="ml-auto">R$ {reservation.totalPrice}</strong>
        </div>
      </div>
    </article>
  );
}
