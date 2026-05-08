import { mkdirSync } from 'fs'
import { dirname } from 'path'

export const config = {
  port: (parseInt(process.env.PORT as string, 10) || 3081) as number,
  dataFile: (process.env.REMINDERS_FILE || process.env.BIRTHDAYS_FILE || 'data/reminders.json') as string,
}

// Ensure data directory exists for relative paths
if (config.dataFile && !config.dataFile.startsWith('/') && !config.dataFile.startsWith('\\') && !config.dataFile.startsWith('./')) {
  const dataDir = dirname(config.dataFile)
  try {
    mkdirSync(dataDir, { recursive: true })
  } catch {}
}
