import { Minus, Plus } from 'lucide-react'

export function Quantity({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-line bg-white">
      <button type="button" className="h-9 w-9 cursor-pointer border-0 bg-[#f7f7f7]" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Menos">
        <Minus size={14} className="mx-auto" />
      </button>
      <input
        className="w-12 border-0 text-center outline-none"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
      />
      <button type="button" className="h-9 w-9 cursor-pointer border-0 bg-[#f7f7f7]" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Más">
        <Plus size={14} className="mx-auto" />
      </button>
    </div>
  )
}
