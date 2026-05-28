import { readFileSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join, isAbsolute } from 'path'
import type { Reminder } from '../types.js'
import { config } from '../config.js'
import { logger } from '../logger.js'

export interface Storage {
  getAllReminders: () => Reminder[]
  getReminderById: (id: string) => Reminder | null
  addReminder: (name: string, date: string, icon?: string, tags?: string[]) => Reminder
  updateReminder: (id: string, name: string, date: string, icon?: string, tags?: string[]) => Reminder | null
  deleteReminder: (id: string) => boolean
  addTag: (id: string, tag: string) => void
  updateTags: (id: string, tags: string[]) => void
  deleteTag: (id: string, tagId: string) => void
  getTags: (id: string) => string[]
}

function resolvePath(dataFile: string): string {
  return isAbsolute(dataFile) ? dataFile : join(process.cwd(), dataFile)
}

export function createStorage(dataFile: string): Storage {
  const filePath = resolvePath(dataFile)
  let reminders: Reminder[] = []

  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8').trim()
      reminders = content ? JSON.parse(content) : []
    }
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException
    if (e.code !== 'ENOENT') throw err
  }

  // Write queue — serialises async file writes so concurrent mutations never corrupt the file
  let writeQueue: Promise<void> = Promise.resolve()

  function save(): void {
    const snapshot = JSON.stringify(reminders, null, 2)
    writeQueue = writeQueue.then(() =>
      writeFile(filePath, snapshot, 'utf-8').catch(err =>
        logger.error('Failed to save reminders', { error: String(err) })
      )
    )
  }

  return {
    getAllReminders: () => [...reminders],

    getReminderById: (id) => reminders.find(r => r.id === id) ?? null,

    addReminder: (name, date, icon, tags = []) => {
      const entry: Reminder = {
        id: crypto.randomUUID(),
        name,
        date,
        icon,
        createdAt: Date.now(),
        tags,
      }
      reminders.push(entry)
      save()
      return entry
    },

    updateReminder: (id, name, date, icon, tags) => {
      const i = reminders.findIndex(r => r.id === id)
      if (i === -1) return null
      reminders[i] = {
        ...reminders[i],
        name,
        date,
        ...(icon !== undefined && { icon }),
        ...(tags !== undefined && { tags }),
      }
      save()
      return reminders[i]
    },

    deleteReminder: (id) => {
      const i = reminders.findIndex(r => r.id === id)
      if (i === -1) return false
      reminders.splice(i, 1)
      save()
      return true
    },

    addTag: (id, tag) => {
      const i = reminders.findIndex(r => r.id === id)
      if (i === -1) return
      if (!reminders[i].tags) reminders[i].tags = []
      if (!reminders[i].tags.includes(tag)) {
        reminders[i].tags = [...reminders[i].tags, tag]
        save()
      }
    },

    updateTags: (id, tags) => {
      const i = reminders.findIndex(r => r.id === id)
      if (i === -1) return
      reminders[i] = { ...reminders[i], tags }
      save()
    },

    deleteTag: (id, tagId) => {
      const i = reminders.findIndex(r => r.id === id)
      if (i === -1) return
      reminders[i].tags = (reminders[i].tags ?? []).filter(t => t !== tagId)
      save()
    },

    getTags: (id) => reminders.find(r => r.id === id)?.tags ?? [],
  }
}

// Singleton used by the server
export const storage: Storage = createStorage(config.dataFile)
export default storage
