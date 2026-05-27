import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
  beforeEach(() => vi.useFakeTimers({ now: new Date(2026, 4, 6) }))

  it('returns age for upcoming birthday this year', () => {
    // June 15 not yet reached → turning 36 in 2026
    expect(ageFromDate('1990-06-15')).toBe(36)
  })

  it('returns next age for already-passed birthday this year', () => {
    // March 20 already passed → turning 37 in 2027
    expect(ageFromDate('1990-03-20')).toBe(37)
  })

  it('returns this year age when birthday is today', () => {
    // today.getDate() > d is false when equal, so not "passed"
    expect(ageFromDate('1990-05-06')).toBe(36)
  })

  it('returns null for year before 1900', () => {
    expect(ageFromDate('1800-01-01')).toBeNull()
  })

  it('returns null for invalid date', () => {
    expect(ageFromDate('not-a-date')).toBeNull()
  })
})
