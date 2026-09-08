import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { products } from '../../data/catalog'
import { SafeImage } from '../SafeImage'
import { btnDisabled, btnGhost, btnPrimary, cn, container } from '../../lib/cn'

export function CompareBar() {
  const { compareIds, toggleCompare, clearCompare } = useStore()
  if (compareIds.length === 0) return null
  const items = compareIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className="sticky bottom-0 z-30 bg-ink py-2.5 text-white">
      <div className={cn(container, 'flex items-center gap-4')}>
        <p className="m-0">
          Comparador <span>{items.length}/3</span>
        </p>
        <div className="flex flex-1 gap-2">
          {items.map((p) =>
            p ? (
              <button key={p.id} type="button" className="cursor-pointer border-0 bg-transparent p-0" onClick={() => toggleCompare(p.id)} title="Quitar">
                <SafeImage className="h-12 w-12 rounded-lg object-cover" src={p.images[0]} alt={p.name} />
              </button>
            ) : null,
          )}
        </div>
        <div className="flex gap-2">
          <Link to="/comparar" className={cn(btnPrimary, items.length < 2 && btnDisabled)}>
            Comparar
          </Link>
          <button type="button" className={cn(btnGhost, 'border-[#444]')} onClick={clearCompare}>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}
