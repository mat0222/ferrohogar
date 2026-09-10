/** Prefijo de GitHub Pages (`/ferrohogar/`) o `/` en local. */
export function asset(path: string) {
  if (!path || path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  const base = import.meta.env.BASE_URL
  if (path.startsWith(base)) return path
  return `${base}${path.replace(/^\//, '')}`
}
