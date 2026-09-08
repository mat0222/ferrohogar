import { ProductCard } from '../components/product/ProductCard'
import { useAdmin } from '../admin/context'
import { cn, container, muted, productGrid, section } from '../lib/cn'

export function Offers() {
  const { state } = useAdmin()
  const list = state.products.filter((p) => !p.hidden && (p.offer || p.promo || (p.stock > 0 && p.stock <= 5)))
  return (
    <div className={cn(container, section)}>
      <h1>Ofertas dinámicas</h1>
      <p className={muted}>Descuentos, últimas unidades y promociones por cantidad.</p>
      <div className={cn(productGrid, 'mt-6')}>
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
