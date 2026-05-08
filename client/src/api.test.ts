import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from './api'

const mockFetch = vi.fn()

beforeEach(() => vi.stubGlobal('fetch', mockFetch))
afterEach(() => vi.unstubAllGlobals())

function mockOk(data: unknown) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) })
}

describe('api.getReminders', () => {
  it('calls GET /api/reminders and returns parsed array', async () => {
    const reminders = [{ id: '1', name: 'Alice', date: '1990-06-15', createdAt: 0, tags: [] }]
    mockFetch.mockReturnValueOnce(mockOk(reminders))

    const result = await api.getReminders()

    expect(mockFetch).toHaveBeenCalledWith('/api/reminders', expect.objectContaining({
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }))
    expect(result).toEqual(reminders)
  })
})

describe('api.createReminder', () => {
  it('calls POST /api/reminders with JSON body', async () => {
    const created = { id: '2', name: 'Bob', date: '1985-03-20', createdAt: 0, tags: [] }
    mockFetch.mockReturnValueOnce(mockOk(created))

    const result = await api.createReminder({ name: 'Bob', date: '1985-03-20' })

    expect(mockFetch).toHaveBeenCalledWith('/api/reminders', expect.objectContaining({
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
    mockFetch.mockReturnValueOnce(mockOk(updated))

    const result = await api.updateReminder('3', { name: 'Charlie', date: '2000-01-01' })

    expect(mockFetch).toHaveBeenCalledWith('/api/reminders/3', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ name: 'Charlie', date: '2000-01-01' }),
    }))
    expect(result).toEqual(updated)
  })
})

describe('api.deleteReminder', () => {
  it('calls DELETE /api/reminders/:id', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 204 }))

    await api.deleteReminder('4')

    expect(mockFetch).toHaveBeenCalledWith('/api/reminders/4', { method: 'DELETE' })
  })
})

describe('error handling', () => {
  it('throws on non-ok response', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve(null) }))

    await expect(api.getReminders()).rejects.toThrow('API error: 404')
  })
})
