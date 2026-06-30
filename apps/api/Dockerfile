FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/app/.venv

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock .python-version ./
COPY apps/api/ ./apps/api/

RUN uv sync --frozen --no-dev --package api

WORKDIR /app/apps/api

EXPOSE 8000

CMD ["uv", "run", "--package", "api", "fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
