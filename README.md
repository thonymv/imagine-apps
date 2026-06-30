# Prueba Técnica — Imagine Apps

Customer + ticket management app. FastAPI + React + PostgreSQL + MongoDB.

## Stack

- **Backend** — Python 3.12, FastAPI, SQLAlchemy 2.0 (async), asyncpg, Pydantic v2, motor (MongoDB).
- **Frontend** — React 19, Vite, TypeScript, ESLint.
- **Datastores** — PostgreSQL 16 (relational) and MongoDB 7 (audit log).
- **Tooling** — pnpm (Node), uv (Python), Docker Compose, GitHub Actions.

## Layout

```
.
├── apps/
│   ├── api/                 # FastAPI
│   │   └── app/
│   │       ├── core/        # settings
│   │       ├── db/          # SQLAlchemy + Mongo clients
│   │       ├── models/      # ORM models
│   │       ├── schemas/     # Pydantic schemas
│   │       ├── repositories/  # data access (CRUDBase + concrete)
│   │       ├── services/    # business rules (DIP-friendly)
│   │       ├── controllers/ # FastAPI routers
│   │       └── tests/       # unit + integration
│   └── web/                 # Vite + React 19 + TS
│       └── src/
│           ├── api/         # typed fetch client
│           ├── hooks/       # useCustomers, useTickets
│           └── features/    # customers/ and tickets/ UI
├── .github/workflows/ci.yml # backend + frontend CI
├── docker-compose.yml       # full stack
├── docker-compose.dev.yml   # dev override (bind mounts, fastapi dev)
└── pyproject.toml           # uv workspace root
```

## Quick start

### Full stack with Docker

```bash
docker compose up --build
```

Then open:
- Web: <http://localhost:5173>
- API: <http://localhost:8000/docs>

### Local development (no Docker)

```bash
pnpm install
uv sync
pnpm dev
```

This runs API on `:8000` and web on `:5173` with HMR. The API reads
`DATABASE_URL` and `MONGO_URL` from `.env` at the repo root (defaults
to `localhost:5432` for Postgres and `localhost:27017` for Mongo).
Override them if you point at the docker services.

## Tests

```bash
# backend: unit + integration (requires reachable Postgres)
unset VIRTUAL_ENV
uv run --package api pytest apps/api/app/tests

# frontend: lint + type-check + build
pnpm -F web lint
pnpm -F web build
```

Integration tests default to `localhost:5433` (the docker `db` port
mapped in `docker-compose.yml`). The test suite skips cleanly if the
DB is unreachable.

## API

Base URL `http://localhost:8000/api/v1`.

| Method | Path                            | Description                       |
|--------|---------------------------------|-----------------------------------|
| POST   | `/customers`                    | Create a customer                 |
| GET    | `/customers`                    | List all customers                |
| GET    | `/customers/{id}`               | Get a customer by id              |
| POST   | `/tickets`                      | Create a ticket for a customer    |
| GET    | `/tickets`                      | List all tickets                  |
| PATCH  | `/tickets/{id}/status`          | Change ticket status              |

Status values: `pendiente` (Pendiente), `en_progreso` (En progreso),
`finalizado` (Finalizado).

## Architecture decisions

- **SRP / DIP** — controllers (HTTP) → services (rules) → repositories (DB).
  Services depend on repository abstractions, not on `AsyncSession`.
- **Transactions** — `get_db` commits on success and rolls back on
  exception, so `repository.flush()` is the only place that talks to
  the session during a request.
- **Audit log** — `TicketService` emits `ticket.created` and
  `ticket.status_changed` events to MongoDB. Best-effort: if Mongo
  is down, the API still serves the user.
- **Schema migrations** — `Base.metadata.create_all` on startup is
  fine for a 4h technical test; swap for Alembic before production.

## CI

`.github/workflows/ci.yml` runs on push to `main` and on pull requests:

- **backend** — `uv sync`, `ruff check`, `pytest` (with postgres and
  mongo service containers so integration tests run).
- **frontend** — `pnpm install --frozen-lockfile`, `lint`, `build`.

## Salesforce integration

See `salesforce.md` for a one-page proposal covering object mapping,
an Apex trigger and LWC sketch, and Experience Cloud exposure.
