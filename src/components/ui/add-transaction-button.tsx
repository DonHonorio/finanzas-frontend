'use client'

import { useState } from "react"
import { AddTransactionModal } from "@/src/components/vista-mensual/add-transaction-modal"
import { Account } from "@/src/types/account-types"
import { Category } from "@/src/types/category-types"
import { cn } from "@/src/lib/utils"

interface AddTransactionButtonProps {
  accounts: Account[]
  categories: Category[]
  onTransactionAdded?: () => void
  mode?: "expenses" | "incomes"
  variant?: "default" | "floating"
  className?: string
  defaultCategoryId?: string | number
}

export function AddTransactionButton({
  accounts,
  categories,
  onTransactionAdded,
  mode = "expenses",
  variant = "default",
  className,
  defaultCategoryId
}: AddTransactionButtonProps) {
  const [open, setOpen] = useState(false)

  const isFloating = variant === "floating"

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          isFloating
            ? "w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-3xl text-primary hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95"
            : "w-60 bg-primary hover:bg-primary/90 text-primary-foreground text-lg rounded-lg transition select-none",
          className
        )}
        title="Añadir movimiento"
      >
        {isFloating ? "+" : "+ Añadir Movimiento"}
      </button>

      <AddTransactionModal
        open={open}
        accounts={accounts}
        categories={categories}
        onCancel={() => setOpen(false)}
        onAccept={() => {
            setOpen(false)
            onTransactionAdded?.()
        }}
        mode={mode}
        defaultCategoryId={defaultCategoryId}
      />
    </>
  )
}
