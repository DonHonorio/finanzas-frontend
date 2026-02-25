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

type User = z.infer<typeof UserSchema>

interface HomePageClientProps {
  user?: User | null
  source?: "backend" | "local" | "none"
}

// Clave usada en localStorage para registrar que el usuario ya completó el onboarding
const ONBOARDING_KEY = 'fp_onboarding_completed'

// Página principal del frontend, con enlaces a las diferentes secciones de la aplicación
export function HomePageClient({ user, source }: HomePageClientProps) {
  const router = useRouter()
  // Normaliza usuario efectivo (backend directo o local resuelto en cliente).
  const resolvedUser = useResolvedSessionUser(user, source)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Redirigir a bienvenida solo si no hay usuario (no registrado) y es la primera vez en este navegador
  useEffect(() => {
    if (source === "none" && !resolvedUser && !localStorage.getItem(ONBOARDING_KEY)) {
      router.replace('/bienvenida')
    }
  }, [resolvedUser, router, source])

  useEffect(() => {
    // Resetear datos si no hay usuario
    if (!resolvedUser) {
      setAccounts([])
      setCategories([])
      return
    }
    
    // Cargar datos cuando hay usuario o cambia el usuario
    // Se usa data-layer para soportar backend/local con misma API.
    getAccounts().then(setAccounts)
    getCategories().then(setCategories)
  }, [resolvedUser?.userId])

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <Header user={resolvedUser} source={source} />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-between py-12 px-8">
        {/* Título */}
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-16">
            Menú Principal
          </h1>
        </div>

        {/* Grid de Opciones */}
        <div className="flex-1 flex items-center justify-center w-full max-w-5xl">
          <div className="grid grid-cols-2 gap-8 w-full">
            {/* Vista Mensual */}
            <Link
              href="/vista-mensual"
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-4 min-h-[200px]"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <CalendarDays className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-primary transition">
                Vista Mensual
              </h2>
            </Link>

            {/* Patrimonio Personal */}
            <Link
              href="/patrimonio"
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-4 min-h-[200px]"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-primary transition">
                Patrimonio Personal
              </h2>
            </Link>

            {/* Ahorros */}
            <Link
              href="/ahorros"
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-4 min-h-[200px]"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <PiggyBank className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-primary transition">
                Ahorros
              </h2>
            </Link>

            {/* Cuentas */}
            <Link
              href="/cuentas"
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-4 min-h-[200px]"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition">
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-primary transition">
                Cuentas
              </h2>
            </Link>
          </div>
        </div>

        {/* Botón de Añadir Movimiento */}
        <div className="w-full max-w-4xl flex justify-center pt-8">
          <AddTransactionButton
            accounts={accounts}
            categories={categories}
            mode="expenses"
            variant="default"
            className="px-8 py-4 shadow-md hover:shadow-lg font-semibold text-lg"
          />
        </div>
      </main>

      <ToastNotification />
    </div>
  )
}
