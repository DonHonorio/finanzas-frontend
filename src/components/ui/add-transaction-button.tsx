'use client'

import { useState } from "react"
import { useSWRConfig } from "swr"
import { AddTransactionModal } from "@/src/components/vista-mensual/add-transaction-modal"
import { Account } from "@/src/types/account-types"
import { Category, Subcategory } from "@/src/types/category-types"
import { cn } from "@/src/lib/utils"
import { useTranslations } from "next-intl"

interface AddTransactionButtonProps {
  accounts: Account[]
  categories: Category[]
  onTransactionAdded?: () => void
  mode?: "expenses" | "incomes"
  variant?: "default" | "floating"   // Dos estilos: botón normal en footer o botón flotante (+)
  className?: string
  defaultCategoryId?: string | number  // Para pre-seleccionar categoría (edición desde categoría)
  defaultSubcategoryId?: number        // Para pre-seleccionar subcategoría
  subcategories?: Subcategory[]        // Subcategorías de la categoría por defecto
}

// Componente de botón que llama al modal para añadir un nuevo movimiento (gasto o ingreso)
export function AddTransactionButton({
  accounts,
  categories,
  onTransactionAdded,
  mode = "expenses",
  variant = "default",
  className,
  defaultCategoryId,
  defaultSubcategoryId,
  subcategories
}: AddTransactionButtonProps) {
  const [open, setOpen] = useState(false)
  const { mutate: globalMutate } = useSWRConfig()
  const t = useTranslations("AddTransactionButton")

  const isFloating = variant === "floating"

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          isFloating
            ? "w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-3xl text-primary hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95"
            : "bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base px-4 py-2 rounded-lg transition select-none",
          className
        )}
        title={t("title")}
      >
        {isFloating ? "+" : t("label")}
      </button>


      <AddTransactionModal
        open={open}
        accounts={accounts}
        categories={categories}
        onCancel={() => setOpen(false)}
        onAccept={() => {
          setOpen(false)
          // Revalida todas las keys de dashboard para reflejar el movimiento recién creado.
          void globalMutate(
            (key) => Array.isArray(key) && key[0] === "dashboard",
            undefined,
            { revalidate: true }
          )
          onTransactionAdded?.()  // Callback para refrescar datos después de añadir
        }}
        mode={mode}
        defaultCategoryId={defaultCategoryId}
        defaultSubcategoryId={defaultSubcategoryId}
        subcategories={subcategories}
      />
    </>
  )
}
