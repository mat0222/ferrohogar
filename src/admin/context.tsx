import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setLiveCategories, setLiveProducts } from '../data/liveCatalog'
import { uid } from '../lib/utils'
import { categories as catalogCategories } from '../data/catalog'
import { useStore } from '../context/StoreContext'
import { can as roleCan } from './permissions'
import type { Permission } from './types'
import {
  ADMIN_USERS,
  seedAbandoned,
  seedAutomations,
  seedBrands,
  seedCategories,
  seedCoupons,
  seedCustomers,
  seedFavorites,
  seedGuides,
  seedHero,
  seedHomeSections,
  seedInstallations,
  seedMessages,
  seedNotices,
  seedOrders,
  seedPayments,
  seedProducts,
  seedPromos,
  seedReviews,
  seedSettings,
  seedShipping,
  seedTechnicians,
} from './seed'
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
  AdminOrderStatus,
  AdminProduct,
  AdminPromo,
  AdminReview,
  AdminTechnician,
  AdminUser,
  AutomationRule,
  HeroContent,
  HomeSection,
  InstallStatus,
  MessageKind,
  PaymentOption,
  ReviewStatus,
  ShippingMethod,
  SiteSettings,
} from './types'

const KEY = 'ferrohogar-admin-v1'
const SESSION_KEY = 'ferrohogar-admin-session'

export interface AdminState {
  users: AdminUser[]
  products: AdminProduct[]
  categories: AdminCategory[]
  brands: AdminBrand[]
  orders: AdminOrder[]
  customers: AdminCustomer[]
  installations: AdminInstallation[]
  technicians: AdminTechnician[]
  promos: AdminPromo[]
  coupons: AdminCoupon[]
  reviews: AdminReview[]
  guides: AdminGuide[]
  messages: AdminMessage[]
  shipping: ShippingMethod[]
  payments: PaymentOption[]
  homeSections: HomeSection[]
  hero: HeroContent
  settings: SiteSettings
  abandoned: AbandonedCart[]
  favorites: AdminFavoriteRow[]
  notices: AdminNotice[]
  automations: AutomationRule[]
}

function createSeed(): AdminState {
  return {
    users: ADMIN_USERS,
    products: seedProducts(),
    categories: seedCategories(),
    brands: seedBrands(),
    orders: seedOrders,
    customers: seedCustomers,
    installations: seedInstallations,
    technicians: seedTechnicians,
    promos: seedPromos,
    coupons: seedCoupons,
    reviews: seedReviews(),
    guides: seedGuides(),
    messages: seedMessages,
    shipping: seedShipping,
    payments: seedPayments,
    homeSections: seedHomeSections,
    hero: seedHero,
    settings: seedSettings,
    abandoned: seedAbandoned,
    favorites: seedFavorites,
    notices: seedNotices,
    automations: seedAutomations,
  }
}

function load(): AdminState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return createSeed()
    return { ...createSeed(), ...JSON.parse(raw) }
  } catch {
    return createSeed()
  }
}

interface AdminValue {
  ready: boolean
  session: AdminUser | null
  state: AdminState
  loginAdmin: (email: string, password: string) => string | null
  logoutAdmin: () => void
  can: (permission: Permission) => boolean
  toast: (message: string) => void
  banner: string | null
  clearBanner: () => void
  saveProduct: (product: AdminProduct) => void
  duplicateProduct: (id: string) => void
  deleteProduct: (id: string) => void
  adjustStock: (id: string, stock: number) => void
  saveCategory: (category: AdminCategory) => void
  deleteCategory: (id: string) => void
  reorderCategories: (ids: string[]) => void
  saveBrand: (brand: AdminBrand) => void
  deleteBrand: (slug: string) => void
  setOrderStatus: (id: string, status: AdminOrderStatus) => void
  saveCustomer: (customer: AdminCustomer) => void
  saveInstallation: (item: AdminInstallation) => void
  setInstallStatus: (id: string, status: InstallStatus) => void
  saveTechnician: (tech: AdminTechnician) => void
  savePromo: (promo: AdminPromo) => void
  deletePromo: (id: string) => void
  saveCoupon: (coupon: AdminCoupon) => void
  deleteCoupon: (id: string) => void
  setReviewStatus: (id: string, status: ReviewStatus, featured?: boolean) => void
  saveGuide: (guide: AdminGuide) => void
  deleteGuide: (slug: string) => void
  addMessage: (input: { name: string; email: string; body: string; kind?: MessageKind }) => void
  setMessageStatus: (id: string, status: AdminMessage['status']) => void
  saveShipping: (method: ShippingMethod) => void
  savePayment: (option: PaymentOption) => void
  setHero: (hero: HeroContent) => void
  setHomeSections: (sections: HomeSection[]) => void
  saveSettings: (settings: SiteSettings) => void
  saveUser: (user: AdminUser) => void
  deleteUser: (id: string) => void
  markNoticeRead: (id: string) => void
  markAllNoticesRead: () => void
  remindCart: (id: string) => void
  toggleAutomation: (id: string) => void
  resetDemo: () => void
}

