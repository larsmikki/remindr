type LogData = Record<string, unknown>

function emit(level: 'info' | 'warn' | 'error', msg: string, data?: LogData) {
  const entry = { level, ts: new Date().toISOString(), msg, ...data }
  const line = JSON.stringify(entry)
  if (level === 'error') {
    console.error(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  info:  (msg: string, data?: LogData) => emit('info',  msg, data),
  warn:  (msg: string, data?: LogData) => emit('warn',  msg, data),
  error: (msg: string, data?: LogData) => emit('error', msg, data),
}
