import os
from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://ocupa_test:ocupa_test@localhost:5434/ocupa_test",
)
database_name = TEST_DATABASE_URL.rsplit("/", maxsplit=1)[-1].split("?", maxsplit=1)[0]
if not database_name.endswith("_test"):
    raise RuntimeError("TEST_DATABASE_URL must point to a database whose name ends with '_test'.")

os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ.setdefault("JWT_SECRET", "test-secret-that-is-at-least-32-characters-long")

from app.core.database import Base, get_db  # noqa: E402
import app.models  # noqa: E402, F401 -- registers model metadata
from app.main import app  # noqa: E402


@pytest_asyncio.fixture
async def db_session() -> AsyncIterator[AsyncSession]:
    test_engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
    async with test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(test_engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    async with test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()


@pytest_asyncio.fixture
async def api_client(db_session: AsyncSession) -> AsyncIterator[AsyncClient]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def space_payload():
    def build(**overrides):
        payload = {
            "name": "Sala Criativa",
            "type": "Sala",
            "description": "Uma sala ampla e iluminada.",
            "area": "24.50",
            "capacity": 6,
            "address": "Rua Harmonia, 10",
            "neighborhood": "Vila Madalena",
            "city": "São Paulo",
            "state": "SP",
            "latitude": -23.55,
            "longitude": -46.69,
            "price_value": "20.00",
            "price_unit": "hora",
            "purposes": ["Trabalhar", "Fotografar"],
            "amenities": ["Wi-Fi", "Mesa"],
        }
        payload.update(overrides)
        return payload

    return build