const AdminContext = createContext<AdminValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const store = useStore()
  const [state, setState] = useState<AdminState>(() => (typeof window === 'undefined' ? createSeed() : load()))
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY))
  const [banner, setBanner] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    setLiveProducts(state.products.filter((p) => !p.hidden))
    const roots = state.categories.filter((c) => !c.parentId && c.active)
    const mapped = catalogCategories
      .map((c) => {
        const row = roots.find((r) => r.slug === c.slug || r.id === c.slug)
        return row
          ? { ...c, name: row.name, description: row.description, image: row.image, icon: row.icon }
          : c
      })
      .filter((c) => roots.some((r) => r.slug === c.slug || r.id === c.slug) || roots.length === 0)
    setLiveCategories(mapped.length ? mapped : catalogCategories)
  }, [state.products, state.categories])

  const session = useMemo(
    () => state.users.find((u) => u.id === sessionId && u.active) ?? null,
    [state.users, sessionId],
  )

  const toast = useCallback((message: string) => {
    setBanner(message)
    window.setTimeout(() => setBanner(null), 2600)
  }, [])

  const loginAdmin = useCallback((email: string, password: string) => {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && u.active,
    )
    if (!user) return 'Email o contraseña incorrectos'
    setSessionId(user.id)
    localStorage.setItem(SESSION_KEY, user.id)
    return null
  }, [state.users])

  const logoutAdmin = useCallback(() => {
    setSessionId(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const canDo = useCallback((permission: Permission) => roleCan(session?.role, permission), [session])

  const saveProduct = useCallback((product: AdminProduct) => {
    setState((s) => {
      const exists = s.products.some((p) => p.id === product.id)
      return { ...s, products: exists ? s.products.map((p) => (p.id === product.id ? product : p)) : [product, ...s.products] }
    })
    toast('Producto guardado')
  }, [toast])

  const duplicateProduct = useCallback((id: string) => {
    setState((s) => {
      const p = s.products.find((x) => x.id === id)
      if (!p) return s
      const copy: AdminProduct = {
        ...p,
        id: uid('p'),
        slug: `${p.slug}-copia`,
        name: `${p.name} (copia)`,
        code: `${p.code}-C`,
        sku: `${p.sku}-C`,
      }
      return { ...s, products: [copy, ...s.products] }
    })
    toast('Producto duplicado')
  }, [toast])

  const deleteProduct = useCallback((id: string) => {
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }))
    toast('Producto eliminado')
  }, [toast])

  const adjustStock = useCallback((id: string, stock: number) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)),
    }))
    toast('Stock actualizado')
  }, [toast])

  const saveCategory = useCallback((category: AdminCategory) => {
    setState((s) => {
      const exists = s.categories.some((c) => c.id === category.id)
      return { ...s, categories: exists ? s.categories.map((c) => (c.id === category.id ? category : c)) : [...s.categories, category] }
    })
    toast('Categoría guardada')
  }, [toast])

  const deleteCategory = useCallback((id: string) => {
    setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id && c.parentId !== id) }))
    toast('Categoría eliminada')
  }, [toast])

  const reorderCategories = useCallback((ids: string[]) => {
    setState((s) => ({
      ...s,
      categories: s.categories.map((c) => {
        const idx = ids.indexOf(c.id)
        return idx >= 0 ? { ...c, order: idx + 1 } : c
      }),
    }))
  }, [])

  const saveBrand = useCallback((brand: AdminBrand) => {
    setState((s) => {
      const exists = s.brands.some((b) => b.slug === brand.slug)
      return { ...s, brands: exists ? s.brands.map((b) => (b.slug === brand.slug ? brand : b)) : [...s.brands, brand] }
    })
    toast('Marca guardada')
  }, [toast])

  const deleteBrand = useCallback((slug: string) => {
    setState((s) => ({ ...s, brands: s.brands.filter((b) => b.slug !== slug) }))
    toast('Marca eliminada')
  }, [toast])

  const setOrderStatus = useCallback((id: string, status: AdminOrderStatus) => {
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) }))
    toast('Estado del pedido actualizado')
  }, [toast])

  const saveCustomer = useCallback((customer: AdminCustomer) => {
    setState((s) => {
      const exists = s.customers.some((c) => c.id === customer.id)
      return { ...s, customers: exists ? s.customers.map((c) => (c.id === customer.id ? customer : c)) : [customer, ...s.customers] }
    })
    toast('Cliente guardado')
  }, [toast])

  const saveInstallation = useCallback((item: AdminInstallation) => {
    setState((s) => {
      const exists = s.installations.some((i) => i.id === item.id)
      return { ...s, installations: exists ? s.installations.map((i) => (i.id === item.id ? item : i)) : [item, ...s.installations] }
    })
    toast('Instalación guardada')
  }, [toast])

  const setInstallStatus = useCallback((id: string, status: InstallStatus) => {
    setState((s) => ({ ...s, installations: s.installations.map((i) => (i.id === id ? { ...i, status } : i)) }))
    toast('Estado de instalación actualizado')
  }, [toast])

  const saveTechnician = useCallback((tech: AdminTechnician) => {
    setState((s) => {
      const exists = s.technicians.some((t) => t.id === tech.id)
      return { ...s, technicians: exists ? s.technicians.map((t) => (t.id === tech.id ? tech : t)) : [tech, ...s.technicians] }
    })
    toast('Técnico guardado')
  }, [toast])

  const savePromo = useCallback((promo: AdminPromo) => {
    setState((s) => {
      const exists = s.promos.some((p) => p.id === promo.id)
      return { ...s, promos: exists ? s.promos.map((p) => (p.id === promo.id ? promo : p)) : [promo, ...s.promos] }
    })
    toast('Promoción guardada')
  }, [toast])

  const deletePromo = useCallback((id: string) => {
    setState((s) => ({ ...s, promos: s.promos.filter((p) => p.id !== id) }))
    toast('Promoción eliminada')
  }, [toast])

  const saveCoupon = useCallback((coupon: AdminCoupon) => {
    setState((s) => {
      const exists = s.coupons.some((c) => c.id === coupon.id)
      return { ...s, coupons: exists ? s.coupons.map((c) => (c.id === coupon.id ? coupon : c)) : [coupon, ...s.coupons] }
    })
    toast('Cupón guardado')
  }, [toast])

  const deleteCoupon = useCallback((id: string) => {
    setState((s) => ({ ...s, coupons: s.coupons.filter((c) => c.id !== id) }))
    toast('Cupón eliminado')
  }, [toast])

  const setReviewStatus = useCallback((id: string, status: ReviewStatus, featured?: boolean) => {
    setState((s) => ({
      ...s,
      reviews: s.reviews.map((r) => (r.id === id ? { ...r, status, featured: featured ?? r.featured } : r)),
    }))
    toast('Reseña actualizada')
  }, [toast])

  const saveGuide = useCallback((guide: AdminGuide) => {
    setState((s) => {
      const exists = s.guides.some((g) => g.slug === guide.slug)
      return { ...s, guides: exists ? s.guides.map((g) => (g.slug === guide.slug ? guide : g)) : [guide, ...s.guides] }
    })
    toast('Guía guardada')
  }, [toast])

  const deleteGuide = useCallback((slug: string) => {
    setState((s) => ({ ...s, guides: s.guides.filter((g) => g.slug !== slug) }))
    toast('Guía eliminada')
  }, [toast])

  const addMessage = useCallback((input: { name: string; email: string; body: string; kind?: MessageKind }) => {
    const row: AdminMessage = {
      id: uid('msg'),
      name: input.name,
      email: input.email,
      body: input.body,
      kind: input.kind ?? 'contacto',
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    setState((s) => ({
      ...s,
      messages: [row, ...s.messages],
      notices: [
        { id: uid('n'), text: `Nuevo mensaje de ${input.name}.`, href: '/admin/mensajes', read: false, createdAt: new Date().toISOString() },
        ...s.notices,
      ],
    }))
  }, [])

  const setMessageStatus = useCallback((id: string, status: AdminMessage['status']) => {
    setState((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, status } : m)) }))
  }, [])

  const saveShipping = useCallback((method: ShippingMethod) => {
    setState((s) => ({ ...s, shipping: s.shipping.map((m) => (m.id === method.id ? method : m)) }))
    toast('Envío actualizado')
  }, [toast])

  const savePayment = useCallback((option: PaymentOption) => {
    setState((s) => ({ ...s, payments: s.payments.map((p) => (p.id === option.id ? option : p)) }))
    toast('Pago actualizado')
  }, [toast])

  const setHero = useCallback((hero: HeroContent) => {
    setState((s) => ({ ...s, hero }))
    toast('Hero actualizado')
  }, [toast])

  const setHomeSections = useCallback((homeSections: HomeSection[]) => {
    setState((s) => ({ ...s, homeSections }))
    toast('Inicio actualizado')
  }, [toast])

  const saveSettings = useCallback((settings: SiteSettings) => {
    setState((s) => ({ ...s, settings }))
    toast('Configuración guardada')
  }, [toast])

  const saveUser = useCallback((user: AdminUser) => {
    setState((s) => {
      const exists = s.users.some((u) => u.id === user.id)
      return { ...s, users: exists ? s.users.map((u) => (u.id === user.id ? user : u)) : [...s.users, user] }
    })
    toast('Usuario guardado')
  }, [toast])

  const deleteUser = useCallback((id: string) => {
    if (id === 'u-admin') {
      toast('No se puede eliminar el administrador principal')
      return
    }
    setState((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }))
    toast('Usuario eliminado')
  }, [toast])

  const markNoticeRead = useCallback((id: string) => {
    setState((s) => ({ ...s, notices: s.notices.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
  }, [])

  const markAllNoticesRead = useCallback(() => {
    setState((s) => ({ ...s, notices: s.notices.map((n) => ({ ...n, read: true })) }))
  }, [])

  const remindCart = useCallback((id: string) => {
    setState((s) => ({ ...s, abandoned: s.abandoned.map((c) => (c.id === id ? { ...c, reminded: true } : c)) }))
    toast('Recordatorio enviado (5% OFF)')
  }, [toast])

  const toggleAutomation = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      automations: s.automations.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    }))
  }, [])

  const resetDemo = useCallback(() => {
    const next = createSeed()
    setState(next)
    toast('Datos de demo restaurados')
  }, [toast])

  const mergedOrders = useMemo(() => {
    const map = new Map(state.orders.map((o) => [o.id, o]))
    for (const o of store.orders) {
      if (map.has(o.id)) continue
      map.set(o.id, {
        id: o.id,
        customerId: 'store',
        customerName: o.customer.name,
        customerEmail: o.customer.email,
        items: o.items,
        subtotal: o.subtotal,
        shipping: o.shipping,
        total: o.total,
        status: o.status === 'received' ? 'pending' : o.status === 'shipped' ? 'dispatched' : (o.status as AdminOrderStatus),
        payment: o.payment,
        delivery: o.delivery,
        address: o.address ?? '',
        createdAt: o.createdAt,
      })
    }
    return [...map.values()].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [state.orders, store.orders])

  const value = useMemo<AdminValue>(
    () => ({
      ready: true,
      session,
      state: { ...state, orders: mergedOrders },
      loginAdmin,
      logoutAdmin,
      can: canDo,
      toast,
      banner,
      clearBanner: () => setBanner(null),
      saveProduct,
      duplicateProduct,
      deleteProduct,
      adjustStock,
      saveCategory,
      deleteCategory,
      reorderCategories,
      saveBrand,
      deleteBrand,
      setOrderStatus,
      saveCustomer,
      saveInstallation,
      setInstallStatus,
      saveTechnician,
      savePromo,
      deletePromo,
      saveCoupon,
      deleteCoupon,
      setReviewStatus,
      saveGuide,
      deleteGuide,
      addMessage,
      setMessageStatus,
      saveShipping,
      savePayment,
      setHero,
      setHomeSections,
      saveSettings,
      saveUser,
      deleteUser,
      markNoticeRead,
      markAllNoticesRead,
      remindCart,
      toggleAutomation,
      resetDemo,
    }),
    [
      session,
      state,
      mergedOrders,
      loginAdmin,
      logoutAdmin,
      canDo,
      toast,
      banner,
      saveProduct,
      duplicateProduct,
      deleteProduct,
      adjustStock,
      saveCategory,
      deleteCategory,
      reorderCategories,
      saveBrand,
      deleteBrand,
      setOrderStatus,
      saveCustomer,
      saveInstallation,
      setInstallStatus,
      saveTechnician,
      savePromo,
      deletePromo,
      saveCoupon,
      deleteCoupon,
      setReviewStatus,
      saveGuide,
      deleteGuide,
      addMessage,
      setMessageStatus,
      saveShipping,
      savePayment,
      setHero,
      setHomeSections,
      saveSettings,
      saveUser,
      deleteUser,
      markNoticeRead,
      markAllNoticesRead,
      remindCart,
      toggleAutomation,
      resetDemo,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin debe usarse dentro de AdminProvider')
  return ctx
}

export function stockStatus(product: AdminProduct) {
  if (product.hidden) return { label: 'Oculto', tone: 'muted' as const }
  if (product.stock <= 0) return { label: 'Agotado', tone: 'danger' as const }
  if (product.stock <= product.minStock) return { label: 'Stock bajo', tone: 'warn' as const }
  return { label: 'Disponible', tone: 'ok' as const }
}
