import type { Product } from '../types'
import { getLiveCategories, getLiveProducts } from '../data/liveCatalog'

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string) {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array<number>(n + 1)
    row[0] = i
    return row
  })
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

function dictionary() {
  const products = getLiveProducts()
  const categories = getLiveCategories()
  return Array.from(
    new Set(
      [
        ...products.flatMap((p) => [p.name, p.brand, p.type, p.category, p.subcategory, p.code]),
        ...categories.map((c) => c.name),
        'taladro',
        'amoladora',
        'pintura',
        'cemento',
        'canilla',
        'mecha',
        'broca',
        'guantes',
        'lampara',
        'cable',
      ].flatMap((w) => normalize(w).split(' ')).filter((w) => w.length > 3),
    ),
  )
}

export function didYouMean(query: string) {
  const q = normalize(query)
  if (q.length < 4) return undefined
  let best: { word: string; dist: number } | undefined
  for (const word of dictionary()) {
    const dist = levenshtein(q, word)
    const allowed = q.length <= 5 ? 1 : 2
    if (dist > 0 && dist <= allowed && (!best || dist < best.dist)) {
      best = { word, dist }
    }
  }
  return best?.word
}

function fieldScore(query: string, field: string) {
  const q = normalize(query)
  const f = normalize(field)
  if (!q || !f) return 0
  if (f === q) return 100
  if (f.includes(q)) return 80
  const words = f.split(' ')
  if (words.some((w) => w.startsWith(q))) return 70
  let best = 0
  for (const word of words) {
    if (word.length < 4 || q.length < 4) continue
    const dist = levenshtein(q, word)
    const allowed = q.length <= 5 ? 1 : 2
    if (dist <= allowed) best = Math.max(best, 60 - dist * 10)
  }
  return best
}

export function scoreProduct(product: Product, query: string) {
  const parts = normalize(query).split(' ').filter(Boolean)
  if (!parts.length) return 0
  const fields = [product.name, product.brand, product.category, product.subcategory, product.code, product.type]
  let total = 0
  for (const part of parts) {
    const best = Math.max(...fields.map((f) => fieldScore(part, f)))
    if (best === 0) return 0
    total += best
  }
  return total / parts.length
}

export function searchProducts(query: string, list: Product[] = getLiveProducts()) {
  const q = query.trim()
  if (!q) return list
  return list
    .map((product) => ({ product, score: scoreProduct(product, q) }))
    .filter((x) => x.score >= 50)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.product)
}

export function searchSuggestions(query: string) {
  const q = query.trim()
  const categories = getLiveCategories()
  if (q.length < 2) return { products: [] as Product[], categories, correction: undefined as string | undefined }
  const correction = didYouMean(q)
  const found = searchProducts(q)
  const extra = correction ? searchProducts(correction).filter((p) => !found.some((f) => f.id === p.id)) : []
  const cats = categories.filter((c) => {
    const n = normalize(c.name)
    const qn = normalize(q)
    return n.includes(qn) || levenshtein(n, qn) <= 2
  })
  return {
    products: [...found, ...extra].slice(0, 6),
    categories: cats.slice(0, 3),
    correction: found.length === 0 ? correction : undefined,
  }
}
