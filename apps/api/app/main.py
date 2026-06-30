from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401  # ensure ORM models are registered with Base.metadata
from app.controllers import customers as customers_controller
from app.controllers import tickets as tickets_controller
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
        "http://localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers_controller.router, prefix="/api/v1")
app.include_router(tickets_controller.router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello from FastAPI"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
