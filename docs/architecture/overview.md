# Architecture Overview — Todo App

## Scope and shape

Shape: fullstack. Product ships one Next.js UI, one Go API, and one PostgreSQL database. Tasks persist across reloads. No auth, no external services.

## Stack

- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS v3, ESLint.
- Backend: Go 1.22 HTTP API.
- Database: PostgreSQL 16.
- Runtime: repository-root `docker compose --profile local up --build` for local DB + API + UI. Deployment injects `DATABASE_URL` and omits local Postgres profile.

## Repository layout

```text
code/
  backend/
    cmd/api/main.go              # one Go main package and HTTP entrypoint
    internal/migrations/         # embedded SQL migration runner
    migrations/                  # timestamped .up.sql/.down.sql files
    .env.example                 # backend runtime keys
  frontend/
    app/                         # Next.js App Router routes
    app/globals.css              # shared design tokens and reusable classes
    .env.example                 # public browser config
```

## Component boundaries and data flow

Browser renders one page from `code/frontend/app/page.tsx`. Client-side todo components added by later stories call backend over `NEXT_PUBLIC_API_URL`. Backend owns validation at API boundary, applies migrations on boot, and stores todo rows in PostgreSQL. Frontend may optimistically show pending UI only when it can roll back on failure.

## Backend conventions

- Exactly one `main` package: `code/backend/cmd/api`.
- Read `DATABASE_URL`; fail fast if missing.
- Listen on `PORT`, then `APP_PORT`, then `8080`.
- Apply every pending migration before serving requests.
- `/healthz` returns 200 only after migrations succeeded and `SELECT 1` succeeds.
- Use `context.Context` with timeouts for database operations.
- Use parameterized SQL only.
- Return generic client errors; log internal details server-side.

## Frontend conventions

- `app/page.tsx` stays Server Component unless it needs browser APIs.
- Any component using `useState`, `useEffect`, event handlers, or browser APIs must start with literal first line `"use client"`.
- React component files use `export default function ComponentName()`.
- Shared tokens and reusable classes live in `app/globals.css`; story code should avoid editing it.
- User-facing copy is English.
- Controls use native form, button, and input elements with visible focus and accessible names.

## Environment variables

Root `.env.example` keys for compose:

- `POSTGRES_USER` — local Postgres user.
- `POSTGRES_PASSWORD` — local Postgres password; example only.
- `POSTGRES_DB` — local Postgres database.
- `BACKEND_PORT` — host port mapped to backend.
- `FRONTEND_PORT` — host port mapped to frontend.
- `NEXT_PUBLIC_API_URL` — browser-visible API base URL.

Backend `code/backend/.env.example`:

- `DATABASE_URL` — PostgreSQL connection URL injected by runtime.
- `PORT` — HTTP listen port.
- `APP_PORT` — fallback HTTP listen port.

Frontend `code/frontend/.env.example`:

- `NEXT_PUBLIC_API_URL` — API base URL used by browser code.

## Run and verify

```bash
docker compose --profile local up --build
```

Frontend: http://localhost:3000. Backend health: http://localhost:8080/healthz.

Local checks:

```bash
cd code/backend && go build ./... && go vet ./... && go test ./...
cd code/frontend && npm ci && npm run lint && npm run build && npm test --if-present
docker compose config -q
```

CI runs these checks in `.github/workflows/ci.yml` on pull requests and pushes to main. Container build and boot remain in `.github/workflows/container.yml`.

## Decisions and rejected alternatives

1. Use Go API with PostgreSQL.
   - Chosen because persistence is required and existing project shape is fullstack.
   - Rejected frontend-only local storage because tasks must survive reloads via database, not per-browser storage.
   - Rejected separate DB credentials because runtime injects one `DATABASE_URL`; split keys add config drift.

2. Self-apply SQL migrations at backend boot.
   - Chosen because runtime creates empty database and no separate migrator runs.
   - Rejected manual migration step because `docker compose up` must boot working stack.
   - Tradeoff: boot fails on bad migration; that is safer than serving broken API.

3. Next.js App Router with Tailwind tokens in global CSS.
   - Chosen because project needs one accessible page and design tokens are already approved.
   - Rejected component library because scope is small and native controls cover requirements.
   - Tradeoff: story authors must reuse tokens instead of adding theme abstractions.

4. Keep auth out.
   - Chosen because SRS says no sign-in and no roles.
   - Rejected per-user ownership columns for now because they imply auth not in scope.
   - Tradeoff: future auth requires requirement update and schema extension.

## Risks and unknowns

- Todo table and API contract are intentionally deferred to ERD and service design tasks.
- If auth is added later, data ownership and permission checks must be redesigned.
- Large-list target is 100 tasks; pagination skipped until requirements exceed that ceiling.
