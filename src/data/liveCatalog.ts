import { categories, products } from './catalog'
import type { Category, Product } from '../types'

let liveProducts: Product[] = products.map((p) => ({ ...p }))
let liveCategories: Category[] = categories.map((c) => ({ ...c }))
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function getLiveProducts() {
  return liveProducts
}

export function getLiveCategories() {
  return liveCategories
}

export function setLiveProducts(next: Product[]) {
  liveProducts = next
  emit()
}

export function setLiveCategories(next: Category[]) {
  liveCategories = next
  emit()
}

export function subscribeLiveCatalog(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
