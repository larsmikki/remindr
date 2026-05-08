import { useTheme } from '@/contexts/ThemeContext'

interface TagBadgeProps {
  tagId: string
  className?: string
  onClick?: () => void
}

export default function TagBadge({ tagId, className = '', onClick }: TagBadgeProps) {
  const { theme } = useTheme()

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-opacity hover:opacity-70 ${className}`}
        style={{ background: `${theme.accent}18`, color: theme.accent }}
      >
        {tagId}
      </button>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{ background: `${theme.accent}18`, color: theme.accent }}
    >
      {tagId}
    </span>
  )
}
