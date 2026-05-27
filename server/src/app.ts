import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { existsSync, readFileSync } from 'fs'
import { join, extname } from 'path'
import { remindersRouter } from './routes/reminders.js'
import { logger } from './logger.js'

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

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    res.on('finish', () => {
      logger.info('request', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ms: Date.now() - start,
      })
    })
    next()
  })

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' })
  })

  app.use('/api', remindersRouter)

  // Static files (production) with SPA fallback
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
    if (process.env.NODE_ENV !== 'production' || !existsSync(STATIC_DIR)) return next()
    const urlPath = req.path
    const candidate = join(STATIC_DIR, urlPath === '/' ? 'index.html' : urlPath)
    const file = existsSync(candidate) ? candidate : join(STATIC_DIR, 'index.html')
    const mime = MIME[extname(file)] ?? 'application/octet-stream'
    const isHashed = urlPath.startsWith('/assets/')
    res.setHeader('Cache-Control', isHashed ? 'public, max-age=31536000, immutable' : 'no-cache')
    res.type(mime).send(readFileSync(file))
  })

  // 404 for anything unmatched
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Error handler — invalid JSON bodies and unexpected failures
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if ((err as { type?: string })?.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
    logger.error('Unhandled error', { error: String(err) })
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
