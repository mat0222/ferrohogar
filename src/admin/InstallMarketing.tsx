import { useMemo, useState } from 'react'
import { useAdmin } from './context'
import type { AdminCoupon, AdminInstallation, AdminPromo, AdminTechnician, InstallStatus, PromoType, ReviewStatus } from './types'
import { asset } from '../lib/asset'
import { uid } from '../lib/utils'
import { aBtn, aBtnDanger, aBtnGhost, aCard, aInput, Badge, PageHeader, Tabs } from './ui'

const installLabel: Record<InstallStatus, string> = {
  request: 'Solicitud',
  confirmed: 'Confirmada',
  assigned: 'Técnico asignado',
  on_way: 'En camino',
  installing: 'En instalación',
  done: 'Finalizada',
  cancelled: 'Cancelada',
}

const installTone: Record<InstallStatus, 'warn' | 'info' | 'violet' | 'orange' | 'ok' | 'danger'> = {
  request: 'warn',
  confirmed: 'info',
  assigned: 'violet',
  on_way: 'orange',
  installing: 'orange',
  done: 'ok',
  cancelled: 'danger',
}

export function AdminInstallations() {
  const { state, setInstallStatus, saveInstallation, saveTechnician } = useAdmin()
  const [tab, setTab] = useState('list')
  const [tech, setTech] = useState<AdminTechnician | null>(null)
  const [job, setJob] = useState<AdminInstallation | null>(null)
  const month = useMemo(() => {
    const start = new Date(2026, 8, 1)
    const days = new Date(2026, 9, 0).getDate()
    const offset = start.getDay() === 0 ? 6 : start.getDay() - 1
    return { days, offset }
  }, [])

  return (
    <div>
      <PageHeader title="Instalaciones" actions={<button className={aBtn} type="button" onClick={() => setJob({ id: `INS-${Math.floor(2000 + Math.random() * 8000)}`, customerId: '', customerName: '', serviceName: 'Sanitarios', date: '2026-09-16', timeSlot: '14:00 - 16:00', status: 'request', zone: 'CABA', address: '', notes: '', createdAt: new Date().toISOString() })}>Nueva solicitud</button>} />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'list', label: 'Solicitudes' }, { id: 'tech', label: 'Técnicos' }, { id: 'cal', label: 'Calendario' }]} />

      {tab === 'list' && (
        <div className="grid gap-3">
          {state.installations.map((i) => (
            <article key={i.id} className={aCard}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <strong>{i.id}</strong>
                  <p className="m-0">{i.serviceName} · {i.customerName}</p>
                  <p className="m-0 text-sm text-slate-500">{i.date} · {i.timeSlot} · {i.technicianName ?? 'Sin técnico'}</p>
                </div>
                <Badge tone={installTone[i.status]}>{installLabel[i.status]}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <select className={aInput} style={{ maxWidth: 220 }} value={i.status} onChange={(e) => setInstallStatus(i.id, e.target.value as InstallStatus)}>
                  {(Object.keys(installLabel) as InstallStatus[]).map((s) => <option key={s} value={s}>{installLabel[s]}</option>)}
                </select>
                <select className={aInput} style={{ maxWidth: 220 }} value={i.technicianId ?? ''} onChange={(e) => {
                  const t = state.technicians.find((x) => x.id === e.target.value)
                  saveInstallation({ ...i, technicianId: t?.id, technicianName: t?.name, status: t ? 'assigned' : i.status })
                }}>
                  <option value="">Asignar técnico</option>
                  {state.technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'tech' && (
        <div>
          <button className={`${aBtn} mb-4`} type="button" onClick={() => setTech({ id: uid('t'), name: '', photo: '/img/technician.jpg', specialty: 'Electricidad', phone: '', zones: ['CABA'], available: true, jobs: 0, rating: 5 })}>Nuevo técnico</button>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.technicians.map((t) => (
              <article key={t.id} className={aCard}>
                <img src={asset(t.photo)} alt="" className="mb-3 h-16 w-16 rounded-full object-cover" />
                <strong>{t.name}</strong>
                <p className="m-0 text-sm">{t.specialty} · ⭐ {t.rating}</p>
                <p className="m-0 text-sm text-slate-500">{t.zones.join(' · ')} · {t.jobs} trabajos</p>
                <button className={`${aBtnGhost} mt-3`} type="button" onClick={() => setTech(t)}>Editar</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'cal' && (
        <div className={aCard}>
          <h3>Septiembre 2026</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: month.offset }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: month.days }, (_, i) => {
              const day = i + 1
              const iso = `2026-09-${String(day).padStart(2, '0')}`
              const jobs = state.installations.filter((x) => x.date === iso)
              return (
                <button key={iso} type="button" className="min-h-[72px] cursor-pointer rounded-xl border border-slate-200 bg-white p-1 text-left text-xs" onClick={() => {
                  const first = jobs[0]
                  if (first) setJob(first)
                }}>
                  <strong>{day}</strong>
                  {jobs.map((j) => <p key={j.id} className="m-0 truncate text-[10px] text-brand">{j.timeSlot.slice(0, 5)} {j.serviceName}</p>)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {tech && (
        <Modal onClose={() => setTech(null)}>
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); saveTechnician(tech); setTech(null) }}>
            <h3>Técnico</h3>
            <input className={aInput} placeholder="Nombre" value={tech.name} onChange={(e) => setTech({ ...tech, name: e.target.value })} required />
            <input className={aInput} placeholder="Especialidad" value={tech.specialty} onChange={(e) => setTech({ ...tech, specialty: e.target.value })} />
            <input className={aInput} placeholder="Teléfono" value={tech.phone} onChange={(e) => setTech({ ...tech, phone: e.target.value })} />
            <input className={aInput} placeholder="Zonas (coma)" value={tech.zones.join(', ')} onChange={(e) => setTech({ ...tech, zones: e.target.value.split(',').map((z) => z.trim()).filter(Boolean) })} />
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={tech.available} onChange={(e) => setTech({ ...tech, available: e.target.checked })} /> Disponible</label>
            <div className="flex gap-2"><button className={aBtn} type="submit">Guardar</button><button className={aBtnGhost} type="button" onClick={() => setTech(null)}>Cerrar</button></div>
          </form>
        </Modal>
      )}

      {job && (
        <Modal onClose={() => setJob(null)}>
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); saveInstallation(job); setJob(null) }}>
            <h3>{job.id}</h3>
            <input className={aInput} placeholder="Cliente" value={job.customerName} onChange={(e) => setJob({ ...job, customerName: e.target.value })} required />
            <input className={aInput} placeholder="Servicio" value={job.serviceName} onChange={(e) => setJob({ ...job, serviceName: e.target.value })} />
            <input className={aInput} type="date" value={job.date} onChange={(e) => setJob({ ...job, date: e.target.value })} />
            <input className={aInput} placeholder="Horario" value={job.timeSlot} onChange={(e) => setJob({ ...job, timeSlot: e.target.value })} />
            <input className={aInput} placeholder="Dirección" value={job.address} onChange={(e) => setJob({ ...job, address: e.target.value })} />
            <div className="flex gap-2"><button className={aBtn} type="submit">Guardar</button><button className={aBtnGhost} type="button" onClick={() => setJob(null)}>Cerrar</button></div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export function AdminPromos() {
  const { state, savePromo, deletePromo, saveCoupon, deleteCoupon } = useAdmin()
  const [tab, setTab] = useState('promos')
  const [promo, setPromo] = useState<AdminPromo | null>(null)
  const [coupon, setCoupon] = useState<AdminCoupon | null>(null)
  return (
    <div>
      <PageHeader title="Promociones y cupones" />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'promos', label: 'Promociones' }, { id: 'coupons', label: 'Cupones' }]} />
      {tab === 'promos' && (
        <div>
          <button className={`${aBtn} mb-4`} type="button" onClick={() => setPromo({ id: uid('pr'), name: '', type: 'percent', value: 10, from: '2026-09-08', to: '2026-09-30', category: 'herramientas', active: true })}>Nueva oferta</button>
          <div className="grid gap-3">
            {state.promos.map((p) => (
              <article key={p.id} className={`${aCard} flex flex-wrap items-center justify-between gap-3`}>
                <div>
                  <strong>{p.name}</strong>
                  <p className="m-0 text-sm text-slate-500">{p.type} · {p.value}% · {p.from} → {p.to}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone={p.active ? 'ok' : 'muted'}>{p.active ? 'Activa' : 'Inactiva'}</Badge>
                  <button className={aBtnGhost} type="button" onClick={() => setPromo(p)}>Editar</button>
                  <button className={aBtnDanger} type="button" onClick={() => deletePromo(p.id)}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
      {tab === 'coupons' && (
        <div>
          <button className={`${aBtn} mb-4`} type="button" onClick={() => setCoupon({ id: uid('cp'), code: 'FERRO10', discountPercent: 10, minAmount: 50000, maxUses: 100, used: 0, active: true })}>Nuevo cupón</button>
          {state.coupons.map((c) => (
            <article key={c.id} className={`${aCard} mb-3 flex flex-wrap items-center justify-between gap-3`}>
              <div>
                <strong>{c.code}</strong>
                <p className="m-0 text-sm text-slate-500">{c.discountPercent}% · mín. ${c.minAmount.toLocaleString('es-AR')} · {c.used}/{c.maxUses} usos</p>
              </div>
              <div className="flex gap-2">
                <button className={aBtnGhost} type="button" onClick={() => setCoupon(c)}>Editar</button>
                <button className={aBtnDanger} type="button" onClick={() => deleteCoupon(c.id)}>Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {promo && (
        <Modal onClose={() => setPromo(null)}>
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); savePromo(promo); setPromo(null) }}>
            <h3>Promoción</h3>
            <input className={aInput} placeholder="Nombre" value={promo.name} onChange={(e) => setPromo({ ...promo, name: e.target.value })} required />
            <select className={aInput} value={promo.type} onChange={(e) => setPromo({ ...promo, type: e.target.value as PromoType })}>
              <option value="percent">Porcentaje</option>
              <option value="2x1">2×1</option>
              <option value="second">Segunda unidad</option>
              <option value="free_shipping">Envío gratis</option>
              <option value="qty">Por cantidad</option>
            </select>
            <input className={aInput} type="number" value={promo.value} onChange={(e) => setPromo({ ...promo, value: Number(e.target.value) })} />
            <div className="grid grid-cols-2 gap-2">
              <input className={aInput} type="date" value={promo.from} onChange={(e) => setPromo({ ...promo, from: e.target.value })} />
              <input className={aInput} type="date" value={promo.to} onChange={(e) => setPromo({ ...promo, to: e.target.value })} />
            </div>
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={promo.active} onChange={(e) => setPromo({ ...promo, active: e.target.checked })} /> Activa</label>
            <div className="flex gap-2"><button className={aBtn} type="submit">Guardar</button><button className={aBtnGhost} type="button" onClick={() => setPromo(null)}>Cerrar</button></div>
          </form>
        </Modal>
      )}
      {coupon && (
        <Modal onClose={() => setCoupon(null)}>
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); saveCoupon({ ...coupon, code: coupon.code.toUpperCase() }); setCoupon(null) }}>
            <h3>Cupón</h3>
            <input className={aInput} value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value })} />
            <input className={aInput} type="number" value={coupon.discountPercent} onChange={(e) => setCoupon({ ...coupon, discountPercent: Number(e.target.value) })} />
            <input className={aInput} type="number" value={coupon.minAmount} onChange={(e) => setCoupon({ ...coupon, minAmount: Number(e.target.value) })} />
            <input className={aInput} type="number" value={coupon.maxUses} onChange={(e) => setCoupon({ ...coupon, maxUses: Number(e.target.value) })} />
            <div className="flex gap-2"><button className={aBtn} type="submit">Guardar</button><button className={aBtnGhost} type="button" onClick={() => setCoupon(null)}>Cerrar</button></div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export function AdminReviews() {
  const { state, setReviewStatus } = useAdmin()
  return (
    <div>
      <PageHeader title="Reseñas" subtitle="Aprobar, destacar u ocultar opiniones de clientes." />
      <div className="grid gap-3">
        {state.reviews.map((r) => (
          <article key={r.id} className={aCard}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <strong>{r.author}</strong> <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                <p className="m-0">{r.comment}</p>
                <p className="m-0 text-xs text-slate-500">{r.date} · {r.productId}</p>
              </div>
              <Badge tone={r.status === 'published' ? 'ok' : r.status === 'pending' ? 'warn' : 'muted'}>
                {r.status === 'published' ? 'Publicada' : r.status === 'pending' ? 'Pendiente' : r.status}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['published', 'rejected', 'hidden'] as ReviewStatus[]).map((s) => (
                <button key={s} className={aBtnGhost} type="button" onClick={() => setReviewStatus(r.id, s)}>{s === 'published' ? 'Aprobar' : s === 'rejected' ? 'Rechazar' : 'Ocultar'}</button>
              ))}
              <button className={aBtnGhost} type="button" onClick={() => setReviewStatus(r.id, r.status, !r.featured)}>{r.featured ? 'Quitar destacado' : 'Destacar'}</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
