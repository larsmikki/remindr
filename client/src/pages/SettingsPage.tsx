import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemePicker from '@/components/ThemePicker'
import { useReminders } from '@/contexts/RemindersContext'
import { api } from '@/api'
import { Button, Surface, Toggle, useToast } from '@/components/ui'

export default function SettingsPage() {
  const { theme } = useTheme()
  const { reminders, isDemoMode, setDemoMode, refresh } = useReminders()
  const { addToast } = useToast()
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
    addToast('Backup exported', 'success')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        const entries: Array<{ name?: string; date?: string; icon?: string }> = data.reminders ?? data.birthdays ?? []
        for (const entry of entries) {
          if (entry.name && entry.date) {
            await api.createReminder({ name: entry.name, date: entry.date, icon: entry.icon })
          }
        }
        await refresh()
        addToast(`Imported ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`, 'success')
      } catch {
        addToast('Invalid JSON file', 'error')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Settings</h1>
        <p className="text-sm mt-0.5 text-text2">Customize your Remindy experience.</p>
      </div>

      <Surface className="p-6 mb-5">
        <h2 className="text-base font-bold mb-1 text-text">Themes</h2>
        <p className="text-xs mb-5 text-text2">Choose how Remindy looks to you.</p>
        <ThemePicker />
      </Surface>

      <Surface className="p-6 mb-5">
        <h2 className="text-base font-bold mb-1 text-text">Appearance</h2>
        <p className="text-xs mb-5 text-text2">Show or hide interface elements.</p>
        <div
          className="flex items-center justify-between gap-4 w-full rounded-xl px-4 py-3"
          style={{ background: theme.surface2, border: `1px solid ${theme.border}` }}
        >
          <span>
            <span className="block text-sm font-semibold text-text">Demo mode</span>
            <span className="block text-xs mt-0.5 text-text2">Show sample birthdays on the home page.</span>
          </span>
          <Toggle
            checked={isDemoMode}
            onChange={setDemoMode}
            aria-label="Toggle demo mode"
          />
        </div>
      </Surface>

      <Surface className="p-6">
        <h2 className="text-base font-bold mb-1 text-text">Data</h2>
        <p className="text-xs mb-5 text-text2">Export or import your data as a JSON backup.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={handleExport}
            leadingIcon={<DownloadIcon />}
          >
            Export backup
          </Button>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            leadingIcon={<UploadIcon />}
          >
            Import backup
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </Surface>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )
}
