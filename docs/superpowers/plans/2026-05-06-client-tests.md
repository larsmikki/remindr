# Client Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add vitest tests for `client/src/lib/dateUtils.ts` and `client/src/api.ts` so `npm test` passes across the monorepo.

**Architecture:** Two new test files alongside existing source. `dateUtils.test.ts` uses `vi.setSystemTime` to pin the current date. `api.test.ts` stubs `fetch` globally via `vi.stubGlobal`. No new dependencies — vitest is already installed and inherits the `@` path alias from `vite.config.ts`.

**Tech Stack:** vitest 4.x, TypeScript, `vi.setSystemTime`, `vi.stubGlobal`

---

### Task 1: `dateUtils` tests

**Files:**
- Create: `client/src/lib/dateUtils.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest'
import { parseDateParts, daysUntil, formatBirthday, daysLabel, ageFromDate } from './dateUtils'

afterEach(() => vi.useRealTimers())

// ── parseDateParts ────────────────────────────────────────────────────────────

describe('parseDateParts', () => {
  it('parses YYYY-MM-DD', () => {
    expect(parseDateParts('1990-06-15')).toEqual([1990, 6, 15])
  })

  it('parses legacy MM/DD/YYYY', () => {
    expect(parseDateParts('6/15/1990')).toEqual([1990, 6, 15])
  })

  it('returns null for empty string', () => {
    expect(parseDateParts('')).toBeNull()
  })

  it('returns null for garbage input', () => {
    expect(parseDateParts('not-a-date')).toBeNull()
  })
})

// ── daysUntil ─────────────────────────────────────────────────────────────────

describe('daysUntil', () => {
  // Pin to 2026-05-06
  beforeEach(() => vi.useFakeTimers({ now: new Date(2026, 4, 6) }))

  it('returns 0 for today', () => {
    expect(daysUntil('2026-05-06')).toBe(0)
  })

  it('returns 1 for tomorrow', () => {
    expect(daysUntil('2026-05-07')).toBe(1)
  })

  it('wraps yesterday to next year (364 days)', () => {
    expect(daysUntil('2026-05-05')).toBe(364)
  })

  it('returns 999 for invalid input', () => {
    expect(daysUntil('not-a-date')).toBe(999)
  })
})

// ── formatBirthday ────────────────────────────────────────────────────────────

describe('formatBirthday', () => {
  it('formats ISO date as "Month Day"', () => {
    expect(formatBirthday('1990-06-15')).toBe('June 15')
  })

  it('formats legacy slash date as "Month Day"', () => {
    expect(formatBirthday('6/15/1990')).toBe('June 15')
  })

  it('returns original string for invalid input', () => {
    expect(formatBirthday('not-a-date')).toBe('not-a-date')
  })
})

// ── daysLabel ─────────────────────────────────────────────────────────────────

describe('daysLabel', () => {
  it('0 → Today!', () => expect(daysLabel(0)).toBe('Today!'))
  it('1 → Tomorrow', () => expect(daysLabel(1)).toBe('Tomorrow'))
  it('3 → In 3 days', () => expect(daysLabel(3)).toBe('In 3 days'))
  it('7 → Next week', () => expect(daysLabel(7)).toBe('Next week'))
  it('14 → In 2 weeks', () => expect(daysLabel(14)).toBe('In 2 weeks'))
  it('30 → Next month', () => expect(daysLabel(30)).toBe('Next month'))
  it('60 → In 2 months', () => expect(daysLabel(60)).toBe('In 2 months'))
})

// ── ageFromDate ───────────────────────────────────────────────────────────────

describe('ageFromDate', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date(2026, 4, 6) })) // 2026-05-06

  it('returns age for upcoming birthday this year', () => {
    // June 15 hasn't happened yet → turning 36 in 2026
    expect(ageFromDate('1990-06-15')).toBe(36)
  })

  it('returns next age for already-passed birthday this year', () => {
    // March 20 already passed → turning 37 in 2027
    expect(ageFromDate('1990-03-20')).toBe(37)
  })

  it('returns this year age when birthday is today', () => {
    // May 6 = today → turning 36 today (not "already passed" since > not >=)
    expect(ageFromDate('1990-05-06')).toBe(36)
  })

  it('returns null for year before 1900', () => {
    expect(ageFromDate('1800-01-01')).toBeNull()
  })

  it('returns null for invalid date', () => {
    expect(ageFromDate('not-a-date')).toBeNull()
  })
})
```

