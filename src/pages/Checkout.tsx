import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { cartTotals, formatPrice } from '../lib/utils'
import { btnOutline, btnPrimary, choice, choiceOn, cn, container, empty, field, formGrid, formTwo, input, muted, panel, split, summary } from '../lib/cn'

const steps = ['Datos', 'Entrega', 'Pago', 'Confirmación']

export function Checkout() {
  const { cart, user, addresses, placeOrder, login } = useStore()
  const totals = cartTotals(cart)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery')
  const [address, setAddress] = useState(addresses[0]?.street ?? '')
  const [payment, setPayment] = useState('Tarjeta')
  const [cuotas, setCuotas] = useState('1')
  const [orderId, setOrderId] = useState('')

  if (!cart.length && !orderId) {
    return (
      <div className={cn(container, empty)}>
        No hay productos. <Link to="/carrito">Volver al carrito</Link>
      </div>
    )
  }

  function next() {
    if (step === 0) {
      if (!name || !email) return
      if (!user) login({ name, email, phone })
    }
    if (step === 2) {
      const order = placeOrder({
        items: cart,
        ...totals,
        delivery,
        payment: payment === 'Tarjeta' ? `${payment} ${cuotas} cuota(s)` : payment,
        address: delivery === 'delivery' ? address : 'Retiro en Av. San Martín 2450',
        customer: { name, email, phone },
      })
      setOrderId(order.id)
    }
    setStep((s) => Math.min(3, s + 1))
  }

  return (
    <div className={cn(container, 'py-7 pb-12')}>
      <h1>Checkout</h1>
      <div className="mb-[22px] flex gap-2">
        {steps.map((s, i) => (
          <span key={s} className={cn('flex-1 rounded-lg bg-white p-2 text-center text-[0.82rem] font-bold', i <= step && 'bg-brand text-white')}>
            {i + 1}. {s}
          </span>
        ))}
      </div>
      <div className={split}>
        <div className={cn(panel, formGrid)}>
          {step === 0 && (
            <>
              <h2>Datos personales</h2>
              <label className={field}>Nombre<input className={input} value={name} onChange={(e) => setName(e.target.value)} required /></label>
              <label className={field}>Email<input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
              <label className={field}>Teléfono<input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            </>
          )}
          {step === 1 && (
            <>
              <h2>Entrega</h2>
              <button type="button" className={cn(choice, delivery === 'delivery' && choiceOn)} onClick={() => setDelivery('delivery')}>
                🚚 Envío a domicilio
              </button>
              <button type="button" className={cn(choice, delivery === 'pickup' && choiceOn)} onClick={() => setDelivery('pickup')}>
                🏪 Retiro en sucursal
              </button>
              {delivery === 'delivery' && (
                <label className={field}>Dirección
                  <input className={input} value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <h2>Pago</h2>
              {['Tarjeta', 'Transferencia', 'Mercado Pago'].map((p) => (
                <button key={p} type="button" className={cn(choice, payment === p && choiceOn)} onClick={() => setPayment(p)}>
                  {p}
                </button>
              ))}
              {payment === 'Tarjeta' && (
                <>
                  <div className={formTwo}>
                    <label className={field}>Número<input className={input} placeholder="4242 4242 4242 4242" /></label>
                    <label className={field}>Vencimiento<input className={input} placeholder="08/28" /></label>
                  </div>
                  <label className={field}>Cuotas
                    <select className={input} value={cuotas} onChange={(e) => setCuotas(e.target.value)}>
                      {['1', '3', '6', '12'].map((c) => <option key={c} value={c}>{c} cuota{c === '1' ? '' : 's'}</option>)}
                    </select>
                  </label>
                </>
              )}
            </>
          )}
          {step === 3 && (
            <div>
              <h2>Pedido {orderId}</h2>
              <p>✅ Compra realizada correctamente.</p>
              <p className={muted}>Te enviamos el comprobante a {email}.</p>
              <button type="button" className={btnPrimary} onClick={() => navigate(`/pedido/${orderId}`)}>
                Seguir el pedido
              </button>
            </div>
          )}
          {step < 3 && (
            <div className="flex gap-2">
              {step > 0 && <button type="button" className={btnOutline} onClick={() => setStep(step - 1)}>Atrás</button>}
              <button type="button" className={btnPrimary} onClick={next}>{step === 2 ? 'Pagar' : 'Continuar'}</button>
            </div>
          )}
        </div>
        <aside className={summary}>
          <h3>Total</h3>
          <p><strong>{formatPrice(totals.total || 0)}</strong></p>
          <p className={muted}>{cart.length} producto(s)</p>
        </aside>
      </div>
    </div>
  )
}
