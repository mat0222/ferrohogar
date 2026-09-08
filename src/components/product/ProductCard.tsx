import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useStore } from '../../context/StoreContext'
import { discountPercent, formatPrice, stockLabel } from '../../lib/utils'
import { Stars } from './Stars'
import { Heart, ShoppingCart } from 'lucide-react'
import { btnPrimary, cn } from '../../lib/cn'
import { SafeImage } from '../SafeImage'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, toggleCompare, compareIds } = useStore()
  const discount = discountPercent(product)
  const fav = isFavorite(product.id)
  const comparing = compareIds.includes(product.id)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative aspect-[1.05] bg-[#fafafa]">
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-brand px-2 py-1 text-[0.72rem] font-extrabold text-white">
            -{discount}%
          </span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-9 left-2.5 rounded-md bg-warn px-2 py-1 text-[0.72rem] font-extrabold text-white">
            Últimas unidades
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-ink px-2 py-1 text-[0.72rem] font-extrabold text-white">
            Nuevo
          </span>
        )}
        <button
          type="button"
          className={cn(
            'absolute top-2.5 right-2.5 grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full border-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,.08)]',
            fav ? 'text-brand' : 'text-muted',
          )}
          aria-label="Favorito"
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
        <Link to={`/productos/${product.slug}`} className="block h-full">
          <SafeImage className="h-full w-full object-cover" src={product.images[0]} alt={product.name} />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="m-0 text-[0.7rem] font-bold tracking-[0.08em] text-muted uppercase">{product.brand}</p>
        <Link to={`/productos/${product.slug}`} className="min-h-[2.6em] font-bold">
          {product.name}
        </Link>
        <p className="m-0 text-xs text-muted">Cód. {product.code}</p>
        <div className="flex items-center gap-1.5 text-[0.8rem] text-muted">
          <Stars value={product.rating} />
          <span>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="text-[1.15rem]">{formatPrice(product.price)}</strong>
          {product.previousPrice && <s className="text-[0.85rem] text-muted">{formatPrice(product.previousPrice)}</s>}
        </div>
        <p className={cn('m-0 text-[0.8rem]', product.stock <= 5 ? 'text-warn' : 'text-ok')}>{stockLabel(product.stock)}</p>
        <button
          type="button"
          className={cn(btnPrimary, 'w-full')}
          disabled={product.stock <= 0}
          onClick={() => addToCart(product.id)}
        >
          <ShoppingCart size={16} />
          {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
        <button
          type="button"
          className={cn('cursor-pointer border-0 bg-transparent py-1 text-[0.8rem]', comparing ? 'font-bold text-brand' : 'text-muted')}
          onClick={() => toggleCompare(product.id)}
        >
          {comparing ? 'Quitar del comparador' : 'Comparar'}
        </button>
      </div>
    </article>
  )
}
