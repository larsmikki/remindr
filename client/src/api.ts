import type { Reminder } from '@/types'

const BASE = '/api'
type ReminderInput = Omit<Reminder, 'id' | 'createdAt' | 'tags'> & { tags?: string[] }

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts?.headers },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  getReminders: () => fetchJson<Reminder[]>('/reminders'),
  createReminder: (r: ReminderInput) =>
    fetchJson<Reminder>('/reminders', { method: 'POST', body: JSON.stringify(r) }),
  updateReminder: (id: string, r: ReminderInput) =>
    fetchJson<Reminder>(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(r) }),
  deleteReminder: async (id: string) => {
    const res = await fetch(`${BASE}/reminders/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
  },
  addTag: (reminderId: string, tag: string) =>
    fetchJson<void>(`/reminders/${reminderId}/tags`, { method: 'POST', body: JSON.stringify({ tag }) }),
  updateTags: (reminderId: string, tags: string[]) =>
    fetchJson<void>(`/reminders/${reminderId}/tags`, { method: 'PUT', body: JSON.stringify({ tags }) }),
  deleteTag: (reminderId: string, tagId: string) =>
    fetchJson<void>(`/reminders/${reminderId}/tags/${encodeURIComponent(tagId)}`, { method: 'DELETE' }),
}
