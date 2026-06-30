# AGENTS.md

## What this is

Technical test monorepo: customer + ticket management app (FastAPI + React + Postgres).
Full spec lives at `tasks/PRUEBA-TECNICA.md` — read it before designing anything. Budget: 4 hours, not a production system.

## Two parallel workspaces (not nested)

The repo has **two independent workspace systems** that share the same `apps/` tree:

| System | Manifest | Members |
|---|---|---|
| pnpm (Node) | `pnpm-workspace.yaml` | `apps/*`, `packages/*` |
| uv (Python) | root `pyproject.toml` → `[tool.uv.workspace]` | `apps/api` |

`apps/api/` is a pnpm member by glob but has no `package.json`, so pnpm skips it. uv is the one that manages it. They don't conflict.

## Layout

```
.
├── apps/
│   ├── api/                        # FastAPI — flat layout (not src/api/)
│   │   ├── app/                    # the actual Python package
│   │   │   ├── __init__.py
│   │   │   └── main.py             # app = FastAPI()
│   │   └── pyproject.toml
│   └── web/                        # Vite + React 19 + TS (default template still in place)
├── src/prueba_tecnica_imagine_apps/   # empty Python package — uv workspace anchor only
├── package.json                    # pnpm root + dev orchestrator scripts
├── pyproject.toml                  # uv root + [tool.fastapi] entrypoint
└── tasks/PRUEBA-TECNICA.md         # the spec
```

## Commands

```bash
pnpm install && uv sync        # one-time setup
pnpm dev                       # api (8000) + web (5173) in parallel via concurrently
pnpm dev:api                   # backend only
pnpm dev:web                   # frontend only
uv run --package api fastapi dev       # backend, alternative
pnpm -F web dev                # frontend, alternative
```

Backend auto-reloads via FastAPI CLI. Frontend HMR via Vite. Both start from repo root — no `cd` required.

## Gotchas that will trip you up

- **`apps/api/app/` is a flat layout forced by build config.** `apps/api/pyproject.toml` has `[tool.uv.build-backend] module-name = "app"` and `module-root = ""` because `uv_build` defaults to expecting `src/<project-name>/__init__.py`. Without this override, every `uv sync` fails with "Expected a Python module at: src/api/__init__.py". Don't move code to `src/api/`.

- **FastAPI entrypoint is defined in TWO `pyproject.toml` files** — root and `apps/api/`. Both are correct. The CLI walks up from cwd and uses the first match, so having both lets `uv run --package api fastapi dev` work from root AND `cd apps/api && uv run fastapi dev` work from the package. Don't remove either.

- **`src/prueba_tecnica_imagine_apps/` is the uv workspace anchor, not application code.** It's an empty package. Don't add business logic there — Python code goes in `apps/api/app/`.

- **Vite port fallback**: 5173/5174 stay occupied by zombie Vite processes between runs. Vite silently moves to 5175+. Free them with `pkill -9 -f vite` (also `pkill -9 -f uvicorn` for the api).

- **CORS is not configured.** Browser blocks `:5173` → `:8000` calls until you add `CORSMiddleware` with `allow_origins=["http://localhost:5173"]` in `apps/api/app/main.py`.

- **`apps/web/src/App.tsx` is still the Vite default** (counter, logos). Replace it; don't extend it.

- **`uv run` warning about `VIRTUAL_ENV`**: if you have a stale `VIRTUAL_ENV` env var pointing elsewhere, uv warns and ignores it. Harmless but noisy. Fix with `unset VIRTUAL_ENV` if it bothers you.

## Spec-driven constraints (from PRUEBA-TECNICA.md)

- Backend layout: `controllers/ services/ repositories/ models/ schemas/` under `apps/api/app/`. Apply SRP/DIP.
- DB: PostgreSQL required; MongoDB optional for audit events.
- Tests: ≥2 unit + ≥1 integration. Tool: pytest.
- Commits: **conventional commits, multiple** — single-commit delivery is rejected.
- CI: GitHub Actions. At minimum: install + lint + test. No deploy required.
- Container: `docker-compose.yml` at repo root. `docker compose up` must run api + web + db.
- Optional: `salesforce.md` (one-page proposal, no code).

## What's done vs. not done

Done: monorepo structure, pnpm + uv workspaces, FastAPI + Vite scaffolds, dev orchestrator (`pnpm dev`), `uv run --package api fastapi dev` working, `.gitignore` for both ecosystems.

Not done: DB layer (no SQLAlchemy/SQLModel yet), models/schemas, controllers/services/repositories, tests, CORS, real frontend UI, Docker, GitHub Actions, README content, `salesforce.md`.
