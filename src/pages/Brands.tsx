import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { useAdmin } from '../admin/context'
import { brandPill, cn, container, crumb, productGrid, section } from '../lib/cn'

export function Brands() {
  const { slug } = useParams()
  const { state } = useAdmin()
  const brands = state.brands.filter((b) => b.active)
  const products = state.products.filter((p) => !p.hidden)
  const brand = brands.find((b) => b.slug === slug)
  const list = brand
    ? products.filter((p) => p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') === brand.slug || p.brand === brand.name)
    : []

  if (!slug) {
    return (
      <div className={cn(container, section)}>
        <h1>Marcas</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => (
            <Link key={b.slug} to={`/marcas/${b.slug}`} className={brandPill}>{b.name}</Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(container, section)}>
      <p className={crumb}><Link to="/marcas">Marcas</Link> / {brand?.name}</p>
      <h1>{brand?.name}</h1>
      <div className={productGrid}>
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!list.length && <p>No hay productos de esta marca todavía.</p>}
    </div>
  )
}
