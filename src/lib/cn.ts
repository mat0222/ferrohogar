export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export const container = 'mx-auto w-[min(1180px,calc(100%-2rem))]'

export const btn =
  'inline-flex items-center justify-center gap-2 rounded-md px-[18px] py-3 font-bold transition cursor-pointer border-0'
export const btnPrimary = `${btn} bg-brand text-white hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed`
export const btnOutline = `${btn} bg-white border border-line text-ink hover:bg-page`
export const btnGhost = `${btn} bg-transparent text-white border border-white/25 hover:bg-white/10`
export const btnDisabled = 'pointer-events-none opacity-45'

export const panel = 'bg-white border border-line rounded-[14px] p-5'
export const card = 'bg-white border border-line rounded-[14px] p-[18px] transition hover:border-brand'
export const muted = 'text-muted'
export const crumb = 'text-[0.85rem] text-muted my-2'

export const productGrid = 'grid grid-cols-2 gap-[18px] max-lg:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
export const productGrid3 = 'grid grid-cols-2 gap-[18px] lg:grid-cols-3'
export const section = 'py-14'
export const sectionHead = 'mb-[22px] flex items-end justify-between gap-4'
export const field = 'grid gap-1 text-[0.85rem] font-semibold'
export const input =
  'w-full rounded-lg border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand'
export const choice = 'flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-white p-3.5 text-left'
export const choiceOn = 'border-brand bg-brand-soft'
export const empty = 'rounded-[14px] bg-white p-12 text-center'
export const summary =
  'h-fit sticky top-[148px] max-lg:static rounded-[14px] border border-line bg-white p-[18px]'
export const split = 'grid gap-6 py-7 pb-12 lg:grid-cols-[1.5fr_0.8fr]'
export const formGrid = 'grid gap-2.5'
export const formTwo = 'grid gap-2.5 sm:grid-cols-2'
export const filterLabel = 'mb-1.5 flex items-center gap-2 text-[0.9rem]'
export const filterTitle = 'mt-3.5 mb-2 text-base'
export const select = 'w-full rounded-lg border border-line bg-white px-2.5 py-2'
export const resultBox = 'mt-3 rounded-xl bg-brand-soft p-4'
export const table = 'w-full overflow-hidden rounded-xl border-collapse bg-white'
export const thtd = 'border border-line p-3 text-left'
export const tabBtn = 'cursor-pointer rounded-lg border-0 bg-white px-3.5 py-2.5 font-bold'
export const tabOn = 'bg-ink text-white'
export const tracker = 'my-4 flex list-none flex-wrap gap-2 p-0'
export const trackerItem = 'min-w-[110px] flex-1 rounded-[10px] bg-[#f3f3f3] p-2.5 text-[0.85rem]'
export const fourGrid = 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
export const brandPill = 'rounded-[10px] border border-line bg-white px-2 py-[18px] text-center font-extrabold tracking-[0.04em] hover:border-brand'

export function stepClass(i: number, idx: number) {
  return cn(trackerItem, i < idx && 'bg-[#e9f8ef] text-ok', i === idx && 'bg-brand-soft font-extrabold text-brand')
}

