import type { CartItem, PriceAlert, Product } from '../types'
import { getLiveProducts } from '../data/liveCatalog'

export function triggeredAlerts(alerts: PriceAlert[]) {
  return alerts.filter((alert) => {
    const product = getLiveProducts().find((p) => p.id === alert.productId)
    if (!product) return false
    if (alert.type === 'stock') return product.stock > 0
    if (alert.type === 'price' && alert.targetPrice) return product.price <= alert.targetPrice
    return false
  })
}

export const FREE_SHIPPING = 80_000
export const WHATSAPP = '5491145678900'
export const STORE_PHONE = '11 4567-8900'
export const STORE_EMAIL = 'hola@ferrohogar.com'
export const STORE_ADDRESS = 'Av. San Martín 2450, CABA'
export const STORE_HOURS = 'Lunes a sábado de 8:00 a 19:00'

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function discountPercent(product: Product) {
  if (!product.previousPrice || product.previousPrice <= product.price) return 0
  return Math.round((1 - product.price / product.previousPrice) * 100)
}

export function getProduct(id: string) {
  return getLiveProducts().find((p) => p.id === id)
}

export function getProductBySlug(slug: string) {
  return getLiveProducts().find((p) => p.slug === slug)
}

export function lineTotal(product: Product, qty: number) {
  let price = product.price * qty
  if (product.promo && qty >= product.promo.minQty) {
    price *= 1 - product.promo.discountPercent / 100
  }
  return Math.round(price)
}

export function cartTotals(items: CartItem[]) {
  let subtotal = 0
  let discount = 0
  for (const item of items) {
    const product = getProduct(item.productId)
    if (!product) continue
    const raw = product.price * item.quantity
    const final = lineTotal(product, item.quantity)
    subtotal += raw
    discount += raw - final
  }
  const afterDiscount = subtotal - discount
  const shipping = afterDiscount >= FREE_SHIPPING || afterDiscount === 0 ? 0 : 6500
  return { subtotal, discount, shipping, total: afterDiscount + shipping }
}

export function stockLabel(stock: number) {
  if (stock <= 0) return 'Sin stock'
  if (stock <= 5) return `Últimas ${stock} unidades`
  return `${stock} en stock`
}

export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export function dateLabel(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function addDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
