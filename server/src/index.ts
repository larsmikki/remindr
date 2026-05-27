import { createApp } from './app.js'
import { config } from './config.js'
import { logger } from './logger.js'

const app = createApp()
app.listen(config.port, '0.0.0.0', () => {
  logger.info('server started', { port: config.port })
})
