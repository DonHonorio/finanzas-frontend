import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Month } from "../types/dashboard-types"

// Combina clases CSS condicionales y resuelve conflictos de Tailwind
export function cn(...inputs: ClassValue[]) {
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
export function formatCurrency(value: number, options?: { locale?: string; currency?: string }) {
  const locale = options?.locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-US")
  const currency = options?.currency ?? "EUR"

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

// Formatea una fecha ISO a formato español dd/mm/yyyy
export function formatDate(dateString: string, locale?: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-US"), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Formatea números de forma compacta para vistas reducidas (tablet/móvil): 1234 → "1.2K"
export function formatCompact(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs === 0) return '0'
  if (abs >= 10000) return `${sign}${Math.round(abs / 1000)}K`
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}K`
  return `${sign}${Math.round(abs)}`
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
