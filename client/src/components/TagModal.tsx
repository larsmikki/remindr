import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import type { Reminder } from '@/types'
import { Button, Input, Modal } from '@/components/ui'

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
    <Modal title={reminder.name} onClose={onClose} maxWidth={384}>
      <div className="p-6 space-y-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <div
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: `${theme.accent}18`, color: theme.accent }}
              >
                {t}
                <button type="button" onClick={() => deleteTag(reminder.id, t)} className="ml-0.5 hover:opacity-70" aria-label={`Remove ${t}`}>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            type="text"
            value={tagName}
            onChange={e => setTagName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCurrent() }}
            placeholder="Add tag..."
            className="flex-1 py-2"
          />
          <Button type="button" onClick={addCurrent} size="sm" className="self-stretch">
            Add
          </Button>
        </div>
        <Button type="button" onClick={onClose} fullWidth>
          Done
        </Button>
      </div>
    </Modal>
  )
}
