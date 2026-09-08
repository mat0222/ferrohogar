export type CategorySlug =
  | 'herramientas'
  | 'construccion'
  | 'pinturas'
  | 'electricidad'
  | 'sanitarios'
  | 'jardin'
  | 'tornilleria'
  | 'hogar'

export interface Category {
  slug: CategorySlug
  name: string
  icon: string
  description: string
  image: string
}

export interface SpecBar {
  label: string
  value: number
  display: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  code: string
  category: CategorySlug
  subcategory: string
  price: number
  previousPrice?: number
  rating: number
  reviewCount: number
  stock: number
  images: string[]
  description: string
  specs: { label: string; value: string }[]
  specBars?: SpecBar[]
  usage?: string
  level?: number
  features: string[]
  color?: string
  size?: string
  power?: string
  type: string
  featured?: boolean
  offer?: boolean
  isNew?: boolean
  soldCount: number
  relatedIds: string[]
  alsoNeedIds: string[]
  createdAt: string
  promo?: { minQty: number; discountPercent: number }
  compareGroup?: string
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  comment: string
  photos: string[]
  date: string
  verified: boolean
}

export interface Kit {
  id: string
  slug: string
  name: string
  project: string
  description: string
  productIds: string[]
  image: string
}

export interface ProjectNeed {
  id: string
  title: string
  description: string
  icon: string
  kitId: string
  productIds: string[]
}

export interface Guide {
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  readMinutes: number
  content: { heading?: string; text: string }[]
}

export interface InstallService {
  id: string
  name: string
  icon: string
  description: string
  priceFrom: number
  duration: string
}

export interface Professional {
  id: string
  name: string
  specialty: string
  rating: number
  jobs: number
  photo: string
  zones: string[]
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Address {
  id: string
  label: string
  street: string
  city: string
  zip: string
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiry: string
}

export interface UserProfile {
  name: string
  email: string
  phone: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  status: 'received' | 'preparing' | 'shipped' | 'in_transit' | 'delivered'
  delivery: 'delivery' | 'pickup'
  payment: string
  createdAt: string
  address?: string
  tracking?: string
  carrier?: string
  estimatedDate?: string
  customer: UserProfile
}

export interface InstallationBooking {
  id: string
  serviceId: string
  serviceName: string
  date: string
  timeSlot: string
  status: 'request' | 'assigned' | 'on_way' | 'installing' | 'done'
  technician?: string
  zone: string
  address: string
  notes: string
  createdAt: string
}

export interface PriceAlert {
  id: string
  productId: string
  type: 'price' | 'stock'
  targetPrice?: number
}

export interface FavoriteItem {
  productId: string
  addedAt: string
  priceWhenAdded: number
}

export interface Toast {
  id: string
  message: string
  type: 'ok' | 'info'
}

export type SortKey =
  | 'relevance'
  | 'sold'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
