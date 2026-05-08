# Client Test Suite Design

**Date:** 2026-05-06
**Scope:** Utility functions + API layer (no React component tests)
**New dependencies:** None — vitest already installed in client workspace

## Problem

`npm test` fails because the client workspace runs `vitest run` but has no test files, causing vitest to exit with code 1.

## Approach

Use vitest built-ins only:
- `vi.setSystemTime()` to pin the current date for time-sensitive functions
- `vi.stubGlobal('fetch', vi.fn())` to mock the global fetch for API tests

## Files to Create

### `client/src/lib/dateUtils.test.ts`

Tests for all five exported functions in `dateUtils.ts`.

**`parseDateParts`**
- YYYY-MM-DD format parses correctly → `[year, month, day]`
- Legacy MM/DD/YYYY format parses correctly
- Empty string → `null`
- Garbage string → `null`

**`daysUntil`** *(pins date via `vi.setSystemTime`)*
- Date matching today → `0`
- Date matching tomorrow → `1`
- Date matching yesterday → wraps to next year (364 or 365 days)
- Invalid date string → `999`

**`formatBirthday`**
- ISO date `'1990-06-15'` → `'June 15'`
- Legacy slash date `'6/15/1990'` → `'June 15'`
- Invalid string → returns original string unchanged

**`daysLabel`** *(pure mapping, no mocking)*
- `0` → `'Today!'`
- `1` → `'Tomorrow'`
- `3` → `'In 3 days'`
- `7` → `'Next week'`
- `14` → `'In 2 weeks'`
- `30` → `'Next month'`
- `60` → `'In 2 months'`

**`ageFromDate`** *(pins date via `vi.setSystemTime`)*
- Year < 1900 → `null`
- Birthday already passed this year → next year's age
- Birthday not yet reached this year → this year's age

### `client/src/api.test.ts`

Tests for all four functions in `api.ts`. Uses `vi.stubGlobal('fetch', vi.fn())` in `beforeEach`, restored in `afterEach`.

**`getReminders`**
- Calls `GET /api/reminders`
- Returns parsed JSON array

**`createReminder`**
- Calls `POST /api/reminders`
- Body is JSON-stringified reminder
- Sets `Content-Type: application/json` header

**`updateReminder`**
- Calls `PUT /api/reminders/:id` with correct id
- Body is JSON-stringified updates

**`deleteReminder`**
- Calls `DELETE /api/reminders/:id`
- Uses raw `fetch` (no JSON parsing)

**Error handling**
- Non-ok response (e.g. 404) throws `Error("API error: 404")`

## Out of Scope

- React component tests (would require `@testing-library/react` + jsdom)
- `dateIcons.ts` (static data array, nothing to test)
- `demoData.ts` (static data, nothing to test)
