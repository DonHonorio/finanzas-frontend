import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "default" | "outline" | "ghost" | "destructive"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: "sm" | "md" | "lg"
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-600 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }

  const sizeStyles = {
    sm: "px-3 py-1 text-sm rounded",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-5 py-3 text-base rounded-lg",
  }

  return (
    <button
      className={cn(
        "transition duration-200 font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
}
