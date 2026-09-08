import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAdmin } from './context'
import type { AdminBrand, AdminCategory, AdminOrderStatus } from './types'
import { formatPrice, getProduct, uid } from '../lib/utils'
import { aBtn, aBtnDanger, aBtnGhost, aCard, aInput, aTableWrap, aTd, aTh, BackLink, Badge, PageHeader } from './ui'
import { orderLabel, orderTone } from './Dashboard'

export function AdminCategories() {
  const { state, saveCategory, deleteCategory, reorderCategories } = useAdmin()
  const roots = [...state.categories.filter((c) => !c.parentId)].sort((a, b) => a.order - b.order)
  const [drag, setDrag] = useState<string | null>(null)
  const [form, setForm] = useState<AdminCategory | null>(null)

  return (
    <div>
      <PageHeader
        title="Categorías"
        subtitle="Reordená las categorías padre con drag & drop."
        actions={<button className={aBtn} type="button" onClick={() => setForm({ id: uid('cat'), name: '', slug: '', image: '/img/tools.jpg', icon: 'hammer', description: '', parentId: null, order: roots.length + 1, active: true })}>Nueva categoría</button>}
      />
      <div className="grid gap-3">
        {roots.map((c) => (
          <article
            key={c.id}
            draggable
            onDragStart={() => setDrag(c.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!drag || drag === c.id) return
              const ids = roots.map((r) => r.id)
              const from = ids.indexOf(drag)
              const to = ids.indexOf(c.id)
              ids.splice(from, 1)
              ids.splice(to, 0, drag)
              reorderCategories(ids)
              setDrag(null)
            }}
            className={aCard}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong>{c.name}</strong>
                <p className="m-0 text-sm text-slate-500">{c.description}</p>
              </div>
              <div className="flex gap-2">
                <button className={aBtnGhost} type="button" onClick={() => setForm(c)}>Editar</button>
                <button className={aBtnDanger} type="button" onClick={() => deleteCategory(c.id)}>Eliminar</button>
              </div>
            </div>
            <ul className="mt-3 mb-0 text-sm text-slate-600">
              {state.categories.filter((s) => s.parentId === c.id).map((s) => (
                <li key={s.id}>↳ {s.name}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {form && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            className="grid w-full max-w-lg gap-3 rounded-2xl bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault()
              saveCategory({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') })
              setForm(null)
            }}
          >
            <h3>Categoría</h3>
            <input className={aInput} placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className={aInput} placeholder="Icono (hammer, zap, paint...)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <textarea className={aInput} placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activa</label>
            <div className="flex gap-2">
              <button className={aBtn} type="submit">Guardar</button>
              <button className={aBtnGhost} type="button" onClick={() => setForm(null)}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export function AdminBrands() {
  const { state, saveBrand, deleteBrand } = useAdmin()
  const [form, setForm] = useState<AdminBrand | null>(null)

  return (
    <div>
      <PageHeader title="Marcas" actions={<button className={aBtn} type="button" onClick={() => setForm({ slug: uid('b').toLowerCase(), name: '', logo: '', description: '', website: '', featured: false, active: true })}>Nueva marca</button>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {state.brands.map((b) => (
          <article key={b.slug} className={aCard}>
            <div className="mb-2 flex items-center justify-between">
              <strong>{b.name}</strong>
              {b.featured && <Badge tone="orange">Destacada</Badge>}
            </div>
            <p className="text-sm text-slate-500">{b.description}</p>
            <p className="text-xs text-slate-400">{b.website}</p>
            <div className="mt-3 flex gap-2">
              <button className={aBtnGhost} type="button" onClick={() => setForm(b)}>Editar</button>
              <button className={aBtnDanger} type="button" onClick={() => deleteBrand(b.slug)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
      {form && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="grid w-full max-w-lg gap-3 rounded-2xl bg-white p-5" onSubmit={(e) => { e.preventDefault(); saveBrand(form); setForm(null) }}>
            <h3>Marca</h3>
            <input className={aInput} placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className={aInput} placeholder="Sitio web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <textarea className={aInput} placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Marca destacada (Inicio)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activa</label>
            <div className="flex gap-2">
              <button className={aBtn} type="submit">Guardar</button>
              <button className={aBtnGhost} type="button" onClick={() => setForm(null)}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

const STATUSES: AdminOrderStatus[] = ['pending', 'confirmed', 'preparing', 'dispatched', 'in_transit', 'delivered', 'cancelled']

export function AdminOrders() {
  const { state } = useAdmin()
  const [params] = useSearchParams()
  const status = params.get('status')
  const list = state.orders.filter((o) => (status === 'pending' ? o.status === 'pending' || o.status === 'confirmed' : true))

  return (
    <div>
      <PageHeader title="Pedidos" subtitle={`${list.length} pedidos`} />
      <div className={aTableWrap}>
        <table className="w-full border-collapse">
          <thead>
            <tr>{['Pedido', 'Cliente', 'Total', 'Pago', 'Estado'].map((h) => <th key={h} className={aTh}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td className={aTd}><Link className="font-bold" to={`/admin/pedidos/${o.id}`}>{o.id}</Link></td>
                <td className={aTd}>{o.customerName}</td>
                <td className={aTd}>{formatPrice(o.total)}</td>
                <td className={aTd}>{o.payment}</td>
                <td className={aTd}><Badge tone={orderTone[o.status]}>{orderLabel[o.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminOrderDetail() {
  const { id } = useParams()
  const { state, setOrderStatus } = useAdmin()
  const order = state.orders.find((o) => o.id === id)
  if (!order) return <p>Pedido no encontrado.</p>
  return (
    <div>
      <BackLink to="/admin/pedidos">← Pedidos</BackLink>
      <PageHeader title={`Pedido ${order.id}`} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={aCard}>
          <p><strong>Cliente:</strong> {order.customerName}</p>
          <p><strong>Email:</strong> {order.customerEmail}</p>
          <p><strong>Dirección:</strong> {order.address}</p>
          <p><strong>Pago:</strong> {order.payment}</p>
          <label className="grid gap-1 text-sm font-semibold">Estado
            <select className={aInput} value={order.status} onChange={(e) => setOrderStatus(order.id, e.target.value as AdminOrderStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{orderLabel[s]}</option>)}
            </select>
          </label>
        </section>
        <section className={aCard}>
          <h3>Productos</h3>
          {order.items.map((i) => {
            const p = getProduct(i.productId) ?? state.products.find((x) => x.id === i.productId)
            return <p key={i.productId} className="m-0 py-1">{p?.name ?? i.productId} × {i.quantity}</p>
          })}
          <p>Subtotal: {formatPrice(order.subtotal)}</p>
          <p>Envío: {formatPrice(order.shipping)}</p>
          <p><strong>Total: {formatPrice(order.total)}</strong></p>
        </section>
      </div>
    </div>
  )
}

export function AdminCustomers() {
  const { state } = useAdmin()
  const rows = state.customers.map((c) => {
    const orders = state.orders.filter((o) => o.customerId === c.id || o.customerEmail === c.email)
    return { c, orders: orders.length, spent: orders.reduce((n, o) => n + o.total, 0), last: orders[0]?.id ?? c.lastOrderId }
  })
  return (
    <div>
      <PageHeader title="Clientes" />
      <div className={aTableWrap}>
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>{['Nombre', 'Email', 'Teléfono', 'Registro', 'Último pedido', 'Pedidos', 'Total gastado'].map((h) => <th key={h} className={aTh}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(({ c, orders, spent, last }) => (
              <tr key={c.id}>
                <td className={aTd}><Link className="font-bold" to={`/admin/clientes/${c.id}`}>{c.name}</Link></td>
                <td className={aTd}>{c.email}</td>
                <td className={aTd}>{c.phone}</td>
                <td className={aTd}>{c.createdAt.slice(0, 10)}</td>
                <td className={aTd}>{last ?? '—'}</td>
                <td className={aTd}>{orders}</td>
                <td className={aTd}>{formatPrice(spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminCustomerDetail() {
  const { id } = useParams()
  const { state } = useAdmin()
  const c = state.customers.find((x) => x.id === id)
  if (!c) return <p>Cliente no encontrado.</p>
  const orders = state.orders.filter((o) => o.customerId === c.id || o.customerEmail === c.email)
  const favs = state.favorites.filter((f) => f.customerName === c.name)
  const spent = orders.reduce((n, o) => n + o.total, 0)
  return (
    <div>
      <BackLink to="/admin/clientes">← Clientes</BackLink>
      <PageHeader title={c.name} subtitle={c.email} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={aCard}><p className="m-0 text-xs text-slate-500">Pedidos</p><strong className="text-2xl">{orders.length}</strong></div>
        <div className={aCard}><p className="m-0 text-xs text-slate-500">Gastado</p><strong className="text-2xl">{formatPrice(spent)}</strong></div>
        <div className={aCard}><p className="m-0 text-xs text-slate-500">Favoritos</p><strong className="text-2xl">{favs.length}</strong></div>
      </div>
      <section className={`${aCard} mt-4`}>
        <h3>Últimos pedidos</h3>
        {orders.map((o) => (
          <p key={o.id}><Link to={`/admin/pedidos/${o.id}`}>{o.id}</Link> · {formatPrice(o.total)} · {orderLabel[o.status]}</p>
        ))}
      </section>
    </div>
  )
}

export function AdminFavorites() {
  const { state } = useAdmin()
  return (
    <div>
      <PageHeader title="Favoritos" subtitle="Productos guardados por clientes" />
      <div className={aTableWrap}>
        <table className="w-full border-collapse">
          <thead><tr>{['Cliente', 'Producto', 'Fecha'].map((h) => <th key={h} className={aTh}>{h}</th>)}</tr></thead>
          <tbody>
            {state.favorites.map((f) => {
              const p = state.products.find((x) => x.id === f.productId)
              return (
                <tr key={f.id}>
                  <td className={aTd}>{f.customerName}</td>
                  <td className={aTd}>{p?.name ?? f.productId}</td>
                  <td className={aTd}>{f.addedAt.slice(0, 10)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
