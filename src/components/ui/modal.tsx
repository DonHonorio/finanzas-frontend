'use client'

import { ReactNode } from "react"
import { cn } from "@/src/lib/utils"

type Props = {
    open: boolean      // Controla si el modal está visible o no
    onCancel: () => void // Callback para cerrar el modal (clic en overlay o Escape)
    className?: string // Clases adicionales para personalizar tamaño/apariencia del contenido
    children: ReactNode // Contenido renderizado dentro del modal
}

export function Modal({ open, onCancel, className, children }: Props) {
    // Renderizado condicional: si no está abierto, no renderiza nada
    if (!open) return null

    return (
        // Contenedor fijo que cubre toda la pantalla
        // z-50 asegura que esté por encima de todo el contenido
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 
              Overlay semi-transparente que cubre toda la pantalla
              El onClick permite cerrar el modal al hacer clic fuera del contenido
              bg-black/40 = fondo negro al 40% de opacidad
            */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
            />

            {/* 
              Contenedor del contenido del modal
              relative para posicionar dentro del contenedor fijo
              bg-white rounded-xl shadow-xl = apariencia de "tarjeta flotante"
              flex flex-col = organiza children verticalmente
              animate-in... = animaciones de entrada suaves
            */}
            <div
                className={cn(
                    "relative bg-white rounded-xl shadow-xl flex flex-col",
                    "animate-in fade-in zoom-in-95 duration-200", // Animaciones de entrada
                    className // Clases personalizadas pasadas desde el componente que usa Modal
                )}
            >
                {children}
            </div>
        </div>
    )
}