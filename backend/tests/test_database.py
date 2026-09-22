from decimal import Decimal

import pytest
from sqlalchemy import inspect, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Amenity, Favorite, PriceUnit, Purpose, Space, User

pytestmark = pytest.mark.asyncio


def make_user(email: str = "owner@example.com") -> User:
    return User(name="Owner", email=email, password_hash="not-a-real-hash")


def make_space(owner: User, **overrides) -> Space:
    data = {
        "owner": owner,
        "name": "Sala de testes",
        "type": "Sala",
        "description": "Espaço criado para validar o domínio.",
        "area": Decimal("24.50"),
        "capacity": 6,
        "address": "Rua dos Testes, 10",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "latitude": -23.5505,
        "longitude": -46.6333,
        "price_value": Decimal("25.00"),
        "price_unit": PriceUnit.HOUR,
    }
    data.update(overrides)
    return Space(**data)


async def test_database_connection_and_tables(db_session: AsyncSession) -> None:
    assert await db_session.scalar(select(text("1"))) == 1
    connection = await db_session.connection()
    table_names = await connection.run_sync(lambda sync_connection: inspect(sync_connection).get_table_names())
    assert {"users", "spaces", "purposes", "amenities", "favorites", "reservations"} <= set(table_names)


async def test_create_user(db_session: AsyncSession) -> None:
    user = make_user()
    db_session.add(user)
    await db_session.commit()
    assert user.id is not None
    assert await db_session.scalar(select(User).where(User.email == user.email)) == user


async def test_create_space_and_relationships(db_session: AsyncSession) -> None:
    owner = make_user()
    purpose = Purpose(name="Trabalhar", slug="trabalhar")
    amenity = Amenity(name="Wi-Fi", slug="wi-fi")
    space = make_space(owner)
    space.purposes.append(purpose)
    space.amenities.append(amenity)
    db_session.add(space)
    await db_session.commit()

    assert space.owner is owner
    assert space in owner.spaces
    assert space.purposes == [purpose]
    assert space.amenities == [amenity]


async def test_unique_user_email(db_session: AsyncSession) -> None:
    db_session.add_all([make_user(), make_user()])
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()


async def test_space_constraints(db_session: AsyncSession) -> None:
    db_session.add(make_space(make_user(), area=Decimal("0")))
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()


async def test_duplicate_favorite_is_rejected(db_session: AsyncSession) -> None:
    user = make_user()
    space = make_space(user)
    db_session.add_all([user, space])
    await db_session.flush()
    db_session.add(Favorite(user_id=user.id, space_id=space.id))
    await db_session.commit()

    db_session.add(Favorite(user_id=user.id, space_id=space.id))
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()
