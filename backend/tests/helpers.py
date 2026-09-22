from httpx import AsyncClient


async def register(
    client: AsyncClient,
    email: str = "owner@example.com",
    password: str = "strong-password",
    name: str = "Owner",
) -> dict:
    response = await client.post(
        "/api/auth/register",
        json={"name": name, "email": email, "password": password},
    )
    assert response.status_code == 201, response.text
    return response.json()


def auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


async def create_space(client: AsyncClient, token: str, payload: dict) -> dict:
    response = await client.post("/api/spaces", json=payload, headers=auth(token))
    assert response.status_code == 201, response.text
    return response.json()
