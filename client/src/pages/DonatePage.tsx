import { useTheme } from '@/contexts/ThemeContext'
import { Button, Surface } from '@/components/ui'

const values = [
  { label: '100% free forever', color: '#22c55e', icon: ShieldIcon },
  { label: 'No ads or tracking', color: '#f59e0b', icon: LockIcon },
  { label: 'Your data, your device', color: null, icon: DriveIcon },
]

const donateOptions = [
  {
    title: 'Buy Me a Coffee',
    sub: 'One-time donation, any amount',
    url: 'https://www.buymeacoffee.com/remindy',
    label: 'Buy Me a Coffee',
    icon: CoffeeIcon,
  },
  {
    title: 'PayPal',
    sub: 'Quick and secure donation',
    url: 'https://paypal.me/remindy',
    label: 'Donate via PayPal',
    icon: WalletIcon,
  },
]

export default function DonatePage() {
  const { theme } = useTheme()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Support Remindy</h1>
        <p className="text-sm mt-0.5 text-text2">
          I build privacy-first, self-hosted tools with no subscriptions, no ads, and no tracking.
          Your data stays yours.
        </p>
      </div>

      <Surface className="p-6 mb-5">
        <h2 className="text-base font-bold mb-1 text-text">What you get</h2>
        <p className="text-xs mb-4 text-text2">Remindy stays small, open, and self-hosted.</p>
        <div className="flex items-center gap-3 flex-wrap">
          {values.map(({ label, color, icon: Icon }) => {
            const badgeColor = color ?? theme.accent
            return (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}20` }}
              >
                <Icon />
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      </Surface>

      <Surface className="p-6 mb-5">
        <h2 className="text-base font-bold mb-1 text-text">Donate</h2>
        <p className="text-xs mb-5 text-text2">One-time donations through Buy Me a Coffee or PayPal.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {donateOptions.map(({ title, sub, url, label, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-4 rounded-xl p-6"
              style={{ background: theme.surface2, border: `1px solid ${theme.border}` }}
            >
              <div className="h-9 w-9 flex items-center justify-center" style={{ color: theme.accent }}>
                <Icon size="lg" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-snug text-text">{title}</h3>
                <p className="text-xs mt-1 text-text2">{sub}</p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
              >
                {label}
              </Button>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="p-6">
        <h2 className="text-base font-bold mb-1 text-text">Thank you</h2>
        <p className="text-xs text-text2">Every bit of support helps keep Remindy available for everyone.</p>
      </Surface>
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 2.25c.22 0 .437.045.64.132l5 2.143c.37.158.61.521.61.924v3.22c0 4.033-2.51 7.64-6.293 9.038a1 1 0 01-.694 0C5.48 16.31 2.97 12.702 2.97 8.67V5.45c0-.403.24-.766.61-.924l5-2.143c.203-.087.42-.132.64-.132z" clipRule="evenodd" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5 8V6a5 5 0 0110 0v2h.5A1.5 1.5 0 0117 9.5v6A1.5 1.5 0 0115.5 17h-11A1.5 1.5 0 013 15.5v-6A1.5 1.5 0 014.5 8H5zm2 0h6V6a3 3 0 10-6 0v2z" clipRule="evenodd" />
    </svg>
  )
}

function DriveIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 016.5 2h7A2.5 2.5 0 0116 4.5v11A2.5 2.5 0 0113.5 18h-7A2.5 2.5 0 014 15.5v-11zM7 5a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7zm3 6a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z" />
    </svg>
  )
}

function CoffeeIcon({ size }: { size?: 'lg' }) {
  const cls = size === 'lg' ? 'h-9 w-9' : 'h-4 w-4'
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 8a1 1 0 011-1h11a1 1 0 011 1v1h1.5a3.5 3.5 0 010 7H17a5 5 0 01-5 5H9a5 5 0 01-5-5V8zm13 3v3h1.5a1.5 1.5 0 000-3H17zM6 9v7a3 3 0 003 3h3a3 3 0 003-3V9H6zM8 2.5a1 1 0 011 1V5a1 1 0 11-2 0V3.5a1 1 0 011-1zm4 0a1 1 0 011 1V5a1 1 0 11-2 0V3.5a1 1 0 011-1z" />
    </svg>
  )
}

function WalletIcon({ size }: { size?: 'lg' }) {
  const cls = size === 'lg' ? 'h-9 w-9' : 'h-4 w-4'
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 016.5 3H17a2 2 0 012 2v1h.5A2.5 2.5 0 0122 8.5v8A2.5 2.5 0 0119.5 19h-13A4.5 4.5 0 012 14.5v-9h2zm2.5-.5A.5.5 0 006 5.5V6h11V5H6.5zM4 8v6.5A2.5 2.5 0 006.5 17h13a.5.5 0 00.5-.5v-8a.5.5 0 00-.5-.5H4zm12.5 3H19v3h-2.5a1.5 1.5 0 010-3z" />
    </svg>
  )
}
