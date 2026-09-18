import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarX } from "lucide-react";

import { AccountLayout } from "@/components/ocupa/AccountLayout";
import { ReservationCard } from "@/components/ocupa/ReservationCard";
import { Button } from "@/components/ui/button";
import { getUserReservations } from "@/data/account";
import { toLocalDateKey } from "@/data/ocupa";

export const Route = createFileRoute("/reservas")({ component: ReservationsPage });

function ReservationsPage() {
  const reservations = getUserReservations();
  const today = toLocalDateKey(new Date());
  const upcoming = reservations.filter((item) => item.date >= today && item.status !== "cancelled");
  const previous = reservations.filter((item) => item.date < today || item.status === "cancelled");

  return (
    <AccountLayout
      title="Minhas reservas"
      description="Acompanhe os espaços que você reservou e relembre experiências anteriores."
    >
      {reservations.length > 0 ? (
        <div className="space-y-12">
          <ReservationSection
            title="Próximas reservas"
            reservations={upcoming}
            empty="Nenhuma reserva futura."
          />
          <ReservationSection
            title="Reservas anteriores"
            reservations={previous}
            empty="Nenhuma reserva anterior."
          />
        </div>
      ) : (
        <div className="py-16 text-center">
          <CalendarX className="mx-auto size-9 text-primary" />
          <h2 className="mt-5 font-serif text-3xl text-primary">Você ainda não possui reservas</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Encontre um espaço para aquilo que você precisa fazer.
          </p>
          <Button variant="editorial" className="mt-7" asChild>
            <Link to="/buscar" search={{ necessidade: "", localizacao: "", data: "" }}>
              Encontrar um espaço <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </AccountLayout>
  );
}

function ReservationSection({
  title,
  reservations,
  empty,
}: {
  title: string;
  reservations: ReturnType<typeof getUserReservations>;
  empty: string;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-primary">{title}</h2>
      {reservations.length ? (
        <div className="mt-5 space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      ) : (
        <p className="mt-4 border-y border-border py-6 text-sm text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}
