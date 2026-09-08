import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchSuggestions } from '../../lib/search'
import { formatPrice } from '../../lib/utils'
import { SafeImage } from '../SafeImage'

const dropItem = 'flex items-center gap-3 px-3.5 py-2.5 hover:bg-brand-soft'

export function SearchBar() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { products, categories, correction } = searchSuggestions(q)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function go(e: React.FormEvent) {
    e.preventDefault()
    const term = correction || q.trim()
    if (!term) return
    setOpen(false)
    navigate(`/productos?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className="relative" ref={wrap}>
      <form className="flex overflow-hidden rounded-lg bg-white" onSubmit={go}>
        <input
          className="min-w-0 flex-1 border-0 px-4 py-3 text-ink outline-none"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar productos, marcas o código..."
          aria-label="Buscar productos"
        />
        <button type="submit" className="w-12 cursor-pointer border-0 bg-brand text-white" aria-label="Buscar">
          <Search size={18} className="mx-auto" />
        </button>
      </form>
      {open && q.trim().length >= 2 && (
        <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-xl bg-white text-ink shadow-card">
          {correction && (
            <p className="mx-3.5 mt-2.5 mb-0 text-[0.9rem]">
              ¿Quisiste decir{' '}
              <button type="button" className="cursor-pointer border-0 bg-transparent font-bold text-brand" onClick={() => setQ(correction)}>
                {correction}
              </button>
              ?
            </p>
          )}
          {categories.map((c) => (
            <Link key={c.slug} to={`/categorias/${c.slug}`} onClick={() => setOpen(false)} className={dropItem}>
              Categoría: {c.name}
            </Link>
          ))}
          {products.length === 0 && !categories.length && <p className="p-3.5 text-muted">No encontramos resultados.</p>}
          {products.map((p) => (
            <Link key={p.id} to={`/productos/${p.slug}`} onClick={() => setOpen(false)} className={dropItem}>
              <SafeImage className="h-11 w-11 rounded-md bg-page object-cover" src={p.images[0]} alt="" />
              <span className="flex flex-1 flex-col">
                <strong>{p.name}</strong>
                <em className="text-[0.8rem] not-italic text-muted">
                  {p.brand} · {p.code}
                </em>
              </span>
              <b>{formatPrice(p.price)}</b>
            </Link>
          ))}
          {q.trim() && (
            <button
              type="button"
              className="w-full cursor-pointer border-0 bg-[#fafafa] px-3.5 py-2.5 font-bold hover:bg-brand-soft"
              onClick={() => {
                const term = correction || q.trim()
                if (!term) return
                setOpen(false)
                navigate(`/productos?q=${encodeURIComponent(term)}`)
              }}
            >
              Ver todos los resultados
            </button>
          )}
        </div>
      )}
    </div>
  )
}
