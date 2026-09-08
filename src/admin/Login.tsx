import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { useAdmin } from './context'
import { aBtn, aInput } from './ui'

export function AdminLogin() {
  const { loginAdmin, session } = useAdmin()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@ferrohogar.com')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')

  if (session) return <Navigate to="/admin" replace />

  return (
    <div className="grid min-h-screen bg-[#101114] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden items-center justify-center bg-[url('/img/tools.jpg')] bg-cover bg-center lg:flex">
        <div className="rounded-2xl bg-black/70 p-10 text-white">
          <Logo stacked />
          <p className="mt-4 max-w-sm text-sm text-white/80">Panel de administración de la ferretería online.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
          onSubmit={(e) => {
            e.preventDefault()
            const err = loginAdmin(email, password)
            if (err) setError(err)
            else navigate('/admin')
          }}
        >
          <p className="m-0 text-xs font-extrabold tracking-[0.16em] text-brand">FERROHOGAR ADMIN</p>
          <h1 className="mt-2 text-2xl font-extrabold">Ingresar al panel</h1>
          <label className="mt-4 grid gap-1 text-sm font-semibold">
            Email
            <input className={aInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="mt-3 grid gap-1 text-sm font-semibold">
            Contraseña
            <input className={aInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="mt-2 mb-0 text-sm font-semibold text-red-600">{error}</p>}
          <button className={`${aBtn} mt-5 w-full`} type="submit">
            Entrar
          </button>
          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <strong className="block text-slate-800">Cuenta administrador</strong>
            admin@ferrohogar.com · Admin123!
            <p className="mt-2 mb-0">Otras cuentas: vendedor@ / Vendedor123! · instalaciones@ / Instala123! · contenido@ / Contenido123! · soporte@ / Soporte123! (todas @ferrohogar.com)</p>
          </div>
          <Link to="/" className="mt-4 inline-block text-sm text-slate-500 hover:text-brand">
            ← Volver a la tienda
          </Link>
        </form>
      </div>
    </div>
  )
}
