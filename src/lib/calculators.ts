export interface CalcResult {
  label: string
  detail: string
  recommendIds: string[]
  kitId?: string
}

function litersNeeded(area: number, coats: number, yieldPerLiter: number) {
  if (area <= 0 || coats <= 0 || yieldPerLiter <= 0) return 0
  return Math.ceil((area * coats) / yieldPerLiter)
}

export const calculators = {
  pintura: {
    title: 'Calculadora de pintura',
    hint: 'Superficie × capas / rendimiento.',
    compute(values: Record<string, number>): CalcResult {
      const liters = litersNeeded(values.area, values.coats, values.yield)
      return {
        label: `Necesitás aproximadamente ${liters} litros de pintura.`,
        detail: `Para ${values.area} m² y ${values.coats} mano${values.coats > 1 ? 's' : ''} con un rendimiento de ${values.yield} m²/L.`,
        recommendIds: ['p15', 'p18', 'p19', 'p20', 'p43'],
        kitId: 'kit-pintar',
      }
    },
    fields: [
      { key: 'area', label: 'Superficie (m²)', defaultValue: 30 },
      { key: 'coats', label: 'Capas', defaultValue: 2 },
      { key: 'yield', label: 'Rendimiento (m²/L)', defaultValue: 10 },
    ],
  },
  cemento: {
    title: 'Calculadora de cemento',
    hint: 'Volumen de mezcla × dosificación.',
    compute(values: Record<string, number>): CalcResult {
      const m3 = (values.length * values.width * values.thickness) / 100
      const bags = Math.ceil(m3 * 7)
      return {
        label: `Necesitás alrededor de ${bags} bolsas de 50 kg.`,
        detail: `Volumen estimado: ${m3.toFixed(2)} m³ (regla práctica: 7 bolsas por m³ de hormigón magro).`,
        recommendIds: ['p09', 'p13', 'p14', 'p10'],
        kitId: 'kit-pared',
      }
    },
    fields: [
      { key: 'length', label: 'Largo (m)', defaultValue: 4 },
      { key: 'width', label: 'Ancho (m)', defaultValue: 3 },
      { key: 'thickness', label: 'Espesor (cm)', defaultValue: 8 },
    ],
  },
  ceramicos: {
    title: 'Calculadora de cerámicos',
    hint: 'Incluye 10% de desperdicio.',
    compute(values: Record<string, number>): CalcResult {
      const area = values.length * values.width
      const tile = (values.tileW / 100) * (values.tileH / 100)
      const units = Math.ceil((area / tile) * 1.1)
      return {
        label: `Necesitás ${units} piezas (con 10% extra).`,
        detail: `Superficie ${area.toFixed(1)} m². Pedí también nivel láser y tarugos si vas a colocar zócalos.`,
        recommendIds: ['p11', 'p12', 'p34'],
      }
    },
    fields: [
      { key: 'length', label: 'Largo del ambiente (m)', defaultValue: 4 },
      { key: 'width', label: 'Ancho (m)', defaultValue: 3 },
      { key: 'tileW', label: 'Ancho de pieza (cm)', defaultValue: 45 },
      { key: 'tileH', label: 'Alto de pieza (cm)', defaultValue: 45 },
    ],
  },
  tornillos: {
    title: 'Calculadora de tornillos',
    hint: 'Separación típica entre fijaciones.',
    compute(values: Record<string, number>): CalcResult {
      const count = Math.ceil(values.length / (values.spacing / 100)) * values.rows
      return {
        label: `Llevá ${count} tornillos, más un 15% de reserva: ${Math.ceil(count * 1.15)}.`,
        detail: `Largo ${values.length} m, cada ${values.spacing} cm, ${values.rows} hilera(s).`,
        recommendIds: ['p36', 'p34', 'p08'],
      }
    },
    fields: [
      { key: 'length', label: 'Largo a fijar (m)', defaultValue: 5 },
      { key: 'spacing', label: 'Separación (cm)', defaultValue: 30 },
      { key: 'rows', label: 'Hileras', defaultValue: 2 },
    ],
  },
  cable: {
    title: 'Calculadora de cable',
    hint: 'Recorrido + 15% de holgura.',
    compute(values: Record<string, number>): CalcResult {
      const meters = Math.ceil(values.run * values.circuits * 1.15)
      return {
        label: `Necesitás ${meters} metros de cable.`,
        detail: `Para ${values.circuits} circuito(s) y ${values.run} m de recorrido. Usá 2.5 mm² en tomas.`,
        recommendIds: ['p22', 'p25', 'p21'],
        kitId: 'kit-luz',
      }
    },
    fields: [
      { key: 'run', label: 'Recorrido (m)', defaultValue: 18 },
      { key: 'circuits', label: 'Circuitos', defaultValue: 2 },
    ],
  },
  revestimiento: {
    title: 'Calculadora de revestimiento',
    hint: 'Muros, con 8% de merma.',
    compute(values: Record<string, number>): CalcResult {
      const wall = values.height * values.width * values.walls
      const boxes = Math.ceil((wall * 1.08) / values.boxCoverage)
      return {
        label: `Comprá ${boxes} cajas (cobertura ${values.boxCoverage} m² c/u).`,
        detail: `${wall.toFixed(1)} m² de muro + 8% de merma.`,
        recommendIds: ['p11', 'p12', 'p44'],
      }
    },
    fields: [
      { key: 'height', label: 'Alto (m)', defaultValue: 2.4 },
      { key: 'width', label: 'Ancho por pared (m)', defaultValue: 3 },
      { key: 'walls', label: 'Cantidad de paredes', defaultValue: 1 },
      { key: 'boxCoverage', label: 'm² por caja', defaultValue: 1.5 },
    ],
  },
}
