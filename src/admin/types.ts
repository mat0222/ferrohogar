import type { CartItem, Product, Review } from '../types'

export type AdminRole = 'admin' | 'vendedor' | 'instalaciones' | 'contenido' | 'soporte'

export type Permission =
  | 'dashboard'
  | 'products'
  | 'products.edit'
  | 'products.delete'
  | 'categories'
  | 'brands'
  | 'orders'
  | 'orders.edit'
  | 'customers'
  | 'installations'
  | 'promos'
  | 'reviews'
  | 'favorites'
  | 'shipping'
  | 'payments'
  | 'content'
  | 'guides'
  | 'messages'
  | 'stats'
  | 'carts'
  | 'users'
  | 'settings'
  | 'notifications'

export interface AdminUser {
  id: string
  name: string
  email: string
  password: string
  role: AdminRole
  active: boolean
}

export interface AdminProduct extends Product {
  sku: string
  shortDescription: string
  wholesalePrice?: number
  installments: number
  minStock: number
  location: string
  hidden: boolean
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  image: string
  icon: string
  description: string
  parentId: string | null
  order: number
  active: boolean
}

export interface AdminBrand {
  slug: string
  name: string
  logo: string
  description: string
  website: string
  featured: boolean
  active: boolean
}

export type AdminOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'

export interface AdminOrder {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: AdminOrderStatus
  payment: string
  delivery: 'delivery' | 'pickup'
  address: string
  createdAt: string
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
  lastOrderId?: string
}

export type InstallStatus = 'request' | 'confirmed' | 'assigned' | 'on_way' | 'installing' | 'done' | 'cancelled'

export interface AdminInstallation {
  id: string
  customerId: string
  customerName: string
  serviceName: string
  date: string
  timeSlot: string
  status: InstallStatus
  technicianId?: string
  technicianName?: string
  zone: string
  address: string
  notes: string
  createdAt: string
}

export interface AdminTechnician {
  id: string
  name: string
  photo: string
  specialty: string
  phone: string
  zones: string[]
  available: boolean
  jobs: number
  rating: number
}

export type PromoType = 'percent' | '2x1' | 'second' | 'free_shipping' | 'qty'

export interface AdminPromo {
  id: string
  name: string
  type: PromoType
  value: number
  from: string
  to: string
  category?: string
  active: boolean
}

export interface AdminCoupon {
  id: string
  code: string
  discountPercent: number
  minAmount: number
  maxUses: number
  used: number
  active: boolean
}

export type ReviewStatus = 'pending' | 'published' | 'rejected' | 'hidden'

export interface AdminReview extends Review {
  status: ReviewStatus
  featured: boolean
}

export interface AdminGuide {
  slug: string
  title: string
  image: string
  author: string
  category: string
  excerpt: string
  content: { heading?: string; text: string }[]
  seoTitle: string
  seoDescription: string
  status: 'draft' | 'scheduled' | 'published'
  readMinutes: number
}

export type MessageStatus = 'new' | 'open' | 'replied' | 'closed'
export type MessageKind = 'consulta' | 'contacto' | 'solicitud' | 'reclamo'

export interface AdminMessage {
  id: string
  name: string
  email: string
  body: string
  kind: MessageKind
  status: MessageStatus
  createdAt: string
}

export interface ShippingMethod {
  id: string
  name: string
  price: number
  zones: string
  days: string
  active: boolean
}

export interface PaymentOption {
  id: string
  name: string
  active: boolean
}

export interface HomeSection {
  id: string
  label: string
  enabled: boolean
}

export interface HeroContent {
  image: string
  kicker: string
  title: string
  button: string
  link: string
}

export interface SiteSettings {
  name: string
  email: string
  phone: string
  address: string
  whatsapp: string
  instagram: string
  facebook: string
  hours: string
  currency: string
  taxNote: string
  freeShippingFrom: number
  seoTitle: string
  seoDescription: string
}

export interface AbandonedCart {
  id: string
  customerName: string
  email: string
  items: CartItem[]
  total: number
  updatedAt: string
  reminded: boolean
}

export interface AdminFavoriteRow {
  id: string
  customerName: string
  productId: string
  addedAt: string
}

export interface AdminNotice {
  id: string
  text: string
  href: string
  read: boolean
  createdAt: string
}

export interface AutomationRule {
  id: string
  title: string
  description: string
  enabled: boolean
}

export type SalesRange = 'today' | '7d' | '30d' | '3m' | '1y'
