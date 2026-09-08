import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { products } from '../data/catalog'
import { formatPrice, getProduct } from '../lib/utils'
import { btnOutline, btnPrimary, cn, container, empty, muted, section, sectionHead, table, thtd } from '../lib/cn'

export function Compare() {
  const { compareIds, clearCompare } = useStore()
  const items = compareIds.map(getProduct).filter(Boolean)
  const keys = [...new Set(items.flatMap((p) => p?.specs.map((s) => s.label) ?? []))]

  if (items.length < 2) {
    return (
      <div className={cn(container, empty)}>
        <h1>Comparador</h1>
        <p>Seleccioná al menos 2 productos desde el listado. Máximo 3.</p>
        <Link to="/productos" className={btnPrimary}>Ir a productos</Link>
      </div>
    )
  }

  return (
    <div className={cn(container, section)}>
      <div className={sectionHead}>
        <h1>Comparador de productos</h1>
        <button type="button" className={btnOutline} onClick={clearCompare}>Limpiar</button>
      </div>
      <div className="overflow-x-auto">
        <table className={table}>
          <thead>
            <tr>
              <th className={thtd}>Característica</th>
              {items.map((p) => p && (
                <th key={p.id} className={thtd}>
                  <Link to={`/productos/${p.slug}`}>{p.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className={thtd}>Marca</th>
              {items.map((p) => p && <td key={p.id} className={thtd}>{p.brand}</td>)}
            </tr>
            <tr>
              <th className={thtd}>Precio</th>
              {items.map((p) => p && <td key={p.id} className={thtd}>{formatPrice(p.price)}</td>)}
            </tr>
            {keys.map((k) => (
              <tr key={k}>
                <th className={thtd}>{k}</th>
                {items.map((p) => {
                  const spec = p?.specs.find((s) => s.label === k)
                  const val = spec?.value ?? '—'
                  const isBool = val === 'Sí' || val === 'No' || val.startsWith('No ')
                  return (
                    <td key={p?.id} className={thtd}>
                      {isBool ? (val === 'Sí' || (typeof val === 'string' && val.includes('x')) ? '✅' : val === 'No' || val.startsWith('No') ? '❌' : val) : val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={cn(muted, 'mt-3')}>Catálogo: {products.length} productos.</p>
    </div>
  )
}
