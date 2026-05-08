import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Reminder, Tag } from '@/types'
import { getDemoReminders } from '@/lib/demoData'

const DEMO_MODE_KEY = 'remindy-demo-mode'

interface RemindersContextType {
  reminders: Reminder[]
  tags: Tag[]
  loading: boolean
  isDemoMode: boolean
  setDemoMode: (enabled: boolean) => void
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<void>
  updateReminder: (id: string, reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  addTag: (reminderId: string, tag: string) => Promise<void>
  updateTags: (reminderId: string, tags: string[]) => Promise<void>
  deleteTag: (reminderId: string, tagId: string) => Promise<void>
  getTags: (reminderId: string) => string[]
  refresh: () => void
}

const RemindersContext = createContext<RemindersContextType>({
  reminders: [],
  tags: [],
  loading: true,
  isDemoMode: false,
  setDemoMode: () => {},
  addReminder: async () => {},
  updateReminder: async () => {},
  deleteReminder: async () => {},
  addTag: async () => {},
  updateTags: async () => {},
  deleteTag: async () => {},
  getTags: () => [],
  refresh: () => {},
})

let retryTimer: ReturnType<typeof setTimeout> | null = null

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [tags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoModeState] = useState(
    () => localStorage.getItem(DEMO_MODE_KEY) === 'true'
  )

  const setDemoMode = (enabled: boolean) => {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled))
    setIsDemoModeState(enabled)
  }

  const refresh = async () => {
    if (isDemoMode) {
      setReminders(getDemoReminders())
      setLoading(false)
      return
    }
    setLoading(true)
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = null
    }
    try {
      const res = await fetch('/api/reminders')
      if (res.ok) {
        const data: Reminder[] = await res.json()
        setReminders(data)
      }
    } catch (err) {
      console.error('Failed to load reminders:', err)
    } finally {
      setLoading(false)
    }
  }

  const addReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    if (isDemoMode) {
      const newReminder: Reminder = { ...reminder, id: `demo-${Date.now()}`, createdAt: Date.now() }
      setReminders(prev => [newReminder, ...prev])
      return
    }
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      })
      if (res.ok) {
        const newReminder: Reminder = await res.json()
        setReminders(prev => [newReminder, ...prev])
        if (retryTimer) clearTimeout(retryTimer)
        retryTimer = setTimeout(() => refresh(), 5000)
      }
    } catch (err) {
      console.error('Failed to add reminder:', err)
    }
  }

  const updateReminder = async (id: string, reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    if (isDemoMode) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, ...reminder } : r))
      return
    }
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      })
      if (res.ok) {
        const updated: Reminder = await res.json()
        setReminders(prev => prev.map(r => r.id === id ? updated : r))
      }
    } catch (err) {
      console.error('Failed to update reminder:', err)
    }
  }

  const deleteReminder = async (id: string) => {
    if (isDemoMode) {
      setReminders(prev => prev.filter(r => r.id !== id))
      return
    }
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setReminders(prev => prev.filter(r => r.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete reminder:', err)
    }
  }

  const addTag = async (reminderId: string, tag: string) => {
    if (isDemoMode) {
      setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, tags: [...r.tags, tag] } : r))
      return
    }
    try {
      const res = await fetch(`/api/reminders/${reminderId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      })
      if (res.ok) {
        setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, tags: [...r.tags, tag] } : r))
      }
    } catch (err) {
      console.error('Failed to add tag:', err)
    }
  }

  const updateTags = async (reminderId: string, tags: string[]) => {
    if (isDemoMode) {
      setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, tags } : r))
      return
    }
    try {
      const res = await fetch(`/api/reminders/${reminderId}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags }),
      })
      if (res.ok) {
        setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, tags } : r))
      }
    } catch (err) {
      console.error('Failed to update tags:', err)
    }
  }

  const deleteTag = async (reminderId: string, tagId: string) => {
    if (isDemoMode) {
      setReminders(prev => prev.map(r => {
        if (r.id === reminderId) {
          return { ...r, tags: r.tags?.filter(t => t !== tagId) || [] }
        }
        return r
      }))
      return
    }
    try {
      const res = await fetch(`/api/reminders/${reminderId}/tags/${encodeURIComponent(tagId)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setReminders(prev => prev.map(r => {
          if (r.id === reminderId) {
            return { ...r, tags: r.tags?.filter(t => t !== tagId) || [] }
          }
          return r
        }))
      }
    } catch (err) {
      console.error('Failed to delete tag:', err)
    }
  }

  const getTags = (reminderId: string) => {
    return reminders.find(r => r.id === reminderId)?.tags || []
  }

  useEffect(() => {
    refresh()
  }, [isDemoMode])

  useEffect(() => {
    const handleFetchError = async (e: Event) => {
      if (isDemoMode) return
      const err = e as ErrorEvent
      if (err.error?.status === 0 || err.error?.message?.includes('Failed to fetch')) {
        console.warn('Server not ready, waiting 5s...')
        if (retryTimer) clearTimeout(retryTimer)
        retryTimer = setTimeout(() => {
          retryTimer = null
          refresh()
        }, 5000)
      }
    }
    window.addEventListener('error', handleFetchError as any)
    return () => window.removeEventListener('error', handleFetchError as any)
  }, [])

  return (
    <RemindersContext.Provider value={{ reminders, tags, loading, isDemoMode, setDemoMode, addReminder, updateReminder, deleteReminder, addTag, updateTags, deleteTag, getTags, refresh }}>
      {children}
    </RemindersContext.Provider>
  )
}

export const useReminders = () => useContext(RemindersContext)
