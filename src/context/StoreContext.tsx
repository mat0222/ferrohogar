import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { reviews as seedReviews } from '../data/catalog'
import type {
  Address,
  CartItem,
  FavoriteItem,
  InstallationBooking,
  Order,
  PaymentMethod,
  PriceAlert,
  Review,
  Toast,
  UserProfile,
} from '../types'
import { addDays, getProduct, uid } from '../lib/utils'

const KEY = 'ferrohogar-store-v1'

interface Persisted {
  cart: CartItem[]
  favorites: FavoriteItem[]
  compareIds: string[]
  user: UserProfile | null
  addresses: Address[]
  payments: PaymentMethod[]
  orders: Order[]
  installations: InstallationBooking[]
  alerts: PriceAlert[]
  extraReviews: Review[]
}

const seed: Persisted = {
  cart: [],
  favorites: [],
  compareIds: [],
  user: null,
  addresses: [
    { id: 'a1', label: 'Casa', street: 'Av. San Martín 2450 4° B', city: 'CABA', zip: '1416' },
    { id: 'a2', label: 'Trabajo', street: 'Av. Corrientes 1234', city: 'CABA', zip: '1043' },
  ],
  payments: [{ id: 'pm1', brand: 'Visa', last4: '4242', expiry: '08/28' }],
  orders: [],
  installations: [],
  alerts: [],
  extraReviews: [],
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    return { ...seed, ...JSON.parse(raw) }
  } catch {
    return seed
  }
}

