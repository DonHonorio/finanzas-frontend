import { cn } from "@/src/lib/utils"

interface DeleteButtonProps {
    onClick: () => void
    label?: string
    className?: string
    disabled?: boolean
}

export function DeleteButton({ onClick, label = "Eliminar", className, disabled }: DeleteButtonProps) {
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
            {label}
        </button>
    )
}
