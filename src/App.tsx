import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AdminProvider } from './admin/context'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Installation } from './pages/Installation'
import { InstallationTracking } from './pages/InstallationTracking'
import { Contact } from './pages/Contact'
import { Account } from './pages/Account'
import { Favorites } from './pages/Favorites'
import { OrderTracking } from './pages/OrderTracking'
import { Categories } from './pages/Categories'
import { Guides, GuideDetail } from './pages/Guides'
import { Assistant } from './pages/Assistant'
import { Offers } from './pages/Offers'
import { Compare } from './pages/Compare'
import { Calculators } from './pages/Calculators'
import { Legal } from './pages/Legal'
import { KitDetail, Kits } from './pages/KitDetail'
import { About, Help } from './pages/Help'
import { Brands } from './pages/Brands'
import { AdminLayout } from './admin/Layout'
import { AdminLogin } from './admin/Login'
import { AdminDashboard } from './admin/Dashboard'
import { AdminProducts } from './admin/Products'
import { AdminProductForm } from './admin/ProductForm'
import {
  AdminBrands,
  AdminCategories,
  AdminCustomerDetail,
  AdminCustomers,
  AdminFavorites,
  AdminOrderDetail,
  AdminOrders,
} from './admin/Commerce'
import { AdminInstallations, AdminPromos, AdminReviews } from './admin/InstallMarketing'
import {
  AdminCarts,
  AdminContent,
  AdminGuides,
  AdminMessages,
  AdminPayments,
  AdminSettings,
  AdminShipping,
  AdminStats,
  AdminUsers,
} from './admin/ContentSystem'

export default function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="productos/nuevo" element={<AdminProductForm />} />
              <Route path="productos/:id" element={<AdminProductForm />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="marcas" element={<AdminBrands />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="pedidos/:id" element={<AdminOrderDetail />} />
              <Route path="clientes" element={<AdminCustomers />} />
              <Route path="clientes/:id" element={<AdminCustomerDetail />} />
              <Route path="instalaciones" element={<AdminInstallations />} />
              <Route path="promociones" element={<AdminPromos />} />
              <Route path="resenas" element={<AdminReviews />} />
              <Route path="favoritos" element={<AdminFavorites />} />
              <Route path="envios" element={<AdminShipping />} />
              <Route path="pagos" element={<AdminPayments />} />
              <Route path="contenido" element={<AdminContent />} />
              <Route path="guias" element={<AdminGuides />} />
              <Route path="mensajes" element={<AdminMessages />} />
              <Route path="estadisticas" element={<AdminStats />} />
              <Route path="carritos" element={<AdminCarts />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="configuracion" element={<AdminSettings />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/productos/:slug" element={<ProductDetail />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/categorias/:slug" element={<Products />} />
              <Route path="/ofertas" element={<Offers />} />
              <Route path="/marcas" element={<Brands />} />
              <Route path="/marcas/:slug" element={<Brands />} />
              <Route path="/kits" element={<Kits />} />
              <Route path="/kits/:slug" element={<KitDetail />} />
              <Route path="/instalacion" element={<Installation />} />
              <Route path="/instalacion/seguimiento/:id" element={<InstallationTracking />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido/:id" element={<OrderTracking />} />
              <Route path="/cuenta" element={<Account />} />
              <Route path="/cuenta/pedidos" element={<Account />} />
              <Route path="/cuenta/direcciones" element={<Account />} />
              <Route path="/cuenta/pagos" element={<Account />} />
              <Route path="/cuenta/instalaciones" element={<Account />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/guias" element={<Guides />} />
              <Route path="/guias/:slug" element={<GuideDetail />} />
              <Route path="/asistente" element={<Assistant />} />
              <Route path="/comparar" element={<Compare />} />
              <Route path="/calculadoras" element={<Calculators />} />
              <Route path="/ayuda" element={<Help />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/legal/:slug" element={<Legal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </StoreProvider>
  )
}
