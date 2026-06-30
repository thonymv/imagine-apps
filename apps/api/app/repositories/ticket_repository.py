from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import Ticket, TicketStatus
from app.repositories.base import CRUDBase
from app.schemas.ticket import TicketCreate


class TicketRepository(CRUDBase[Ticket, TicketCreate]):
    def __init__(self, session: AsyncSession):
        super().__init__(Ticket, session)

    async def list_by_customer(self, customer_id: int) -> list[Ticket]:
        result = await self.session.execute(
            select(Ticket).where(Ticket.customer_id == customer_id)
        )
        return list(result.scalars().all())

    async def update_status(self, ticket: Ticket, status: TicketStatus) -> Ticket:
        return await self.update(ticket, status=status)
