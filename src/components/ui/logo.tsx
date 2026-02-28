'use client'

import Link from "next/link"
import Image from "next/image"

/**
 * Componente de logo reutilizable que navega al menú principal
 * Se usa en el header de todas las páginas
 */
export function Logo() {
  return (
    <Link href="/" className="block hover:opacity-90 transition-opacity">
      <div className="relative h-[44px] w-[176px] sm:h-[53px] sm:w-[211px]">
        <Image
          src="/logoRiconomy.png"
          alt="Riconomy"
          fill
          priority
          className="object-contain object-left"
          sizes="(min-width: 640px) 211px, 176px"
        />
      </div>
    </Link>
  )
}
