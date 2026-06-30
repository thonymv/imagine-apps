from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.ticket import TicketStatus


class TicketCreate(BaseModel):
    customer_id: int
    title: str
    description: str
    status: TicketStatus = TicketStatus.pendiente


class TicketRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    title: str
    description: str
    status: TicketStatus
    created_at: datetime
    updated_at: datetime


class TicketStatusUpdate(BaseModel):
    status: TicketStatus
