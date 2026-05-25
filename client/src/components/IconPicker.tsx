import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { DATE_ICONS } from '@/lib/dateIcons'
import { Input } from '@/components/ui'

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const { theme } = useTheme()
  const [search, setSearch] = useState('')

  const visible = search.trim()
    ? DATE_ICONS.filter(ic => ic.name.includes(search.toLowerCase()))
    : DATE_ICONS

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text2">Icon</p>
      <Input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search icons..."
        className="py-1.5 text-xs"
      />
      <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-1">
        {visible.map(ic => (
          <button
            key={ic.ch}
            type="button"
            title={ic.name}
            onClick={() => onChange(ic.ch)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-opacity hover:opacity-80"
            style={value === ic.ch
              ? { background: `${theme.accent}30`, outline: `2px solid ${theme.accent}` }
              : { background: theme.surface2 }
            }
          >
            {ic.ch}
          </button>
        ))}
      </div>
    </div>
  )
}
