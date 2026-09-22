import pytest
from httpx import AsyncClient

from tests.helpers import auth, register

pytestmark = pytest.mark.asyncio


async def test_register_hashes_password_and_returns_token(api_client: AsyncClient) -> None:
    result = await register(api_client)
    assert result["access_token"]
    assert result["token_type"] == "bearer"
    assert result["user"]["email"] == "owner@example.com"
    assert "password" not in result["user"]
    assert "password_hash" not in result["user"]


async def test_register_rejects_duplicate_email(api_client: AsyncClient) -> None:
    await register(api_client, email="Case@Example.com")
    response = await api_client.post(
        "/api/auth/register",
        json={"name": "Other", "email": "case@example.com", "password": "other-password"},
    )
    assert response.status_code == 409


async def test_login(api_client: AsyncClient) -> None:
    await register(api_client)
    response = await api_client.post(
        "/api/auth/login",
        json={"email": "OWNER@example.com", "password": "strong-password"},
    )
    assert response.status_code == 200
    assert response.json()["access_token"]


async def test_login_rejects_invalid_credentials(api_client: AsyncClient) -> None:
    await register(api_client)
    response = await api_client.post(
        "/api/auth/login",
        json={"email": "owner@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


async def test_auth_me(api_client: AsyncClient) -> None:
    registered = await register(api_client)
    response = await api_client.get(
        "/api/auth/me", headers=auth(registered["access_token"])
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Owner"
    assert "password_hash" not in response.json()


async def test_protected_endpoint_rejects_missing_token(api_client: AsyncClient) -> None:
    response = await api_client.get("/api/users/me")
    assert response.status_code == 401


async def test_update_profile_and_email_uniqueness(api_client: AsyncClient) -> None:
    first = await register(api_client, email="first@example.com")
    await register(api_client, email="second@example.com")
    response = await api_client.patch(
        "/api/users/me",
        json={"name": "New Name", "email": "new@example.com"},
        headers=auth(first["access_token"]),
    )
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"
    duplicate = await api_client.patch(
        "/api/users/me",
        json={"email": "second@example.com"},
        headers=auth(first["access_token"]),
    )
    assert duplicate.status_code == 409
