'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { Dashboard } from "@/src/components/vista-mensual/dashboard"
import { VistaMensualHeader } from "@/src/components/vista-mensual/vista-mensual-header"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import { Header } from "@/src/components/menu-principal/header"
import { getAccounts } from '@/src/actions/get-accounts-action'
import { Account } from '@/src/types/account-types'
import { getCategories } from '@/src/actions/get-categories-action'
import { Category } from '@/src/types/category-types'
import { UserSchema } from '@/src/schemas'

type User = z.infer<typeof UserSchema>

interface VistaMensualPageClientProps {
  user?: User | null
}

/**
 * Componente principal de la página de Vista Mensual.
 * Gestiona el estado global de la vista (tipo de vista, año, modales)
 * y organiza la estructura de los componentes hijos.
 */
export function VistaMensualPageClient({ user }: VistaMensualPageClientProps) {
  // Determina si se visualizan gastos o ingresos en el dashboard
  const [mode, setMode] = useState<"expenses" | "incomes">("expenses")

  // Año actual seleccionado para filtrar los datos -> es el año con el que se hacen las consultas, no el que se muestra en el filtro de la cabecera
  const [actualYear, setActualYear] = useState(new Date().getFullYear())

  // Cuentas del usuario (se cargan al montar el componente)
  const [accounts, setAccounts] = useState<Account[]>([])
  
  // Categorías del usuario (se cargan al montar el componente)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Resetear datos si no hay usuario
    if (!user) {
      setAccounts([])
      setCategories([])
      return
    }
    
    // Cargar datos cuando hay usuario o cambia el usuario
    getAccounts().then(data => setAccounts(data))
    getCategories().then(data => setCategories(data))
  }, [user?.userId])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header con navegación y autenticación */}
      <Header user={user} />

      {/* Contenido principal */}
      <div className="flex-1 p-10 overflow-hidden">
        {/* En este div está el contenido que se ve a simple vista */}
        <div className="h-full flex flex-col">
          {/* 
            Cabecera con controles de navegación:
            - Botón de volver (onBack)
            - Título
            - Selector entre Gastos/Ingresos (mode)
            - Selector de año (actualYear)
          */}
          <VistaMensualHeader
          mode={mode}
          setMode={setMode}
          actualYear={actualYear}
          setActualYear={setActualYear}
        />


        {/* 
          Contenedor principal del dashboard:
          - Se pasa el modo (expenses/incomes) y el año actual
          - evita que el scroll esté fuera de la tabla, se ajusta al tamaño disponible automáticamente
        */}
        <main className="flex-1 overflow-hidden">
          <Dashboard mode={mode} actualYear={actualYear} />
        </main>

        <footer className="h-10 mt-4 flex justify-end shrink-0">
          {/* 
            Modal para añadir nuevos movimientos:
            - onCancel: cierra el modal sin guardar cambios
            - onAccept: cerrará el modal tras guardar (lógica pendiente de implementar)
            - Se pasan las cuentas y categorías para que el modal pueda mostrar opciones de selección
            - mode: se pasa el modo actual para que el botón aparezca por defecto del tipo correcto (gasto o ingreso)
          */}
          <AddTransactionButton
            accounts={accounts}
            categories={categories}
            mode={mode}
            // TODO: Implementar lógica de refresco tras guardar
            onTransactionAdded={() => { console.log('Transacción añadida, refrescar dashboard...') }}
          />
        </footer>
      </div>
      </div>
    </div>
  )
}