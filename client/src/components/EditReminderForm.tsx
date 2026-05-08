import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { DEFAULT_ICON } from '@/lib/dateIcons'
import IconPicker from '@/components/IconPicker'
import type { Reminder } from '@/types'

interface Props {
  reminder: Reminder
  existingTags: string[]
  onSave: (name: string, date: string, icon: string, tags: string[]) => void
  onClose: () => void
}

function dayMonthToIso(val: string): string {
  const m = val.match(/^(\d{1,2})\/(\d{1,2})$/)
  if (!m) return ''
  return `0000-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

export default function EditReminderForm({ reminder, existingTags, onSave, onClose }: Props) {
  const { theme } = useTheme()
  const [name, setName] = useState(reminder.name)
  const [icon, setIcon] = useState(reminder.icon || DEFAULT_ICON)
  const [tags, setTags] = useState<string[]>(reminder.tags ?? [])
  const [newTag, setNewTag] = useState('')

  const isYearUnknown = reminder.date.startsWith('0000-')
  const [yearKnown, setYearKnown] = useState(!isYearUnknown)
  const [date, setDate] = useState(isYearUnknown ? '' : reminder.date)
  const [dayMonth, setDayMonth] = useState(() => {
    if (!isYearUnknown) return ''
    const [, mm, dd] = reminder.date.split('-')
    return mm && dd ? `${dd}/${mm}` : ''
  })

  const effectiveDate = yearKnown ? date : dayMonthToIso(dayMonth)

  const toggleYearKnown = () => {
    if (yearKnown) {
      if (date) {
        const [, mm, dd] = date.split('-')
        if (mm && dd) setDayMonth(`${dd}/${mm}`)
      }
      setYearKnown(false)
    } else {
      setYearKnown(true)
    }
  }

  const handleDayMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d/]/g, '')
    if (val.length === 2 && dayMonth.length < 2 && !val.includes('/')) val = val + '/'
    if (val.length > 5) val = val.slice(0, 5)
    setDayMonth(val)
  }

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const addNewTag = () => {
    const trimmed = newTag.trim()
    if (!trimmed || tags.includes(trimmed)) { setNewTag(''); return }
    setTags(prev => [...prev, trimmed])
    setNewTag('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !effectiveDate) return
    onSave(name.trim(), effectiveDate, icon, tags)
  }

  const inputStyle = () => ({
    background: theme.surface2,
    border: `1px solid ${theme.border}`,
    color: theme.text,
  })

  const unselectedExisting = existingTags.filter(t => !tags.includes(t))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-xl overflow-hidden w-full max-w-sm" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <h2 className="font-bold" style={{ color: theme.text }}>Edit reminder</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2.5 text-sm rounded-lg outline-none placeholder:opacity-40"
            style={inputStyle()}
          />

          <div className="flex gap-2">
            {yearKnown ? (
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm rounded-lg outline-none"
                style={inputStyle()}
              />
            ) : (
              <input
                type="text"
                value={dayMonth}
                onChange={handleDayMonthChange}
                placeholder="dd/mm"
                maxLength={5}
                className="flex-1 px-3 py-2.5 text-sm rounded-lg outline-none placeholder:opacity-40"
                style={inputStyle()}
              />
            )}
            <button
              type="button"
              onClick={toggleYearKnown}
              className="flex items-center gap-1.5 px-2.5 py-2.5 text-sm rounded-lg whitespace-nowrap flex-shrink-0 transition-all"
              style={!yearKnown
                ? { background: `${theme.accent}20`, color: theme.accent, border: `1px solid ${theme.accent}40` }
                : { background: theme.surface2, color: theme.text2, border: `1px solid ${theme.border}` }
              }
            >
              <span
                className="relative w-6 h-3 rounded-full flex-shrink-0 transition-colors duration-200"
                style={{ background: !yearKnown ? theme.accent : theme.border }}
              >
                <span
                  className="absolute top-0.5 w-2 h-2 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ transform: !yearKnown ? 'translateX(13px)' : 'translateX(1px)' }}
                />
              </span>
              Year unknown
            </button>
          </div>

          <IconPicker value={icon} onChange={setIcon} />

          {(existingTags.length > 0 || tags.length > 0) && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium" style={{ color: theme.text2 }}>Tags</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: theme.accent, color: '#fff' }}
                    >
                      {tag}
                      <svg className="h-2.5 w-2.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  ))}
                </div>
              )}
              {unselectedExisting.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {unselectedExisting.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                      style={{ background: `${theme.accent}18`, color: theme.accent }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNewTag() } }}
              placeholder="Add a tag…"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none placeholder:opacity-40"
              style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text }}
            />
            <button
              type="button"
              onClick={addNewTag}
              className="px-3 py-2 text-sm font-semibold rounded-lg"
              style={{ background: theme.surface2, color: theme.text2, border: `1px solid ${theme.border}` }}
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: theme.accent }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-80"
              style={{ background: theme.surface2, color: theme.text2, border: `1px solid ${theme.border}` }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
