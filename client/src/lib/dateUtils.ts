/** Normalise any stored date string to [year, month, day] numbers.
 *  Handles YYYY-MM-DD (date input) and legacy MM/DD/YYYY strings. */
export function parseDateParts(dateStr: string): [number, number, number] | null {
  if (!dateStr) return null
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number)
    if (isNaN(y) || !m || !d) return null
    return [y, m, d]
  }
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/').map(Number)
    if (parts.length === 3) {
      const [m, d, y] = parts
      if (!y || !m || !d) return null
      return [y, m, d]
    }
  }
  return null
}

/** Days until the next occurrence of this date (0 = today). */
export function daysUntil(dateStr: string): number {
  const parts = parseDateParts(dateStr)
  if (!parts) return 999
  const [, m, d] = parts
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const next = new Date(today.getFullYear(), m - 1, d)
  if (next.getTime() < today.getTime()) next.setFullYear(today.getFullYear() + 1)
  return Math.round((next.getTime() - today.getTime()) / 86_400_000)
}

/** Format a date string as "Month Day" (e.g. "June 15"). */
export function formatBirthday(dateStr: string): string {
  const parts = parseDateParts(dateStr)
  if (!parts) return dateStr
  const [, m, d] = parts
  return new Date(2000, m - 1, d).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

/** Human-readable label for a day count. */
export function daysLabel(days: number): string {
  if (days === 0) return 'Today!'
  if (days === 1) return 'Tomorrow'
  if (days < 7)  return `In ${days} days`
  if (days < 14) return 'Next week'
  if (days < 30) return `In ${Math.round(days / 7)} weeks`
  if (days < 60) return 'Next month'
  return `In ${Math.ceil(days / 30)} months`
}

/** Age a person is turning on their next occurrence of this date, or null if year is not meaningful. */
export function ageFromDate(dateStr: string): number | null {
  const parts = parseDateParts(dateStr)
  if (!parts) return null
  const [y, m, d] = parts
  if (y < 1900) return null
  const today = new Date()
  const passedThisYear =
    today.getMonth() + 1 > m ||
    (today.getMonth() + 1 === m && today.getDate() > d)
  const nextYear = passedThisYear ? today.getFullYear() + 1 : today.getFullYear()
  const age = nextYear - y
  return age > 0 ? age : null
}
