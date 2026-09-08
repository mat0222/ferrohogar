import { useParams } from 'react-router-dom'
import { cn, container } from '../lib/cn'

const copy: Record<string, { title: string; body: string }> = {
  terminos: {
    title: 'Términos y condiciones',
    body: 'El uso de FerroHogar implica aceptar estos términos. Los precios publicados incluyen IVA y pueden cambiar sin previo aviso hasta confirmar el pedido. Las instalaciones se rigen por el presupuesto aceptado y la disponibilidad de zona.',
  },
  privacidad: {
    title: 'Política de privacidad',
    body: 'Tratamos tu nombre, email, teléfono y dirección solo para procesar pedidos, instalaciones y soporte. No vendemos tus datos. Podés pedir acceso o baja escribiendo a hola@ferrohogar.com.',
  },
  cookies: {
    title: 'Cookies',
    body: 'Usamos cookies técnicas para el carrito, la sesión y las preferencias de favoritos. Podés bloquearlas en el navegador; algunas funciones dejarán de recordarse.',
  },
}

export function Legal() {
  const { slug } = useParams()
  const page = copy[slug ?? 'terminos'] ?? copy.terminos
  return (
    <div className={cn(container, 'max-w-[760px] py-10')}>
      <h1>{page.title}</h1>
      <p>{page.body}</p>
    </div>
  )
}