- [ ] **Step 2: Add missing `beforeEach` import**

The file above uses `beforeEach` in two describe blocks. Add it to the import line:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
```

(Replace the import line at the top of the file.)

- [ ] **Step 3: Run the tests**

```
cd C:\java\remindy
npm run test -w server -- --run 2>nul & npm run test -w client -- --run
```

Or just the client:
```
cd C:\java\remindy\client && npx vitest run src/lib/dateUtils.test.ts
```

Expected: all `parseDateParts`, `formatBirthday`, `daysLabel`, `ageFromDate`, `daysUntil` tests pass.

- [ ] **Step 4: Commit**

```
git add client/src/lib/dateUtils.test.ts
git commit -m "test(client): add dateUtils unit tests"
```

---

### Task 2: `api` tests

**Files:**
- Create: `client/src/api.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from './api'

function mockOk(data: unknown) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) })
}

function mockError(status: number) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve(null) })
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api.getReminders', () => {
  it('calls GET /api/reminders and returns parsed array', async () => {
    const reminders = [{ id: '1', name: 'Alice', date: '1990-06-15', createdAt: 0, tags: [] }]
    vi.mocked(fetch).mockReturnValueOnce(mockOk(reminders) as any)

    const result = await api.getReminders()

    expect(fetch).toHaveBeenCalledWith('/api/reminders', expect.objectContaining({
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }))
    expect(result).toEqual(reminders)
  })
})

describe('api.createReminder', () => {
  it('calls POST /api/reminders with JSON body', async () => {
    const created = { id: '2', name: 'Bob', date: '1985-03-20', createdAt: 0, tags: [] }
    vi.mocked(fetch).mockReturnValueOnce(mockOk(created) as any)

    const result = await api.createReminder({ name: 'Bob', date: '1985-03-20' })

    expect(fetch).toHaveBeenCalledWith('/api/reminders', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'Bob', date: '1985-03-20' }),
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }))
    expect(result).toEqual(created)
  })
})

describe('api.updateReminder', () => {
  it('calls PUT /api/reminders/:id with JSON body', async () => {
    const updated = { id: '3', name: 'Charlie', date: '2000-01-01', createdAt: 0, tags: [] }
    vi.mocked(fetch).mockReturnValueOnce(mockOk(updated) as any)

    const result = await api.updateReminder('3', { name: 'Charlie', date: '2000-01-01' })

    expect(fetch).toHaveBeenCalledWith('/api/reminders/3', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ name: 'Charlie', date: '2000-01-01' }),
    }))
    expect(result).toEqual(updated)
  })
})

describe('api.deleteReminder', () => {
  it('calls DELETE /api/reminders/:id', async () => {
    vi.mocked(fetch).mockReturnValueOnce(Promise.resolve({ ok: true, status: 204 }) as any)

    await api.deleteReminder('4')

    expect(fetch).toHaveBeenCalledWith('/api/reminders/4', { method: 'DELETE' })
  })
})

describe('error handling', () => {
  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockReturnValueOnce(mockError(404) as any)

    await expect(api.getReminders()).rejects.toThrow('API error: 404')
  })
})
```

- [ ] **Step 2: Run the tests**

```
cd C:\java\remindy\client && npx vitest run src/api.test.ts
```

Expected: all 5 tests pass.

- [ ] **Step 3: Commit**

```
git add client/src/api.test.ts
git commit -m "test(client): add api layer tests"
```

---

### Task 3: Verify full monorepo test run passes

- [ ] **Step 1: Run all tests from root**

```
cd C:\java\remindy && npm test
```

Expected output:
```
> remindy-server@1.0.0 test
> vitest run
 Test Files  1 passed (1)
      Tests  14 passed (14)

> remindy-client@1.0.0 test
> vitest run
 Test Files  2 passed (2)
      Tests  ~19 passed
```

Both workspaces exit 0. No failures.
