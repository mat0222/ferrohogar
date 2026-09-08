# FerroHogar

**Tu proyecto, nuestra herramienta.**

Ferretería online y panel de administración para comprar, asesorar e instalar. Catálogo de herramientas, construcción, pinturas, electricidad y hogar, con reserva de técnicos y un backoffice completo.

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/demo-frontend-FF5A1F?style=flat-square" alt="Demo frontend" />
</p>

---

## Qué es

FerroHogar es una SPA de ecommerce pensada para una ferretería argentina: precios en pesos, cuotas, envío a todo el país, retiro en sucursal e **instalación profesional** (calefón, electricidad, aires).

El proyecto tiene dos caras:

| Tienda | FerroHogar Admin |
| --- | --- |
| Experiencia de compra para el cliente | Dashboard SaaS para operar el negocio |
| Catálogo, carrito, checkout, cuenta | Productos, pedidos, clientes, contenido |
| Kits, guías, asistente y calculadoras | Instalaciones, promociones, usuarios y roles |

Los datos viven en el navegador (`localStorage`). No hace falta backend ni base de datos para probarlo.

---

## Tienda

- Inicio configurable (hero, secciones y orden desde el admin)
- Catálogo con filtros, ofertas, marcas y categorías
- Ficha de producto: galería, specs, stock, reseñas y relacionados
- Carrito, checkout (envío o retiro) y seguimiento de pedido
- Favoritos y comparador (hasta 3 productos)
- Kits por proyecto y asistente de compra
- Reserva de instalación con técnico y seguimiento
- Guías, calculadoras, contacto, WhatsApp y chat
- Búsqueda con tolerancia a typos (`taldro` → taladro)

## Panel admin

Acceso desde el botón naranja **Ingresar** (esquina superior derecha) o `/admin/login`.

- Dashboard: ventas, gráfico, últimos pedidos y alertas
- Productos: alta, edición, duplicado, stock e imágenes
- Categorías, marcas, pedidos y clientes
- Instalaciones, técnicos y calendario
- Promociones, cupones y moderación de reseñas
- Contenido del inicio (hero + constructor visual)
- Guías, mensajes, envíos, pagos y estadísticas
- Carritos abandonados, usuarios, roles y notificaciones

---

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19 + TypeScript |
| Bundler | Vite 7 |
| Estilos | Tailwind CSS 4 |
| Rutas | React Router 7 |
| Iconos | Lucide |
| Estado | Context API + `localStorage` |

Identidad visual: negro `#1a1a1a`, naranja `#ff5a1f` y tipografía Inter / Oswald.

---

## Cómo correrlo

Requisitos: **Node.js 20+** y npm.

```bash
git clone <url-del-repo>
cd ferrohogar
npm install
npm run dev
```

Abrí **http://localhost:5173/** (si el puerto está ocupado, Vite usa el siguiente, por ejemplo `5174`).

```bash
npm run build     # producción
npm run preview   # servir el build
npm run lint      # ESLint
```

---

## Cuentas de demo

### Cliente (tienda)

En **Mi cuenta** entra cualquier nombre, email y teléfono. Es una demo: no hay registro real.

### Administrador

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@ferrohogar.com` | `Admin123!` |
| Vendedor | `vendedor@ferrohogar.com` | `Vendedor123!` |
| Instalaciones | `instalaciones@ferrohogar.com` | `Instala123!` |
| Contenido | `contenido@ferrohogar.com` | `Contenido123!` |
| Soporte | `soporte@ferrohogar.com` | `Soporte123!` |

El administrador (Mateo) tiene acceso completo. El resto ve solo las secciones de su rol.

---

## Estructura

```text
src/
├── admin/           # Panel FerroHogar Admin
├── components/      # Header, footer, cards, búsqueda
├── context/         # Estado de la tienda (carrito, pedidos, sesión)
├── data/            # Catálogo seed + catálogo vivo
├── lib/             # Precios, búsqueda, calculadoras
├── pages/           # Páginas de la tienda
└── types.ts
public/
├── img/             # Fotos locales de productos y banners
└── logo.png
```

Claves de persistencia:

- `ferrohogar-store-v1` — carrito, cuenta, pedidos e instalaciones del cliente
- `ferrohogar-admin-v1` — catálogo, contenido y operación del admin

---

## Notas

- Es un **prototipo frontend**: no procesa pagos reales ni envía emails.
- Mercado Pago, transferencia y efectivo están simulados en el checkout y en el admin.
- Editar un producto o el hero en el admin se refleja en la tienda.
- En **Configuración** del admin se pueden restaurar los datos de demo.

---

## Licencia

Uso académico / demostración del proyecto FerroHogar.
