import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useReminders } from '@/contexts/RemindersContext'
import { useTheme } from '@/contexts/ThemeContext'
import TagBadge from '@/components/TagBadge'
import ReminderCard from '@/components/ReminderCard'
import EditReminderForm from '@/components/EditReminderForm'
import { Button, useToast } from '@/components/ui'

export default function TagsPage() {
  const { reminders, loading, updateReminder, updateTags, deleteReminder } = useReminders()
  const { theme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = searchParams.get('tag')
  const [editId, setEditId] = useState<string | null>(null)
  const [confirmDeleteTag, setConfirmDeleteTag] = useState<string | null>(null)
  const { addToast } = useToast()

  const tagMap = useMemo(() => {
    const map = new Map<string, typeof reminders>()
    for (const r of reminders) {
      for (const tag of r.tags ?? []) {
        if (!map.has(tag)) map.set(tag, [])
        map.get(tag)!.push(r)
      }
    }
    return map
  }, [reminders])

  const sortedTags = useMemo(() => {
    const all = [...tagMap.keys()].sort()
    return activeTag ? all.filter(t => t === activeTag) : all
  }, [tagMap, activeTag])

  const existingTags = useMemo(() => {
    const tagSet = new Set<string>()
    reminders.forEach(r => (r.tags ?? []).forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [reminders])

  const editReminder = editId ? reminders.find(r => r.id === editId) : null

  const deleteTagFromAll = async (tag: string) => {
    const affected = reminders.filter(r => r.tags?.includes(tag))
    await Promise.all(affected.map(r => updateTags(r.id, r.tags.filter(t => t !== tag))))
    setConfirmDeleteTag(null)
    addToast(`Tag "${tag}" removed`, 'success')
  }

  return (
    <div>
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

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>
          Tags
        </h1>
        <p className="text-sm mt-0.5" style={{ color: theme.text2 }}>
          See reminders organized by tag.
        </p>
      </div>

      {activeTag && (
        <div className="flex items-center gap-2 mb-5">
          <span className="text-sm" style={{ color: theme.text2 }}>Filtered by</span>
          <TagBadge tagId={activeTag} />
          <button
            onClick={() => setSearchParams({})}
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: theme.text2 }}
          >
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i}>
              <div className="skeleton h-6 w-24 mb-3 rounded-full" />
              <div className="space-y-2.5">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                    <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3.5 w-32" />
                      <div className="skeleton h-3 w-20" />
                    </div>
                    <div className="skeleton h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : sortedTags.length === 0 ? (
        <div className="text-center py-20" style={{ color: theme.text2 }}>
          <p>No tags yet. Add tags to your reminders to see them here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedTags.map(tag => {
            const tagged = tagMap.get(tag) ?? []
            return (
              <div key={tag}>
                <div className="flex items-center gap-3 mb-3">
                  <TagBadge tagId={tag} />
                  <span className="text-xs" style={{ color: theme.text2 }}>
                    {tagged.length} {tagged.length === 1 ? 'reminder' : 'reminders'}
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    {confirmDeleteTag === tag ? (
                      <>
                        <span className="text-xs" style={{ color: theme.text2 }}>Remove tag?</span>
                        <Button
                          onClick={() => deleteTagFromAll(tag)}
                          variant="danger"
                          size="sm"
                        >
                          Yes
                        </Button>
                        <Button
                          onClick={() => setConfirmDeleteTag(null)}
                          size="sm"
                        >
                          No
                        </Button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteTag(tag)}
                        className="p-1.5 rounded-md transition-opacity hover:opacity-70"
                        style={{ color: theme.text2 }}
                        title="Remove tag"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5">
                  {tagged.map(r => (
                    <ReminderCard
                      key={r.id}
                      reminder={r}
                      onEdit={() => setEditId(r.id)}
                      onDelete={() => deleteReminder(r.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
