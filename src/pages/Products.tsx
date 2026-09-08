import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { useAdmin } from '../admin/context'
import { searchProducts } from '../lib/search'
import type { SortKey } from '../types'
import { container, crumb, empty, filterLabel, filterTitle, muted, productGrid3, select } from '../lib/cn'

const sorts: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Relevancia' },
  { key: 'sold', label: 'Más vendidos' },
  { key: 'price-asc', label: 'Precio menor' },
  { key: 'price-desc', label: 'Precio mayor' },
  { key: 'rating', label: 'Mejor valorados' },
  { key: 'newest', label: 'Más nuevos' },
]

export function Products() {
  const { slug } = useParams()
  const { state } = useAdmin()
  const products = state.products.filter((p) => !p.hidden)
  const brands = state.brands.filter((b) => b.active)
  const categories = state.categories.filter((c) => !c.parentId && c.active)
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const brandParam = params.get('marca') ?? ''
  const [sort, setSort] = useState<SortKey>('relevance')
  const [cats, setCats] = useState<string[]>(slug ? [slug] : [])
  const [brand, setBrand] = useState(brandParam)
  const [maxPrice, setMaxPrice] = useState(250000)
  const [onlyStock, setOnlyStock] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [onlyDiscount, setOnlyDiscount] = useState(false)
  const [type, setType] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [power, setPower] = useState('')

  const types = [...new Set(products.map((p) => p.type))]
  const colors = [...new Set(products.map((p) => p.color).filter(Boolean))] as string[]
  const sizes = [...new Set(products.map((p) => p.size).filter(Boolean))] as string[]
  const powers = [...new Set(products.map((p) => p.power).filter(Boolean))] as string[]

  const list = useMemo(() => {
    let result = q ? searchProducts(q, products) : [...products]
    if (cats.length) result = result.filter((p) => cats.includes(p.category))
    if (brand) result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase() || p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') === brand)
    if (onlyStock) result = result.filter((p) => p.stock > 0)
    if (onlyDiscount) result = result.filter((p) => p.previousPrice || p.promo)
    if (minRating) result = result.filter((p) => p.rating >= minRating)
    result = result.filter((p) => p.price <= maxPrice)
    if (type) result = result.filter((p) => p.type === type)
    if (color) result = result.filter((p) => p.color === color)
    if (size) result = result.filter((p) => p.size === size)
    if (power) result = result.filter((p) => p.power === power)

    const sorted = [...result]
    if (sort === 'sold') sorted.sort((a, b) => b.soldCount - a.soldCount)
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return sorted
  }, [q, cats, brand, onlyStock, onlyDiscount, minRating, maxPrice, type, color, size, power, sort, products])

  const title = slug ? categories.find((c) => c.slug === slug)?.name ?? 'Productos' : q ? `Resultados para “${q}”` : 'Productos'
  const catMeta = categories.find((c) => c.slug === slug)

  function toggleCat(s: string) {
    setCats((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  return (
    <div className={`${container} grid gap-6 py-8 pb-14 lg:grid-cols-[260px_1fr]`}>
      <aside className="h-fit rounded-[14px] border border-line bg-white p-[18px] lg:sticky lg:top-[148px]">
        <h3 className={filterTitle}>Categorías</h3>
        {categories.map((c) => (
          <label key={c.slug} className={filterLabel}>
            <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
            {c.name}
          </label>
        ))}
        <h3 className={filterTitle}>Marca</h3>
        <select className={select} value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <h3 className={filterTitle}>Precio hasta {maxPrice.toLocaleString('es-AR')}</h3>
        <input className="w-full" type="range" min={1000} max={250000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        <h3 className={filterTitle}>Disponibilidad</h3>
        <label className={filterLabel}>
          <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} />
          Solo con stock
        </label>
        <h3 className={filterTitle}>Rating mínimo</h3>
        {[0, 3, 4, 4.5].map((r) => (
          <label key={r} className={filterLabel}>
            <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} />
            {r === 0 ? 'Todos' : `${r}+`}
          </label>
        ))}
        <h3 className={filterTitle}>Descuento</h3>
        <label className={filterLabel}>
          <input type="checkbox" checked={onlyDiscount} onChange={(e) => setOnlyDiscount(e.target.checked)} />
          Con oferta o promo
        </label>
        <h3 className={filterTitle}>Tipo</h3>
        <select className={select} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Todos</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <h3 className={filterTitle}>Color</h3>
        <select className={select} value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">Todos</option>
          {colors.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <h3 className={filterTitle}>Tamaño</h3>
        <select className={select} value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">Todos</option>
          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <h3 className={filterTitle}>Potencia</h3>
        <select className={select} value={power} onChange={(e) => setPower(e.target.value)}>
          <option value="">Todas</option>
          {powers.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </aside>
      <div>
        <p className={crumb}>
          <Link to="/">Inicio</Link> / <Link to="/productos">Productos</Link>
          {catMeta && <> / {catMeta.name}</>}
        </p>
        <div className="mb-[18px] flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1>{title}</h1>
            {catMeta && <p className={muted}>{catMeta.description}</p>}
            <p className={muted}>{list.length} productos</p>
          </div>
          <label className="text-sm">
            Ordenar{' '}
            <select className={select} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {sorts.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={productGrid3}>
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {list.length === 0 && <div className={empty}>No hay productos con esos filtros.</div>}
      </div>
    </div>
  )
}
