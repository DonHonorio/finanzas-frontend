'use client'

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string // Si se proporciona, navega a esta ruta. Si no, usa router.back()
}

/**
 * Botón de volver reutilizable
 * Por defecto navega al menú principal (/), pero se puede especificar otra ruta
 */
export function BackButton({ href = "/" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:-translate-x-0.5 transition select-none"
    >
      <ChevronLeft className="h-4 w-4" />
      Volver
    </button>
  )
}
