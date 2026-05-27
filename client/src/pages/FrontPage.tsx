import { useState, useMemo } from 'react'
import { useReminders } from '@/contexts/RemindersContext'
import { useTheme } from '@/contexts/ThemeContext'
import { parseDateParts, daysUntil } from '@/utils/dateUtils'
import AddReminderForm from '@/components/AddReminderForm'
import EditReminderForm from '@/components/EditReminderForm'
import ReminderCard from '@/components/ReminderCard'
import { Button, Input, useToast } from '@/components/ui'

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function FrontPage() {
  const { reminders, loading, addReminder, updateReminder, deleteReminder } = useReminders()
  const { theme } = useTheme()

  const [showForm, setShowForm]       = useState(false)
  const [search, setSearch]           = useState('')
  const [monthFilter, setMonthFilter] = useState<string | null>(null)
  const [editId, setEditId]           = useState<string | null>(null)
  const { addToast } = useToast()

  const existingTags = useMemo(() => {
    const tagSet = new Set<string>()
    reminders.forEach(r => (r.tags ?? []).forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [reminders])

  const filtered = useMemo(() => {
    let result = reminders
    if (monthFilter) {
      result = result.filter(r => {
        const parts = parseDateParts(r.date)
        return parts ? String(parts[1]).padStart(2, '0') === monthFilter : false
      })
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r => r.name.toLowerCase().includes(q))
    }
    return result.slice().sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
  }, [reminders, monthFilter, search])

  const editReminder = editId ? reminders.find(r => r.id === editId) : null

  return (
    <div className="relative">
      {/* Edit modal */}
      {editId && editReminder && (
        <EditReminderForm
          reminder={editReminder}
          existingTags={existingTags}
          onSave={(name, date, icon, tags) => {
            updateReminder(editId, { name, date, icon, tags })
            addToast(`${name} updated`, 'success')
            setEditId(null)
          }}
          onClose={() => setEditId(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>Reminders</h1>
          {!loading && (
            <p className="text-sm mt-0.5" style={{ color: theme.text2 }}>
              {reminders.length === 0 ? 'No dates yet' : `${reminders.length} saved`}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => { setShowForm(v => !v); setEditId(null) }}
          style={showForm ? { color: theme.text } : undefined}
        >
          {showForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              New Reminder
            </>
          )}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <AddReminderForm
          existingTags={existingTags}
          onSave={(name, date, icon, tags) => {
            addReminder({ name, date, icon, tags })
            addToast(`${name} saved`, 'success')
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: theme.text2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="pl-9 pr-9 rounded-xl"
          style={{ background: theme.surface }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: theme.text2 }}>
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>

      {/* Month filter */}
      <div className="flex items-center gap-1 mb-6">
        <button
          onClick={() => setMonthFilter(null)}
          className="flex-1 px-2 py-1 text-xs font-semibold rounded-md transition-all"
          style={!monthFilter
            ? { background: theme.accent, color: '#fff' }
            : { background: theme.surface, color: theme.text2, border: `1px solid ${theme.border}` }}
        >
          All
        </button>
        {MONTH_LABELS.map((label, i) => {
          const mm = String(i + 1).padStart(2, '0')
          const active = monthFilter === mm
          return (
            <button
              key={mm}
              onClick={() => setMonthFilter(active ? null : mm)}
              className="flex-1 px-2 py-1 text-xs font-semibold rounded-md transition-all"
              style={active
                ? { background: theme.accent, color: '#fff' }
                : { background: theme.surface, color: theme.text2, border: `1px solid ${theme.border}` }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
              <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-32" />
                <div className="skeleton h-3 w-20" />
              </div>
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${theme.accent}15` }}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.accent }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21l-3.5-3.5M3 21l3.5-3.5"/>
            </svg>
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: theme.text }}>
            {reminders.length === 0 ? 'No dates yet' : 'No results'}
          </h3>
          <p className="text-sm mb-6" style={{ color: theme.text2 }}>
            {reminders.length === 0 ? 'Add a birthday, anniversary, or any date worth remembering' : 'Try a different search or month'}
          </p>
          {reminders.length === 0 && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setShowForm(true)}
            >
              Add your first date
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(r => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onEdit={() => { setEditId(r.id); setShowForm(false) }}
              onDelete={() => deleteReminder(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
