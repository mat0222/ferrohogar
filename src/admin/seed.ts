import { brands as catalogBrands, categories, guides, products, professionals, reviews } from '../data/catalog'
import { heroImage } from '../data/catalog'
import { STORE_ADDRESS, STORE_EMAIL, STORE_HOURS, STORE_PHONE, WHATSAPP } from '../lib/utils'
import type {
  AbandonedCart,
  AdminBrand,
  AdminCategory,
  AdminCoupon,
  AdminCustomer,
  AdminFavoriteRow,
  AdminGuide,
  AdminInstallation,
  AdminMessage,
  AdminNotice,
  AdminOrder,
  AdminProduct,
  AdminPromo,
  AdminReview,
  AdminTechnician,
  AdminUser,
  AutomationRule,
  HeroContent,
  HomeSection,
  PaymentOption,
  ShippingMethod,
  SiteSettings,
} from './types'

const LOW_STOCK: Record<string, number> = {
  p03: 4,
  p08: 3,
  p10: 5,
  p12: 2,
  p18: 4,
  p23: 3,
  p27: 1,
  p30: 4,
  p33: 2,
  p36: 3,
  p39: 5,
  p43: 3,
}

const OUT_STOCK = new Set(['p14', 'p19'])

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u-admin', name: 'Mateo', email: 'admin@ferrohogar.com', password: 'Admin123!', role: 'admin', active: true },
  { id: 'u-vend', name: 'Laura Vega', email: 'vendedor@ferrohogar.com', password: 'Vendedor123!', role: 'vendedor', active: true },
  { id: 'u-inst', name: 'Carlos Gómez', email: 'instalaciones@ferrohogar.com', password: 'Instala123!', role: 'instalaciones', active: true },
  { id: 'u-cont', name: 'Sofía Ruiz', email: 'contenido@ferrohogar.com', password: 'Contenido123!', role: 'contenido', active: true },
  { id: 'u-sop', name: 'Marcos Díaz', email: 'soporte@ferrohogar.com', password: 'Soporte123!', role: 'soporte', active: true },
]

export function seedProducts(): AdminProduct[] {
  return products.map((p) => {
    const stock = OUT_STOCK.has(p.id) ? 0 : (LOW_STOCK[p.id] ?? p.stock)
    return {
      ...p,
      stock,
      sku: p.code,
      shortDescription: p.description.split('.')[0] + '.',
      wholesalePrice: Math.round(p.price * 0.88),
      installments: 12,
      minStock: 5,
      location: 'Depósito CABA',
      hidden: false,
    }
  })
}

