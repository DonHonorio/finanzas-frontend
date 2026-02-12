import { cn } from "@/src/lib/utils"

interface SaveButtonProps {
    isPending: boolean   // Estado de la acción en curso (crear/actualizar)
    isValid: boolean     // Formulario válido para habilitar botón
    label?: string
    pendingLabel?: string
    form?: string        // ID del formulario si el botón está fuera de él
    className?: string
}

// Botón de guardar/crear reutilizable con estilo consistente
export function SaveButton({
    isPending,
    isValid,
    label = "Guardar",
    pendingLabel = "Guardando...",
    form,
    className = ""
}: SaveButtonProps) {
    return (
        <button
            type="submit"
            form={form}  // Permite submit desde fuera del <form>
            disabled={!isValid || isPending}
            className={cn(
                "px-8 py-2.5 rounded-lg text-[15px] text-white transition-colors",
                isValid && !isPending
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-gray-400 cursor-not-allowed opacity-70",
                className
            )}
        >
            {isPending ? pendingLabel : label}
        </button>
    )
}