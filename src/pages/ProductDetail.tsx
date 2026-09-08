import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CreditCard, ShieldCheck, Truck } from 'lucide-react'
import { ProductCard } from '../components/product/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { Stars } from '../components/product/Stars'
import { Quantity } from '../components/ui/Quantity'
import { useStore } from '../context/StoreContext'
import { useAdmin } from '../admin/context'
import { discountPercent, formatPrice, getProduct, stockLabel, waLink } from '../lib/utils'
import {
  btnOutline,
  btnPrimary,
  cn,
  container,
  crumb,
  empty,
  field,
  formGrid,
  formTwo,
  input,
  muted,
  panel,
  productGrid,
  section,
  tabBtn,
  tabOn,
  table,
  thtd,
} from '../lib/cn'

export function ProductDetail() {
  const { slug } = useParams()
  const { state } = useAdmin()
  const product = state.products.find((p) => p.slug === slug && !p.hidden)
  const { addToCart, toggleFavorite, isFavorite, addReview, reviews, user, addAlert } = useStore()
  const [qty, setQty] = useState(1)
  const [photo, setPhoto] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc')
  const [comment, setComment] = useState('')
  const [stars, setStars] = useState(5)
  const navigate = useNavigate()

  const productReviews = useMemo(
    () => (product ? reviews.filter((r) => r.productId === product.id) : []),
    [reviews, product],
  )

  if (!product) {
    return (
      <div className={cn(container, empty)}>
        Producto no encontrado. <Link to="/productos">Volver</Link>
      </div>
    )
  }

  const related = product.relatedIds.map(getProduct).filter(Boolean)
  const also = product.alsoNeedIds.map(getProduct).filter(Boolean)
  const discount = discountPercent(product)
  const box = 'mt-3.5 rounded-xl border border-line bg-white p-3.5 text-[0.92rem]'

  return (
    <div className={container}>
      <p className={crumb}>
        <Link to="/">Inicio</Link> / <Link to="/productos">Productos</Link> / {product.name}
      </p>
      <div className="grid gap-9 py-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-[14px] border border-line bg-white p-4">
          <div className="cursor-zoom-in overflow-hidden rounded-[10px] bg-[#fafafa]" onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}>
            <SafeImage className={cn('h-[420px] w-full object-contain transition', zoom && 'scale-[1.55]')} src={product.images[photo]} alt={product.name} />
          </div>
          <div className="mt-2.5 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={cn('h-[72px] w-[72px] overflow-hidden rounded-lg border-2 bg-[#f3f3f3] p-0', i === photo ? 'border-brand' : 'border-transparent')}
                onClick={() => setPhoto(i)}
              >
                <SafeImage className="h-full w-full object-cover" src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="m-0 text-[0.7rem] font-bold tracking-[0.08em] text-muted uppercase">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="text-xs text-muted">Código {product.code}</p>
          <div className="flex items-center gap-1.5 text-[0.8rem] text-muted">
            <Stars value={product.rating} size={16} />
            <strong className="text-ink">{product.rating.toFixed(1)} / 5</strong>
            <span className={muted}>{product.reviewCount + productReviews.filter((r) => r.id.startsWith('rv')).length} opiniones</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <strong className="text-[1.8rem]">{formatPrice(product.price)}</strong>
            {product.previousPrice && <s className="text-muted">{formatPrice(product.previousPrice)}</s>}
            {discount > 0 && <span className="rounded-md bg-brand px-2 py-1 text-[0.72rem] font-extrabold text-white">-{discount}%</span>}
          </div>
          <p className={cn('text-[0.8rem]', product.stock <= 5 ? 'text-warn' : 'text-ok')}>{stockLabel(product.stock)}</p>
          {product.promo && (
            <p className={muted}>
              Promo: {product.promo.discountPercent}% off llevando {product.promo.minQty} o más.
            </p>
          )}
          <div className="my-4 flex flex-wrap gap-2.5">
            <Quantity value={qty} max={Math.max(1, product.stock)} onChange={setQty} />
            <button type="button" className={btnPrimary} disabled={product.stock <= 0} onClick={() => addToCart(product.id, qty)}>
              Agregar al carrito
            </button>
            <button type="button" className={btnOutline} onClick={() => toggleFavorite(product.id)}>
              {isFavorite(product.id) ? 'En favoritos' : 'Favoritos'}
            </button>
          </div>
          <div className={formTwo}>
            <button type="button" className={btnOutline} onClick={() => addAlert({ productId: product.id, type: 'price', targetPrice: Math.round(product.price * 0.9) })}>
              Avisarme si baja de {formatPrice(Math.round(product.price * 0.9))}
            </button>
            <button type="button" className={btnOutline} onClick={() => addAlert({ productId: product.id, type: 'stock' })}>
              Avisarme cuando haya stock
            </button>
          </div>
          <div className={cn(box, 'flex items-center gap-2')}>
            <CreditCard size={16} /> Tarjeta, transferencia y Mercado Pago. Hasta 12 cuotas.
          </div>
          <div className={cn(box, 'grid gap-2')}>
            <span className="flex items-center gap-2"><Truck size={16} /> Envío a domicilio o retiro en sucursal. Gratis desde $80.000.</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} /> Compra segura</span>
          </div>
          <a className={cn(btnOutline, 'mt-3')} href={waLink(`Hola, necesito ayuda para elegir ${product.name}.`)} target="_blank" rel="noreferrer">
            Hablar con un especialista
          </a>
        </div>
      </div>

      {product.specBars && (
        <section className={cn(panel, 'mb-6')}>
          <h2>Ficha técnica visual</h2>
          <p className={muted}>Uso recomendado: {product.usage}</p>
          {product.level && <p>Nivel {'★'.repeat(product.level)}{'☆'.repeat(5 - product.level)}</p>}
          <div className="my-[18px] grid gap-3">
            {product.specBars.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span>{s.label}</span>
                  <strong>{s.display}</strong>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#eee]">
                  <i className="block h-full bg-brand" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-7 mb-3 flex gap-2">
        <button type="button" className={cn(tabBtn, tab === 'desc' && tabOn)} onClick={() => setTab('desc')}>Descripción</button>
        <button type="button" className={cn(tabBtn, tab === 'specs' && tabOn)} onClick={() => setTab('specs')}>Especificaciones</button>
        <button type="button" className={cn(tabBtn, tab === 'reviews' && tabOn)} onClick={() => setTab('reviews')}>Reseñas</button>
      </div>
      {tab === 'desc' && <div className={panel}><p>{product.description}</p><ul>{product.features.map((f) => <li key={f}>{f}</li>)}</ul></div>}
      {tab === 'specs' && (
        <div className={panel}>
          <table className={table}>
            <tbody>
              {product.specs.map((s) => (
                <tr key={s.label}>
                  <th className={thtd}>{s.label}</th>
                  <td className={thtd}>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'reviews' && (
        <div>
          {productReviews.map((r) => (
            <article key={r.id} className="mb-3 rounded-xl border border-line bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <strong>{r.author}</strong>
                <span className={muted}>{r.date} {r.verified && '· Compra verificada'}</span>
              </div>
              <Stars value={r.rating} />
              <p>{r.comment}</p>
              {r.photos.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {r.photos.map((src) => (
                    <SafeImage key={src} className="h-[72px] w-[72px] rounded-lg object-cover" src={src} alt="" />
                  ))}
                </div>
              )}
            </article>
          ))}
          <form
            className={cn(panel, formGrid)}
            onSubmit={(e) => {
              e.preventDefault()
              addReview({
                productId: product.id,
                author: user?.name || 'Cliente FerroHogar',
                rating: stars,
                comment,
                photos: [],
                verified: Boolean(user),
              })
              setComment('')
            }}
          >
            <h3>Dejá tu reseña</h3>
            <label className={field}>
              Estrellas
              <select className={input} value={stars} onChange={(e) => setStars(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className={field}>
              Comentario
              <textarea className={input} required rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </label>
            <button className={btnPrimary} type="submit">Publicar</button>
          </form>
        </div>
      )}

      <section className={section}>
        <h2>También necesitás</h2>
        <p className={muted}>Completá el trabajo de una sola vez.</p>
        <div className={productGrid}>
          {also.map((p) => p && <ProductCard key={p.id} product={p} />)}
        </div>
        <button type="button" className={cn(btnPrimary, 'mt-4')} onClick={() => { also.forEach((p) => p && addToCart(p.id)); navigate('/carrito') }}>
          Comprá todo junto
        </button>
      </section>

      <section className="pb-14">
        <h2>Productos relacionados</h2>
        <div className={productGrid}>
          {related.map((p) => p && <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
