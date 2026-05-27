import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, THEMES, type ThemeDefinition } from '@/contexts/ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeDefinition>(() => {
    const stored = localStorage.getItem('remindy-theme')
    if (!stored) return THEMES[0]
    if (stored === 'light') return THEMES.find(t => t.name === 'Default') || THEMES[0]
    if (stored === 'dark') return THEMES.find(t => t.name === 'Dark') || THEMES[0]
    const found = THEMES.find(t => t.name === stored)
    return found || THEMES[0]
  })

  useEffect(() => {
    localStorage.setItem('remindy-theme', theme.name)
    document.documentElement.classList.toggle('dark', theme.mode === 'dark')

    const root = document.documentElement
    root.style.setProperty('--theme-bg', theme.bg)
    root.style.setProperty('--theme-surface', theme.surface)
    root.style.setProperty('--theme-surface2', theme.surface2)
    root.style.setProperty('--theme-border', theme.border)
    root.style.setProperty('--theme-text', theme.text)
    root.style.setProperty('--theme-text2', theme.text2)
    root.style.setProperty('--theme-accent', theme.accent)
    root.style.setProperty('--theme-gradient', theme.gradient)

    const accentMatch = theme.accent.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/)
    if (accentMatch) {
      const r = parseInt(accentMatch[1], 16)
      const g = parseInt(accentMatch[2], 16)
      const b = parseInt(accentMatch[3], 16)
      root.style.setProperty('--theme-accent-rgb', `${r}, ${g}, ${b}`)
      const gradientStops = theme.gradient.match(/#[0-9a-f]{6}/gi)
      root.style.setProperty('--theme-accent-light', gradientStops?.[0] ?? theme.accent)
      root.style.setProperty('--theme-accent-dark', gradientStops?.[1] ?? theme.accent)
    }
  }, [theme])

  const setThemeByName = (name: string) => {
    const found = THEMES.find(t => t.name === name)
    if (found) setTheme(found)
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  )
}
