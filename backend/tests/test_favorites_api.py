import pytest
from httpx import AsyncClient

from tests.helpers import auth, create_space, register

pytestmark = pytest.mark.asyncio


async def test_favorite_lifecycle(api_client: AsyncClient, space_payload) -> None:
    user = await register(api_client)
    headers = auth(user["access_token"])
    space = await create_space(api_client, user["access_token"], space_payload())

    added = await api_client.post(f"/api/favorites/{space['id']}", headers=headers)
    assert added.status_code == 201
    assert added.json()["space_id"] == space["id"]
    assert (await api_client.post(f"/api/favorites/{space['id']}", headers=headers)).status_code == 409

    check = await api_client.get(f"/api/favorites/{space['id']}/check", headers=headers)
    assert check.json()["is_favorite"] is True
    listing = await api_client.get("/api/favorites", headers=headers)
    assert [item["id"] for item in listing.json()] == [space["id"]]

    removed = await api_client.delete(f"/api/favorites/{space['id']}", headers=headers)
    assert removed.status_code == 204
    check = await api_client.get(f"/api/favorites/{space['id']}/check", headers=headers)
    assert check.json()["is_favorite"] is False
