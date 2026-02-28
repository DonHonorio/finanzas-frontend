'use client'

import Link from "next/link"
import { CalendarDays, TrendingUp, PiggyBank, CreditCard } from "lucide-react"
import { z } from 'zod'
import { Header } from "@/src/components/menu-principal/header"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import ToastNotification from "@/src/components/ui/ToastNotification"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAccounts } from "@/src/data-layer/accounts"
import { getCategories } from "@/src/data-layer/categories"
import { Account } from "@/src/types/account-types"
import { Category } from "@/src/types/category-types"
import { UserSchema } from '@/src/schemas'
import { useResolvedSessionUser } from "@/src/hooks/use-resolved-session-user"
import { useTranslations } from "next-intl"

type User = z.infer<typeof UserSchema>

interface HomePageClientProps {
  user?: User | null
  source?: "backend" | "local" | "none"
  title?: string
}

// Clave usada en localStorage para registrar que el usuario ya completó el onboarding
const ONBOARDING_KEY = 'fp_onboarding_completed'

// Página principal del frontend, con enlaces a las diferentes secciones de la aplicación
export function HomePageClient({ user, source, title }: HomePageClientProps) {
  const t = useTranslations("HomePage")
  const router = useRouter()
  // Normaliza usuario efectivo (backend directo o local resuelto en cliente).
  const resolvedUser = useResolvedSessionUser(user, source)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const availableAccounts = resolvedUser ? accounts : []
  const availableCategories = resolvedUser ? categories : []

  // Redirigir a bienvenida solo si no hay usuario (no registrado) y es la primera vez en este navegador
  useEffect(() => {
    if (source === "none" && !resolvedUser && !localStorage.getItem(ONBOARDING_KEY)) {
      router.replace('/bienvenida')
    }
  }, [resolvedUser, router, source])

  useEffect(() => {
    if (!resolvedUser?.userId) {
      return
    }

    // Cargar datos cuando hay usuario o cambia el usuario
    // Se usa data-layer para soportar backend/local con misma API.
    getAccounts().then(setAccounts)
    getCategories().then(setCategories)
  }, [resolvedUser?.userId])

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-gray-50">
      {/* Header */}
      <Header user={resolvedUser} source={source} />

      {/* Contenido Principal */}
      <main className="flex-1 min-h-0 flex flex-col px-3 sm:px-8 py-3 sm:py-8 gap-3 sm:gap-8 overflow-hidden">
        {/* Título */}
        <div className="w-full max-w-4xl shrink-0 mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 text-center">
            {title ?? t("title")}
          </h1>
        </div>

        {/* Zona flexible (centro): el área se adapta y las 4 tarjetas se mantienen cuadradas */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-8 w-full max-w-md sm:max-w-4xl aspect-square max-h-full">
            {/* Vista Mensual */}
            <Link
              href="/vista-mensual"
              className="group h-full bg-white rounded-2xl p-3 sm:p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-2 sm:gap-4"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <CalendarDays className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-sm sm:text-2xl font-semibold text-gray-800 group-hover:text-primary transition text-center">
                {t("monthlyView")}
              </h2>
            </Link>

            {/* Patrimonio Personal */}
            <Link
              href="/patrimonio"
              className="group h-full bg-white rounded-2xl p-3 sm:p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-2 sm:gap-4"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <TrendingUp className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-sm sm:text-2xl font-semibold text-gray-800 group-hover:text-primary transition text-center">
                {t("netWorth")}
              </h2>
            </Link>

            {/* Ahorros */}
            <Link
              href="/ahorros"
              className="group h-full bg-white rounded-2xl p-3 sm:p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-2 sm:gap-4"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <PiggyBank className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-sm sm:text-2xl font-semibold text-gray-800 group-hover:text-primary transition text-center">
                {t("savings")}
              </h2>
            </Link>

            {/* Cuentas */}
            <Link
              href="/cuentas"
              className="group h-full bg-white rounded-2xl p-3 sm:p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-2 sm:gap-4"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <CreditCard className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-sm sm:text-2xl font-semibold text-gray-800 group-hover:text-primary transition text-center">
                {t("accounts")}
              </h2>
            </Link>
          </div>
        </div>

        {/* Botón de Añadir Movimiento */}
        <div className="w-full max-w-4xl shrink-0 mx-auto flex justify-center">
          <AddTransactionButton
            accounts={availableAccounts}
            categories={availableCategories}
            mode="expenses"
            variant="default"
            className="px-5 sm:px-8 py-2.5 sm:py-4 shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
          />
        </div>
      </main>

      <ToastNotification />
    </div>
  )
}