interface StoreValue {
  cart: CartItem[]
  favorites: FavoriteItem[]
  compareIds: string[]
  user: UserProfile | null
  addresses: Address[]
  payments: PaymentMethod[]
  orders: Order[]
  installations: InstallationBooking[]
  alerts: PriceAlert[]
  reviews: Review[]
  toasts: Toast[]
  addToCart: (productId: string, qty?: number, silent?: boolean) => void
  addManyToCart: (ids: string[]) => void
  setQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  toggleCompare: (productId: string) => void
  clearCompare: () => void
  login: (profile: UserProfile) => void
  logout: () => void
  updateProfile: (profile: UserProfile) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  addPayment: (payment: Omit<PaymentMethod, 'id'>) => void
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order
  bookInstallation: (booking: Omit<InstallationBooking, 'id' | 'createdAt' | 'status'>) => InstallationBooking
  addAlert: (alert: Omit<PriceAlert, 'id'>) => void
  removeAlert: (id: string) => void
  addReview: (review: Omit<Review, 'id' | 'date'>) => void
  pushToast: (message: string, type?: Toast['type']) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => (typeof window === 'undefined' ? seed : load()))
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const pushToast = useCallback((message: string, type: Toast['type'] = 'ok') => {
    const id = uid('t')
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800)
  }, [])

  const addToCart = useCallback(
    (productId: string, qty = 1, silent = false) => {
      const product = getProduct(productId)
      if (!product || product.stock <= 0) {
        if (!silent) pushToast('Sin stock disponible', 'info')
        return
      }
      setState((s) => {
        const existing = s.cart.find((i) => i.productId === productId)
        const nextQty = (existing?.quantity ?? 0) + qty
        if (nextQty > product.stock) {
          return s
        }
        const cart = existing
          ? s.cart.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i))
          : [...s.cart, { productId, quantity: qty }]
        return { ...s, cart }
      })
      if (!silent) pushToast('Agregado al carrito')
    },
    [pushToast],
  )

  const addManyToCart = useCallback(
    (ids: string[]) => {
      ids.forEach((id) => addToCart(id, 1, true))
      pushToast('Kit agregado al carrito')
    },
    [addToCart, pushToast],
  )

  const setQty = useCallback((productId: string, qty: number) => {
    setState((s) => {
      if (qty <= 0) return { ...s, cart: s.cart.filter((i) => i.productId !== productId) }
      const product = getProduct(productId)
      const capped = product ? Math.min(qty, product.stock) : qty
      return {
        ...s,
        cart: s.cart.map((i) => (i.productId === productId ? { ...i, quantity: capped } : i)),
      }
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((i) => i.productId !== productId) }))
  }, [])

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), [])

  const toggleFavorite = useCallback(
    (productId: string) => {
      setState((s) => {
        const exists = s.favorites.some((f) => f.productId === productId)
        if (exists) return { ...s, favorites: s.favorites.filter((f) => f.productId !== productId) }
        const product = getProduct(productId)
        return {
          ...s,
          favorites: [
            ...s.favorites,
            { productId, addedAt: new Date().toISOString(), priceWhenAdded: product?.price ?? 0 },
          ],
        }
      })
    },
    [],
  )

  const isFavorite = useCallback(
    (productId: string) => state.favorites.some((f) => f.productId === productId),
    [state.favorites],
  )

  const toggleCompare = useCallback((productId: string) => {
    setState((s) => {
      if (s.compareIds.includes(productId)) {
        return { ...s, compareIds: s.compareIds.filter((id) => id !== productId) }
      }
      if (s.compareIds.length >= 3) {
        return s
      }
      return { ...s, compareIds: [...s.compareIds, productId] }
    })
  }, [])

  const clearCompare = useCallback(() => setState((s) => ({ ...s, compareIds: [] })), [])

  const login = useCallback((profile: UserProfile) => {
    setState((s) => {
      const demoOrder: Order | undefined =
        s.orders.length === 0
          ? {
              id: 'FH-18294',
              items: [
                { productId: 'p01', quantity: 1 },
                { productId: 'p42', quantity: 1 },
              ],
              subtotal: 101980,
              discount: 20000,
              shipping: 0,
              total: 81980,
              status: 'in_transit',
              delivery: 'delivery',
              payment: 'Mercado Pago',
              createdAt: addDays(-2),
              address: 'Av. San Martín 2450 4° B, CABA',
              tracking: 'AND-904221',
              carrier: 'Andreani',
              estimatedDate: addDays(1),
              customer: profile,
            }
          : undefined
      const demoInstall: InstallationBooking | undefined =
        s.installations.length === 0
          ? {
              id: '10482',
              serviceId: 'sanitarios',
              serviceName: 'Instalación de calefón',
              date: addDays(4).slice(0, 10),
              timeSlot: '14:00 - 16:00',
              status: 'assigned',
              technician: 'Martín López',
              zone: 'CABA',
              address: 'Av. San Martín 2450 4° B, CABA',
              notes: '',
              createdAt: new Date().toISOString(),
            }
          : undefined
      return {
        ...s,
        user: profile,
        orders: demoOrder ? [demoOrder, ...s.orders] : s.orders,
        installations: demoInstall ? [demoInstall, ...s.installations] : s.installations,
      }
    })
    pushToast(`Hola, ${profile.name.split(' ')[0]}`)
  }, [pushToast])

  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), [])
  const updateProfile = useCallback((profile: UserProfile) => setState((s) => ({ ...s, user: profile })), [])

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    setState((s) => ({ ...s, addresses: [...s.addresses, { ...address, id: uid('ad') }] }))
  }, [])

  const addPayment = useCallback((payment: Omit<PaymentMethod, 'id'>) => {
    setState((s) => ({ ...s, payments: [...s.payments, { ...payment, id: uid('pm') }] }))
  }, [])

  const placeOrder = useCallback((order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const created: Order = {
      ...order,
      id: `FH-${Math.floor(10000 + Math.random() * 89999)}`,
      createdAt: new Date().toISOString(),
      status: 'received',
      tracking: `AND-${Math.floor(100000 + Math.random() * 899999)}`,
      carrier: order.delivery === 'delivery' ? 'Andreani' : 'Retiro en sucursal',
      estimatedDate: addDays(order.delivery === 'delivery' ? 3 : 0),
    }
    setState((s) => ({ ...s, orders: [created, ...s.orders], cart: [] }))
    return created
  }, [])

  const bookInstallation = useCallback((booking: Omit<InstallationBooking, 'id' | 'createdAt' | 'status'>) => {
    const created: InstallationBooking = {
      ...booking,
      id: String(Math.floor(40000 + Math.random() * 50000)),
      createdAt: new Date().toISOString(),
      status: 'request',
      technician: 'Martín López',
    }
    setState((s) => ({ ...s, installations: [created, ...s.installations] }))
    pushToast('Instalación reservada')
    return created
  }, [pushToast])

  const addAlert = useCallback(
    (alert: Omit<PriceAlert, 'id'>) => {
      setState((s) => ({ ...s, alerts: [...s.alerts, { ...alert, id: uid('al') }] }))
      pushToast('Alerta activada')
    },
    [pushToast],
  )

  const removeAlert = useCallback((id: string) => {
    setState((s) => ({ ...s, alerts: s.alerts.filter((a) => a.id !== id) }))
  }, [])

  const addReview = useCallback((review: Omit<Review, 'id' | 'date'>) => {
    setState((s) => ({
      ...s,
      extraReviews: [
        { ...review, id: uid('rv'), date: new Date().toISOString().slice(0, 10) },
        ...s.extraReviews,
      ],
    }))
    pushToast('¡Gracias por tu reseña!')
  }, [pushToast])

  const reviews = useMemo(() => [...state.extraReviews, ...seedReviews], [state.extraReviews])

  const value = useMemo<StoreValue>(
    () => ({
      cart: state.cart,
      favorites: state.favorites,
      compareIds: state.compareIds,
      user: state.user,
      addresses: state.addresses,
      payments: state.payments,
      orders: state.orders,
      installations: state.installations,
      alerts: state.alerts,
      reviews,
      toasts,
      addToCart,
      addManyToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      clearCompare,
      login,
      logout,
      updateProfile,
      addAddress,
      addPayment,
      placeOrder,
      bookInstallation,
      addAlert,
      removeAlert,
      addReview,
      pushToast,
    }),
    [
      state,
      reviews,
      toasts,
      addToCart,
      addManyToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      clearCompare,
      login,
      logout,
      updateProfile,
      addAddress,
      addPayment,
      placeOrder,
      bookInstallation,
      addAlert,
      removeAlert,
      addReview,
      pushToast,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
