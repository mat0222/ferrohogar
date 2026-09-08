import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from './context'
import type { AdminGuide, AdminUser, HeroContent, HomeSection } from './types'
import { formatPrice, uid } from '../lib/utils'
import { PERMISSION_OPTIONS, ROLE_LABEL } from './permissions'
import { can as roleCan } from './permissions'
import type { AdminRole } from './types'
import { aBtn, aBtnDanger, aBtnGhost, aCard, aInput, aTableWrap, aTd, aTh, Badge, PageHeader, Tabs } from './ui'
import { DASHBOARD_KPIS } from './seed'

export function AdminContent() {
  const { state, setHero, setHomeSections } = useAdmin()
  const [tab, setTab] = useState('hero')
  const [hero, setLocalHero] = useState<HeroContent>(state.hero)
  const [sections, setSections] = useState<HomeSection[]>(state.homeSections)
  const [drag, setDrag] = useState<number | null>(null)

  return (
    <div>
      <PageHeader title="Contenido de la web" subtitle="Editá el inicio sin tocar código." />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'hero', label: 'Hero' }, { id: 'sections', label: 'Secciones' }, { id: 'builder', label: 'Constructor visual' }]} />

      {tab === 'hero' && (
        <form className={`${aCard} grid max-w-2xl gap-3`} onSubmit={(e) => { e.preventDefault(); setHero(hero) }}>
          <label className="grid gap-1 text-sm font-semibold">Imagen de fondo<input className={aInput} value={hero.image} onChange={(e) => setLocalHero({ ...hero, image: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">Antetítulo<input className={aInput} value={hero.kicker} onChange={(e) => setLocalHero({ ...hero, kicker: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">Título<textarea className={aInput} rows={3} value={hero.title} onChange={(e) => setLocalHero({ ...hero, title: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">Texto del botón<input className={aInput} value={hero.button} onChange={(e) => setLocalHero({ ...hero, button: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">Link<input className={aInput} value={hero.link} onChange={(e) => setLocalHero({ ...hero, link: e.target.value })} /></label>
          <button className={aBtn} type="submit">Guardar hero</button>
        </form>
      )}

      {tab === 'sections' && (
        <form className={aCard} onSubmit={(e) => { e.preventDefault(); setHomeSections(sections) }}>
          {sections.map((s, i) => (
            <label key={s.id} className="mb-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={s.enabled} onChange={(e) => setSections(sections.map((x, idx) => idx === i ? { ...x, enabled: e.target.checked } : x))} />
              {s.label}
            </label>
          ))}
          <button className={aBtn} type="submit">Guardar secciones</button>
        </form>
      )}

      {tab === 'builder' && (
        <div className={`${aCard} max-w-md`}>
          <p className="text-sm text-slate-500">Arrastrá para cambiar el orden del Inicio. El ojito oculta la sección.</p>
          {sections.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDrag(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (drag === null || drag === i) return
                const next = [...sections]
                const [moved] = next.splice(drag, 1)
                next.splice(i, 0, moved)
                setSections(next)
                setDrag(null)
              }}
              className="mb-2 flex cursor-grab items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <span>↕ {s.label}</span>
              <button type="button" className="cursor-pointer border-0 bg-transparent text-sm" onClick={() => setSections(sections.map((x, idx) => idx === i ? { ...x, enabled: !x.enabled } : x))}>
                {s.enabled ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          ))}
          <button className={aBtn} type="button" onClick={() => setHomeSections(sections)}>Publicar orden</button>
        </div>
      )}
    </div>
  )
}

export function AdminGuides() {
  const { state, saveGuide, deleteGuide } = useAdmin()
  const [form, setForm] = useState<AdminGuide | null>(null)
  return (
    <div>
      <PageHeader title="Guías y artículos" actions={<button className={aBtn} type="button" onClick={() => setForm({ slug: uid('g').toLowerCase(), title: '', image: '/img/tools.jpg', author: 'Equipo FerroHogar', category: 'Herramientas', excerpt: '', content: [{ text: '' }], seoTitle: '', seoDescription: '', status: 'draft', readMinutes: 5 })}>Nueva guía</button>} />
      {state.guides.map((g) => (
        <article key={g.slug} className={`${aCard} mb-3 flex flex-wrap items-center justify-between gap-3`}>
          <div>
            <strong>{g.title}</strong>
            <p className="m-0 text-sm text-slate-500">{g.category} · {g.status} · {g.author}</p>
          </div>
          <div className="flex gap-2">
            <button className={aBtnGhost} type="button" onClick={() => setForm(g)}>Editar</button>
            <button className={aBtnDanger} type="button" onClick={() => deleteGuide(g.slug)}>Eliminar</button>
          </div>
        </article>
      ))}
      {form && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="grid max-h-[90vh] w-full max-w-lg gap-3 overflow-auto rounded-2xl bg-white p-5" onSubmit={(e) => { e.preventDefault(); saveGuide(form); setForm(null) }}>
            <h3>Artículo</h3>
            <input className={aInput} placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className={aInput} placeholder="Imagen" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <input className={aInput} placeholder="Autor" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            <input className={aInput} placeholder="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <textarea className={aInput} placeholder="Extracto" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            <textarea className={aInput} rows={6} placeholder="Contenido" value={form.content.map((c) => c.text).join('\n\n')} onChange={(e) => setForm({ ...form, content: e.target.value.split('\n\n').map((text) => ({ text })) })} />
            <select className={aInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdminGuide['status'] })}>
              <option value="draft">Borrador</option>
              <option value="scheduled">Programado</option>
              <option value="published">Publicado</option>
            </select>
            <div className="flex gap-2"><button className={aBtn} type="submit">Guardar</button><button className={aBtnGhost} type="button" onClick={() => setForm(null)}>Cerrar</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

export function AdminMessages() {
  const { state, setMessageStatus } = useAdmin()
  return (
    <div>
      <PageHeader title="Mensajes" />
      <div className="grid gap-3">
        {state.messages.map((m) => (
          <article key={m.id} className={aCard}>
            <div className="flex flex-wrap justify-between gap-2">
              <strong>{m.name}</strong>
              <Badge tone={m.status === 'new' ? 'warn' : m.status === 'closed' ? 'muted' : 'info'}>{m.status}</Badge>
            </div>
            <p className="text-sm text-slate-500">{m.email} · {m.kind}</p>
            <p>{m.body}</p>
            <select className={aInput} style={{ maxWidth: 220 }} value={m.status} onChange={(e) => setMessageStatus(m.id, e.target.value as typeof m.status)}>
              <option value="new">Nuevo</option>
              <option value="open">En atención</option>
              <option value="replied">Respondido</option>
              <option value="closed">Cerrado</option>
            </select>
          </article>
        ))}
      </div>
    </div>
  )
}

export function AdminShipping() {
  const { state, saveShipping } = useAdmin()
  return (
    <div>
      <PageHeader title="Envíos" subtitle={`Gratis desde ${formatPrice(state.settings.freeShippingFrom)}`} />
      {state.shipping.map((m) => (
        <article key={m.id} className={`${aCard} mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4`}>
          <strong>{m.name}</strong>
          <label className="text-sm">Precio<input className={aInput} type="number" value={m.price} onChange={(e) => saveShipping({ ...m, price: Number(e.target.value) })} /></label>
          <label className="text-sm">Zonas<input className={aInput} value={m.zones} onChange={(e) => saveShipping({ ...m, zones: e.target.value })} /></label>
          <label className="text-sm">Tiempo<input className={aInput} value={m.days} onChange={(e) => saveShipping({ ...m, days: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={m.active} onChange={(e) => saveShipping({ ...m, active: e.target.checked })} /> Activo</label>
        </article>
      ))}
    </div>
  )
}

export function AdminPayments() {
  const { state, savePayment } = useAdmin()
  return (
    <div>
      <PageHeader title="Pagos" />
      <div className="grid gap-3 sm:grid-cols-2">
        {state.payments.map((p) => (
          <article key={p.id} className={`${aCard} flex items-center justify-between`}>
            <strong>{p.name}</strong>
            <button type="button" className={aBtnGhost} onClick={() => savePayment({ ...p, active: !p.active })}>
              <Badge tone={p.active ? 'ok' : 'muted'}>{p.active ? 'Activo' : 'Inactivo'}</Badge>
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export function AdminStats() {
  const { state } = useAdmin()
  const top = [...state.products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5)
  const cats = [
    ['Herramientas', 38],
    ['Construcción', 24],
    ['Pinturas', 17],
    ['Electricidad', 12],
    ['Otros', 9],
  ] as const
  return (
    <div>
      <PageHeader title="Estadísticas" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={aCard}>
          <h3>Productos más vendidos</h3>
          <ol>
            {top.map((p, i) => <li key={p.id}>{i + 1}. {p.name} · {p.soldCount}</li>)}
          </ol>
        </section>
        <section className={aCard}>
          <h3>Categorías</h3>
          {cats.map(([n, v]) => (
            <div key={n} className="mb-2">
              <div className="flex justify-between text-sm"><span>{n}</span><span>{v}%</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </section>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Conversión', '3.4%'],
          ['Carritos abandonados', String(state.abandoned.length)],
          ['Ticket promedio', formatPrice(Math.round(DASHBOARD_KPIS.salesMonth / DASHBOARD_KPIS.orders))],
          ['Clientes recurrentes', '41%'],
        ].map(([l, v]) => (
          <div key={l} className={aCard}><p className="m-0 text-xs text-slate-500">{l}</p><strong className="text-xl">{v}</strong></div>
        ))}
      </div>
    </div>
  )
}

export function AdminCarts() {
  const { state, remindCart } = useAdmin()
  return (
    <div>
      <PageHeader title="Carritos abandonados" />
      {state.abandoned.map((c) => (
        <article key={c.id} className={`${aCard} mb-3 flex flex-wrap items-center justify-between gap-3`}>
          <div>
            <strong>{c.customerName}</strong> agregó {c.items.length} productos y no terminó la compra.
            <p className="m-0 text-sm text-slate-500">{formatPrice(c.total)} · {c.email}</p>
          </div>
          <button className={aBtn} type="button" disabled={c.reminded} onClick={() => remindCart(c.id)}>
            {c.reminded ? 'Recordatorio enviado' : '📩 Recordatorio 5% OFF'}
          </button>
        </article>
      ))}
    </div>
  )
}

export function AdminUsers() {
  const { state, saveUser, deleteUser, session } = useAdmin()
  const [form, setForm] = useState<AdminUser | null>(null)
  const [inspect, setInspect] = useState<AdminRole>('vendedor')
  return (
    <div>
      <PageHeader title="Usuarios y permisos" actions={<button className={aBtn} type="button" onClick={() => setForm({ id: uid('u'), name: '', email: '', password: '', role: 'vendedor', active: true })}>Nuevo usuario</button>} />
      <div className={aTableWrap}>
        <table className="w-full border-collapse">
          <thead><tr>{['Nombre', 'Email', 'Rol', 'Estado', ''].map((h) => <th key={h} className={aTh}>{h}</th>)}</tr></thead>
          <tbody>
            {state.users.map((u) => (
              <tr key={u.id}>
                <td className={aTd}>{u.name}</td>
                <td className={aTd}>{u.email}</td>
                <td className={aTd}>{ROLE_LABEL[u.role]}</td>
                <td className={aTd}><Badge tone={u.active ? 'ok' : 'muted'}>{u.active ? 'Activo' : 'Inactivo'}</Badge></td>
                <td className={aTd}>
                  <button className={aBtnGhost} type="button" onClick={() => setForm(u)}>Editar</button>
                  {u.id !== session?.id && <button className={aBtnDanger} type="button" onClick={() => deleteUser(u.id)}>Eliminar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className={`${aCard} mt-6`}>
        <h3>Matriz de permisos</h3>
        <select className={`${aInput} mb-3 max-w-xs`} value={inspect} onChange={(e) => setInspect(e.target.value as AdminRole)}>
          {(Object.keys(ROLE_LABEL) as AdminRole[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
        <ul className="m-0 grid list-none gap-1 p-0 text-sm">
          {PERMISSION_OPTIONS.map((p) => (
            <li key={p.key}>{roleCan(inspect, p.key) ? '☑' : '☐'} {p.label}</li>
          ))}
        </ul>
      </section>
      {form && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="grid w-full max-w-lg gap-3 rounded-2xl bg-white p-5" onSubmit={(e) => { e.preventDefault(); saveUser(form); setForm(null) }}>
            <h3>Usuario</h3>
            <input className={aInput} placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className={aInput} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className={aInput} placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select className={aInput} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}>
              {(Object.keys(ROLE_LABEL) as AdminRole[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activo</label>
            <div className="flex gap-2"><button className={aBtn} type="submit">Guardar</button><button className={aBtnGhost} type="button" onClick={() => setForm(null)}>Cerrar</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

export function AdminSettings() {
  const { state, saveSettings, toggleAutomation, resetDemo } = useAdmin()
  const [form, setForm] = useState(state.settings)
  return (
    <div>
      <PageHeader title="Configuración" />
      <form className={`${aCard} mb-6 grid max-w-2xl gap-3`} onSubmit={(e) => { e.preventDefault(); saveSettings(form) }}>
        {([
          ['name', 'Nombre'],
          ['email', 'Email'],
          ['phone', 'Teléfono'],
          ['address', 'Dirección'],
          ['whatsapp', 'WhatsApp'],
          ['instagram', 'Instagram'],
          ['facebook', 'Facebook'],
          ['hours', 'Horarios'],
          ['currency', 'Moneda'],
          ['taxNote', 'Impuestos'],
          ['seoTitle', 'SEO título'],
          ['seoDescription', 'SEO descripción'],
        ] as const).map(([key, label]) => (
          <label key={key} className="grid gap-1 text-sm font-semibold">{label}
            <input className={aInput} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <label className="grid gap-1 text-sm font-semibold">Envío gratis desde
          <input className={aInput} type="number" value={form.freeShippingFrom} onChange={(e) => setForm({ ...form, freeShippingFrom: Number(e.target.value) })} />
        </label>
        <button className={aBtn} type="submit">Guardar</button>
      </form>
      <section className={aCard}>
        <h3>Automatizaciones</h3>
        {state.automations.map((a) => (
          <label key={a.id} className="mb-3 flex items-start gap-3 text-sm">
            <input type="checkbox" checked={a.enabled} onChange={() => toggleAutomation(a.id)} />
            <span><strong>{a.title}</strong><br />{a.description}</span>
          </label>
        ))}
      </section>
      <button className={`${aBtnGhost} mt-4`} type="button" onClick={resetDemo}>Restaurar datos de demo</button>
      <p className="mt-6"><Link to="/admin/carritos" className="text-brand">Ver carritos abandonados →</Link></p>
    </div>
  )
}
