import { useStore } from '../../context/StoreContext'
import { cn } from '../../lib/cn'

export function Toasts() {
  const { toasts } = useStore()
  if (!toasts.length) return null
  return (
    <div className="fixed top-[18px] right-[18px] z-[80] grid gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={cn('rounded-[10px] px-4 py-3 text-white shadow-card', t.type === 'info' ? 'bg-[#333]' : 'bg-ink')}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
