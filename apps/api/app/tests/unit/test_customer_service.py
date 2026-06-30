from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate
from app.services.customer_service import CustomerService


@pytest.fixture
def repo() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def service(repo: AsyncMock) -> CustomerService:
    return CustomerService(repo)


async def test_create_raises_conflict_when_email_exists(
    service: CustomerService, repo: AsyncMock
) -> None:
    repo.get_by_email.return_value = Customer(
        id=1, name="Existing", email="a@b.com"
    )
    payload = CustomerCreate(name="New", email="a@b.com")

    with pytest.raises(HTTPException) as exc:
        await service.create(payload)

    assert exc.value.status_code == 409
    repo.create.assert_not_awaited()


async def test_create_delegates_to_repo(
    service: CustomerService, repo: AsyncMock
) -> None:
    repo.get_by_email.return_value = None
    created = Customer(id=2, name="New", email="n@b.com")
    repo.create.return_value = created
    payload = CustomerCreate(name="New", email="n@b.com")

    result = await service.create(payload)

    assert result is created
    repo.get_by_email.assert_awaited_once_with("n@b.com")
    repo.create.assert_awaited_once_with(payload)
