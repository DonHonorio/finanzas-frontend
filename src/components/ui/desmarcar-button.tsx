"use client"

import { X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { useTranslations } from "next-intl"

interface DesmarcarButtonProps {
    onClick: () => void
    title?: string
    className?: string
}

// Botón para limpiar/desmarcar selección (ej: en inputs de búsqueda o select)
export function DesmarcarButton({ onClick, title, className }: DesmarcarButtonProps) {
    const t = useTranslations("CommonButtons")

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100",
                className
            )}
            title={title ?? t("clearSelection")}
        >
            <X className="h-4 w-4" />
        </button>
    )
}
