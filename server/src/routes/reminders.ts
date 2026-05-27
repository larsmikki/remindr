import { Router, type Request, type Response } from 'express'
import { storage } from '../db/storage.js'

const router = Router()

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function validateReminder(body: Record<string, unknown>): string | null {
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    return 'name is required'
  }
  if (!body.date || typeof body.date !== 'string') {
    return 'date is required'
  }
  if (!DATE_RE.test(body.date)) {
    return 'date must be in YYYY-MM-DD format'
  }
  return null
}

router.get('/reminders', (_req: Request, res: Response) => {
  res.json(storage.getAllReminders())
})

router.post('/reminders', (req: Request, res: Response) => {
  const parsed = req.body as Record<string, unknown>
  const invalid = validateReminder(parsed)
  if (invalid) return res.status(400).json({ error: invalid })
  const entry = storage.addReminder(
    (parsed.name as string).trim(),
    parsed.date as string,
    parsed.icon as string | undefined,
    Array.isArray(parsed.tags) ? (parsed.tags as string[]) : [],
  )
  res.status(201).json(entry)
})

router.get('/reminders/:id', (req: Request, res: Response) => {
  const entry = storage.getReminderById((req.params.id as string))
  return entry ? res.json(entry) : res.status(404).json({ error: 'Not found' })
})

router.put('/reminders/:id', (req: Request, res: Response) => {
  const parsed = req.body as Record<string, unknown>
  const invalid = validateReminder(parsed)
  if (invalid) return res.status(400).json({ error: invalid })
  const updated = storage.updateReminder(
    (req.params.id as string),
    (parsed.name as string).trim(),
    parsed.date as string,
    parsed.icon as string | undefined,
    Array.isArray(parsed.tags) ? (parsed.tags as string[]) : undefined,
  )
  return updated ? res.json(updated) : res.status(404).json({ error: 'Not found' })
})

router.delete('/reminders/:id', (req: Request, res: Response) => {
  return storage.deleteReminder((req.params.id as string))
    ? res.status(204).end()
    : res.status(404).json({ error: 'Not found' })
})

router.put('/reminders/:id/tags', (req: Request, res: Response) => {
  const parsed = req.body as Record<string, unknown>
  storage.updateTags((req.params.id as string), (parsed.tags as string[]) ?? [])
  res.json({ success: true })
})

router.post('/reminders/:id/tags', (req: Request, res: Response) => {
  const parsed = req.body as Record<string, unknown>
  storage.addTag((req.params.id as string), parsed.tag as string)
  res.json({ success: true })
})

router.delete('/reminders/:id/tags/:tagId', (req: Request, res: Response) => {
  storage.deleteTag((req.params.id as string), (req.params.tagId as string))
  res.status(204).end()
})

// Tags are stored inline on reminders; there is no separate tag collection.
router.get('/tags', (_req: Request, res: Response) => {
  res.json([])
})

export { router as remindersRouter }
