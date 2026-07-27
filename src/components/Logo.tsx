interface LogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 22, text: 1, gap: 0.45 },
  md: { icon: 30, text: 1.2, gap: 0.55 },
  lg: { icon: 40, text: 1.55, gap: 0.65 },
}

export function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const s = sizes[size]
  const color = variant === 'light' ? '#ffffff' : '#0B6E6E'
  const accent = variant === 'light' ? '#7EE0D6' : '#14A3A3'

  return (
    <div
      className="logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${s.gap}rem`,
        color,
      }}
      aria-label="CoolCard"
    >
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="64" height="64" rx="14" fill={color} />
        <path
          d="M18 20h16a10 10 0 0 1 0 20H26v8H18V20zm8 12h8a4 4 0 0 0 0-8H26v8z"
          fill={variant === 'light' ? '#0B6E6E' : '#ffffff'}
        />
        <circle
          cx="44"
          cy="42"
          r="8"
          stroke={accent}
          strokeWidth="4"
          fill="none"
        />
      </svg>
      <span
        style={{
          fontWeight: 800,
          fontSize: `${s.text}rem`,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        Cool<span style={{ fontWeight: 600, opacity: 0.9 }}>Card</span>
      </span>
    </div>
  )
}
