import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { cn, container, crumb, empty, panel, stepClass, tracker } from '../lib/cn'

const steps = [
  { key: 'request', label: 'Solicitud' },
  { key: 'assigned', label: 'Técnico asignado' },
  { key: 'on_way', label: 'En camino' },
  { key: 'installing', label: 'Instalación' },
  { key: 'done', label: 'Finalizada' },
] as const

export function InstallationTracking() {
  const { id } = useParams()
  const { installations } = useStore()
  const item = installations.find((i) => i.id === id)

  if (!item) {
    return <div className={cn(container, empty)}>No encontramos esa reserva. <Link to="/instalacion">Reservar</Link></div>
  }

  const idx = steps.findIndex((s) => s.key === item.status)

  return (
    <div className={cn(container, 'py-8')}>
      <p className={crumb}><Link to="/cuenta">Mi cuenta</Link> / Instalación #{item.id}</p>
      <div className={panel}>
        <h1>Instalación #{item.id}</h1>
        <p>{item.serviceName}</p>
        <p>{new Date(item.date).toLocaleDateString('es-AR')} · {item.timeSlot}</p>
        <p>Técnico: {item.technician ?? 'Asignando...'}</p>
        <p>Zona: {item.zone} · {item.address}</p>
        <ol className={tracker}>
          {steps.map((s, i) => (
            <li key={s.key} className={stepClass(i, idx)}>
              {i <= idx ? '✓ ' : '○ '}{s.label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
