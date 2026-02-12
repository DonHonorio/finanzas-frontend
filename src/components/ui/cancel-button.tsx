interface CancelButtonProps {
    onClick: () => void
    label?: string
    className?: string
}

// Botón de cancelar reutilizable con estilo consistente
export function CancelButton({ onClick, label = "Cancelar", className = "" }: CancelButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-8 py-2.5 rounded-lg bg-gray-100 text-[15px] text-gray-700 hover:bg-gray-200 transition-colors ${className}`}
        >
            {label}
        </button>
    )
}
