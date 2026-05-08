import { useTheme } from '@/contexts/ThemeContext'

const apps = [
  {
    name: 'Stashy',
    description: 'Self-hosted media gallery for browsing photos and videos over LAN with album support.',
    url: 'https://github.com/larsmikki/stashy',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stashy-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#fb7185"/>
            <stop offset="100%" stopColor="#be185d"/>
          </linearGradient>
          <linearGradient id="stashy-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="white" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#stashy-bg)"/>
        <rect width="36" height="20" rx="10" fill="url(#stashy-sh)"/>
        <rect x="7" y="8" width="16" height="12" rx="2" fill="white" opacity="0.30"/>
        <rect x="10" y="11" width="16" height="12" rx="2" fill="white" opacity="0.58"/>
        <rect x="13" y="14" width="16" height="12" rx="2" fill="white" opacity="0.95"/>
      </svg>
    ),
  },
  {
    name: 'Remindy',
    description: 'Self-hosted birthday reminder app — no database, JSON storage, dark mode, 10+ themes.',
    url: 'https://github.com/larsmikki/remindy',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="remindy-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <linearGradient id="remindy-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="white" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#remindy-bg)"/>
        <rect width="36" height="20" rx="10" fill="url(#remindy-sh)"/>
        <g transform="translate(18,17) scale(0.72) translate(-18,-17)">
          <circle cx="23" cy="15" r="7.5" fill="white" opacity="0.28"/>
          <path d="M21 22.5 L23 25.5 L25 22.5Z" fill="white" opacity="0.28"/>
          <circle cx="15" cy="15" r="8" fill="white" opacity="0.92"/>
          <circle cx="18" cy="11" r="2.5" fill="white" opacity="0.38"/>
          <path d="M13 23 L15 26.5 L17 23Z" fill="white" opacity="0.85"/>
          <path d="M15 26.5 Q18 29 16 29" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.65"/>
        </g>
      </svg>
    ),
  },
  {
    name: 'Boxy',
    description: 'Self-hosted game collection tracker with box art, condition ratings, and market values.',
    url: 'https://github.com/larsmikki/boxy',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="boxy-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#a3e635"/>
            <stop offset="100%" stopColor="#65a30d"/>
          </linearGradient>
          <linearGradient id="boxy-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="white" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#boxy-bg)"/>
        <rect width="36" height="20" rx="10" fill="url(#boxy-sh)"/>
        <polygon points="18,7 28,13 18,19 8,13" fill="white" opacity="0.95"/>
        <polygon points="28,13 28,25 18,31 18,19" fill="white" opacity="0.55"/>
        <polygon points="8,13 18,19 18,31 8,25" fill="white" opacity="0.3"/>
      </svg>
    ),
  },
  {
    name: 'Budgety',
    description: 'Self-hosted annual budget planner with monthly breakdowns and running balances.',
    url: 'https://github.com/larsmikki/budgety',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="budgety-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#4ade80"/>
            <stop offset="100%" stopColor="#15803d"/>
          </linearGradient>
          <linearGradient id="budgety-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="white" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#budgety-bg)"/>
        <rect width="36" height="20" rx="10" fill="url(#budgety-sh)"/>
        <rect x="9" y="21" width="4.5" height="7" rx="1" fill="white" opacity="0.7"/>
        <rect x="15.75" y="15" width="4.5" height="13" rx="1" fill="white" opacity="0.85"/>
        <rect x="22.5" y="9" width="4.5" height="19" rx="1" fill="white" opacity="1"/>
      </svg>
    ),
  },
  {
    name: 'Linky',
    description: 'Self-hosted bookmark launcher with a drag-and-drop grid and auto-fetched favicons.',
    url: 'https://github.com/larsmikki/linky',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="linky-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#7dd3fc"/>
            <stop offset="100%" stopColor="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="linky-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="white" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#linky-bg)"/>
        <rect width="36" height="20" rx="10" fill="url(#linky-sh)"/>
        <rect x="5" y="14" width="16" height="8" rx="4" fill="none" stroke="white" strokeWidth="2.5"/>
        <rect x="15" y="14" width="16" height="8" rx="4" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
      </svg>
    ),
  },
  {
    name: 'Promptly',
    description: 'Self-hosted AI prompt library with search, categories, themes, and 100+ built-in prompts.',
    url: 'https://github.com/larsmikki/promptly',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="promptly-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
          <linearGradient id="promptly-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="white" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#promptly-bg)"/>
        <rect width="36" height="20" rx="10" fill="url(#promptly-sh)"/>
        <line x1="9" y1="13" x2="27" y2="13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="9" y1="18" x2="22" y2="18" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.8"/>
        <line x1="9" y1="23" x2="18" y2="23" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.55"/>
      </svg>
    ),
  },
]

