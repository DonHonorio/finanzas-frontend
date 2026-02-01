type ToggleButtonProps = {
    isActive: boolean
    label: string
    onClick: () => void
}

export function ToggleButton({ isActive, label, onClick }: ToggleButtonProps) {
    // Botón que forma parte del switch de Gastos/Ingresos
    return (
        <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition select-none
        ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
      `}
            onClick={onClick}
        >
            {label}
        </button>
    )
}
