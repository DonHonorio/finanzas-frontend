"use client"

import { cn } from "@/src/lib/utils"
import { useTranslations } from "next-intl"

interface DeleteButtonProps {
    onClick: () => void
    label?: string
    className?: string
    disabled?: boolean  // Deshabilita el botón (ej: durante una acción en progreso)
}

// Botón para acciones destructivas (eliminar). Usa colores de tema "destructive"
export function DeleteButton({ onClick, label, className, disabled }: DeleteButtonProps) {
    const t = useTranslations("CommonButtons")

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "px-6 py-2.5 rounded-lg bg-destructive text-[15px] text-destructive-foreground hover:bg-destructive/90 transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        >
            {label ?? t("delete")}
        </button>
    )
}
