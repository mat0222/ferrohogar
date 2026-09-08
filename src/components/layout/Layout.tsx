import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatWidget } from './ChatWidget'
import { CompareBar } from './CompareBar'
import { Toasts } from './Toasts'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <ChatWidget />
      <Toasts />
    </div>
  )
}
