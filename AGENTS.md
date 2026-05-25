# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (run from root)
npm install

# Development — must run BOTH concurrently in separate terminals:
npm run dev      # Vite dev server on port 3080 (client only)
npm run server   # Node API server on port 3081 (tsx watch)

# Production build
npm run build          # builds client → dist-client/, server → dist-server/
npm run build:client   # vite build only
npm run build:server   # tsc -b server only

# Lint
npm run lint

# Docker (production)
docker-compose up -d
```

> There is no test suite. No test runner is configured.

## Architecture

Remindy is a monorepo with a React client and a Node.js HTTP API server. There is no framework on the server side — it uses Node's built-in `http.createServer` with manual routing.

```
client/      React 19 + Vite + Tailwind CSS 4
server/      Node.js HTTP server, TypeScript via tsx
data/        birthdays.json — the only persistent store
```

**Ports:** Client dev server → 3080. API server → 3081. Vite proxies `/api/*` to 3081 in dev.

**No database.** All state is stored in `data/birthdays.json` (configurable via `BIRTHDAYS_FILE` env var). The storage layer (`server/src/db/storage.ts`) keeps an in-memory cache and writes through to disk on every mutation.

### Data Model

```typescript
// server/src/types.ts  (source of truth)
interface Birthday {
  id: string
  name: string
  date: string       // ISO format YYYY-MM-DD
  createdAt: number  // unix ms
  groups: string[]   // group names stored directly on birthday
}
```

Groups are **string arrays on Birthday** — there is no separate Group entity in storage. The client's `Group` type in `client/src/types.ts` is a UI representation derived from birthday data.

### Client State

Two React contexts manage global state:

- `BirthdaysContext` — fetches/caches birthdays and groups from API, exposes CRUD operations with optimistic UI. All API calls are centralised here via `client/src/api.ts`.
- `ThemeContext` — 10 built-in themes persisted to `localStorage`. CSS variables are applied to `document.documentElement`.

### API Routes (server/src/index.ts)

```
GET    /api/birthdays
POST   /api/birthdays        { name, date, groups? }
PUT    /api/birthdays/:id    { name, date, groups? }
DELETE /api/birthdays/:id

GET    /api/groups
POST   /api/groups           { name, birthdayId }
DELETE /api/groups/:id

GET    /api/health
```

Static files from `dist-client/` are served by the API server in production.

## Design System

- Accent color: `#f97316` (orange-500)
- Gradient: `linear-gradient(135deg, #fb923c 0%, #ea580c 100%)`
- Icon: birthday cake (cake base + candle + flame) — white on orange gradient, rx=8
- Theme system mirrors Promptly — CSS variables on `:root`, dark mode via `[data-theme]` attribute
- Reference design guide at `c:\java\design-guide.md` for spacing/component patterns
