import type { Reminder } from '@/types'

const BASE = '/api'

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts?.headers },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getReminders: () => fetchJson<Reminder[]>('/reminders'),
  createReminder: (r: { name: string; date: string; icon?: string }) =>
    fetchJson<Reminder>('/reminders', { method: 'POST', body: JSON.stringify(r) }),
  updateReminder: (id: string, r: { name: string; date: string; icon?: string }) =>
    fetchJson<Reminder>(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(r) }),
  deleteReminder: (id: string) => fetch(`${BASE}/reminders/${id}`, { method: 'DELETE' }),
}
