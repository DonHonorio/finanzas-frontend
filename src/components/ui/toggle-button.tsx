type ToggleButtonProps = {
    isActive: boolean
    label: string
    onClick: () => void
}

export function ToggleButton({ isActive, label, onClick }: ToggleButtonProps) {
    // Botón que forma parte del switch de Gastos/Ingresos
    return (
        <button
            type="button"
            className={`relative z-10 w-1/2 text-xs sm:text-sm font-semibold transition select-none cursor-pointer
        ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
      `}
            onClick={onClick}
        >
            {label}
        </button>
    )
}
