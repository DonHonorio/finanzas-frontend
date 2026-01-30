// types.ts
export type Month =
  | 'enero' | 'febrero' | 'marzo' | 'abril'
  | 'mayo' | 'junio' | 'julio' | 'agosto'
  | 'septiembre' | 'octubre' | 'noviembre' | 'diciembre'

export type CategoryRow = {
  categoryId: string
  name: string
  budget: number
  frequency: string
  dtstart: Date
  icon: string
  color: string
  order: number
  isActive: boolean
  months: Record<Month, number>
}

