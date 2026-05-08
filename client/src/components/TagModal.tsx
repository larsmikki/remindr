import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import type { Reminder } from '@/types'

interface Props {
  reminder: Reminder
  onClose: () => void
  addTag: (reminderId: string, tag: string) => void
  deleteTag: (reminderId: string, tagId: string) => void
  getTags: (reminderId: string) => string[]
}

export default function TagModal({ reminder, onClose, addTag, deleteTag, getTags }: Props) {
  const { theme } = useTheme()
  const [tagName, setTagName] = useState('')
  const tags = getTags(reminder.id)

  const addCurrent = () => {
    if (tagName.trim()) {
      addTag(reminder.id, tagName.trim())
      setTagName('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-xl overflow-hidden w-full max-w-sm" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.text2 }}>Tags</p>
          <h2 className="font-bold" style={{ color: theme.text }}>{reminder.name}</h2>
        </div>
        <div className="p-4 space-y-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <div
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${theme.accent}18`, color: theme.accent }}
                >
                  {t}
                  <button onClick={() => deleteTag(reminder.id, t)} className="ml-0.5 hover:opacity-70">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagName}
              onChange={e => setTagName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCurrent() }}
              placeholder="Add tag…"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none placeholder:opacity-40"
              style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text }}
            />
            <button
              onClick={addCurrent}
              className="px-3 py-2 text-sm font-semibold rounded-lg text-white"
              style={{ background: theme.accent }}
            >
              Add
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium rounded-lg transition-opacity hover:opacity-80"
            style={{ background: theme.surface2, color: theme.text2, border: `1px solid ${theme.border}` }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
