'use client'

import { ReactNode } from "react"
import { cn } from "@/lib/utils" // opcional si usas cn(), puedes quitarlo

type Props = {
    open: boolean
    onCancel: () => void
    className?: string // para tamaño personalizado
    children: ReactNode
}

export function Modal({ open, onCancel, className, children }: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
            />

            {/* Modal content */}
            <div
                className={cn(
                    "relative bg-white rounded-xl shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-200",
                    className
                )}
            >
                {children}
            </div>
        </div>
    )
}
