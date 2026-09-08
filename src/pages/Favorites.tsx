import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { useStore } from '../context/StoreContext'
import { formatPrice, getProduct, triggeredAlerts } from '../lib/utils'
import { cn, container, empty, muted, productGrid, resultBox, section } from '../lib/cn'

export function Favorites() {
  const { favorites, alerts, removeAlert } = useStore()
  const fired = triggeredAlerts(alerts)

  return (
    <div className={cn(container, section)}>
      <h1>❤️ Mis favoritos</h1>
      {fired.length > 0 && (
        <div className={cn(resultBox, 'mb-5')}>
          <strong>Alertas</strong>
          {fired.map((a) => {
            const p = getProduct(a.productId)
            return (
              <p key={a.id}>
                🔔 {p?.name} {a.type === 'price' ? `bajó de ${formatPrice(a.targetPrice ?? 0)}` : 'volvió a estar disponible'}
                <button type="button" className="ml-2 cursor-pointer border-0 bg-transparent text-[0.8rem] text-muted" onClick={() => removeAlert(a.id)}>Descartar</button>
              </p>
            )
          })}
        </div>
      )}
      <div className={productGrid}>
        {favorites.map((f) => {
          const p = getProduct(f.productId)
          if (!p) return null
          const dropped = p.price < f.priceWhenAdded
          return (
            <div key={f.productId}>
              <ProductCard product={p} />
              <p className={cn(muted, 'px-2')}>
                Precio al guardar: {formatPrice(f.priceWhenAdded)}
                {dropped && <span> · bajó {formatPrice(f.priceWhenAdded - p.price)}</span>}
              </p>
            </div>
          )
        })}
      </div>
      {!favorites.length && (
        <div className={empty}>
          Todavía no guardaste productos. <Link to="/productos">Explorar</Link>
        </div>
      )}
    </div>
  )
}
