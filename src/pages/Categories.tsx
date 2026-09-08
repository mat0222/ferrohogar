import { Link } from 'react-router-dom'
import { CategoryIcon } from '../components/CategoryIcon'
import { SafeImage } from '../components/SafeImage'
import { useAdmin } from '../admin/context'
import { card, cn, container, fourGrid, muted, section } from '../lib/cn'

export function Categories() {
  const { state } = useAdmin()
  const products = state.products.filter((p) => !p.hidden)
  const categories = state.categories.filter((c) => !c.parentId && c.active)
  return (
    <div className={cn(container, section)}>
      <h1>Categorías</h1>
      <p className={muted}>Explorá por rubro, con subcategorías y cantidad de productos.</p>
      <div className={cn(fourGrid, 'mt-6')}>
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length
          const subs = [...new Set(products.filter((p) => p.category === c.slug).map((p) => p.subcategory))]
          return (
            <Link key={c.slug} to={`/categorias/${c.slug}`} className={card}>
              <SafeImage src={c.image} alt="" className="mb-3 h-[140px] w-full rounded-[10px] object-cover" />
              <span className="text-brand"><CategoryIcon name={c.icon} /></span>
              <h3>{c.name}</h3>
              <p className={muted}>{c.description}</p>
              <p>{count} productos</p>
              <p className={muted}>{subs.join(' · ')}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
