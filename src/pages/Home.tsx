import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  BadgeCheck,
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react'
import { ProductCard } from '../components/product/ProductCard'
import { CategoryIcon } from '../components/CategoryIcon'
import { SafeImage } from '../components/SafeImage'
import { benefitsImage, categories, kits, projectNeeds, workshopImage } from '../data/catalog'
import { formatPrice } from '../lib/utils'
import { useStore } from '../context/StoreContext'
import { useAdmin } from '../admin/context'
import { btnPrimary, card, cn, container, muted, productGrid, section, sectionHead } from '../lib/cn'

const fourGrid = 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'

export function Home() {
  const { addManyToCart } = useStore()
  const { state } = useAdmin()
  const products = state.products.filter((p) => !p.hidden)
  const featured = products.filter((p) => p.featured)
  const offers = products.filter((p) => p.offer)
  const hero = state.hero
  const show = (id: string) => state.homeSections.find((s) => s.id === id)?.enabled !== false
  const homeBrands = state.brands.filter((b) => b.active && b.featured)
  const homeGuides = state.guides.filter((g) => g.status === 'published')
  const brandList = homeBrands.length ? homeBrands : state.brands.filter((b) => b.active)

  const nodes: Record<string, ReactNode> = {
    hero: (
      <section key="hero" className="relative grid min-h-[520px] items-center bg-[#1a1a1a] bg-cover bg-center text-white" style={{ backgroundImage: `url(${hero.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/62 via-black/38 to-black/18" />
        <div className={cn(container, 'relative max-w-[640px] py-[72px]')}>
          <p className="mb-2.5 text-[0.85rem] font-extrabold tracking-[0.14em]">{hero.kicker}</p>
          <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold">{hero.title}</h1>
          <Link to={hero.link} className={btnPrimary}>{hero.button}</Link>
        </div>
      </section>
    ),
    categories: (
      <div key="categories" className={container}>
        <div className="relative z-[2] -mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {categories.map((c) => (
            <Link key={c.slug} to={`/categorias/${c.slug}`} className="rounded-[14px] bg-white px-2 pt-[18px] pb-3.5 text-center shadow-card">
              <span className="mx-auto mb-2 grid h-[52px] w-[52px] place-items-center rounded-full bg-brand-soft text-brand">
                <CategoryIcon name={c.icon} />
              </span>
              <strong className="block text-[0.82rem]">{c.name}</strong>
              <small className="text-[0.72rem] text-muted">{products.filter((p) => p.category === c.slug).length} productos</small>
            </Link>
          ))}
        </div>
      </div>
    ),
    needs: (
      <section key="needs" className={section}>
        <div className={container}>
          <div className={sectionHead}>
            <div>
              <h2 className="text-[1.7rem]">¿Qué necesitás hacer?</h2>
              <p className={muted}>Elegí el proyecto y te armamos los productos.</p>
            </div>
            <Link to="/asistente">Abrir asistente →</Link>
          </div>
          <div className={fourGrid}>
            {projectNeeds.map((n) => (
              <Link key={n.id} to={`/asistente?need=${n.id}`} className={card}>
                <CategoryIcon name={n.icon} />
                <h3>{n.title}</h3>
                <p className={muted}>{n.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    ),
    featured: (
      <section key="featured" className="pb-14">
        <div className={container}>
          <div className={sectionHead}>
            <h2 className="text-[1.7rem]">Productos destacados</h2>
            <Link to="/productos">Ver todos →</Link>
          </div>
          <div className={productGrid}>
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    ),
    offers: (
      <section key="offers" className="pb-14">
        <div className={container}>
          <div className={sectionHead}>
            <div>
              <h2 className="text-[1.7rem]">Ofertas dinámicas</h2>
              <p className={muted}>Descuentos, últimas unidades y promociones por cantidad.</p>
            </div>
            <Link to="/ofertas">Ver ofertas →</Link>
          </div>
          <div className={productGrid}>
            {offers.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    ),
    kits: (
      <section key="kits" className="pb-14">
        <div className={container}>
          <div className={sectionHead}>
            <h2 className="text-[1.7rem]">Kits inteligentes</h2>
            <Link to="/kits">Ver kits →</Link>
          </div>
          <div className={fourGrid}>
            {kits.map((kit) => {
              const items = kit.productIds.map((id) => products.find((p) => p.id === id)!).filter(Boolean)
              const total = items.reduce((n, p) => n + p.price, 0)
              return (
                <article key={kit.id} className={card}>
                  <SafeImage className="mb-3 h-[140px] w-full rounded-[10px] object-cover" src={kit.image} alt={kit.name} />
                  <h3>{kit.name}</h3>
                  <p className={muted}>{kit.description}</p>
                  <p><strong>{formatPrice(total)}</strong></p>
                  <Link to={`/kits/${kit.slug}`} className={cn(btnPrimary, 'w-full')}>Comprar kit completo →</Link>
                  <button type="button" className="cursor-pointer border-0 bg-transparent py-1 text-[0.8rem] text-muted" onClick={() => addManyToCart(kit.productIds)}>Agregar todo al carrito</button>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    ),
    brands: (
      <section key="brands" className="pb-14">
        <div className={container}>
          <div className={sectionHead}>
            <h2 className="text-[1.7rem]">Marcas destacadas</h2>
            <Link to="/marcas">Ver marcas →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {brandList.map((b) => (
              <Link key={b.slug} to={`/marcas/${b.slug}`} className="rounded-[10px] border border-line bg-white px-2 py-[18px] text-center font-extrabold tracking-[0.04em] hover:border-brand">
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    ),
    benefits: (
      <section key="benefits" className="relative overflow-hidden bg-[#1a1a1a] bg-cover bg-center py-10 text-white" style={{ backgroundImage: `url(${benefitsImage})` }}>
        <div className="absolute inset-0 bg-black/72" />
        <div className={cn(container, 'relative z-[1] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4')}>
          {[
            { Icon: Truck, t: 'Envíos rápidos', s: 'A todo el país' },
            { Icon: CreditCard, t: 'Hasta 12 cuotas', s: 'Múltiples medios de pago' },
            { Icon: ShieldCheck, t: 'Compra segura', s: 'Datos protegidos' },
            { Icon: Wrench, t: 'Instalación profesional', s: 'Reserva online' },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon size={28} className="shrink-0 text-brand" />
              <div>
                <strong>{t}</strong>
                <p className="m-0 text-[#bbb]">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    install: (
      <section key="install" className={section}>
        <div className={container}>
          <div className="grid overflow-hidden rounded-2xl bg-white lg:grid-cols-[1.2fr_1fr]">
            <SafeImage className="h-full min-h-[280px] w-full object-cover" src={workshopImage} alt="Instalación FerroHogar" />
            <div className="p-8">
              <h2 className="text-[1.7rem]">Instalación profesional y segura</h2>
              <p>Técnicos capacitados para sanitarios, electricidad, aires y más. Presupuesto sin cargo.</p>
              <ul className="list-none p-0">
                {['Sanitarios y agua', 'Electricidad e iluminación', 'Aires acondicionados', 'Revestimientos y perforaciones'].map((item) => (
                  <li key={item} className="relative py-1.5 pl-[22px] before:absolute before:left-0 before:font-extrabold before:text-brand before:content-['✓']">{item}</li>
                ))}
              </ul>
              <Link to="/instalacion" className={btnPrimary}>Solicitar instalación →</Link>
            </div>
          </div>
        </div>
      </section>
    ),
    why: (
      <section key="why" className="pb-14">
        <div className={container}>
          <h2 className="text-[1.7rem]">¿Por qué elegir FerroHogar?</h2>
          <div className={cn(fourGrid, 'mt-[18px]')}>
            {[
              { Icon: Award, t: 'Amplia variedad', s: 'Herramientas, obra, pinturas y hogar en un solo lugar.' },
              { Icon: BadgeCheck, t: 'Precios competitivos', s: 'Ofertas dinámicas y packs con descuento por cantidad.' },
              { Icon: Headphones, t: 'Atención personalizada', s: 'Asesoría por chat o WhatsApp para elegir el producto correcto.' },
              { Icon: ShieldCheck, t: 'Calidad garantizada', s: 'Marcas líderes y trabajo de instalación garantizado.' },
            ].map(({ Icon, t, s }) => (
              <div key={t} className="rounded-[14px] bg-white p-[22px]">
                <Icon className="mb-2 text-brand" />
                <h3>{t}</h3>
                <p className={muted}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    guides: (
      <section key="guides" className="pb-14">
        <div className={container}>
          <div className={sectionHead}>
            <h2 className="text-[1.7rem]">Guías y consejos</h2>
            <Link to="/guias">Ver todas →</Link>
          </div>
          <div className={fourGrid}>
            {homeGuides.map((g) => (
              <Link key={g.slug} to={`/guias/${g.slug}`} className={card}>
                <SafeImage className="mb-3 h-[140px] w-full rounded-[10px] object-cover" src={g.image} alt="" />
                <small className={muted}>{g.category} · {g.readMinutes} min</small>
                <h3>{g.title}</h3>
                <p className={muted}>{g.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    ),
  }

  return (
    <>
      {state.homeSections.filter((s) => show(s.id)).map((s) => nodes[s.id])}
    </>
  )
}
