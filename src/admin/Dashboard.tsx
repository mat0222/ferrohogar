import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Package, ShoppingBag, Users, Wallet } from 'lucide-react'
import { DASHBOARD_KPIS, salesSeries } from './seed'
import { stockStatus, useAdmin } from './context'
import type { AdminOrderStatus, SalesRange } from './types'
import { formatPrice } from '../lib/utils'
import { aCard, aTableWrap, aTd, aTh, Badge, PageHeader } from './ui'

const ranges: { id: SalesRange; label: string }[] = [
  { id: 'today', label: 'Hoy' },
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
  { id: '3m', label: '3 meses' },
  { id: '1y', label: '1 año' },
]

const orderTone: Record<AdminOrderStatus, 'warn' | 'info' | 'orange' | 'violet' | 'ok' | 'danger'> = {
  pending: 'warn',
  confirmed: 'info',
  preparing: 'orange',
  dispatched: 'violet',
  in_transit: 'info',
  delivered: 'ok',
  cancelled: 'danger',
}

const orderLabel: Record<AdminOrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  dispatched: 'Despachado',
  in_transit: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export function AdminDashboard() {
  const { state } = useAdmin()
  const [range, setRange] = useState<SalesRange>('7d')
  const series = salesSeries(range)
  const max = Math.max(...series.map((s) => s.value), 1)
  const points = series
    .map((s, i) => {
      const x = (i / Math.max(series.length - 1, 1)) * 320
      const y = 110 - (s.value / max) * 90
      return `${x},${y}`
    })
    .join(' ')

  const low = state.products.filter((p) => stockStatus(p).tone === 'warn')
  const out = state.products.filter((p) => stockStatus(p).tone === 'danger')
  const pendingOrders = state.orders.filter((o) => o.status === 'pending' || o.status === 'confirmed')
  const pendingInstall = state.installations.filter((i) => i.status === 'request')
  const newReviews = state.reviews.filter((r) => r.status === 'pending')

  const kpis = useMemo(
    () => [
      { label: 'Ventas de hoy', value: formatPrice(DASHBOARD_KPIS.salesToday), icon: Wallet },
      { label: 'Ventas del mes', value: formatPrice(DASHBOARD_KPIS.salesMonth), icon: Wallet },
      { label: 'Pedidos', value: String(DASHBOARD_KPIS.orders), icon: Package },
      { label: 'Clientes', value: String(DASHBOARD_KPIS.customers), icon: Users },
      { label: 'Productos', value: String(DASHBOARD_KPIS.products), icon: ShoppingBag },
    ],
    [],
  )

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen de FerroHogar Admin" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className={aCard}>
            <k.icon className="mb-2 text-brand" size={20} />
            <p className="m-0 text-xs font-bold tracking-wide text-slate-500 uppercase">{k.label}</p>
            <strong className="text-xl">{k.value}</strong>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className={aCard}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="m-0 text-lg">Gráfico de ventas</h2>
            <div className="flex flex-wrap gap-1">
              {ranges.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-bold ${range === r.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                  onClick={() => setRange(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 320 130" className="h-48 w-full">
            <polyline fill="none" stroke="#ff5a1f" strokeWidth="3" points={points} />
            {series.map((s, i) => {
              const x = (i / Math.max(series.length - 1, 1)) * 320
              const y = 110 - (s.value / max) * 90
              return <circle key={s.label + i} cx={x} cy={y} r="3.5" fill="#ff5a1f" />
            })}
          </svg>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            {series.filter((_, i) => i === 0 || i === series.length - 1 || series.length < 10 || i % Math.ceil(series.length / 7) === 0).map((s) => (
              <span key={s.label}>{s.label}</span>
            ))}
          </div>
        </section>

        <section className={aCard}>
          <h2 className="mt-0 flex items-center gap-2 text-lg">
            <AlertTriangle className="text-amber-500" size={18} /> Requiere atención
          </h2>
          <ul className="m-0 grid list-none gap-2 p-0 text-sm">
            <li><Link to="/admin/productos?stock=low">{low.length} productos con stock bajo</Link></li>
            <li><Link to="/admin/pedidos?status=pending">{pendingOrders.length} pedidos pendientes</Link></li>
            <li><Link to="/admin/instalaciones">{pendingInstall.length} solicitudes de instalación</Link></li>
            <li><Link to="/admin/resenas">{newReviews.length} reseñas nuevas</Link></li>
            <li><Link to="/admin/productos?stock=out">{out.length} productos agotados</Link></li>
          </ul>
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="m-0 text-lg">Últimos pedidos</h2>
          <Link to="/admin/pedidos" className="text-sm font-bold text-brand">Ver todos →</Link>
        </div>
        <div className={aTableWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={aTh}>Pedido</th>
                <th className={aTh}>Cliente</th>
                <th className={aTh}>Total</th>
                <th className={aTh}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {state.orders.slice(0, 6).map((o) => (
                <tr key={o.id}>
                  <td className={aTd}><Link to={`/admin/pedidos/${o.id}`} className="font-bold">{o.id}</Link></td>
                  <td className={aTd}>{o.customerName}</td>
                  <td className={aTd}>{formatPrice(o.total)}</td>
                  <td className={aTd}><Badge tone={orderTone[o.status]}>{orderLabel[o.status]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export { orderLabel, orderTone }
