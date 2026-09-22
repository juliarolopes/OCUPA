import pytest
from httpx import AsyncClient

from tests.helpers import create_space, register

pytestmark = pytest.mark.asyncio


async def test_space_search_filters_and_pagination(api_client: AsyncClient, space_payload) -> None:
    owner = await register(api_client)
    token = owner["access_token"]
    await create_space(api_client, token, space_payload())
    await create_space(
        api_client,
        token,
        space_payload(
            name="Garagem Centro",
            type="Garagem",
            neighborhood="Centro",
            city="Campinas",
            address="Avenida Central, 1",
            price_value="12.00",
            area="40.00",
            purposes=["Guardar"],
            amenities=["Coberta"],
        ),
    )

    need = await api_client.get("/api/spaces", params={"necessidade": "Trabalhar"})
    assert need.json()["total"] == 1
    assert need.json()["items"][0]["name"] == "Sala Criativa"

    location = await api_client.get("/api/spaces", params={"localizacao": "Campinas"})
    assert location.json()["total"] == 1

    price = await api_client.get("/api/spaces", params={"price_max": 15})
    assert [item["name"] for item in price.json()["items"]] == ["Garagem Centro"]

    space_type = await api_client.get("/api/spaces", params={"tipo": "Sala"})
    assert space_type.json()["total"] == 1

    taxonomy = await api_client.get(
        "/api/spaces", params=[("amenities", "Wi-Fi"), ("purposes", "Fotografar")]
    )
    assert taxonomy.json()["total"] == 1

    page = await api_client.get("/api/spaces", params={"page": 2, "page_size": 1})
    assert page.json()["total"] == 2
    assert page.json()["pages"] == 2
    assert len(page.json()["items"]) == 1
