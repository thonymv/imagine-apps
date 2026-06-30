from fastapi import HTTPException, status

from app.models.customer import Customer
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate


class CustomerService:
    def __init__(self, repo: CustomerRepository):
        self.repo = repo

    async def list(self) -> list[Customer]:
        return await self.repo.list_all()

    async def get(self, customer_id: int) -> Customer:
        customer = await self.repo.get(customer_id)
        if customer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )
        return customer

    async def create(self, data: CustomerCreate) -> Customer:
        existing = await self.repo.get_by_email(data.email)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        return await self.repo.create(data)
