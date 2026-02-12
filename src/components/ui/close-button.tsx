interface CloseButtonProps {
    onClick: () => void
    className?: string
}

// Botón de cerrar (X) reutilizable con estilo consistente
export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`text-gray-400 hover:text-gray-600 text-2xl leading-none ${className}`}
            aria-label="Cerrar"
        >
            ×
        </button>
    )
}
