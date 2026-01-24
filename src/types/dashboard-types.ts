// types.ts
export type Month =
  | 'enero' | 'febrero' | 'marzo' | 'abril'
  | 'mayo' | 'junio' | 'julio' | 'agosto'
  | 'septiembre' | 'octubre' | 'noviembre' | 'diciembre'

export type CategoryRow = {
  id: string
  name: string
  budget: number
  months: Record<Month, number>
}
