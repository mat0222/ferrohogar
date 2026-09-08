import { useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  FolderTree,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Percent,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tags,
  Truck,
  UserRound,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useAdmin } from './context'
import type { Permission } from './types'
import { cn } from '../lib/cn'
import { ROLE_LABEL } from './permissions'

const nav: { to: string; label: string; icon: typeof Home; perm: Permission }[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard' },
  { to: '/admin/productos', label: 'Productos', icon: ShoppingBag, perm: 'products' },
  { to: '/admin/categorias', label: 'Categorías', icon: FolderTree, perm: 'categories' },
  { to: '/admin/marcas', label: 'Marcas', icon: Tags, perm: 'brands' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: Package, perm: 'orders' },
  { to: '/admin/clientes', label: 'Clientes', icon: Users, perm: 'customers' },
  { to: '/admin/instalaciones', label: 'Instalaciones', icon: Wrench, perm: 'installations' },
  { to: '/admin/promociones', label: 'Promociones', icon: Percent, perm: 'promos' },
  { to: '/admin/resenas', label: 'Reseñas', icon: Star, perm: 'reviews' },
  { to: '/admin/favoritos', label: 'Favoritos', icon: Heart, perm: 'favorites' },
  { to: '/admin/envios', label: 'Envíos', icon: Truck, perm: 'shipping' },
  { to: '/admin/pagos', label: 'Pagos', icon: CreditCard, perm: 'payments' },
  { to: '/admin/contenido', label: 'Contenido', icon: Store, perm: 'content' },
  { to: '/admin/guias', label: 'Guías y artículos', icon: BookOpen, perm: 'guides' },
  { to: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare, perm: 'messages' },
  { to: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3, perm: 'stats' },
  { to: '/admin/carritos', label: 'Carritos abandonados', icon: ShoppingCart, perm: 'carts' },
  { to: '/admin/usuarios', label: 'Usuarios y permisos', icon: UserRound, perm: 'users' },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings, perm: 'settings' },
]

export function AdminLayout() {
  const { session, logoutAdmin, can, state, markNoticeRead, markAllNoticesRead, banner } = useAdmin()
  const [open, setOpen] = useState(false)
  const [bell, setBell] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const unread = state.notices.filter((n) => !n.read)

  const items = useMemo(() => nav.filter((n) => can(n.perm)), [can])

  if (!session) return <Navigate to="/admin/login" replace />

  const required = nav.find((n) => n.to !== '/admin' && location.pathname.startsWith(n.to))
  if (required && !can(required.perm)) return <Navigate to="/admin" replace />

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-slate-900">
      {open && <button className="fixed inset-0 z-30 bg-black/40 lg:hidden" aria-label="Cerrar menú" onClick={() => setOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[#111318] text-slate-300 transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="border-b border-white/10 px-5 py-5">
          <p className="m-0 text-[11px] font-extrabold tracking-[0.18em] text-brand">FERROHOGAR</p>
          <strong className="text-lg text-white">Admin</strong>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {items.map((n) => {
            const Icon = n.icon
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/admin'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold',
                    isActive ? 'bg-brand/15 text-brand' : 'hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon size={16} />
                {n.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5 hover:text-white">
            <Home size={16} /> Ver tienda
          </Link>
          <button type="button" className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-sm text-slate-300 hover:text-white" onClick={logoutAdmin}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <button type="button" className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border-0 bg-slate-100 lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <form
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (q.trim()) navigate(`/admin/productos?q=${encodeURIComponent(q.trim())}`)
            }}
          >
            <Search size={16} className="text-slate-400" />
            <input className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" placeholder="Buscar productos, pedidos, clientes..." value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <div className="relative">
            <button type="button" className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-lg border-0 bg-slate-100" onClick={() => setBell((v) => !v)}>
              <Bell size={18} />
              {unread.length > 0 && <i className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand" />}
            </button>
            {bell && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="mb-1 flex items-center justify-between px-2">
                  <strong className="text-sm">Notificaciones</strong>
                  <button type="button" className="cursor-pointer border-0 bg-transparent text-xs text-brand" onClick={markAllNoticesRead}>Marcar leídas</button>
                </div>
                {state.notices.slice(0, 8).map((n) => (
                  <Link key={n.id} to={n.href} onClick={() => { markNoticeRead(n.id); setBell(false) }} className={cn('block rounded-lg px-2 py-2 text-sm', !n.read && 'bg-orange-50')}>
                    {n.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand font-extrabold text-white">{session.name[0]}</div>
            <div className="leading-tight">
              <strong className="block text-sm">{session.name}</strong>
              <span className="text-xs text-slate-500">{ROLE_LABEL[session.role]}</span>
            </div>
          </div>
        </header>
        {banner && <div className="mx-4 mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{banner}</div>}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
