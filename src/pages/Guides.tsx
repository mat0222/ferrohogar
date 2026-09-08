import { Link, useParams } from 'react-router-dom'
import { guides } from '../data/catalog'
import { SafeImage } from '../components/SafeImage'
import { card, cn, container, crumb, empty, fourGrid, muted, section } from '../lib/cn'

export function Guides() {
  return (
    <div className={cn(container, section)}>
      <h1>Guías y consejos</h1>
      <p className={muted}>Aprendé a elegir herramientas, pinturas y fijaciones.</p>
      <div className={cn(fourGrid, 'mt-6')}>
        {guides.map((g) => (
          <Link key={g.slug} to={`/guias/${g.slug}`} className={card}>
            <SafeImage src={g.image} alt="" className="mb-3 h-[140px] w-full rounded-[10px] object-cover" />
            <small className={muted}>{g.category} · {g.readMinutes} min</small>
            <h3>{g.title}</h3>
            <p className={muted}>{g.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function GuideDetail() {
  const { slug } = useParams()
  const guide = guides.find((g) => g.slug === slug)
  if (!guide) return <div className={cn(container, empty)}>Guía no encontrada.</div>
  return (
    <div className={cn(container, 'max-w-[800px] py-8')}>
      <p className={crumb}><Link to="/guias">Guías</Link> / {guide.title}</p>
      <SafeImage src={guide.image} alt="" className="max-h-[320px] w-full rounded-2xl object-cover" />
      <h1 className="mt-5">{guide.title}</h1>
      {guide.content.map((c, i) => (
        <section key={i}>
          {c.heading && <h2>{c.heading}</h2>}
          <p>{c.text}</p>
        </section>
      ))}
    </div>
  )
}
