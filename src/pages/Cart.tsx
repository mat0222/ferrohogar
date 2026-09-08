import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { Quantity } from '../components/ui/Quantity'
import { useStore } from '../context/StoreContext'
import { products } from '../data/catalog'
import { cartTotals, formatPrice, FREE_SHIPPING, getProduct } from '../lib/utils'
import { btnPrimary, cn, container, empty, muted, productGrid, split, summary } from '../lib/cn'

export function Cart() {
  const { cart, setQty, removeFromCart } = useStore()
  const items = cart.map((i) => ({ ...i, product: getProduct(i.productId) })).filter((i) => i.product)
  const totals = cartTotals(cart)
  const missing = Math.max(0, FREE_SHIPPING - (totals.subtotal - totals.discount))
  const recs = products.filter((p) => ['p41', 'p20', 'p35', 'p38'].includes(p.id))

  if (!items.length) {
    return (
      <div className={cn(container, empty)}>
        <h1>Tu carrito está vacío</h1>
        <Link to="/productos" className={btnPrimary}>Ir a productos</Link>
      </div>
    )
  }

  return (
    <div className={cn(container, split)}>
      <div>
        <h1>Carrito</h1>
        {items.map((i) =>
          i.product ? (
            <article key={i.productId} className="mb-2.5 grid grid-cols-[72px_1fr] items-center gap-3.5 rounded-xl border border-line bg-white p-3 sm:grid-cols-[90px_1fr_auto_auto]">
              <SafeImage className="h-[90px] w-[90px] rounded-lg object-cover" src={i.product.images[0]} alt="" />
              <div>
                <Link to={`/productos/${i.product.slug}`}><strong>{i.product.name}</strong></Link>
                <p className={muted}>{i.product.brand}</p>
                <button type="button" className="cursor-pointer border-0 bg-transparent py-1 text-[0.8rem] text-muted" onClick={() => removeFromCart(i.productId)}>Quitar</button>
              </div>
              <Quantity value={i.quantity} max={i.product.stock} onChange={(n) => setQty(i.productId, n)} />
              <strong>{formatPrice(i.product.price * i.quantity)}</strong>
            </article>
          ) : null,
        )}
        <h2 className="mt-7">Antes de finalizar, quizás te interese...</h2>
        <div className={productGrid}>
          {recs.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      <aside className={summary}>
        <h3>Resumen</h3>
        {missing > 0 ? (
          <p>🚚 Te faltan {formatPrice(missing)} para obtener envío gratis.</p>
        ) : (
          <p>🚚 ¡Tenés envío gratis!</p>
        )}
        <div className="my-2 mb-3.5 h-2 overflow-hidden rounded-full bg-[#eee]">
          <i className="block h-full bg-brand" style={{ width: `${Math.min(100, ((FREE_SHIPPING - missing) / FREE_SHIPPING) * 100)}%` }} />
        </div>
        <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
          <dt>Subtotal</dt>
          <dd className="m-0">{formatPrice(totals.subtotal)}</dd>
          <dt>Descuentos</dt>
          <dd className="m-0">-{formatPrice(totals.discount)}</dd>
          <dt>Envío</dt>
          <dd className="m-0">{totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}</dd>
          <dt>Total</dt>
          <dd className="m-0"><strong>{formatPrice(totals.total)}</strong></dd>
        </dl>
        <Link to="/checkout" className={cn(btnPrimary, 'mt-3 w-full')}>Finalizar compra</Link>
      </aside>
    </div>
  )
}
