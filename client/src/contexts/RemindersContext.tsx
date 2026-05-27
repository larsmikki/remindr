import { createContext, useContext } from 'react'
import type { Reminder, Tag } from '@/types'

export const DEMO_MODE_KEY = 'remindy-demo-mode'

export interface RemindersContextType {
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

export const RemindersContext = createContext<RemindersContextType>({
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

export const useReminders = () => useContext(RemindersContext)
