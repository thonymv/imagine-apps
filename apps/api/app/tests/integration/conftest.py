import socket
from urllib.parse import urlparse

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app


def _check_db_reachable() -> None:
    parsed = urlparse(
        settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    )
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432
    try:
        with socket.create_connection((host, port), timeout=2):
            return
    except (OSError, socket.timeout) as exc:
        pytest.skip(
            f"Integration tests skipped: DB not reachable at {host}:{port} ({exc})"
        )


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def test_engine() -> AsyncEngine:
    _check_db_reachable()
    eng = create_async_engine(settings.DATABASE_URL, echo=False)
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield eng
    await eng.dispose()


@pytest_asyncio.fixture(autouse=True, loop_scope="session")
async def _clean_tables(test_engine: AsyncEngine):
    async with test_engine.begin() as conn:
        await conn.execute(text("DELETE FROM tickets"))
        await conn.execute(text("DELETE FROM customers"))
    yield


@pytest_asyncio.fixture(loop_scope="session")
async def client(test_engine: AsyncEngine):
    session_factory = async_sessionmaker(test_engine, expire_on_commit=False)

    async def _override_get_db():
        async with session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_db] = _override_get_db
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
