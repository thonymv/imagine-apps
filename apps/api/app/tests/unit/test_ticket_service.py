from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

from app.models.ticket import Ticket, TicketStatus
from app.schemas.ticket import TicketStatusUpdate
from app.services.audit_service import AuditService
from app.services.ticket_service import TicketService


@pytest.fixture
def ticket_repo() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def customer_repo() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def audit() -> AsyncMock:
    return AsyncMock(spec=AuditService)


@pytest.fixture
def service(
    ticket_repo: AsyncMock, customer_repo: AsyncMock, audit: AsyncMock
) -> TicketService:
    return TicketService(ticket_repo, customer_repo, audit)


async def test_update_status_raises_not_found_when_missing(
    service: TicketService, ticket_repo: AsyncMock
) -> None:
    ticket_repo.get.return_value = None

    with pytest.raises(HTTPException) as exc:
        await service.update_status(
            99, TicketStatusUpdate(status=TicketStatus.en_progreso)
        )

    assert exc.value.status_code == 404
    ticket_repo.update_status.assert_not_awaited()


async def test_update_status_happy_path(
    service: TicketService, ticket_repo: AsyncMock
) -> None:
    ticket = Ticket(
        id=1,
        customer_id=1,
        title="x",
        description="y",
        status=TicketStatus.pendiente,
    )
    updated = Ticket(
        id=1,
        customer_id=1,
        title="x",
        description="y",
        status=TicketStatus.finalizado,
    )
    ticket_repo.get.return_value = ticket
    ticket_repo.update_status.return_value = updated

    result = await service.update_status(
        1, TicketStatusUpdate(status=TicketStatus.finalizado)
    )

    assert result is updated
    ticket_repo.get.assert_awaited_once_with(1)
    ticket_repo.update_status.assert_awaited_once_with(
        ticket, TicketStatus.finalizado
    )
