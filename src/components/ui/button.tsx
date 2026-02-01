import { cn } from "@/src/lib/utils"
import type { ButtonHTMLAttributes } from "react"

// Variantes visuales del botón
type Variant = "default" | "outline" | "ghost" | "destructive"

// Props del componente, extiende los atributos nativos de button HTML
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: "sm" | "md" | "lg"
}

export function Button({
  className,
  variant = "default",  // Valor por defecto: variante principal
  size = "md",          // Valor por defecto: tamaño medio
  ...props              // Spread del resto de props (onClick, disabled, etc.)
}: ButtonProps) {

  // Mapeo de variantes a clases de Tailwind CSS
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",        // Botón principal/sólido
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100", // Con borde, sin fondo
    ghost: "text-gray-600 hover:bg-gray-100",                   // Sin borde ni fondo, solo texto
    destructive: "bg-red-600 text-white hover:bg-red-700",      // Para acciones peligrosas
  }

  // Mapeo de tamaños a clases de Tailwind CSS
  const sizeStyles = {
    sm: "px-3 py-1 text-sm rounded",      // Pequeño: menos padding, texto pequeño
    md: "px-4 py-2 text-sm rounded-md",   // Medio: padding estándar
    lg: "px-5 py-3 text-base rounded-lg", // Grande: más padding, texto más grande
  }

  return (
    <button
      className={cn(
        "transition duration-200 font-medium", // Transiciones suaves y texto en negrita
        variantStyles[variant],                // Clases según la variante (default/outline/ghost/destructive)
        sizeStyles[size],                      // Clases según el tamaño (sm/md/lg)
        className                              // Clases adicionales pasadas desde el uso
      )}
      {...props} // Pasa todos los props HTML nativos (onClick, type, disabled, etc.)
    />
  )
}