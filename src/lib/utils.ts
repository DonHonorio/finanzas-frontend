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

// Array de nombres de meses (mismo contenido que months pero sin tipo específico)
export const monthNames = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
] as const

// Formatea números como moneda en formato español (€)
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

// Formatea una fecha ISO a formato español dd/mm/yyyy
export function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// Opciones de icono
export const iconOptions = [
  "💰", "💵", "🧾", "💳", "🏦", "💶", "🏛️", "💸",
  "🛒", "🍔", "🚗", "🏠", "🎁", "🎬", "📚", "🧳",
  "🎓", "👕", "💲", "🛠️", "📱", "💻", "🎮", "🎵",
  "🏃", "🏖️", "🧘", "🎨", "📷", "🌳", "⚡", "🔦",
  "🧲", "📺", "🧻", "🍬", "🧼", "🥤", "🍕", "☕",
  "🍷", "🍺", "🥗", "🍜", "🥧", "🎂", "🎁", "💐",
  "🚕", "🚌", "🚆", "🚲", "🛵", "✈️", "🚢", "🛴",
  "📦", "🛍️", "🎧", "🎮", "🎸", "🎹", "🎯", "🎲"
]

// Opciones de color
export const colorOptions = ["#F0BD24", "#F2994A", "#F2C94C", "#E0E0E0", "#BDBDBD", "#4F4F4F"]