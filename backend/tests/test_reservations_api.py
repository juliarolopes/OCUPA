from datetime import UTC, datetime, timedelta

import pytest
from httpx import AsyncClient

from tests.helpers import auth, create_space, register

pytestmark = pytest.mark.asyncio


async def test_reservation_conflict_cancel_and_availability(
    api_client: AsyncClient, space_payload
) -> None:
    owner = await register(api_client, email="owner@example.com")
    guest = await register(api_client, email="guest@example.com")
    other = await register(api_client, email="other@example.com")
    space = await create_space(api_client, owner["access_token"], space_payload())
    start = datetime.now(UTC).replace(microsecond=0) + timedelta(days=2)
    end = start + timedelta(hours=2, minutes=30)
    payload = {
        "space_id": space["id"],
        "start_datetime": start.isoformat(),
        "end_datetime": end.isoformat(),
    }

    created = await api_client.post(
        "/api/reservations", json=payload, headers=auth(guest["access_token"])
    )
    assert created.status_code == 201, created.text
    reservation = created.json()
    assert reservation["total_price"] == "50.00"

    conflict_payload = {
        **payload,
        "start_datetime": (start + timedelta(hours=1)).isoformat(),
        "end_datetime": (end + timedelta(hours=1)).isoformat(),
    }
    conflict = await api_client.post(
        "/api/reservations", json=conflict_payload, headers=auth(other["access_token"])
    )
    assert conflict.status_code == 409

    listing = await api_client.get("/api/reservations", headers=auth(guest["access_token"]))
    assert [item["id"] for item in listing.json()] == [reservation["id"]]
    detail = await api_client.get(
        f"/api/reservations/{reservation['id']}", headers=auth(guest["access_token"])
    )
    assert detail.status_code == 200

    availability = await api_client.get(
        f"/api/spaces/{space['id']}/availability",
        params={"start_datetime": start.isoformat(), "end_datetime": end.isoformat()},
    )
    assert availability.status_code == 200
    assert availability.json()["available"] is False
    assert len(availability.json()["busy_intervals"]) == 1

    cancelled = await api_client.patch(
        f"/api/reservations/{reservation['id']}/cancel",
        headers=auth(guest["access_token"]),
    )
    assert cancelled.status_code == 200
    assert cancelled.json()["status"] == "cancelled"
    availability = await api_client.get(
        f"/api/spaces/{space['id']}/availability",
        params={"start_datetime": start.isoformat(), "end_datetime": end.isoformat()},
    )
    assert availability.json()["available"] is True


async def test_reservation_rejects_invalid_interval(api_client: AsyncClient) -> None:
    user = await register(api_client)
    now = datetime.now(UTC).replace(microsecond=0)
    response = await api_client.post(
        "/api/reservations",
        json={"space_id": 1, "start_datetime": now.isoformat(), "end_datetime": now.isoformat()},
        headers=auth(user["access_token"]),
    )
    assert response.status_code == 422


async def test_reservation_is_private(api_client: AsyncClient, space_payload) -> None:
    owner = await register(api_client, email="owner@example.com")
    guest = await register(api_client, email="guest@example.com")
    stranger = await register(api_client, email="stranger@example.com")
    space = await create_space(api_client, owner["access_token"], space_payload(price_unit="dia"))
    start = datetime.now(UTC).replace(microsecond=0) + timedelta(days=4)
    created = await api_client.post(
        "/api/reservations",
        json={
            "space_id": space["id"],
            "start_datetime": start.isoformat(),
            "end_datetime": (start + timedelta(hours=2)).isoformat(),
        },
        headers=auth(guest["access_token"]),
    )
    assert created.json()["total_price"] == "20.00"
    reservation_id = created.json()["id"]
    response = await api_client.get(
        f"/api/reservations/{reservation_id}", headers=auth(stranger["access_token"])
    )
    assert response.status_code == 404
