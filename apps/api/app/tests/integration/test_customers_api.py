import pytest


@pytest.mark.asyncio
async def test_customer_crud_flow(client):
    r = await client.post(
        "/api/v1/customers",
        json={"name": "Ana", "email": "ana@example.com", "company": "ACME"},
    )
    assert r.status_code == 201, r.text
    created = r.json()
    assert created["name"] == "Ana"
    assert created["email"] == "ana@example.com"
    assert created["company"] == "ACME"
    assert "id" in created
    assert "created_at" in created
    customer_id = created["id"]

    r = await client.get("/api/v1/customers")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1
    assert items[0]["email"] == "ana@example.com"

    r = await client.get(f"/api/v1/customers/{customer_id}")
    assert r.status_code == 200
    assert r.json()["id"] == customer_id

    r = await client.get("/api/v1/customers/99999")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_create_customer_duplicate_email_returns_409(client):
    payload = {"name": "Ana", "email": "dup@example.com"}
    r = await client.post("/api/v1/customers", json=payload)
    assert r.status_code == 201

    r = await client.post("/api/v1/customers", json=payload)
    assert r.status_code == 409
