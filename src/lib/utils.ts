import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Month } from "../types/dashboard-types"

// Combina clases CSS condicionales y resuelve conflictos de Tailwind
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

// Array de meses en español para uso consistente en toda la aplicación
export const months: Month[] = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

// Formatea números como moneda en formato español (€)
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}