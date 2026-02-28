'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useSWRConfig } from 'swr'
import { Dashboard } from "@/src/components/vista-mensual/dashboard"
import { VistaMensualHeader } from "@/src/components/vista-mensual/vista-mensual-header"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import { AddCategoryModal } from "@/src/components/vista-mensual/add-category-modal"
import { Header } from "@/src/components/menu-principal/header"
import { getAccounts } from '@/src/data-layer/accounts'
import { Account } from '@/src/types/account-types'
import { getCategories } from '@/src/data-layer/categories'
import { Category } from '@/src/types/category-types'
import { UserSchema } from '@/src/schemas'
import { useResolvedSessionUser } from "@/src/hooks/use-resolved-session-user"
import { useTranslations } from 'next-intl'

type User = z.infer<typeof UserSchema>

interface VistaMensualPageClientProps {
  user?: User | null
  source?: "backend" | "local" | "none"
}

/**
 * Componente principal de la página de Vista Mensual.
 * Gestiona el estado global de la vista (tipo de vista, año, modales)
 * y organiza la estructura de los componentes hijos.
 */
export function VistaMensualPageClient({ user, source }: VistaMensualPageClientProps) {
  const t = useTranslations("Dashboard")
  const { mutate: globalMutate } = useSWRConfig()

  // Usuario efectivo según origen de sesión (backend/local).
  const resolvedUser = useResolvedSessionUser(user, source)
  // Aísla caché SWR por sesión+usuario para evitar mezclas entre login/local/backend.
  const dashboardUserCacheKey = `${source ?? "none"}:${resolvedUser?.userId ?? "anonymous"}`
  // Determina si se visualizan gastos o ingresos en el dashboard
  const [mode, setMode] = useState<"expenses" | "incomes">("expenses")

  // Año actual seleccionado para filtrar los datos -> es el año con el que se hacen las consultas, no el que se muestra en el filtro de la cabecera
  const [actualYear, setActualYear] = useState(new Date().getFullYear())

  // Cuentas del usuario (se cargan al montar el componente)
  const [accounts, setAccounts] = useState<Account[]>([])

  // Categorías del usuario (se cargan al montar el componente)
  const [categories, setCategories] = useState<Category[]>([])
  const availableAccounts = resolvedUser ? accounts : []
  const availableCategories = resolvedUser ? categories : []

  // Estado del modal de añadir categoría (movido aquí desde el Dashboard)
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)

  useEffect(() => {
    if (!resolvedUser?.userId) {
      return
    }

    // Cargar datos cuando hay usuario o cambia el usuario
    // Carga vía data-layer para mantener compatibilidad local/backend.
    getAccounts().then(data => setAccounts(data))
    getCategories().then(data => setCategories(data))
  }, [resolvedUser?.userId])

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-gray-50">
      {/* Header con navegación y autenticación */}
      <Header user={resolvedUser} source={source} />

      {/* Contenido principal */}
      <div className="flex-1 min-h-0 p-3 sm:p-5 md:p-8 lg:p-10 overflow-hidden">
        {/* En este div está el contenido que se ve a simple vista */}
        <div className="h-full min-h-0 flex flex-col">
          {/*
            Cabecera con controles de navegación:
            - Botón de volver (onBack)
            - Título
            - Selector entre Gastos/Ingresos (mode)
            - Selector de año (actualYear)
          */}
          <div className="shrink-0">
            <VistaMensualHeader
              mode={mode}
              setMode={setMode}
              actualYear={actualYear}
              setActualYear={setActualYear}
            />
          </div>


        {/*
          Contenedor principal del dashboard:
          - Se pasa el modo (expenses/incomes) y el año actual
          - evita que el scroll esté fuera de la tabla, se ajusta al tamaño disponible automáticamente
        */}
        <main className="flex-1 min-h-0 overflow-hidden">
          <Dashboard mode={mode} actualYear={actualYear} userCacheKey={dashboardUserCacheKey} />
        </main>

        {/* Footer: botones en extremos y alineados verticalmente */}
        <footer className="mt-4 shrink-0 flex items-center justify-between gap-3">
          {/* Botón añadir categoría */}
          <button
            onClick={() => setOpenAddCategoryModal(true)}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg px-4 sm:px-5 py-2 whitespace-nowrap transition-colors select-none"
          >
            <span className="text-base leading-none">＋</span>
            {t("addCategory")}
          </button>

          {/* Botón añadir transacción */}
          <AddTransactionButton
            accounts={availableAccounts}
            categories={availableCategories}
            mode={mode}
            className="whitespace-nowrap"
            // TODO: Implementar lógica de refresco tras guardar
            onTransactionAdded={() => { console.log('Transacción añadida, refrescar dashboard...') }}
          />
        </footer>

        {/* Modal añadir categoría — comparte mutate global para refrescar el dashboard */}
        <AddCategoryModal
          open={openAddCategoryModal}
          onCancel={() => setOpenAddCategoryModal(false)}
          onAccept={() => {
            setOpenAddCategoryModal(false)
            void globalMutate(
              (key) => Array.isArray(key) && key[0] === 'dashboard',
              undefined,
              { revalidate: true }
            )
          }}
          mode={mode}
        />
      </div>
      </div>
    </div>
  )
}
