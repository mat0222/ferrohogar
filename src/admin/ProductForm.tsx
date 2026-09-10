import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdmin } from './context'
import type { AdminProduct } from './types'
import { asset } from '../lib/asset'
import { uid } from '../lib/utils'
import { aBtn, aBtnGhost, aCard, aInput, BackLink, PageHeader } from './ui'
import { categories as catalogCategories, brands as catalogBrands } from '../data/catalog'

const emptyProduct = (): AdminProduct => ({
  id: uid('p'),
  slug: '',
  name: '',
  brand: 'Stanley',
  code: '',
  sku: '',
  category: 'herramientas',
  subcategory: '',
  price: 0,
  previousPrice: undefined,
  wholesalePrice: undefined,
  rating: 0,
  reviewCount: 0,
  stock: 0,
  minStock: 5,
  location: 'Depósito CABA',
  images: ['/img/tools.jpg'],
  description: '',
  shortDescription: '',
  specs: [{ label: 'Potencia', value: '' }],
  features: [],
  type: '',
  soldCount: 0,
  relatedIds: [],
  alsoNeedIds: [],
  createdAt: new Date().toISOString().slice(0, 10),
  installments: 12,
  hidden: false,
})

export function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, saveProduct } = useAdmin()
  const found = state.products.find((p) => p.id === id)
  const isNew = id === 'nuevo' || !found
  const [form, setForm] = useState<AdminProduct>(() => found ?? emptyProduct())
  const [drag, setDrag] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const specText = useMemo(() => form.specs.map((s) => `${s.label}|${s.value}`).join('\n'), [form.specs])

  function patch<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const sku = form.sku || form.code || `FH-${form.id.slice(-6).toUpperCase()}`
        saveProduct({ ...form, slug, sku, code: form.code || sku })
        navigate('/admin/productos')
      }}
    >
      <BackLink to="/admin/productos">← Volver a productos</BackLink>
      <PageHeader title={isNew ? 'Crear producto' : 'Editar producto'} subtitle="Información, precio, inventario, imágenes y fichas técnicas." />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={aCard}>
          <h2 className="mt-0 text-base">Información</h2>
          <label className="grid gap-1 text-sm font-semibold">Nombre<input className={aInput} required value={form.name} onChange={(e) => patch('name', e.target.value)} /></label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold">SKU<input className={aInput} value={form.sku} onChange={(e) => patch('sku', e.target.value)} /></label>
            <label className="grid gap-1 text-sm font-semibold">Código<input className={aInput} value={form.code} onChange={(e) => patch('code', e.target.value)} /></label>
          </div>
          <label className="mt-3 grid gap-1 text-sm font-semibold">Descripción corta<textarea className={aInput} rows={2} value={form.shortDescription} onChange={(e) => patch('shortDescription', e.target.value)} /></label>
          <label className="mt-3 grid gap-1 text-sm font-semibold">Descripción<textarea className={aInput} rows={4} value={form.description} onChange={(e) => patch('description', e.target.value)} /></label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm font-semibold">Marca
              <select className={aInput} value={form.brand} onChange={(e) => patch('brand', e.target.value)}>
                {catalogBrands.map((b) => <option key={b.slug}>{b.name}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">Categoría
              <select className={aInput} value={form.category} onChange={(e) => patch('category', e.target.value as AdminProduct['category'])}>
                {catalogCategories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">Subcategoría<input className={aInput} value={form.subcategory} onChange={(e) => patch('subcategory', e.target.value)} /></label>
          </div>
        </section>

        <section className={aCard}>
          <h2 className="mt-0 text-base">Precio e inventario</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold">Precio normal<input className={aInput} type="number" value={form.price} onChange={(e) => patch('price', Number(e.target.value))} /></label>
            <label className="grid gap-1 text-sm font-semibold">Precio promocional<input className={aInput} type="number" value={form.previousPrice ?? ''} onChange={(e) => patch('previousPrice', e.target.value ? Number(e.target.value) : undefined)} /></label>
            <label className="grid gap-1 text-sm font-semibold">Precio mayorista<input className={aInput} type="number" value={form.wholesalePrice ?? ''} onChange={(e) => patch('wholesalePrice', e.target.value ? Number(e.target.value) : undefined)} /></label>
            <label className="grid gap-1 text-sm font-semibold">Cuotas<input className={aInput} type="number" value={form.installments} onChange={(e) => patch('installments', Number(e.target.value))} /></label>
            <label className="grid gap-1 text-sm font-semibold">Stock actual<input className={aInput} type="number" value={form.stock} onChange={(e) => patch('stock', Number(e.target.value))} /></label>
            <label className="grid gap-1 text-sm font-semibold">Stock mínimo<input className={aInput} type="number" value={form.minStock} onChange={(e) => patch('minStock', Number(e.target.value))} /></label>
            <label className="grid gap-1 text-sm font-semibold">Ubicación<input className={aInput} value={form.location} onChange={(e) => patch('location', e.target.value)} /></label>
            <label className="grid gap-1 text-sm font-semibold">Estado
              <select className={aInput} value={form.hidden ? 'hidden' : 'on'} onChange={(e) => patch('hidden', e.target.value === 'hidden')}>
                <option value="on">Visible en tienda</option>
                <option value="hidden">Oculto</option>
              </select>
            </label>
          </div>
          <p className="mt-3 mb-0 text-sm text-slate-500">
            {form.stock <= 0 ? '🔴 Agotado' : form.stock <= form.minStock ? '🟠 Stock bajo' : '🟢 Disponible'}
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => patch('featured', e.target.checked)} /> Destacado</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.offer} onChange={(e) => patch('offer', e.target.checked)} /> Oferta</label>
        </section>
      </div>

      <section className={`${aCard} mt-4`}>
        <h2 className="mt-0 text-base">Imágenes (arrastrá para reordenar)</h2>
        <div className="flex flex-wrap gap-3">
          {form.images.map((src, i) => (
            <div
              key={src + i}
              draggable
              onDragStart={() => setDrag(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (drag === null || drag === i) return
                const next = [...form.images]
                const [moved] = next.splice(drag, 1)
                next.splice(i, 0, moved)
                patch('images', next)
                setDrag(null)
              }}
              className="w-28 cursor-grab rounded-xl border border-slate-200 p-1"
            >
              <img src={asset(src)} alt="" className="h-20 w-full rounded-lg object-cover" />
              <button type="button" className="mt-1 w-full cursor-pointer border-0 bg-transparent text-xs text-red-600" onClick={() => patch('images', form.images.filter((_, idx) => idx !== i))}>Quitar</button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input className={aInput} placeholder="/img/drill.jpg o URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button
            type="button"
            className={aBtnGhost}
            onClick={() => {
              if (!imageUrl.trim()) return
              patch('images', [...form.images, imageUrl.trim()])
              setImageUrl('')
            }}
          >
            Agregar
          </button>
        </div>
      </section>

      <section className={`${aCard} mt-4`}>
        <h2 className="mt-0 text-base">Especificaciones técnicas</h2>
        <p className="text-sm text-slate-500">Una por línea: Etiqueta|Valor</p>
        <textarea
          className={aInput}
          rows={8}
          value={specText}
          onChange={(e) => {
            const specs = e.target.value.split('\n').map((line) => {
              const [label, ...rest] = line.split('|')
              return { label: label.trim(), value: rest.join('|').trim() }
            }).filter((s) => s.label)
            patch('specs', specs)
          }}
        />
      </section>

      <div className="mt-4 flex gap-2">
        <button className={aBtn} type="submit">Guardar producto</button>
        <button className={aBtnGhost} type="button" onClick={() => navigate('/admin/productos')}>Cancelar</button>
      </div>
    </form>
  )
}