const DonatePage = () => {
  const { theme } = useTheme()

  const sectionStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>
          Support Remindy
        </h1>
        <p className="text-sm mt-0.5" style={{ color: theme.text2 }}>
          I build privacy-first, self-hosted tools — no subscriptions, no ads, no tracking.
          Your data stays yours. If this saves you time, consider supporting the work.
        </p>
      </div>

      {/* Values */}
      <div style={{ ...sectionStyle }}>
        <h2 className="text-base font-bold mb-1" style={{ color: theme.text }}>What you get</h2>
        <p className="text-xs mb-4" style={{ color: theme.text2 }}>
          Remindy is and always will be free, open source, and self-hosted.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { icon: '🛡️', label: '100% Free Forever', color: '#22c55e' },
            { icon: '🔒', label: 'No Ads or Tracking', color: '#f59e0b' },
            { icon: '💾', label: 'Your data, your device', color: '#16a34a' },
          ].map(({ icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: `${color}15`, color, border: `1px solid ${color}20` }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Donate options */}
      <div style={sectionStyle}>
        <h2 className="text-base font-bold mb-1" style={{ color: theme.text }}>Donate</h2>
        <p className="text-xs mb-5" style={{ color: theme.text2 }}>
          One-time donations via Buy Me a Coffee or PayPal. Any amount is appreciated.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { emoji: '☕', title: 'Buy Me a Coffee', sub: 'One-time donation, any amount', url: 'https://www.buymeacoffee.com/remindy', label: '☕ Buy Me a Coffee' },
            { emoji: '💙', title: 'PayPal', sub: 'Quick & secure donation', url: 'https://paypal.me/remindy', label: '💙 Donate via PayPal' },
          ].map(({ emoji, title, sub, url, label }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-4 rounded-xl p-6"
              style={{ background: theme.surface2, border: `1px solid ${theme.border}` }}
            >
              <div className="text-4xl">{emoji}</div>
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color: theme.text }}>{title}</h3>
                <p className="text-xs" style={{ color: theme.text2 }}>{sub}</p>
              </div>
              <button
                onClick={() => window.open(url, '_blank')}
                className="w-full py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: theme.gradient, boxShadow: `0 4px 14px ${theme.accent}30` }}
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* App Suite */}
      <div style={sectionStyle}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold" style={{ color: theme.text }}>More apps</h2>
          <a
            href="https://github.com/larsmikki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: theme.accent }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
        <p className="text-xs mb-4" style={{ color: theme.text2 }}>
          A suite of free, self-hosted tools built for privacy and simplicity.
        </p>
        <div className="flex flex-col gap-3">
          {apps.map(({ name, description, url, icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-opacity hover:opacity-80"
              style={{ background: theme.surface2, border: `1px solid ${theme.border}` }}
            >
              <div className="shrink-0">{icon}</div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight" style={{ color: theme.text }}>{name}</div>
                <div className="text-xs mt-0.5 leading-snug" style={{ color: theme.text2 }}>{description}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Thank you */}
      <div style={{ ...sectionStyle, marginBottom: 0 }}>
        <h2 className="text-base font-bold mb-1" style={{ color: theme.text }}>Thank You!</h2>
        <p className="text-xs" style={{ color: theme.text2 }}>
          Every bit of support keeps Remindy free for everyone. Keep reminding!
        </p>
      </div>
    </div>
  )
}

export default DonatePage
