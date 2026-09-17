import { startOfDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { toLocalDateKey, type SpaceAvailability } from "@/data/ocupa";

type AvailabilityCalendarProps = {
  availability: SpaceAvailability[];
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
};

export function AvailabilityCalendar({
  availability,
  selected,
  onSelect,
}: AvailabilityCalendarProps) {
  const availabilityByDate = new Map(availability.map((item) => [item.date, item.available]));
  const isUnavailable = (date: Date) => availabilityByDate.get(toLocalDateKey(date)) !== true;

  return (
    <div className="overflow-hidden border border-border bg-card p-1">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={(date) => date < startOfDay(new Date()) || isUnavailable(date)}
        className="mx-auto w-full [--cell-size:2.15rem] sm:[--cell-size:2.35rem]"
      />
      <div className="flex items-center justify-center gap-5 border-t border-border px-3 py-3 text-[0.65rem] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2.5 bg-light-green" />
          Disponível
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 bg-muted" />
          Indisponível
        </span>
      </div>
    </div>
  );
}
