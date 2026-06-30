import os

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://app:app@localhost:5433/app",
)
