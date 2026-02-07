'use client'

import { cn } from "@/src/lib/utils"

type Props = {
  isActive: boolean
  onToggle: () => void
  className?: string
}
// Componente de conmutador switch para activar/desactivar algo (ej: activar/desactivar cuenta o categoría sin eliminarla)
export function ActiveToggle({ isActive, onToggle, className }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer",
        isActive ? "bg-primary" : "bg-gray-300",
        className
      )}
      aria-pressed={isActive}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white transition",
          isActive ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  )
}
