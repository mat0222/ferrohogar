import { useState } from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { STORE_ADDRESS, STORE_EMAIL, STORE_HOURS, STORE_PHONE, waLink } from '../lib/utils'
import { useStore } from '../context/StoreContext'
import { useAdmin } from '../admin/context'
import { btnOutline, btnPrimary, card, cn, container, field, formGrid, input, muted, panel } from '../lib/cn'

export function Contact() {
  const { pushToast } = useStore()
  const { addMessage } = useAdmin()
  const [sent, setSent] = useState(false)

  return (
    <div className={cn(container, 'grid gap-6 py-8 lg:grid-cols-2')}>
      <div>
        <h1>Contacto</h1>
        <p className={muted}>Estamos para ayudarte a elegir el producto o coordinar una instalación.</p>
        <div className={cn(card, 'grid gap-3.5 hover:border-line')}>
          <p className="m-0 flex items-center gap-2"><MapPin color="#ff5a1f" /> {STORE_ADDRESS}</p>
          <p className="m-0 flex items-center gap-2"><Phone color="#ff5a1f" /> {STORE_PHONE} · {STORE_HOURS}</p>
          <p className="m-0 flex items-center gap-2"><Mail color="#ff5a1f" /> {STORE_EMAIL}</p>
          <p className="m-0 flex items-center gap-2"><Clock color="#ff5a1f" /> {STORE_HOURS}</p>
        </div>
        <iframe className="mt-3 h-[220px] w-full rounded-xl border-0" title="Mapa FerroHogar" src="https://maps.google.com/maps?q=Av.%20San%20Martin%202450%20CABA&t=&z=15&ie=UTF8&iwloc=&output=embed" />
        <h2 className="mt-6">¿No sabés qué producto necesitás?</h2>
        <a className={btnPrimary} href={waLink('Hola, necesito hablar con un asesor para elegir un producto.')} target="_blank" rel="noreferrer">
          Hablar con un asesor
        </a>
        <a className={cn(btnOutline, 'ml-2')} href={waLink('Hola, necesito ayuda para elegir una amoladora...')} target="_blank" rel="noreferrer">
          WhatsApp directo
        </a>
      </div>
      <form
        className={cn(panel, formGrid)}
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          addMessage({
            name: String(data.get('name') ?? ''),
            email: String(data.get('email') ?? ''),
            body: String(data.get('msg') ?? ''),
            kind: 'contacto',
          })
          setSent(true)
          pushToast('Mensaje enviado')
        }}
      >
        <h2>Envianos un mensaje</h2>
        {sent ? (
          <p>Gracias. Te respondemos a la brevedad.</p>
        ) : (
          <>
            <label className={field}>Nombre y apellido<input className={input} required name="name" /></label>
            <label className={field}>Email<input className={input} type="email" required name="email" /></label>
            <label className={field}>Mensaje<textarea className={input} required rows={5} name="msg" /></label>
            <button className={btnPrimary} type="submit">Enviar mensaje →</button>
          </>
        )}
      </form>
    </div>
  )
}
