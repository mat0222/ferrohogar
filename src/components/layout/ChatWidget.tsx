import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Wrench, Package, Truck, Headset, X } from 'lucide-react'
import { waLink } from '../../lib/utils'
import { useStore } from '../../context/StoreContext'
import { btnPrimary, cn } from '../../lib/cn'

const options = [
  { to: '/asistente', label: 'Consultar un producto', icon: Package },
  { to: '/productos', label: 'Consultar stock', icon: Package },
  { to: '/ayuda#envios', label: 'Consultar envío', icon: Truck },
  { to: '/instalacion', label: 'Consultar instalación', icon: Wrench },
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const { compareIds } = useStore()

  return (
    <div className={cn('fixed right-[18px] z-[45] flex flex-col items-end gap-2.5', compareIds.length ? 'bottom-[88px]' : 'bottom-[18px]')}>
      {open && (
        <div className="grid w-[280px] gap-2 rounded-[14px] bg-white p-3.5 shadow-card">
          <header className="flex justify-between">
            <strong>¿Necesitás ayuda?</strong>
            <button type="button" className="cursor-pointer border-0 bg-transparent" onClick={() => setOpen(false)} aria-label="Cerrar">
              <X size={16} />
            </button>
          </header>
          <p>Elegí un tema o hablá con un asesor por WhatsApp.</p>
          {options.map((o) => (
            <Link key={o.label} className="flex items-center gap-2 rounded-lg bg-page p-2" to={o.to} onClick={() => setOpen(false)}>
              <o.icon size={16} /> {o.label}
            </Link>
          ))}
          <a
            className={cn(btnPrimary, 'w-full')}
            href={waLink('Hola, necesito hablar con un asesor de FerroHogar.')}
            target="_blank"
            rel="noreferrer"
          >
            <Headset size={16} /> Hablar con un asesor
          </a>
        </div>
      )}
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-brand px-4 py-3 font-extrabold text-white shadow-brand"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle size={22} />
        <span className="hidden sm:inline">¿Necesitás ayuda?</span>
      </button>
    </div>
  )
}
