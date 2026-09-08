import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../lib/utils'
import { btnOutline, btnPrimary, cn, container, field, formGrid, input, muted, panel } from '../lib/cn'

const nav = [
  { to: '/cuenta', label: 'Perfil', end: true },
  { to: '/cuenta/pedidos', label: 'Mis pedidos' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/cuenta/direcciones', label: 'Direcciones' },
  { to: '/cuenta/pagos', label: 'Métodos de pago' },
  { to: '/cuenta/instalaciones', label: 'Mis instalaciones' },
]

const row = 'mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-line bg-white p-3'

export function Account() {
  const { user, login, logout, updateProfile, orders, addresses, payments, installations, addAddress, addPayment } = useStore()
  const { pathname } = useLocation()
  const [name, setName] = useState('Ana Gómez')
  const [email, setEmail] = useState('ana@mail.com')
  const [phone, setPhone] = useState('11 5555-1212')

  if (!user) {
    return (
      <div className={cn(container, 'py-10')}>
        <form
          className={cn(panel, formGrid, 'mx-auto max-w-[420px]')}
          onSubmit={(e) => {
            e.preventDefault()
            login({ name, email, phone })
          }}
        >
          <h1>Mi cuenta</h1>
          <p className={muted}>Ingresá para ver pedidos, favoritos e instalaciones. Es una demo: cualquier dato funciona.</p>
          <label className={field}>Nombre<input className={input} value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className={field}>Email<input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className={field}>Teléfono<input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <button className={btnPrimary} type="submit">Ingresar</button>
        </form>
      </div>
    )
  }

  return (
    <div className={cn(container, 'grid gap-6 py-7 pb-12 lg:grid-cols-[220px_1fr]')}>
      <aside className="h-fit rounded-[14px] border border-line bg-white p-3">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              cn('block rounded-lg px-3 py-2.5 font-semibold hover:bg-brand-soft hover:text-brand', isActive && 'bg-brand-soft text-brand')
            }
          >
            {n.label}
          </NavLink>
        ))}
        <button type="button" className="cursor-pointer border-0 bg-transparent py-2 text-[0.8rem] text-muted" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>
      <div>
        {pathname === '/cuenta' && (
          <form className={cn(panel, formGrid)} onSubmit={(e) => { e.preventDefault(); updateProfile(user) }}>
            <h1>Perfil</h1>
            <label className={field}>Nombre<input className={input} value={user.name} onChange={(e) => updateProfile({ ...user, name: e.target.value })} /></label>
            <label className={field}>Email<input className={input} value={user.email} onChange={(e) => updateProfile({ ...user, email: e.target.value })} /></label>
            <label className={field}>Teléfono<input className={input} value={user.phone} onChange={(e) => updateProfile({ ...user, phone: e.target.value })} /></label>
            <button className={btnPrimary} type="submit">Guardar</button>
          </form>
        )}
        {pathname === '/cuenta/pedidos' && (
          <div className={panel}>
            <h1>Mis pedidos</h1>
            {orders.map((o) => (
              <Link key={o.id} to={`/pedido/${o.id}`} className={row}>
                <div>
                  <strong>Pedido #{o.id}</strong>
                  <p className={muted}>{o.status === 'in_transit' ? 'En camino' : o.status === 'delivered' ? 'Entregado' : o.status === 'preparing' ? 'En preparación' : 'Recibido'}</p>
                </div>
                <strong>{formatPrice(o.total)}</strong>
              </Link>
            ))}
            {!orders.length && <p>Todavía no tenés pedidos.</p>}
          </div>
        )}
        {pathname === '/cuenta/direcciones' && (
          <div className={panel}>
            <h1>Direcciones</h1>
            {addresses.map((a) => (
              <p key={a.id}><strong>{a.label}</strong> — {a.street}, {a.city} ({a.zip})</p>
            ))}
            <button type="button" className={btnOutline} onClick={() => addAddress({ label: 'Otra', street: 'Nueva dirección', city: 'CABA', zip: '1400' })}>
              Agregar dirección
            </button>
          </div>
        )}
        {pathname === '/cuenta/pagos' && (
          <div className={panel}>
            <h1>Métodos de pago</h1>
            {payments.map((p) => (
              <p key={p.id}>{p.brand} **** {p.last4} · {p.expiry}</p>
            ))}
            <button type="button" className={btnOutline} onClick={() => addPayment({ brand: 'Mastercard', last4: '4444', expiry: '11/27' })}>
              Agregar tarjeta
            </button>
          </div>
        )}
        {pathname === '/cuenta/instalaciones' && (
          <div className={panel}>
            <h1>Mis instalaciones</h1>
            {installations.map((i) => (
              <Link key={i.id} to={`/instalacion/seguimiento/${i.id}`} className={row}>
                <div>
                  <strong>Instalación #{i.id}</strong>
                  <p>{i.serviceName} · {i.technician}</p>
                  <p className={muted}>{i.date} · {i.timeSlot} · {i.status}</p>
                </div>
              </Link>
            ))}
            {!installations.length && <p>No tenés reservas.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
