import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { CategoryIcon } from '../components/CategoryIcon'
import { assistantIntents, kits, products, projectNeeds } from '../data/catalog'
import { useStore } from '../context/StoreContext'
import { formatPrice, getProduct } from '../lib/utils'
import { calculators } from '../lib/calculators'
import { btnOutline, btnPrimary, card, choiceOn, cn, container, field, fourGrid, input, muted, panel, productGrid, resultBox, section } from '../lib/cn'

export function Assistant() {
  const [params] = useSearchParams()
  const initial = params.get('need') ?? ''
  const [intent, setIntent] = useState(initial ? 'pintar' : '')
  const [needId, setNeedId] = useState(initial)
  const { addManyToCart } = useStore()
  const [area, setArea] = useState(30)

  const need = projectNeeds.find((n) => n.id === needId)
  const intentData = assistantIntents.find((i) => i.id === intent)
  const recIds = need?.productIds ?? intentData?.productIds ?? []
  const recs = recIds.map(getProduct).filter(Boolean)
  const kit = kits.find((k) => k.id === need?.kitId)
  const paint = useMemo(() => calculators.pintura.compute({ area, coats: 2, yield: 10 }), [area])

  return (
    <div className={cn(container, section)}>
      <h1>Encontrá lo que necesitás</h1>
      <p className={muted}>¿Qué estás buscando?</p>
      <div className={fourGrid}>
        {assistantIntents.map((i) => (
          <button key={i.id} type="button" className={cn(card, 'text-left', intent === i.id && choiceOn)} onClick={() => { setIntent(i.id); setNeedId(i.id === 'pintar' ? 'pintar' : i.id === 'instalar' ? 'luz' : i.id === 'reparar' ? 'pared' : '') }}>
            <CategoryIcon name={i.icon} />
            <h3>{i.title}</h3>
          </button>
        ))}
      </div>

      <h2 className="mt-8">Proyectos frecuentes</h2>
      <div className={fourGrid}>
        {projectNeeds.map((n) => (
          <button key={n.id} type="button" className={cn(card, 'text-left', needId === n.id && choiceOn)} onClick={() => setNeedId(n.id)}>
            <CategoryIcon name={n.icon} />
            <h3>{n.title}</h3>
            <p className={muted}>{n.description}</p>
          </button>
        ))}
      </div>

      {intent === 'pintar' && (
        <div className={cn(panel, 'mt-6')}>
          <h3>Necesito pintar {area} m²</h3>
          <label className={field}>Superficie
            <input className={input} type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
          </label>
          <div className={resultBox}>
            <strong>{paint.label}</strong>
            <p>{paint.detail}</p>
          </div>
        </div>
      )}

      {kit && (
        <div className={cn(panel, 'mt-5')}>
          <h2>{kit.name}</h2>
          <p>{kit.description}</p>
          <p><strong>{formatPrice(kit.productIds.reduce((n, id) => n + (getProduct(id)?.price ?? 0), 0))}</strong></p>
          <div className="flex gap-2">
            <Link className={btnPrimary} to={`/kits/${kit.slug}`}>Comprar kit completo →</Link>
            <button type="button" className={btnOutline} onClick={() => addManyToCart(kit.productIds)}>Comprá todo junto</button>
          </div>
        </div>
      )}

      <div className={cn(productGrid, 'mt-7')}>
        {recs.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
      {!recs.length && (
        <p className={cn(muted, 'mt-4')}>Elegí una opción para ver productos recomendados. El catálogo tiene {products.length} ítems.</p>
      )}
    </div>
  )
}
