from fastapi import HTTPException, status

from app.models.ticket import Ticket
from app.repositories.customer_repository import CustomerRepository
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import TicketCreate, TicketStatusUpdate
from app.services.audit_service import AuditService


class TicketService:
    def __init__(
        self,
        repo: TicketRepository,
        customer_repo: CustomerRepository,
        audit: AuditService,
    ):
        self.repo = repo
        self.customer_repo = customer_repo
        self.audit = audit

    async def list(self) -> list[Ticket]:
        return await self.repo.list_all()

    async def get(self, ticket_id: int) -> Ticket:
        ticket = await self.repo.get(ticket_id)
        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found",
            )
        return ticket

    async def create(self, data: TicketCreate) -> Ticket:
        customer = await self.customer_repo.get(data.customer_id)
        if customer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )
        ticket = await self.repo.create(data)
        await self.audit.record_event(
            user="system", action="ticket.created", ticket_id=ticket.id
        )
        return ticket

    async def update_status(
        self, ticket_id: int, data: TicketStatusUpdate
    ) -> Ticket:
        ticket = await self.repo.get(ticket_id)
        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found",
            )
        updated = await self.repo.update_status(ticket, data.status)
        await self.audit.record_event(
            user="system",
            action="ticket.status_changed",
            ticket_id=updated.id,
        )
        return updated
