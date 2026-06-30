import pytest


@pytest.mark.asyncio
async def test_ticket_lifecycle(client):
    r = await client.post(
        "/api/v1/customers",
        json={"name": "Bob", "email": "bob@example.com"},
    )
    assert r.status_code == 201
    customer_id = r.json()["id"]

    r = await client.post(
        "/api/v1/tickets",
        json={
            "customer_id": customer_id,
            "title": "Login bug",
            "description": "Cannot login",
        },
    )
    assert r.status_code == 201, r.text
    ticket = r.json()
    assert ticket["status"] == "pendiente"
    ticket_id = ticket["id"]

    r = await client.get("/api/v1/tickets")
    assert r.status_code == 200
    assert len(r.json()) == 1

    r = await client.patch(
        f"/api/v1/tickets/{ticket_id}/status",
        json={"status": "en_progreso"},
    )
    assert r.status_code == 200
    assert r.json()["status"] == "en_progreso"

    r = await client.patch(
        f"/api/v1/tickets/{ticket_id}/status",
        json={"status": "finalizado"},
    )
    assert r.status_code == 200
    assert r.json()["status"] == "finalizado"


@pytest.mark.asyncio
async def test_create_ticket_for_missing_customer_returns_404(client):
    r = await client.post(
        "/api/v1/tickets",
        json={
            "customer_id": 99999,
            "title": "Ghost",
            "description": "x",
        },
    )
    assert r.status_code == 404
