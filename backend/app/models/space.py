import enum
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Enum, Float, ForeignKey, Numeric, String, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.amenity import Amenity
    from app.models.favorite import Favorite
    from app.models.purpose import Purpose
    from app.models.reservation import Reservation
    from app.models.user import User


class PriceUnit(str, enum.Enum):
    HOUR = "hora"
    DAY = "dia"


space_purposes = Table(
    "space_purposes",
    Base.metadata,
    Column("space_id", ForeignKey("spaces.id", ondelete="CASCADE"), primary_key=True),
    Column("purpose_id", ForeignKey("purposes.id", ondelete="CASCADE"), primary_key=True),
)

space_amenities = Table(
    "space_amenities",
    Base.metadata,
    Column("space_id", ForeignKey("spaces.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)


class Space(TimestampMixin, Base):
    __tablename__ = "spaces"
    __table_args__ = (
        CheckConstraint("area > 0", name="area_positive"),
        CheckConstraint("capacity > 0", name="capacity_positive"),
        CheckConstraint("price_value >= 0", name="price_non_negative"),
        CheckConstraint("latitude BETWEEN -90 AND 90", name="latitude_range"),
        CheckConstraint("longitude BETWEEN -180 AND 180", name="longitude_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    type: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    area: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    capacity: Mapped[int] = mapped_column(nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    neighborhood: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    city: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(2), index=True, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    price_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    price_unit: Mapped[PriceUnit] = mapped_column(
        Enum(PriceUnit, name="price_unit", values_callable=lambda enum: [item.value for item in enum]),
        nullable=False,
    )

    owner: Mapped["User"] = relationship(back_populates="spaces")
    purposes: Mapped[list["Purpose"]] = relationship(
        secondary=space_purposes, back_populates="spaces"
    )
    amenities: Mapped[list["Amenity"]] = relationship(
        secondary=space_amenities, back_populates="spaces"
    )
    favorites: Mapped[list["Favorite"]] = relationship(
        back_populates="space", cascade="all, delete-orphan"
    )
    reservations: Mapped[list["Reservation"]] = relationship(
        back_populates="space", cascade="all, delete-orphan"
    )
