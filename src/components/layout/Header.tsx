import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, Menu, ShoppingCart, Truck, User, X } from 'lucide-react'
import { Logo } from '../Logo'
import { SearchBar } from '../search/SearchBar'
import { useStore } from '../../context/StoreContext'
import { cn, container } from '../../lib/cn'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/categorias', label: 'Categorías' },
  { to: '/instalacion', label: 'Instalación' },
  { to: '/guias', label: 'Guías' },
  { to: '/contacto', label: 'Contacto' },
]

const actionClass =
  'relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-white hover:bg-white/6'

export function Header() {
  const { cart, favorites, user } = useStore()
  const [open, setOpen] = useState(false)
  const count = cart.reduce((n, i) => n + i.quantity, 0)

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-header text-white">
        <div className={cn(container, 'grid grid-cols-[1fr_auto] items-center gap-4 py-3.5 md:grid-cols-[auto_1fr_auto] md:gap-6')}>
          <Logo />
          <div className="col-span-2 order-3 md:col-span-1 md:order-none">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/cuenta" className={actionClass}>
              <User size={20} />
              <span className="hidden lg:inline">{user ? user.name.split(' ')[0] : 'Mi cuenta'}</span>
            </Link>
            <Link to="/favoritos" className={actionClass}>
              <Heart size={20} />
              <span className="hidden lg:inline">Favoritos</span>
              {favorites.length > 0 && (
                <i className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand text-[10px] not-italic font-bold">
                  {favorites.length}
                </i>
              )}
            </Link>
            <Link to="/carrito" className={actionClass}>
              <ShoppingCart size={20} />
              <span className="hidden lg:inline">Carrito</span>
              {count > 0 && (
                <i className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand text-[10px] not-italic font-bold">
                  {count}
                </i>
              )}
            </Link>
            <button type="button" className="border-0 bg-transparent text-white md:hidden" onClick={() => setOpen(true)} aria-label="Menú">
              <Menu />
            </button>
            <Link
              to="/admin/login"
              className="rounded-md bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-hover"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </div>
      <nav className="hidden border-t border-[#2a2a2a] bg-nav md:block">
        <div className={cn(container, 'flex min-h-[46px] items-center justify-between')}>
          <ul className="m-0 flex list-none gap-[22px] p-0">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'inline-block border-b-2 border-transparent py-3 text-[0.92rem] font-semibold text-[#ddd] hover:border-brand hover:text-white',
                      isActive && 'border-brand text-white',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <p className="m-0 flex items-center gap-2 text-[0.85rem] text-[#cfcfcf]">
            <Truck size={16} className="text-brand" /> Envíos a todo el país | Rápido y seguro
          </p>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col gap-2 bg-header px-6 pt-[72px]">
          <button type="button" className="absolute top-[18px] right-[18px] border-0 bg-transparent text-white" onClick={() => setOpen(false)} aria-label="Cerrar">
            <X />
          </button>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              end={l.to === '/'}
              className={({ isActive }) => cn('py-2.5 text-xl font-bold text-white', isActive && 'text-brand')}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-fit rounded-md bg-brand px-4 py-2.5 font-bold text-white"
          >
            Ingresar
          </Link>
        </div>
      )}
    </header>
  )
}
