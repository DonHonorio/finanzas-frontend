'use client'

import Link from "next/link"
import { DollarSign } from "lucide-react"

/**
 * Componente de logo reutilizable que navega al menú principal
 * Se usa en el header de todas las páginas
 */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <DollarSign className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-gray-800">R$</span>
    </Link>
  )
}
