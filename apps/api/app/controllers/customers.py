from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate, CustomerRead
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["customers"])


def _service(session: AsyncSession = Depends(get_db)) -> CustomerService:
    return CustomerService(CustomerRepository(session))


@router.post(
    "", response_model=CustomerRead, status_code=status.HTTP_201_CREATED
)
async def create_customer(
    payload: CustomerCreate, service: CustomerService = Depends(_service)
) -> CustomerRead:
    customer = await service.create(payload)
    return CustomerRead.model_validate(customer)


@router.get("", response_model=list[CustomerRead])
async def list_customers(
    service: CustomerService = Depends(_service),
) -> list[CustomerRead]:
    customers = await service.list()
    return [CustomerRead.model_validate(c) for c in customers]


@router.get("/{customer_id}", response_model=CustomerRead)
async def get_customer(
    customer_id: int, service: CustomerService = Depends(_service)
) -> CustomerRead:
    customer = await service.get(customer_id)
    return CustomerRead.model_validate(customer)
