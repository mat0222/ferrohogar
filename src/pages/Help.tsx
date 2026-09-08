import { faqs } from '../data/catalog'
import { FREE_SHIPPING } from '../lib/utils'
import { cn, container, panel, section } from '../lib/cn'

export function Help() {
  return (
    <div className={cn(container, section, 'max-w-[800px]')}>
      <h1>Ayuda</h1>
      <section id="envios">
        <h2>Envíos</h2>
        <p>CABA y GBA en 24/48 h. Interior por Andreani o Correo Argentino. Envío gratis desde {FREE_SHIPPING.toLocaleString('es-AR')}.</p>
      </section>
      <section id="pagos">
        <h2>Pagos</h2>
        <p>Tarjeta, transferencia y Mercado Pago. Hasta 12 cuotas según el banco emisor.</p>
      </section>
      <section id="cambios">
        <h2>Cambios</h2>
        <p>30 días con factura y producto cerrado. Coordiná el cambio desde tu cuenta o por WhatsApp.</p>
      </section>
      <section id="devoluciones">
        <h2>Devoluciones</h2>
        <p>Si el producto llega dañado, lo reponemos o devolvemos el dinero. Materiales abiertos (cemento, pintura usada) no tienen devolución.</p>
      </section>
      <h2>Preguntas frecuentes</h2>
      {faqs.map((f) => (
        <article key={f.q} className={cn(panel, 'mb-3')}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </article>
      ))}
    </div>
  )
}

export function About() {
  return (
    <div className={cn(container, section, 'max-w-[760px]')}>
      <h1>Nosotros</h1>
      <p>
        FerroHogar nace para que armar, reparar o renovar tu casa sea más simple. Combinamos ferretería de verdad —
        marcas, stock y oficios — con una experiencia de compra clara: kits, calculadoras, instalación con seguimiento
        y asesoría humana.
      </p>
      <p>Estamos en Av. San Martín 2450, CABA, y enviamos a todo el país.</p>
    </div>
  )
}
