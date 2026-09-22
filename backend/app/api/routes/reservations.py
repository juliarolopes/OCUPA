import math
from datetime import UTC, datetime
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select

from app.api.dependencies import CurrentUser, DBSession
from app.models import PriceUnit, Reservation, ReservationStatus, Space
from app.schemas import (
    AvailabilityBlock,
    AvailabilityResponse,
    ReservationCreate,
    ReservationRead,
)

router = APIRouter(tags=["Reservations"])


def as_utc(value: datetime) -> datetime:
    return value.astimezone(UTC)


def calculate_price(space: Space, start: datetime, end: datetime) -> Decimal:
    duration_seconds = Decimal(str((end - start).total_seconds()))
    if space.price_unit == PriceUnit.HOUR:
        units = duration_seconds / Decimal(3600)
    else:
        units = Decimal(math.ceil(duration_seconds / Decimal(86400)))
    return (space.price_value * units).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def overlap_filter(space_id: int, start: datetime, end: datetime):
    return (
        Reservation.space_id == space_id,
        Reservation.status != ReservationStatus.CANCELLED,
        Reservation.start_datetime < end,
        Reservation.end_datetime > start,
    )


@router.post(
    "/reservations",
    response_model=ReservationRead,
    status_code=status.HTTP_201_CREATED,
    summary="Criar reserva",
    description="Cria uma reserva sem cobrança, após validar intervalo e conflitos.",
)
async def create_reservation(
    payload: ReservationCreate, current_user: CurrentUser, session: DBSession
) -> Reservation:
    start = as_utc(payload.start_datetime)
    end = as_utc(payload.end_datetime)
    space = await session.scalar(
        select(Space).where(Space.id == payload.space_id).with_for_update()
    )
    if space is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Espaço não encontrado.")
    conflict = await session.scalar(select(Reservation.id).where(*overlap_filter(space.id, start, end)))
    if conflict is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "O espaço já está reservado neste intervalo.")
    reservation = Reservation(
        user_id=current_user.id,
        space_id=space.id,
        start_datetime=start,
        end_datetime=end,
        status=ReservationStatus.PENDING,
        total_price=calculate_price(space, start, end),
    )
    session.add(reservation)
    await session.commit()
    await session.refresh(reservation)
    return reservation


@router.get(
    "/reservations",
    response_model=list[ReservationRead],
    summary="Listar minhas reservas",
)
async def list_reservations(
    current_user: CurrentUser, session: DBSession
) -> list[Reservation]:
    result = await session.scalars(
        select(Reservation)
        .where(Reservation.user_id == current_user.id)
        .order_by(Reservation.start_datetime.desc())
    )
    return list(result.all())


async def owned_reservation_or_404(
    session: DBSession, reservation_id: int, user_id: int
) -> Reservation:
    reservation = await session.scalar(
        select(Reservation).where(
            Reservation.id == reservation_id, Reservation.user_id == user_id
        )
    )
    if reservation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Reserva não encontrada.")
    return reservation


@router.get(
    "/reservations/{reservation_id}",
    response_model=ReservationRead,
    summary="Consultar reserva",
)
async def get_reservation(
    reservation_id: int, current_user: CurrentUser, session: DBSession
) -> Reservation:
    return await owned_reservation_or_404(session, reservation_id, current_user.id)


@router.patch(
    "/reservations/{reservation_id}/cancel",
    response_model=ReservationRead,
    summary="Cancelar reserva",
)
async def cancel_reservation(
    reservation_id: int, current_user: CurrentUser, session: DBSession
) -> Reservation:
    reservation = await owned_reservation_or_404(session, reservation_id, current_user.id)
    reservation.status = ReservationStatus.CANCELLED
    await session.commit()
    await session.refresh(reservation)
    return reservation


@router.get(
    "/spaces/{space_id}/availability",
    response_model=AvailabilityResponse,
    summary="Consultar disponibilidade",
    description="Lista intervalos ocupados e, opcionalmente, verifica um intervalo informado.",
)
async def get_availability(
    space_id: int,
    session: DBSession,
    start_datetime: datetime | None = Query(default=None),
    end_datetime: datetime | None = Query(default=None),
) -> AvailabilityResponse:
    if await session.get(Space, space_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Espaço não encontrado.")
    if (start_datetime is None) != (end_datetime is None):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Informe start_datetime e end_datetime juntos.",
        )
    if start_datetime is not None:
        if start_datetime.tzinfo is None or end_datetime.tzinfo is None:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Os horários devem incluir timezone.")
        if end_datetime <= start_datetime:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Intervalo inválido.")

    result = await session.scalars(
        select(Reservation)
        .where(
            Reservation.space_id == space_id,
            Reservation.status != ReservationStatus.CANCELLED,
        )
        .order_by(Reservation.start_datetime)
    )
    reservations = list(result.all())
    available = None
    if start_datetime is not None and end_datetime is not None:
        start, end = as_utc(start_datetime), as_utc(end_datetime)
        available = not any(
            reservation.start_datetime < end and reservation.end_datetime > start
            for reservation in reservations
        )
    return AvailabilityResponse(
        space_id=space_id,
        available=available,
        busy_intervals=[
            AvailabilityBlock(
                start_datetime=reservation.start_datetime,
                end_datetime=reservation.end_datetime,
            )
            for reservation in reservations
        ],
    )
