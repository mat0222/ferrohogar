import type { AdminRole, Permission } from './types'

const ROLE_PERMS: Record<AdminRole, Permission[] | ['*']> = {
  admin: ['*'],
  vendedor: [
    'dashboard',
    'products',
    'products.edit',
    'orders',
    'orders.edit',
    'customers',
    'reviews',
    'favorites',
    'stats',
    'carts',
    'notifications',
  ],
  instalaciones: ['dashboard', 'installations', 'notifications'],
  contenido: ['dashboard', 'content', 'guides', 'brands', 'categories', 'promos', 'notifications'],
  soporte: ['dashboard', 'customers', 'messages', 'orders', 'reviews', 'notifications'],
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  instalaciones: 'Instalaciones',
  contenido: 'Contenido',
  soporte: 'Soporte',
}

export function can(role: AdminRole | undefined, permission: Permission) {
  if (!role) return false
  const perms = ROLE_PERMS[role]
  return perms[0] === '*' || (perms as Permission[]).includes(permission)
}

export const PERMISSION_OPTIONS: { key: Permission; label: string }[] = [
  { key: 'products', label: 'Ver productos' },
  { key: 'products.edit', label: 'Editar productos' },
  { key: 'products.delete', label: 'Eliminar productos' },
  { key: 'orders', label: 'Ver pedidos' },
  { key: 'orders.edit', label: 'Cambiar pedidos' },
  { key: 'customers', label: 'Clientes' },
  { key: 'installations', label: 'Instalaciones' },
  { key: 'content', label: 'Contenido de la web' },
  { key: 'users', label: 'Usuarios' },
  { key: 'settings', label: 'Configuración' },
]
