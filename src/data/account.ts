import { toLocalDateKey, type Space } from "@/data/ocupa";

export type ReservationStatus = "confirmed" | "pending" | "cancelled";

export type Reservation = {
  id: number;
  spaceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: number;
};

function dateFromToday(dayOffset: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return toLocalDateKey(date);
}

const reservations: Reservation[] = [
  {
    id: 1,
    spaceId: 2,
    date: dateFromToday(8),
    startTime: "14:00",
    endTime: "17:00",
    status: "confirmed",
    totalPrice: 60,
  },
  {
    id: 2,
    spaceId: 4,
    date: dateFromToday(19),
    startTime: "10:00",
    endTime: "12:00",
    status: "pending",
    totalPrice: 70,
  },
  {
    id: 3,
    spaceId: 6,
    date: dateFromToday(-24),
    startTime: "09:00",
    endTime: "18:00",
    status: "confirmed",
    totalPrice: 30,
  },
];

const hostedSpaceIds = [2, 5];

export function getUserReservations() {
  // Futuramente, substituir por GET /api/reservas/.
  return reservations;
}

export function getUserHostedSpaces(userId: string, availableSpaces: Space[]): Space[] {
  // Futuramente, substituir por GET /api/meus-espacos/.
  return availableSpaces.filter(
    (space) =>
      space.ownerId === userId || (userId === "mock-user" && hostedSpaceIds.includes(space.id)),
  );
}
