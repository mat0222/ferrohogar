import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { Logo } from '../Logo'
import { categories } from '../../data/catalog'
import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { cn, container } from '../../lib/cn'

const colTitle = 'mb-2.5 text-[0.95rem] text-white'
const colLink = 'mb-2 block text-[0.9rem] text-[#c9c9c9] hover:text-white'

export function Footer() {
  const [email, setEmail] = useState('')
  const { pushToast } = useStore()

  return (
    <footer className="mt-6 bg-header pt-12 text-[#ddd]">
      <div className={cn(container, 'grid gap-7 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]')}>
        <div>
          <Logo stacked />
          <p className="mt-3 max-w-[240px] text-[0.9rem] text-[#c9c9c9]">
            Ferretería online para construir, reparar y mejorar tu hogar.
          </p>
        </div>
        <div>
          <h3 className={colTitle}>Comprar</h3>
          <Link className={colLink} to="/productos">Productos</Link>
          <Link className={colLink} to="/ofertas">Ofertas</Link>
          <Link className={colLink} to="/categorias">Categorías</Link>
          <Link className={colLink} to="/marcas">Marcas</Link>
          <Link className={colLink} to="/kits">Kits inteligentes</Link>
        </div>
        <div>
          <h3 className={colTitle}>Ayuda</h3>
          <Link className={colLink} to="/ayuda">Preguntas frecuentes</Link>
          <Link className={colLink} to="/ayuda#envios">Envíos</Link>
          <Link className={colLink} to="/ayuda#pagos">Pagos</Link>
          <Link className={colLink} to="/ayuda#cambios">Cambios</Link>
          <Link className={colLink} to="/ayuda#devoluciones">Devoluciones</Link>
        </div>
        <div>
          <h3 className={colTitle}>Empresa</h3>
          <Link className={colLink} to="/nosotros">Nosotros</Link>
          <Link className={colLink} to="/instalacion">Instalaciones</Link>
          <Link className={colLink} to="/contacto">Contacto</Link>
          <Link className={colLink} to="/guias">Guías</Link>
          <Link className={colLink} to="/calculadoras">Calculadoras</Link>
          <Link className={colLink} to="/admin/login">FerroHogar Admin</Link>
        </div>
        <div>
          <h3 className={colTitle}>Legal</h3>
          <Link className={colLink} to="/legal/terminos">Términos</Link>
          <Link className={colLink} to="/legal/privacidad">Privacidad</Link>
          <Link className={colLink} to="/legal/cookies">Cookies</Link>
          <h3 className={cn(colTitle, 'mt-[18px]')}>Seguinos</h3>
          <div className="mb-3 flex gap-2">
            <a className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#2a2a2a] text-white" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#2a2a2a] text-white" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" /></svg>
            </a>
            <a className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#2a2a2a] text-white" href="https://wa.me/5491145678900" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <Send size={18} />
            </a>
          </div>
          <form
            className="flex gap-1.5"
            onSubmit={(e) => {
              e.preventDefault()
              setEmail('')
              pushToast('Te suscribiste al newsletter')
            }}
          >
            <input
              className="min-w-0 flex-1 rounded-md border-0 px-2.5 py-2.5 text-ink"
              type="email"
              required
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="cursor-pointer rounded-md border-0 bg-brand px-3 py-2.5 font-bold text-white hover:bg-brand-hover" type="submit">
              Suscribirme
            </button>
          </form>
        </div>
      </div>
      <div className={cn(container, 'mt-7 flex flex-wrap gap-x-[18px] gap-y-3 border-t border-[#2c2c2c] py-6')}>
        {categories.map((c) => (
          <Link key={c.slug} className="text-[0.85rem] text-[#aaa] hover:text-white" to={`/categorias/${c.slug}`}>
            {c.name}
          </Link>
        ))}
      </div>
      <div className="border-t border-[#2c2c2c]">
        <div className={cn(container, 'flex flex-col justify-between gap-4 py-4 pb-[22px] text-[0.82rem] text-[#999] sm:flex-row')}>
          <p className="m-0">© {new Date().getFullYear()} FerroHogar. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link to="/legal/terminos">Términos y condiciones</Link>
            <Link to="/legal/privacidad">Política de privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
