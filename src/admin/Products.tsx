import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Copy, Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { stockStatus, useAdmin } from './context'
import { formatPrice } from '../lib/utils'
import { SafeImage } from '../components/SafeImage'
import { aBtn, aBtnDanger, aBtnGhost, aInput, aTableWrap, aTd, aTh, Badge, PageHeader } from './ui'

export function AdminProducts() {
  const { state, can, duplicateProduct, deleteProduct, adjustStock } = useAdmin()
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const stockFilter = params.get('stock') ?? ''
  const [search, setSearch] = useState(q)
  const [stockId, setStockId] = useState<string | null>(null)
  const [qty, setQty] = useState(0)

  const list = useMemo(() => {
    return state.products.filter((p) => {
      const text = `${p.name} ${p.sku} ${p.brand} ${p.category}`.toLowerCase()
      if (search && !text.includes(search.toLowerCase())) return false
      const st = stockStatus(p)
      if (stockFilter === 'low' && st.tone !== 'warn') return false
      if (stockFilter === 'out' && st.tone !== 'danger') return false
      return true
    })
  }, [state.products, search, stockFilter])

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle={`${list.length} ítems en el catálogo`}
        actions={
          can('products.edit') ? (
            <Link to="/admin/productos/nuevo" className={aBtn}>
              <Plus size={16} /> Crear producto
            </Link>
          ) : null
        }
      />
      <input className={`${aInput} mb-4 max-w-md`} placeholder="Buscar por nombre, SKU o marca" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className={aTableWrap}>
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              {['Imagen', 'Nombre', 'Código', 'Categoría', 'Marca', 'Precio', 'Stock', 'Estado', 'Ventas', 'Acciones'].map((h) => (
                <th key={h} className={aTh}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const st = stockStatus(p)
              return (
                <tr key={p.id}>
                  <td className={aTd}><SafeImage src={p.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" /></td>
                  <td className={aTd}><strong>{p.name}</strong></td>
                  <td className={aTd}>{p.sku}</td>
                  <td className={aTd}>{p.category}</td>
                  <td className={aTd}>{p.brand}</td>
                  <td className={aTd}>{formatPrice(p.price)}</td>
                  <td className={aTd}>{p.stock}</td>
                  <td className={aTd}><Badge tone={st.tone}>{st.label}</Badge></td>
                  <td className={aTd}>{p.soldCount}</td>
                  <td className={aTd}>
                    <div className="flex flex-wrap gap-1">
                      <Link to={`/productos/${p.slug}`} className={aBtnGhost} title="Ver"><Eye size={14} /></Link>
                      {can('products.edit') && (
                        <>
                          <Link to={`/admin/productos/${p.id}`} className={aBtnGhost} title="Editar"><Pencil size={14} /></Link>
                          <button type="button" className={aBtnGhost} title="Duplicar" onClick={() => duplicateProduct(p.id)}><Copy size={14} /></button>
                          <button
                            type="button"
                            className={aBtnGhost}
                            title="Ajustar stock"
                            onClick={() => {
                              setStockId(p.id)
                              setQty(p.stock)
                            }}
                          >
                            Stock
                          </button>
                        </>
                      )}
                      {can('products.delete') && (
                        <button type="button" className={aBtnDanger} title="Eliminar" onClick={() => { if (confirm('¿Eliminar producto?')) deleteProduct(p.id) }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {stockId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            className="w-full max-w-sm rounded-2xl bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault()
              adjustStock(stockId, qty)
              setStockId(null)
            }}
          >
            <h3>Ajustar stock</h3>
            <input className={aInput} type="number" min={0} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            <div className="mt-4 flex gap-2">
              <button className={aBtn} type="submit">Guardar</button>
              <button className={aBtnGhost} type="button" onClick={() => setStockId(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
