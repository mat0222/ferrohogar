import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Calendar, MapPin, UserRound } from 'lucide-react'
import { installHero, installServices, professionals, zones } from '../data/catalog'
import { SafeImage } from '../components/SafeImage'
import { useStore } from '../context/StoreContext'
import { asset } from '../lib/asset'
import { formatPrice } from '../lib/utils'
import { btnPrimary, card, choice, choiceOn, cn, container, field, formGrid, formTwo, input, muted, panel, section } from '../lib/cn'

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })
}

const slots = ['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00']

export function Installation() {
  const { bookInstallation, user } = useStore()
  const navigate = useNavigate()
  const [serviceId, setServiceId] = useState(installServices[0].id)
  const [date, setDate] = useState(nextDays(10)[1].toISOString().slice(0, 10))
  const [slot, setSlot] = useState(slots[2])
  const [zone, setZone] = useState('CABA')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const days = useMemo(() => nextDays(10), [])
  const service = installServices.find((s) => s.id === serviceId)!

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const booking = bookInstallation({
      serviceId,
      serviceName: service.name,
      date,
      timeSlot: slot,
      technician: professionals[0].name,
      zone,
      address: address || 'A confirmar',
      notes,
    })
    navigate(`/instalacion/seguimiento/${booking.id}`)
  }

  return (
    <>
      <section className="relative grid min-h-[320px] items-end bg-[#1a1a1a] bg-cover bg-center text-white" style={{ backgroundImage: `url(${asset(installHero)})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/68" />
        <div className={cn(container, 'relative z-[1] py-12')}>
          <h1>Instalación profesional y segura</h1>
          <p>Personal capacitado, trabajo garantizado y presupuestos sin cargo.</p>
        </div>
      </section>
      <div className={cn(container, section)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {installServices.map((s) => (
            <button key={s.id} type="button" className={cn(choice, 'flex-col items-start', serviceId === s.id && choiceOn)} onClick={() => setServiceId(s.id)}>
              <h3>{s.name}</h3>
              <p className={muted}>{s.description}</p>
              <p>Desde {formatPrice(s.priceFrom)} · {s.duration}</p>
            </button>
          ))}
        </div>

        <h2 className="mt-9">Nuestros profesionales</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {professionals.map((p) => (
            <article key={p.id} className={card}>
              <SafeImage src={p.photo} alt="" className="h-[72px] w-[72px] rounded-full object-cover" />
              <h3>{p.name}</h3>
              <p>{p.specialty}</p>
              <p className={muted}>★ {p.rating} · {p.jobs} trabajos</p>
              <p className={muted}>{p.zones.join(' · ')}</p>
            </article>
          ))}
        </div>

        <div className="my-9 grid grid-cols-1 gap-4 rounded-[14px] bg-white p-5 sm:grid-cols-3">
          <div className="flex items-center gap-3"><UserRound className="text-brand" /><strong>Personal capacitado</strong></div>
          <div className="flex items-center gap-3"><BadgeCheck className="text-brand" /><strong>Trabajo garantizado</strong></div>
          <div className="flex items-center gap-3"><MapPin className="text-brand" /><strong>Presupuestos sin cargo</strong></div>
        </div>

        <form className={cn(panel, formGrid)} onSubmit={submit}>
          <h2 className="flex items-center gap-2"><Calendar size={20} /> Reserva online</h2>
          <p className={muted}>Servicio → Día → Horario. {user ? '' : 'Podés reservar como visitante.'}</p>
          <label className={field}>Servicio
            <select className={input} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {installServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <div className={formTwo}>
            {days.map((d) => {
              const iso = d.toISOString().slice(0, 10)
              const label = d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })
              return (
                <button key={iso} type="button" className={cn(choice, date === iso && choiceOn)} onClick={() => setDate(iso)}>
                  {label}
                </button>
              )
            })}
          </div>
          <div className={formTwo}>
            {slots.map((s) => (
              <button key={s} type="button" className={cn(choice, slot === s && choiceOn)} onClick={() => setSlot(s)}>{s}</button>
            ))}
          </div>
          <label className={field}>Zona
            <select className={input} value={zone} onChange={(e) => setZone(e.target.value)}>
              {zones.map((z) => <option key={z}>{z}</option>)}
            </select>
          </label>
          <label className={field}>Dirección<input className={input} value={address} onChange={(e) => setAddress(e.target.value)} required /></label>
          <label className={field}>Notas<textarea className={input} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          <p>Selección: <strong>{service.name}</strong> · {new Date(date).toLocaleDateString('es-AR')} · {slot}</p>
          <button className={btnPrimary} type="submit">Confirmar reserva</button>
        </form>
      </div>
    </>
  )
}
