import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { useStore } from '../context/StoreContext'
import { kits } from '../data/catalog'
import { formatPrice, getProduct } from '../lib/utils'
import { btnPrimary, card, cn, container, crumb, empty, fourGrid, muted, panel, productGrid, section, split } from '../lib/cn'

export function KitDetail() {
  const { slug } = useParams()
  const kit = kits.find((k) => k.slug === slug)
  const { addManyToCart } = useStore()
  if (!kit) return <div className={cn(container, empty)}>Kit no encontrado.</div>
  const items = kit.productIds.map(getProduct).filter(Boolean)
  const total = items.reduce((n, p) => n + (p?.price ?? 0), 0)

  return (
    <div className={cn(container, section)}>
      <p className={crumb}><Link to="/kits">Kits</Link> / {kit.name}</p>
      <div className={split}>
        <SafeImage src={kit.image} alt="" className="max-h-[360px] w-full rounded-2xl object-cover" />
        <div className={panel}>
          <h1>{kit.name}</h1>
          <p>{kit.description}</p>
          <p><strong>{formatPrice(total)}</strong></p>
          <button type="button" className={cn(btnPrimary, 'w-full')} onClick={() => addManyToCart(kit.productIds)}>
            Comprar kit completo →
          </button>
        </div>
      </div>
      <h2 className="mt-7">Incluye</h2>
      <div className={productGrid}>
        {items.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}

export function Kits() {
  return (
    <div className={cn(container, section)}>
      <h1>Kits inteligentes</h1>
      <div className={fourGrid}>
        {kits.map((kit) => (
          <Link key={kit.id} to={`/kits/${kit.slug}`} className={card}>
            <SafeImage src={kit.image} alt="" className="mb-3 h-[140px] w-full rounded-[10px] object-cover" />
            <h3>{kit.name}</h3>
            <p className={muted}>{kit.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
