import pytest
from httpx import AsyncClient

from tests.helpers import auth, create_space, register

pytestmark = pytest.mark.asyncio


async def test_space_crud_and_owner_listing(api_client: AsyncClient, space_payload) -> None:
    owner = await register(api_client)
    token = owner["access_token"]
    created = await create_space(api_client, token, space_payload())
    assert created["owner_id"] == owner["user"]["id"]
    assert {item["name"] for item in created["purposes"]} == {"Trabalhar", "Fotografar"}

    listing = await api_client.get("/api/spaces")
    assert listing.status_code == 200
    assert listing.json()["total"] == 1

    detail = await api_client.get(f"/api/spaces/{created['id']}")
    assert detail.status_code == 200
    assert detail.json()["name"] == "Sala Criativa"

    mine = await api_client.get("/api/users/me/spaces", headers=auth(token))
    assert mine.status_code == 200
    assert [item["id"] for item in mine.json()] == [created["id"]]

    updated = await api_client.patch(
        f"/api/spaces/{created['id']}",
        json={"name": "Sala Atualizada", "amenities": ["Projetor"]},
        headers=auth(token),
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Sala Atualizada"
    assert [item["name"] for item in updated.json()["amenities"]] == ["Projetor"]

    deleted = await api_client.delete(f"/api/spaces/{created['id']}", headers=auth(token))
    assert deleted.status_code == 204
    assert (await api_client.get(f"/api/spaces/{created['id']}" )).status_code == 404


async def test_only_owner_can_update_or_delete(api_client: AsyncClient, space_payload) -> None:
    owner = await register(api_client, email="owner@example.com")
    stranger = await register(api_client, email="stranger@example.com")
    space = await create_space(api_client, owner["access_token"], space_payload())
    headers = auth(stranger["access_token"])
    assert (
        await api_client.patch(
            f"/api/spaces/{space['id']}", json={"name": "Invadido"}, headers=headers
        )
    ).status_code == 403
    assert (await api_client.delete(f"/api/spaces/{space['id']}", headers=headers)).status_code == 403
