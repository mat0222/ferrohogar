import { useId } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

function GearMark({ size = 44 }: { size?: number }) {
  const uid = useId().replace(/:/g, '')
  const metal = `ferro-metal-${uid}`
  const glow = `ferro-glow-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id={metal} x1="18%" y1="8%" x2="88%" y2="96%">
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="42%" stopColor="#FF7A22" />
          <stop offset="100%" stopColor="#E03A00" />
        </linearGradient>
        <filter id={glow} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="32" cy="32" r="29" fill="#FF5A1F" opacity="0.22" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="26.5"
          y="2.5"
          width="11"
          height="15"
          rx="2.2"
          fill={`url(#${metal})`}
          transform={`rotate(${i * 45} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="19.5" fill={`url(#${metal})`} filter={`url(#${glow})`} />
      <circle cx="32" cy="32" r="12.2" fill="#1a1a1a" />
      <g fill={`url(#${metal})`} transform="rotate(-38 32 32)">
        <rect x="29.6" y="20" width="4.8" height="24" rx="1.4" />
        <rect x="23.2" y="18.5" width="17.6" height="7" rx="1.4" />
      </g>
    </svg>
  )
}

export function Logo({ compact = false, stacked = false }: { compact?: boolean; stacked?: boolean }) {
  return (
    <Link
      to="/"
      className={cn('flex text-white', stacked ? 'flex-col items-start gap-2' : 'items-center gap-2.5')}
      aria-label="FerroHogar"
    >
      <GearMark size={stacked ? 52 : compact ? 36 : 44} />
      <span className="flex flex-col leading-none">
        <strong className={cn('font-display tracking-[0.04em]', stacked ? 'text-[1.55rem]' : 'text-[1.35rem]')}>
          <span className="text-white">FERRO</span>
          <span className="text-brand">HOGAR</span>
        </strong>
        {!compact && (
          <em
            className={cn(
              'mt-1.5 text-[0.58rem] not-italic tracking-[0.14em] text-white/80',
              stacked ? 'block' : 'hidden sm:block',
            )}
          >
            TU PROYECTO, NUESTRA HERRAMIENTA
          </em>
        )}
      </span>
    </Link>
  )
}
