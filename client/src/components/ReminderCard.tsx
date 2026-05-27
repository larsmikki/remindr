import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import TagBadge from '@/components/TagBadge'
import { DEFAULT_ICON } from '@/utils/dateIcons'
import { daysUntil, daysLabel, formatBirthday, ageFromDate } from '@/utils/dateUtils'
import type { Reminder } from '@/types'
import { Button } from '@/components/ui'

interface Props {
  reminder: Reminder
  onEdit: () => void
  onDelete: () => void
}

export default function ReminderCard({ reminder: r, onEdit, onDelete }: Props) {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const days = daysUntil(r.date)
  const isToday    = days === 0
  const isSoon     = days <= 7
  const isUpcoming = days <= 30
  const ageYears   = ageFromDate(r.date)

  return (
    <div
      className="group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all card-hover"
      style={{
        background:  theme.surface,
        border:      `1px solid ${isToday ? `${theme.accent}60` : theme.border}`,
        boxShadow:   isToday ? `0 0 0 1px ${theme.accent}20` : 'var(--shadow-card-soft)',
      }}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center select-none text-xl"
        style={{ background: `${theme.accent}15` }}
      >
        {r.icon || DEFAULT_ICON}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate" style={{ color: theme.text }}>
          {r.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-xs" style={{ color: theme.text2 }}>
            {formatBirthday(r.date)}
          </span>
          {r.tags && r.tags.length > 0 && (
            r.tags.map(t => <TagBadge key={t} tagId={t} onClick={() => navigate(`/tags?tag=${encodeURIComponent(t)}`)} />)
          )}
        </div>
      </div>

      {/* Age pill */}
      {ageYears !== null && (
        <span
          className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: theme.surface2, color: theme.text2 }}
        >
          {ageYears} yr{ageYears !== 1 ? 's' : ''}
        </span>
      )}

      {/* Days badge */}
      <span
        className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={
          isToday    ? { background: theme.accent,          color: '#fff' } :
          isSoon     ? { background: `${theme.accent}22`,   color: theme.accent } :
          isUpcoming ? { background: `${theme.accent}12`,   color: theme.accent } :
                       { background: theme.surface2,         color: theme.text2 }
        }
      >
        {daysLabel(days)}
      </span>

      {/* Actions */}
      {confirmDelete ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs" style={{ color: theme.text2 }}>Delete?</span>
          <Button
            onClick={onDelete}
            variant="danger"
            size="sm"
          >
            Yes
          </Button>
          <Button
            onClick={() => setConfirmDelete(false)}
            size="sm"
          >
            No
          </Button>
        </div>
      ) : (
        <div
          className="absolute right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg px-1"
          style={{ background: theme.surface }}
        >
          <button onClick={onEdit} className="p-1.5 rounded-md hover:opacity-70" style={{ color: theme.text2 }} title="Edit">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-md hover:opacity-70" style={{ color: theme.text2 }} title="Delete">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
