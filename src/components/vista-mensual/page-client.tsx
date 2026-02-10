'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from "@/src/components/vista-mensual/dashboard"
import { VistaMensualHeader } from "@/src/components/vista-mensual/vista-mensual-header"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import { EditTransactionModal } from './edit-transaction-modal'
import { getAccounts } from '@/src/actions/get-accounts-action'
import { Account } from '@/src/types/account-types'
import { getCategories } from '@/src/actions/get-categories-action'
import { Category } from '@/src/types/category-types'

/**
 * Componente principal de la página de Vista Mensual.
 * Gestiona el estado global de la vista (tipo de vista, año, modales)
 * y organiza la estructura de los componentes hijos.
 */
export function VistaMensualPageClient() {
  // Controla la apertura/cierre del modal para añadir movimientos
  const [openEditModal, setOpenEditModal] = useState(false)

  // Determina si se visualizan gastos o ingresos en el dashboard
  const [mode, setMode] = useState<"expenses" | "incomes">("expenses")

  // Año actual seleccionado para filtrar los datos -> es el año con el que se hacen las consultas, no el que se muestra en el filtro de la cabecera
  const [actualYear, setActualYear] = useState(new Date().getFullYear())

  // Cuentas del usuario (se cargan al montar el componente)
  const [accounts, setAccounts] = useState<Account[]>([])
  
  // Categorías del usuario (se cargan al montar el componente)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Cargar cuentas en background
    getAccounts().then(data => setAccounts(data))
    // Cargar categorías en background
    getCategories().then(data => setCategories(data))
  }, [])

  return (
    <div className="h-screen p-10">

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

        {/* 
          Pie de página con acción principal:
          - Botón para abrir el modal de creación de movimientos
          - Usa clases de Tailwind para diseño responsive y estilos visuales
        */}
        <footer className="h-10 mt-4 flex justify-end shrink-0">
          <button
            onClick={() => setOpenEditModal(true)}
            className="w-60 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg rounded-lg transition select-none mr-4"
          >
            Editar Movimiento (Demo)
          </button>
          
          <AddTransactionButton
            accounts={accounts}
            categories={categories}
            mode={mode}
            // TODO: Implementar lógica de refresco tras guardar
            onTransactionAdded={() => { console.log('Transacción añadida, refrescar dashboard...') }}
          />
        </footer>
      </div>


      {/* 
        Modal para añadir nuevos movimientos:
        - Controlado por el estado 'openModal'
        - onCancel: cierra el modal sin guardar cambios
        - onAccept: cerrará el modal tras guardar (lógica pendiente de implementar)
        - Se pasan las cuentas y categorías para que el modal pueda mostrar opciones de selección
        - mode: se pasa el modo actual para que el botón aparezcomo por defecto del tipo correcto (gasto o ingreso)
      */}
      <EditTransactionModal
        open={openEditModal}
        transaction={{
            "transactionId": "190",
            "name": "Prueba",
            "date": "2025-01-22T00:00:00.000Z",
            "amount": 1459.61,
            "description": "Ingreso recurrente",
            "type": "income",
            "currency": "JPY",
            "createdAt": "2026-01-29T15:25:33.000Z",
            "updatedAt": "2026-01-29T15:25:33.000Z",
            "accountId": "5",
            "categoryId": "15"
        }}
        accounts={accounts}
        categories={categories}
        onCancel={() => setOpenEditModal(false)}
        onAccept={() => {
          setOpenEditModal(false)
          // TODO: Implementar lógica de edición del movimiento
        }}
        mode={mode}
      />
    </div>
  )
}