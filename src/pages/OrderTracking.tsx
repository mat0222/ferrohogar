import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, getProduct } from '../lib/utils'
import { cn, container, empty, panel, stepClass, tracker } from '../lib/cn'

const steps = [
  { key: 'received', label: 'Pedido recibido' },
  { key: 'preparing', label: 'Preparando pedido' },
  { key: 'shipped', label: 'Despachado' },
  { key: 'in_transit', label: 'En camino' },
  { key: 'delivered', label: 'Entregado' },
] as const

export function OrderTracking() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  if (!order) return <div className={cn(container, empty)}>Pedido no encontrado. <Link to="/cuenta/pedidos">Volver</Link></div>
  const idx = steps.findIndex((s) => s.key === order.status)

  return (
    <div className={cn(container, 'py-8')}>
      <h1>Pedido #{order.id}</h1>
      <ol className={tracker}>
        {steps.map((s, i) => (
          <li key={s.key} className={stepClass(i, idx)}>
            {i <= idx ? '✓ ' : '○ '}{s.label}
          </li>
        ))}
      </ol>
      <div className={panel}>
        <p>Empresa de transporte: <strong>{order.carrier}</strong></p>
        <p>Número de seguimiento: <strong>{order.tracking}</strong></p>
        <p>Fecha estimada: {order.estimatedDate ? new Date(order.estimatedDate).toLocaleDateString('es-AR') : 'A confirmar'}</p>
        <p>Pago: {order.payment}</p>
        <p>Total: {formatPrice(order.total)}</p>
        {order.items.map((i) => {
          const p = getProduct(i.productId)
          return p ? <p key={i.productId}>{p.name} × {i.quantity}</p> : null
        })}
      </div>
    </div>
  )
}
