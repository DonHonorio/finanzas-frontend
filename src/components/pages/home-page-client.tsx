'use client'

import Link from "next/link"
import { CalendarDays, TrendingUp, PiggyBank, CreditCard } from "lucide-react"
import { z } from 'zod'
import { Header } from "@/src/components/menu-principal/header"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import ToastNotification from "@/src/components/ui/ToastNotification"
import { useState, useEffect } from "react"
import { getAccounts } from "@/src/actions/get-accounts-action"
import { getCategories } from "@/src/actions/get-categories-action"
import { Account } from "@/src/types/account-types"
import { Category } from "@/src/types/category-types"
import { UserSchema } from '@/src/schemas'

type User = z.infer<typeof UserSchema>

interface HomePageClientProps {
  user?: User | null
}

// Página principal del frontend, con enlaces a las diferentes secciones de la aplicación
export function HomePageClient({ user }: HomePageClientProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getAccounts().then(setAccounts)
    getCategories().then(setCategories)
  }, [])

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <Header user={user} />

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
