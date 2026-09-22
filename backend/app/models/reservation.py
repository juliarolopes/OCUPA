import enum
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.space import Space
    from app.models.user import User


class ReservationStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class Reservation(Base):
    __tablename__ = "reservations"
    __table_args__ = (
        CheckConstraint("end_datetime > start_datetime", name="valid_period"),
        CheckConstraint("total_price >= 0", name="total_price_non_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    space_id: Mapped[int] = mapped_column(
        ForeignKey("spaces.id", ondelete="CASCADE"), index=True, nullable=False
    )
    start_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    end_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    status: Mapped[ReservationStatus] = mapped_column(
        Enum(
            ReservationStatus,
            name="reservation_status",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        default=ReservationStatus.PENDING,
        server_default=ReservationStatus.PENDING.value,
        index=True,
    )
    total_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="reservations")
    space: Mapped["Space"] = relationship(back_populates="reservations")
