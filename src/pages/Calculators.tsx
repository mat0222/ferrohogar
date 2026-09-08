import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { calculators } from '../lib/calculators'
import { getProduct } from '../lib/utils'
import { cn, container, field, formGrid, input, muted, panel, resultBox, section, tabBtn, tabOn } from '../lib/cn'

type Key = keyof typeof calculators

export function Calculators() {
  const [active, setActive] = useState<Key>('pintura')
  const calc = calculators[active]
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(calc.fields.map((f) => [f.key, f.defaultValue])),
  )
  const result = useMemo(() => calc.compute(values), [calc, values])
  const recs = result.recommendIds.map(getProduct).filter(Boolean)

  return (
    <div className={cn(container, section)}>
      <h1>Calculadoras de obra</h1>
      <p className={muted}>Pintura, cemento, cerámicos, tornillos, cable y revestimiento.</p>
      <div className="my-7 mb-3 flex flex-wrap gap-2">
        {(Object.keys(calculators) as Key[]).map((k) => (
          <button
            key={k}
            type="button"
            className={cn(tabBtn, active === k && tabOn)}
            onClick={() => {
              setActive(k)
              setValues(Object.fromEntries(calculators[k].fields.map((f) => [f.key, f.defaultValue])))
            }}
          >
            {calculators[k].title.replace('Calculadora de ', '')}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <form className={cn(panel, formGrid)} onSubmit={(e) => e.preventDefault()}>
          <h2>{calc.title}</h2>
          <p className={muted}>{calc.hint}</p>
          {calc.fields.map((f) => (
            <label key={f.key} className={field}>
              {f.label}
              <input
                className={input}
                type="number"
                min={0}
                step={0.1}
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
              />
            </label>
          ))}
          <div className={resultBox}>
            <strong>{result.label}</strong>
            <p>{result.detail}</p>
            {result.kitId && (
              <Link to={`/kits/${result.kitId === 'kit-pintar' ? 'kit-pintar-habitacion' : result.kitId === 'kit-pared' ? 'kit-reparar-pared' : 'kit-colocar-iluminacion'}`}>
                Ver kit recomendado
              </Link>
            )}
          </div>
        </form>
        <div>
          <h3>Productos sugeridos</h3>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {recs.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
