import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

export const aInput =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-brand'
export const aBtn =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50'
export const aBtnGhost =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
export const aBtnDanger =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700'
export const aCard = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
export const aTableWrap = 'overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm'
export const aTh = 'bg-slate-50 px-3 py-3 text-left text-xs font-bold tracking-wide text-slate-500 uppercase'
export const aTd = 'border-t border-slate-100 px-3 py-3 text-sm'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="m-0 text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 mb-0 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

export function Badge({
  tone,
  children,
}: {
  tone: 'ok' | 'warn' | 'danger' | 'info' | 'muted' | 'violet' | 'orange'
  children: ReactNode
}) {
  const map = {
    ok: 'bg-emerald-50 text-emerald-700',
    warn: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-sky-50 text-sky-700',
    muted: 'bg-slate-100 text-slate-600',
    violet: 'bg-violet-50 text-violet-700',
    orange: 'bg-orange-50 text-orange-700',
  }
  return <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold', map[tone])}>{children}</span>
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="p-8 text-center text-sm text-slate-500">{children}</p>
}

export function Tabs({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (v: string) => void
  items: { id: string; label: string }[]
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            'cursor-pointer rounded-full border-0 px-3.5 py-2 text-sm font-bold',
            value === t.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 shadow-sm',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="mb-4 inline-block text-sm font-semibold text-slate-500 hover:text-brand">
      {children}
    </Link>
  )
}
