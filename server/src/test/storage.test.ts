import { describe, it, expect, beforeEach } from 'vitest'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createStorage } from '../db/storage'

const tmpFile = join(tmpdir(), `remindy-test-${process.pid}.json`)

function fresh() {
  writeFileSync(tmpFile, '[]', 'utf-8')
  return createStorage(tmpFile)
}

import { afterAll } from 'vitest'
afterAll(() => { if (existsSync(tmpFile)) unlinkSync(tmpFile) })

describe('storage — reminders', () => {
  let s: ReturnType<typeof createStorage>
  beforeEach(() => { s = fresh() })

  it('starts empty', () => {
    expect(s.getAllReminders()).toEqual([])
  })

  it('adds a reminder and returns it', () => {
    const r = s.addReminder('Alice', '1990-06-15', '🎂')
    expect(r.name).toBe('Alice')
    expect(r.date).toBe('1990-06-15')
    expect(r.icon).toBe('🎂')
    expect(r.id).toBeTruthy()
    expect(r.tags).toEqual([])
    expect(s.getAllReminders()).toHaveLength(1)
  })

  it('gets a reminder by id', () => {
    const r = s.addReminder('Bob', '1985-03-20')
    expect(s.getReminderById(r.id)).toMatchObject({ name: 'Bob' })
  })

  it('returns null for unknown id', () => {
    expect(s.getReminderById('does-not-exist')).toBeNull()
  })

  it('updates a reminder', () => {
    const r = s.addReminder('Charlie', '2000-01-01')
    const updated = s.updateReminder(r.id, 'Charles', '2000-01-01', '🎉')
    expect(updated?.name).toBe('Charles')
    expect(updated?.icon).toBe('🎉')
  })

  it('returns null when updating unknown id', () => {
    expect(s.updateReminder('nope', 'X', '2000-01-01')).toBeNull()
  })

  it('deletes a reminder', () => {
    const r = s.addReminder('Dave', '1995-07-04')
    expect(s.deleteReminder(r.id)).toBe(true)
    expect(s.getAllReminders()).toHaveLength(0)
  })

  it('returns false when deleting unknown id', () => {
    expect(s.deleteReminder('ghost')).toBe(false)
  })

  it('getAllReminders returns a copy — mutations do not affect internal state', () => {
    s.addReminder('Eve', '1988-11-11')
    const all = s.getAllReminders()
    all.push({ id: 'fake', name: 'Fake', date: '2000-01-01', createdAt: 0, tags: [] })
    expect(s.getAllReminders()).toHaveLength(1)
  })
})

describe('storage — tags', () => {
  let s: ReturnType<typeof createStorage>
  beforeEach(() => { s = fresh() })

  it('adds a tag to a reminder', () => {
    const r = s.addReminder('Frank', '1992-05-05')
    s.addTag(r.id, 'Family')
    expect(s.getTags(r.id)).toEqual(['Family'])
  })

  it('does not add duplicate tags', () => {
    const r = s.addReminder('Grace', '1993-09-09')
    s.addTag(r.id, 'Friends')
    s.addTag(r.id, 'Friends')
    expect(s.getTags(r.id)).toEqual(['Friends'])
  })

  it('updates tags', () => {
    const r = s.addReminder('Hank', '1980-02-14')
    s.addTag(r.id, 'Old')
    s.updateTags(r.id, ['New1', 'New2'])
    expect(s.getTags(r.id)).toEqual(['New1', 'New2'])
  })

  it('deletes a tag', () => {
    const r = s.addReminder('Iris', '1975-12-25')
    s.addTag(r.id, 'Work')
    s.addTag(r.id, 'Family')
    s.deleteTag(r.id, 'Work')
    expect(s.getTags(r.id)).toEqual(['Family'])
  })

  it('returns empty array for unknown reminder', () => {
    expect(s.getTags('unknown')).toEqual([])
  })
})
