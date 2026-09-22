from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.models.reservation import ReservationStatus
from app.models.space import PriceUnit


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class NamedResource(ORMModel):
    id: int
    name: str
    slug: str


class UserRead(ORMModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None


class SpaceRead(ORMModel):
    id: int
    owner_id: int
    name: str
    type: str
    description: str
    area: Decimal
    capacity: int
    address: str
    neighborhood: str
    city: str
    state: str
    latitude: float
    longitude: float
    price_value: Decimal
    price_unit: PriceUnit
    purposes: list[NamedResource]
    amenities: list[NamedResource]
    created_at: datetime
    updated_at: datetime


class SpaceInput(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    type: str = Field(min_length=1, max_length=80)
    description: str = Field(min_length=1)
    area: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    capacity: int = Field(gt=0)
    address: str = Field(min_length=1, max_length=255)
    neighborhood: str = Field(min_length=1, max_length=120)
    city: str = Field(min_length=1, max_length=120)
    state: str = Field(min_length=2, max_length=2)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    price_value: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    price_unit: PriceUnit
    purposes: list[str] = Field(default_factory=list)
    amenities: list[str] = Field(default_factory=list)


class SpaceCreate(SpaceInput):
    pass


class SpaceUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    type: str | None = Field(default=None, min_length=1, max_length=80)
    description: str | None = Field(default=None, min_length=1)
    area: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    capacity: int | None = Field(default=None, gt=0)
    address: str | None = Field(default=None, min_length=1, max_length=255)
    neighborhood: str | None = Field(default=None, min_length=1, max_length=120)
    city: str | None = Field(default=None, min_length=1, max_length=120)
    state: str | None = Field(default=None, min_length=2, max_length=2)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    price_value: Decimal | None = Field(
        default=None, gt=0, max_digits=10, decimal_places=2
    )
    price_unit: PriceUnit | None = None
    purposes: list[str] | None = None
    amenities: list[str] | None = None


class SpacePage(BaseModel):
    items: list[SpaceRead]
    page: int
    page_size: int
    total: int
    pages: int


class FavoriteRead(ORMModel):
    user_id: int
    space_id: int
    created_at: datetime


class FavoriteCheck(BaseModel):
    space_id: int
    is_favorite: bool


class ReservationRead(ORMModel):
    id: int
    user_id: int
    space_id: int
    start_datetime: datetime
    end_datetime: datetime
    status: ReservationStatus
    total_price: Decimal
    created_at: datetime


class ReservationCreate(BaseModel):
    space_id: int
    start_datetime: datetime
    end_datetime: datetime

    @model_validator(mode="after")
    def validate_interval(self):
        if self.end_datetime <= self.start_datetime:
            raise ValueError("end_datetime must be after start_datetime")
        if self.start_datetime.tzinfo is None or self.end_datetime.tzinfo is None:
            raise ValueError("reservation datetimes must include a timezone")
        return self


class AvailabilityBlock(BaseModel):
    start_datetime: datetime
    end_datetime: datetime


class AvailabilityResponse(BaseModel):
    space_id: int
    available: bool | None
    busy_intervals: list[AvailabilityBlock]
