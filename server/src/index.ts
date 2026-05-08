import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { storage } from './db/storage'
import { config } from './config'
import { logger } from './logger'

const STATIC_DIR = join(process.cwd(), 'client', 'dist')
const MIME: Record<string, string> = {
  '.html':  'text/html',
  '.js':    'application/javascript',
  '.css':   'text/css',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.ico':   'image/x-icon',
  '.json':  'application/json',
  '.woff2': 'font/woff2',
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// ── Response helpers ──────────────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return { status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}

function err(message: string, status: number): Response {
  return json({ error: message }, status)
}

function noContent(): Response {
  return { status: 204, headers: {}, body: '' }
}

interface Response {
  status: number
  headers: Record<string, string>
  body: string | Buffer
}

// ── Input validation ──────────────────────────────────────────────────────────

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

function parseBody(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw || '{}') as Record<string, unknown>
  } catch {
    return null
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

function handleRequest(method: string, url: string, body: string): Response {
  if (method === 'OPTIONS') {
    return { status: 204, headers: { 'Content-Type': 'text/plain' }, body: '' }
  }

  // GET /api/reminders
  if (method === 'GET' && url === '/api/reminders') {
    return json(storage.getAllReminders())
  }

  // POST /api/reminders
  if (method === 'POST' && url === '/api/reminders') {
    const parsed = parseBody(body)
    if (!parsed) return err('Invalid JSON', 400)
    const invalid = validateReminder(parsed)
    if (invalid) return err(invalid, 400)
    const entry = storage.addReminder(
      (parsed.name as string).trim(),
      parsed.date as string,
      parsed.icon as string | undefined,
      Array.isArray(parsed.tags) ? (parsed.tags as string[]) : [],
    )
    return json(entry, 201)
  }

  // Routes with /:id
  const reminderMatch = url.match(/^\/api\/reminders\/([^/]+)$/)
  if (reminderMatch) {
    const id = reminderMatch[1]

    if (method === 'GET') {
      const entry = storage.getReminderById(id)
      return entry ? json(entry) : err('Not found', 404)
    }

    if (method === 'PUT') {
      const parsed = parseBody(body)
      if (!parsed) return err('Invalid JSON', 400)
      const invalid = validateReminder(parsed)
      if (invalid) return err(invalid, 400)
      const updated = storage.updateReminder(
        id,
        (parsed.name as string).trim(),
        parsed.date as string,
        parsed.icon as string | undefined,
        Array.isArray(parsed.tags) ? (parsed.tags as string[]) : undefined,
      )
      return updated ? json(updated) : err('Not found', 404)
    }

    if (method === 'DELETE') {
      return storage.deleteReminder(id) ? noContent() : err('Not found', 404)
    }
  }

  // /api/reminders/:id/tags
  const tagsMatch = url.match(/^\/api\/reminders\/([^/]+)\/tags$/)
  if (tagsMatch) {
    const id = tagsMatch[1]

    if (method === 'PUT') {
      const parsed = parseBody(body)
      if (!parsed) return err('Invalid JSON', 400)
      storage.updateTags(id, (parsed.tags as string[]) ?? [])
      return json({ success: true })
    }

    if (method === 'POST') {
      const parsed = parseBody(body)
      if (!parsed) return err('Invalid JSON', 400)
      storage.addTag(id, parsed.tag as string)
      return json({ success: true })
    }
  }

  // DELETE /api/reminders/:id/tags/:tagId
  const tagDeleteMatch = url.match(/^\/api\/reminders\/([^/]+)\/tags\/(.+)$/)
  if (tagDeleteMatch && method === 'DELETE') {
    storage.deleteTag(tagDeleteMatch[1], tagDeleteMatch[2])
    return noContent()
  }

  // GET /api/tags
  if (method === 'GET' && url === '/api/tags') {
    return json([])
  }

  // GET /api/health
  if (method === 'GET' && url === '/api/health') {
    return json({ status: 'ok' })
  }

  // Static files (production)
  if (!url.startsWith('/api/') && process.env.NODE_ENV === 'production' && existsSync(STATIC_DIR)) {
    const urlPath = url.split('?')[0] ?? '/'
    const filePath = join(STATIC_DIR, urlPath === '/' ? 'index.html' : urlPath)
    const file = existsSync(filePath) ? filePath : join(STATIC_DIR, 'index.html')
    const mime = MIME[extname(file)] ?? 'application/octet-stream'
    const isHashed = urlPath.startsWith('/assets/')
    const cacheControl = isHashed ? 'public, max-age=31536000, immutable' : 'no-cache'
    return { status: 200, headers: { 'Content-Type': mime, 'Cache-Control': cacheControl }, body: readFileSync(file) }
  }

  return err('Not found', 404)
}

// ── Server bootstrap ──────────────────────────────────────────────────────────

function startServer() {
  const server = createServer((req, res) => {
    const chunks: Buffer[] = []
    const start = Date.now()

    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString()
      const method = req.method ?? 'GET'
      const url = req.url ?? '/'
      let response: Response

      try {
        response = handleRequest(method, url.split('?')[0], body)
      } catch (e) {
        logger.error('Unhandled error', { error: String(e) })
        response = err('Internal server error', 500)
      }

      res.writeHead(response.status, { ...CORS_HEADERS, ...response.headers })
      res.end(response.body)

      logger.info('request', {
        method,
        url,
        status: response.status,
        ms: Date.now() - start,
      })
    })
  })

  server.listen(config.port, '0.0.0.0', () => {
    logger.info('server started', { port: config.port })
  })
}

startServer()
