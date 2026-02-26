"use client"

import { useTranslations } from "next-intl"

interface CancelButtonProps {
    onClick: () => void
    label?: string
    className?: string
}

// Botón de cancelar reutilizable con estilo consistente
export function CancelButton({ onClick, label, className = "" }: CancelButtonProps) {
    const t = useTranslations("CommonButtons")

    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-8 py-2.5 rounded-lg bg-gray-100 text-[15px] text-gray-700 hover:bg-gray-200 transition-colors ${className}`}
        >
            {label ?? t("cancel")}
        </button>
    )
}
