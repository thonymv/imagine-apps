from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import Customer
from app.repositories.base import CRUDBase
from app.schemas.customer import CustomerCreate


class CustomerRepository(CRUDBase[Customer, CustomerCreate]):
    def __init__(self, session: AsyncSession):
        super().__init__(Customer, session)

    async def get_by_email(self, email: str) -> Customer | None:
        result = await self.session.execute(
            select(Customer).where(Customer.email == email)
        )
        return result.scalar_one_or_none()
