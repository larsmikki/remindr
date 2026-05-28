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

> Tests run with Vitest. `npm test` runs both client and server suites.

## Architecture

Remindr is a monorepo with a React client and an Express API server.

```
client/      React 19 + Vite + Tailwind CSS 4
server/      Express on Node.js, TypeScript via tsx
data/        reminders.json — the only persistent store
```

**Ports:** Client dev server → 3080. API server → 3081. Vite proxies `/api/*` to 3081 in dev.

**No database.** All state is stored in `data/reminders.json` (configurable via `REMINDERS_FILE` env var). The storage layer (`server/src/db/storage.ts`) keeps an in-memory cache and writes through to disk on every mutation, serialised via an async write queue.

### Data Model

```typescript
// server/src/types.ts  (source of truth)
interface Reminder {
  id: string
  name: string
  date: string       // ISO format YYYY-MM-DD
  icon?: string
  createdAt: number  // unix ms
  tags: string[]     // tag names stored inline on the reminder
}
```

Tags are **string arrays on Reminder** — there is no separate Tag entity in storage. The client's `Tag` type in `client/src/types.ts` is a UI representation derived from reminder data.

### Client State

Two React contexts manage global state:

- `RemindersContext` / `RemindersProvider` — fetches/caches reminders from the API, exposes CRUD operations with optimistic UI, and owns the demo-mode toggle. All API calls are centralised in `client/src/api.ts`.
- `ThemeContext` / `ThemeProvider` — 10+ built-in themes persisted to `localStorage`. CSS variables are applied to `document.documentElement`.

### API Routes (server/src/routes/reminders.ts)

```
GET    /api/reminders
POST   /api/reminders                 { name, date, icon?, tags? }
GET    /api/reminders/:id
PUT    /api/reminders/:id             { name, date, icon?, tags? }
DELETE /api/reminders/:id

POST   /api/reminders/:id/tags        { tag }
PUT    /api/reminders/:id/tags        { tags: string[] }
DELETE /api/reminders/:id/tags/:tagId

GET    /api/tags                      → []  (tags are inline; no collection)

GET    /api/health
```

Static files from `dist-client/` are served by the API server in production.

## Design System

- Accent color: `#f59e0b` (amber-500) — see `C:\java\shared\design-system\` for the canonical fleet spec
- Gradient: `linear-gradient(135deg, #fbbf24 0%, #d97706 100%)`
- Icon: layered heart — white on amber gradient
- Theme system: CSS variables on `:root`, dark mode via `[data-theme]` attribute
