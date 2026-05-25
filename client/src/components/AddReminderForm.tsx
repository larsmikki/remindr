import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { DEFAULT_ICON } from '@/lib/dateIcons'
import IconPicker from '@/components/IconPicker'
import { Button, Input, Surface } from '@/components/ui'

interface Props {
  existingTags: string[]
  onSave: (name: string, date: string, icon: string, tags: string[]) => void
  onCancel: () => void
}

function dayMonthToIso(val: string): string {
  const m = val.match(/^(\d{1,2})\/(\d{1,2})$/)
  if (!m) return ''
  return `0000-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

export default function AddReminderForm({ existingTags, onSave, onCancel }: Props) {
  const { theme } = useTheme()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [yearKnown, setYearKnown] = useState(true)
  const [dayMonth, setDayMonth] = useState('')
  const [icon, setIcon] = useState(DEFAULT_ICON)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState('')

  const effectiveDate = yearKnown ? date : dayMonthToIso(dayMonth)
  const unselectedExisting = existingTags.filter(t => !selectedTags.includes(t))

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
    setError('')
  }

  const handleDayMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d/]/g, '')
    if (val.length === 2 && dayMonth.length < 2 && !val.includes('/')) val = val + '/'
    if (val.length > 5) val = val.slice(0, 5)
    setDayMonth(val)
    setError('')
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const addNewTag = () => {
    const trimmed = newTag.trim()
    if (!trimmed || selectedTags.includes(trimmed)) {
      setNewTag('')
      return
    }
    setSelectedTags(prev => [...prev, trimmed])
    setNewTag('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = name.trim()
    if (!trimmed || !effectiveDate) {
      setError('Fill in all fields')
      return
    }
    if (yearKnown && isNaN(new Date(date).getTime())) {
      setError('Invalid date')
      return
    }
    onSave(trimmed, effectiveDate, icon, selectedTags)
  }

  return (
    <Surface className="mb-5 p-4 rounded-xl" style={{ borderColor: `${theme.accent}40`, boxShadow: 'var(--shadow-card-soft)' }}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          autoFocus
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          placeholder="Name"
          invalid={!!error}
        />

        <div className="flex gap-2">
          {yearKnown ? (
            <Input
              type="date"
              value={date}
              onChange={e => { setDate(e.target.value); setError('') }}
              className="flex-1"
              invalid={!!error}
            />
          ) : (
            <Input
              type="text"
              value={dayMonth}
              onChange={handleDayMonthChange}
              placeholder="dd/mm"
              maxLength={5}
              className="flex-1"
              invalid={!!error}
            />
          )}
          <button
            type="button"
            role="switch"
            aria-checked={!yearKnown}
            onClick={toggleYearKnown}
            className="flex items-center gap-1.5 px-2.5 py-2.5 text-sm rounded-lg whitespace-nowrap flex-shrink-0 transition-opacity hover:opacity-80"
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

        {(existingTags.length > 0 || selectedTags.length > 0) && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-text2">Tags</p>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: theme.accent, color: '#fff' }}
                  >
                    {tag}
                    <svg className="h-2.5 w-2.5 opacity-70" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
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
          <Input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNewTag() } }}
            placeholder="Add a tag..."
            className="flex-1 py-2"
          />
          <Button type="button" onClick={addNewTag} size="sm" className="self-stretch">
            Add
          </Button>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="primary" fullWidth>
            Save
          </Button>
          <Button type="button" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Surface>
  )
}
