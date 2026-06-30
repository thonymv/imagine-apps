from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.customer_repository import CustomerRepository
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import TicketCreate, TicketRead, TicketStatusUpdate
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/tickets", tags=["tickets"])


def _service(session: AsyncSession = Depends(get_db)) -> TicketService:
    return TicketService(
        TicketRepository(session), CustomerRepository(session)
    )


@router.post(
    "", response_model=TicketRead, status_code=status.HTTP_201_CREATED
)
async def create_ticket(
    payload: TicketCreate, service: TicketService = Depends(_service)
) -> TicketRead:
    ticket = await service.create(payload)
    return TicketRead.model_validate(ticket)


@router.get("", response_model=list[TicketRead])
async def list_tickets(
    service: TicketService = Depends(_service),
) -> list[TicketRead]:
    tickets = await service.list()
    return [TicketRead.model_validate(t) for t in tickets]


@router.patch("/{ticket_id}/status", response_model=TicketRead)
async def update_ticket_status(
    ticket_id: int,
    payload: TicketStatusUpdate,
    service: TicketService = Depends(_service),
) -> TicketRead:
    ticket = await service.update_status(ticket_id, payload)
    return TicketRead.model_validate(ticket)
