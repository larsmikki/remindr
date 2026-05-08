import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemePicker from '@/components/ThemePicker'
import { useReminders } from '@/contexts/RemindersContext'
import { api } from '@/api'

export default function SettingsPage() {
  const { theme } = useTheme()
  const { reminders, isDemoMode, setDemoMode, refresh } = useReminders()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = { reminders }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'remindy-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        const entries: Array<{ name?: string; date?: string; icon?: string }> = data.reminders ?? data.birthdays ?? []
        for (const b of entries) {
          if (b.name && b.date) {
            await api.createReminder({ name: b.name, date: b.date, icon: b.icon })
          }
        }
        await refresh()
        alert(`Imported ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} successfully`)
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const sectionStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: theme.text2 }}>
          Customize your Remindy experience.
        </p>
      </div>

      {/* Theme section */}
      <div style={sectionStyle}>
        <h2 className="text-base font-bold mb-1" style={{ color: theme.text }}>Theme</h2>
        <p className="text-xs mb-5" style={{ color: theme.text2 }}>
          Choose how Remindy looks to you.
        </p>
        <ThemePicker />
      </div>

      {/* Demo Mode section */}
      <div style={sectionStyle}>
        <h2 className="text-base font-bold mb-1" style={{ color: theme.text }}>Demo mode</h2>
        <p className="text-xs mb-5" style={{ color: theme.text2 }}>
          Show sample birthdays on the home page to preview how Remindy looks with data.
        </p>
        <button
          onClick={() => setDemoMode(!isDemoMode)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-80"
          style={{ background: theme.surface2, color: theme.text, border: `1px solid ${isDemoMode ? '#f97316' : theme.border}` }}
        >
          {/* Toggle pill */}
          <span
            className="relative inline-block w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ background: isDemoMode ? '#f97316' : theme.border }}
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: isDemoMode ? 'translateX(16px)' : 'translateX(0)' }}
            />
          </span>
          {isDemoMode ? 'Demo Mode On' : 'Demo Mode Off'}
        </button>
      </div>

      {/* Data section */}
      <div style={sectionStyle}>
        <h2 className="text-base font-bold mb-1" style={{ color: theme.text }}>Data</h2>
        <p className="text-xs mb-5" style={{ color: theme.text2 }}>
          Your data is stored locally in your browser. Export your birthdays as JSON for backup.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-80"
            style={{ background: theme.surface2, color: theme.text, border: `1px solid ${theme.border}` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Settings
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-80"
            style={{ background: theme.surface2, color: theme.text, border: `1px solid ${theme.border}` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Import Settings
          </button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </div>
      </div>

    </div>
  )
}