export function seedCategories(): AdminCategory[] {
  const roots: AdminCategory[] = categories.map((c, i) => ({
    id: c.slug,
    name: c.name,
    slug: c.slug,
    image: c.image,
    icon: c.icon,
    description: c.description,
    parentId: null,
    order: i + 1,
    active: true,
  }))
  const children: AdminCategory[] = []
  let extra = 0
  for (const c of categories) {
    const subs = [...new Set(products.filter((p) => p.category === c.slug).map((p) => p.subcategory))]
    subs.forEach((sub, i) => {
      extra += 1
      children.push({
        id: `${c.slug}-${i}`,
        name: sub,
        slug: `${c.slug}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
        image: c.image,
        icon: c.icon,
        description: `Subcategoría de ${c.name}`,
        parentId: c.slug,
        order: i + 1,
        active: true,
      })
    })
  }
  return [...roots, ...children]
}

export function seedBrands(): AdminBrand[] {
  const featured = new Set(['stanley', 'bosch', 'truper', 'alba', 'makita', 'philips'])
  return catalogBrands.map((b) => ({
    slug: b.slug,
    name: b.name,
    logo: '',
    description: `Productos ${b.name} disponibles en FerroHogar.`,
    website: `https://www.${b.slug.replace('+', '')}.com`,
    featured: featured.has(b.slug),
    active: true,
  }))
}

export const seedCustomers: AdminCustomer[] = [
  { id: 'c1', name: 'Juan Pérez', email: 'juan.perez@mail.com', phone: '11 5555-1010', address: 'Av. San Martín 2450, CABA', createdAt: '2025-11-02', lastOrderId: 'FH-10482' },
  { id: 'c2', name: 'Lucas Díaz', email: 'lucas.diaz@mail.com', phone: '11 5555-2020', address: 'Av. Cabildo 1800, CABA', createdAt: '2026-01-14', lastOrderId: 'FH-10481' },
  { id: 'c3', name: 'Ana López', email: 'ana.lopez@mail.com', phone: '11 5555-3030', address: 'Av. Rivadavia 5200, CABA', createdAt: '2025-08-20', lastOrderId: 'FH-10480' },
  { id: 'c4', name: 'María Gómez', email: 'maria.gomez@mail.com', phone: '11 5555-4040', address: 'Calle 12 450, La Plata', createdAt: '2026-03-08', lastOrderId: 'FH-10479' },
  { id: 'c5', name: 'Pedro Sánchez', email: 'pedro.sanchez@mail.com', phone: '11 5555-5050', address: 'Av. Maipú 900, Vicente López', createdAt: '2026-04-22', lastOrderId: 'FH-10477' },
  { id: 'c6', name: 'Lucía Fernández', email: 'lucia.fernandez@mail.com', phone: '11 5555-6060', address: 'Av. Mitre 2100, Avellaneda', createdAt: '2026-02-11' },
]

export const seedOrders: AdminOrder[] = [
  { id: 'FH-10482', customerId: 'c1', customerName: 'Juan Pérez', customerEmail: 'juan.perez@mail.com', items: [{ productId: 'p01', quantity: 1 }], subtotal: 89990, shipping: 0, total: 89990, status: 'preparing', payment: 'Mercado Pago', delivery: 'delivery', address: 'Av. San Martín 2450, CABA', createdAt: new Date().toISOString() },
  { id: 'FH-10481', customerId: 'c2', customerName: 'Lucas Díaz', customerEmail: 'lucas.diaz@mail.com', items: [{ productId: 'p05', quantity: 1 }], subtotal: 39000, shipping: 6500, total: 45500, status: 'dispatched', payment: 'Tarjeta', delivery: 'delivery', address: 'Av. Cabildo 1800, CABA', createdAt: daysAgo(1) },
  { id: 'FH-10480', customerId: 'c3', customerName: 'Ana López', customerEmail: 'ana.lopez@mail.com', items: [{ productId: 'p02', quantity: 1 }, { productId: 'p35', quantity: 1 }], subtotal: 123000, shipping: 0, total: 123000, status: 'delivered', payment: 'Transferencia', delivery: 'delivery', address: 'Av. Rivadavia 5200, CABA', createdAt: daysAgo(2) },
  { id: 'FH-10479', customerId: 'c4', customerName: 'María Gómez', customerEmail: 'maria.gomez@mail.com', items: [{ productId: 'p15', quantity: 2 }], subtotal: 56000, shipping: 6500, total: 62500, status: 'pending', payment: 'Mercado Pago', delivery: 'delivery', address: 'Calle 12 450, La Plata', createdAt: daysAgo(0.2) },
  { id: 'FH-10478', customerId: 'c1', customerName: 'Juan Pérez', customerEmail: 'juan.perez@mail.com', items: [{ productId: 'p21', quantity: 4 }], subtotal: 28000, shipping: 0, total: 28000, status: 'pending', payment: 'Efectivo', delivery: 'pickup', address: 'Retiro sucursal', createdAt: daysAgo(0.4) },
  { id: 'FH-10477', customerId: 'c5', customerName: 'Pedro Sánchez', customerEmail: 'pedro.sanchez@mail.com', items: [{ productId: 'p04', quantity: 1 }], subtotal: 75990, shipping: 0, total: 75990, status: 'confirmed', payment: 'Tarjeta', delivery: 'delivery', address: 'Av. Maipú 900, Vicente López', createdAt: daysAgo(0.6) },
  { id: 'FH-10476', customerId: 'c6', customerName: 'Lucía Fernández', customerEmail: 'lucia.fernandez@mail.com', items: [{ productId: 'p16', quantity: 1 }], subtotal: 18900, shipping: 6500, total: 25400, status: 'pending', payment: 'Mercado Pago', delivery: 'delivery', address: 'Av. Mitre 2100, Avellaneda', createdAt: daysAgo(0.8) },
  { id: 'FH-10475', customerId: 'c2', customerName: 'Lucas Díaz', customerEmail: 'lucas.diaz@mail.com', items: [{ productId: 'p08', quantity: 6 }], subtotal: 48000, shipping: 0, total: 48000, status: 'in_transit', payment: 'Transferencia', delivery: 'delivery', address: 'Av. Cabildo 1800, CABA', createdAt: daysAgo(3) },
]

export const seedTechnicians: AdminTechnician[] = [
  ...professionals.map((p) => ({
    id: p.id,
    name: p.name,
    photo: p.photo,
    specialty: p.specialty,
    phone: '11 4000-1000',
    zones: p.zones,
    available: true,
    jobs: p.jobs,
    rating: p.rating,
  })),
  {
    id: 't4',
    name: 'Carlos Gómez',
    photo: '/img/technician.jpg',
    specialty: 'Electricidad',
    phone: '11 4000-2048',
    zones: ['CABA', 'Zona Norte'],
    available: true,
    jobs: 98,
    rating: 4.9,
  },
]

export const seedInstallations: AdminInstallation[] = [
  { id: 'INS-1048', customerId: 'c1', customerName: 'Juan Pérez', serviceName: 'Instalación de calefón', date: '2026-09-15', timeSlot: '14:00 - 16:00', status: 'confirmed', technicianId: 't4', technicianName: 'Carlos Gómez', zone: 'CABA', address: 'Av. San Martín 2450, CABA', notes: '', createdAt: daysAgo(1) },
  { id: 'INS-1047', customerId: 'c3', customerName: 'Ana López', serviceName: 'Electricidad e iluminación', date: '2026-09-10', timeSlot: '10:00 - 12:00', status: 'request', zone: 'CABA', address: 'Av. Rivadavia 5200, CABA', notes: 'Cambiar 4 tomas', createdAt: daysAgo(0.3) },
  { id: 'INS-1046', customerId: 'c5', customerName: 'Pedro Sánchez', serviceName: 'Aires acondicionados', date: '2026-09-12', timeSlot: '16:00 - 18:00', status: 'request', zone: 'Zona Norte', address: 'Av. Maipú 900, Vicente López', notes: '', createdAt: daysAgo(0.5) },
  { id: 'INS-1045', customerId: 'c2', customerName: 'Lucas Díaz', serviceName: 'Sanitarios', date: '2026-09-09', timeSlot: '08:00 - 10:00', status: 'request', zone: 'CABA', address: 'Av. Cabildo 1800, CABA', notes: 'Canilla cocina', createdAt: daysAgo(0.7) },
  { id: 'INS-1044', customerId: 'c4', customerName: 'María Gómez', serviceName: 'Revestimientos', date: '2026-09-18', timeSlot: '14:00 - 16:00', status: 'assigned', technicianId: 't1', technicianName: 'Martín López', zone: 'Zona Sur', address: 'Calle 12 450, La Plata', notes: '', createdAt: daysAgo(4) },
]

export const seedPromos: AdminPromo[] = [
  { id: 'pr1', name: '20% OFF TALADROS', type: 'percent', value: 20, from: '2026-09-08', to: '2026-09-20', category: 'herramientas', active: true },
  { id: 'pr2', name: '2x1 en mechas', type: '2x1', value: 0, from: '2026-09-01', to: '2026-09-30', category: 'tornilleria', active: true },
  { id: 'pr3', name: 'Envío gratis pintura', type: 'free_shipping', value: 0, from: '2026-09-05', to: '2026-09-15', category: 'pinturas', active: false },
]

export const seedCoupons: AdminCoupon[] = [
  { id: 'cp1', code: 'FERRO10', discountPercent: 10, minAmount: 50000, maxUses: 100, used: 23, active: true },
  { id: 'cp2', code: 'HOGAR15', discountPercent: 15, minAmount: 80000, maxUses: 50, used: 8, active: true },
]

export function seedReviews(): AdminReview[] {
  const pendingComments = [
    { productId: 'p01', author: 'Julián R.', comment: 'Excelente taladro.', rating: 5 },
    { productId: 'p04', author: 'Camila S.', comment: 'La amoladora llegó impecable.', rating: 5 },
    { productId: 'p15', author: 'Nico A.', comment: 'Buena cobertura, tardó el envío.', rating: 4 },
    { productId: 'p02', author: 'Elena V.', comment: 'Las baterías rinden muy bien.', rating: 5 },
    { productId: 'p21', author: 'Pablo M.', comment: 'LED de buena luz.', rating: 4 },
    { productId: 'p26', author: 'Rocío T.', comment: 'La grifería es sólida.', rating: 5 },
    { productId: 'p08', author: 'Iván L.', comment: 'Bolsa de cemento en buen estado.', rating: 4 },
    { productId: 'p05', author: 'Carla B.', comment: 'Caja completa, faltaba un destornillador chico.', rating: 3 },
  ]
  const published: AdminReview[] = reviews.map((r) => ({ ...r, status: 'published' as const, featured: r.rating >= 5 }))
  const pending: AdminReview[] = pendingComments.map((r, i) => ({
    id: `pending-${i + 1}`,
    productId: r.productId,
    author: r.author,
    rating: r.rating,
    comment: r.comment,
    photos: [],
    date: new Date().toISOString().slice(0, 10),
    verified: false,
    status: 'pending',
    featured: false,
  }))
  return [...pending, ...published]
}

export function seedGuides(): AdminGuide[] {
  return guides.map((g) => ({
    ...g,
    author: 'Equipo FerroHogar',
    seoTitle: g.title,
    seoDescription: g.excerpt,
    status: 'published' as const,
  }))
}

export const seedMessages: AdminMessage[] = [
  { id: 'm1', name: 'Juan Pérez', email: 'juan.perez@mail.com', body: '¿El taladro Stanley tiene garantía en sucursal?', kind: 'consulta', status: 'new', createdAt: daysAgo(0.1) },
  { id: 'm2', name: 'Ana López', email: 'ana.lopez@mail.com', body: 'Quiero coordinar instalación de calefón para la semana próxima.', kind: 'solicitud', status: 'open', createdAt: daysAgo(1) },
  { id: 'm3', name: 'Pedro Sánchez', email: 'pedro.sanchez@mail.com', body: 'El envío figura despachado pero no hay movimiento.', kind: 'reclamo', status: 'new', createdAt: daysAgo(0.4) },
]

export const seedShipping: ShippingMethod[] = [
  { id: 'correo', name: 'Correo Argentino', price: 6500, zones: 'Todo el país', days: '3 a 7 días', active: true },
  { id: 'moto', name: 'Moto (CABA)', price: 3500, zones: 'CABA', days: '24 h', active: true },
  { id: 'transporte', name: 'Transporte', price: 8900, zones: 'Interior', days: '4 a 8 días', active: true },
  { id: 'retiro', name: 'Retiro en sucursal', price: 0, zones: 'CABA', days: '2 horas hábiles', active: true },
]

export const seedPayments: PaymentOption[] = [
  { id: 'mp', name: 'Mercado Pago', active: true },
  { id: 'transfer', name: 'Transferencia', active: true },
  { id: 'card', name: 'Tarjeta', active: true },
  { id: 'cash', name: 'Efectivo en sucursal', active: true },
]

export const seedHomeSections: HomeSection[] = [
  { id: 'hero', label: 'Banner principal', enabled: true },
  { id: 'categories', label: 'Categorías', enabled: true },
  { id: 'needs', label: '¿Qué necesitás hacer?', enabled: true },
  { id: 'featured', label: 'Productos destacados', enabled: true },
  { id: 'offers', label: 'Ofertas', enabled: true },
  { id: 'kits', label: 'Kits', enabled: true },
  { id: 'brands', label: 'Marcas', enabled: true },
  { id: 'benefits', label: 'Beneficios', enabled: true },
  { id: 'install', label: 'Instalación', enabled: true },
  { id: 'why', label: 'Por qué FerroHogar', enabled: true },
  { id: 'guides', label: 'Guías', enabled: true },
]

export const seedHero: HeroContent = {
  image: heroImage,
  kicker: 'FERRETERÍA ONLINE',
  title: 'Todo lo que necesitás para construir, reparar y mejorar tu hogar.',
  button: 'Ver productos →',
  link: '/productos',
}

export const seedSettings: SiteSettings = {
  name: 'FerroHogar',
  email: STORE_EMAIL,
  phone: STORE_PHONE,
  address: STORE_ADDRESS,
  whatsapp: WHATSAPP,
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  hours: STORE_HOURS,
  currency: 'ARS',
  taxNote: 'Precios finales con IVA',
  freeShippingFrom: 80000,
  seoTitle: 'FerroHogar | Tu proyecto, nuestra herramienta',
  seoDescription: 'Ferretería online. Herramientas, construcción, pinturas e instalación profesional.',
}

export const seedAbandoned: AbandonedCart[] = [
  { id: 'ab1', customerName: 'Juan Pérez', email: 'juan.perez@mail.com', items: [{ productId: 'p01', quantity: 1 }, { productId: 'p35', quantity: 1 }, { productId: 'p42', quantity: 1 }], total: 142000, updatedAt: daysAgo(0.3), reminded: false },
  { id: 'ab2', customerName: 'Lucía Fernández', email: 'lucia.fernandez@mail.com', items: [{ productId: 'p15', quantity: 2 }], total: 56000, updatedAt: daysAgo(1), reminded: false },
  { id: 'ab3', customerName: 'Pedro Sánchez', email: 'pedro.sanchez@mail.com', items: [{ productId: 'p04', quantity: 1 }], total: 75990, updatedAt: daysAgo(2), reminded: true },
]

export const seedFavorites: AdminFavoriteRow[] = [
  { id: 'f1', customerName: 'Juan Pérez', productId: 'p01', addedAt: daysAgo(2) },
  { id: 'f2', customerName: 'Juan Pérez', productId: 'p04', addedAt: daysAgo(5) },
  { id: 'f3', customerName: 'Ana López', productId: 'p15', addedAt: daysAgo(1) },
  { id: 'f4', customerName: 'Lucas Díaz', productId: 'p02', addedAt: daysAgo(3) },
]

export const seedNotices: AdminNotice[] = [
  { id: 'n1', text: '4 productos tienen stock bajo.', href: '/admin/productos?stock=low', read: false, createdAt: daysAgo(0.05) },
  { id: 'n2', text: 'Nuevo pedido #FH-10482.', href: '/admin/pedidos/FH-10482', read: false, createdAt: daysAgo(0.02) },
  { id: 'n3', text: 'Nueva instalación solicitada.', href: '/admin/instalaciones', read: false, createdAt: daysAgo(0.2) },
  { id: 'n4', text: 'Nueva reseña pendiente de aprobación.', href: '/admin/resenas', read: false, createdAt: daysAgo(0.4) },
]

export const seedAutomations: AutomationRule[] = [
  { id: 'au1', title: 'Stock bajo', description: 'Si stock ≤ mínimo → marcar stock bajo y notificar.', enabled: true },
  { id: 'au2', title: 'Agotado', description: 'Si stock = 0 → marcar agotado y ocultar comprar.', enabled: true },
  { id: 'au3', title: 'Pedido confirmado', description: 'Si pedido confirmado → email al cliente.', enabled: true },
  { id: 'au4', title: 'Instalación confirmada', description: 'Si instalación confirmada → enviar datos del técnico.', enabled: true },
]

export function salesSeries(range: 'today' | '7d' | '30d' | '3m' | '1y') {
  if (range === 'today') {
    return ['8h', '10h', '12h', '14h', '16h', '18h', '20h'].map((label, i) => ({
      label,
      value: [80, 140, 210, 320, 280, 190, 155][i] * 1000,
    }))
  }
  if (range === '7d') {
    return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((label, i) => ({
      label,
      value: [980, 1240, 1110, 1560, 1890, 2100, 1245][i] * 1000,
    }))
  }
  if (range === '30d') {
    return Array.from({ length: 30 }, (_, i) => ({
      label: String(i + 1),
      value: Math.round(400000 + Math.abs(Math.sin(i / 3) * 900000) + (i % 7) * 80000),
    }))
  }
  if (range === '3m') {
    return ['Jul', 'Ago', 'Sep'].map((label, i) => ({ label, value: [14200000, 16800000, 18452300][i] }))
  }
  return ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'].map((label, i) => ({
    label,
    value: [9.2, 10.1, 12.4, 8.8, 9.5, 11.2, 13.1, 14.8, 15.2, 14.2, 16.8, 18.45][i] * 1_000_000,
  }))
}

export const DASHBOARD_KPIS = {
  salesToday: 1_245_800,
  salesMonth: 18_452_300,
  orders: 342,
  customers: 1_284,
  products: 1_847,
}

function daysAgo(days: number) {
  const d = new Date()
  d.setTime(d.getTime() - days * 86400000)
  return d.toISOString()
}
