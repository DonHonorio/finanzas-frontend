'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    ColumnDef, getCoreRowModel,
    useReactTable
} from '@tanstack/react-table'
import { CategoryRow } from '@/src/types/dashboard-types'
import { TableBody } from './table-body'
import { TableFooter } from './table-footer'
import { TableHeader } from './table-header'
import { AddCategoryModal } from './add-category-modal'
import { EditCategoryModal } from './edit-category-modal'
import { ViewCategoryModal } from './view-category-modal'
import { useDashboardData } from '@/src/hooks/use-dashboard-data'
import { formatCurrency, months } from '@/src/lib/utils'
import { DataLoading } from '../ui/data-loading'
import { DataError } from '../ui/data-error'
import { NoData } from '../ui/no-data'

/**
 * Nombre del campo que se usará como título de la primera columna llamada: 'categoría' en la tabla
 * Centralizado aquí porque actua como key y facilitar cambios futuros (ej: cambiar de 'name' a 'nombre')
 * También es importante porque se relaciona automaticamente con los datos recibidos del backend
 */
export const categoryColumnTitle = 'name'

/**
 * Componente principal del Dashboard que muestra datos de gastos/ingresos
 * Gestiona la tabla de datos, modales y estados de carga/error
 */
export function Dashboard({ mode, actualYear }: { mode: "expenses" | "incomes", actualYear: number }) {
    // Estado para controlar la apertura del modal de añadir categoría
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)

    // Srive para mostrar el tipo de dato en la UI 
    const tipoDato = mode === "expenses" ? "gastos" : "ingresos"

    // Estados para gestionar los modales de vista/edición de categorías
    // Para abrir un modal en una categoría específica
    const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null)
    const [modalType, setModalType] = useState<"view" | "edit" | null>(null)

    // Hook personalizado para obtener datos del dashboard con SWR
    // Incluye mutación para reintentar peticiones en caso de error
    const { data = [], isLoading, error, mutate } = useDashboardData(mode, actualYear);

    /**
     * Efecto para logging de datos (solo en desarrollo)
     * Se ejecuta cuando cambian los datos, el modo o el estado de carga
     * Solo muestra logs cuando hay datos reales cargados
     */
    useEffect(() => {
        // Solo loguear cuando realmente haya datos
        if (data.length > 0 && !isLoading && process.env.NODE_ENV === 'development') {
            console.log(`📊 Datos actuales (${tipoDato}):`, data.length, 'registros')
            console.log('Data: ', data)
        }
    }, [data, mode, isLoading])

    // Log de errores en consola para debugging
    if (error) {
        console.error('Error en SWR:', error)
    }


    // Maneja la apertura del "modal de visualización" para una categoría
    const handleView = (category: CategoryRow) => { // Se le pasa el objeto categoría completo
        setSelectedCategory(category)
        setModalType("view")
    }

    // Maneja la apertura del "modal de edición" para una categoría
    const handleEdit = (category: CategoryRow) => {
        setSelectedCategory(category)
        setModalType("edit")
    }

    // Cierra cualquier modal abierto y limpia la categoría seleccionada
    const handleCloseModal = () => {
        setModalType(null)
        setSelectedCategory(null)
    }

    /**
     * Definición de columnas para react-table usando useMemo
     * Se memoiza para evitar recreación en cada render
     * Incluye columna de categoría, presupuesto y las 12 columnas mensuales
     */
    const columns = useMemo<ColumnDef<CategoryRow>[]>(() => [
        {
            accessorKey: categoryColumnTitle, // key de la columna
            header: 'CATEGORÍAS', // Título que ve el usuario
            meta: {
                align: 'center' // estilo aplicado
            }
        },
        {
            accessorKey: 'budget',
            header: 'PRESUPUESTO',
            // Formatea el valor numérico como moneda
            cell: info => formatCurrency(info.getValue<number>()), // estilo aplicado a las celdas de esta columna (ahorrando hacerlo después)
        },
        // Genera columnas dinámicas para cada mes
        ...months.map(month => ({
            id: month, // 'enero', 'febrero'...
            header: month.toUpperCase(), // poniendo en mayúscula el título de columnas
            // Función para acceder al valor del mes en el objeto months, es decir -> busca un accessorKey en las claves del objeto months del array de categories
            accessorFn: row => row.months[month],
            cell: info => formatCurrency(info.getValue<number>()),
        } as ColumnDef<CategoryRow>)),
    ], [])

    /**
     * Instancia de react-table que maneja la lógica de la tabla
     * Se pasa data directamente, useReactTable maneja el estado vacío internamente
     */
    const table = useReactTable({
        data: data, // useReactTable maneja data vacía internamente
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false
    })

    return (
        <div className="h-full flex flex-col border border-border rounded-lg overflow-hidden">

            {/* Cabecera de la tabla - fija en la parte superior */}
            <div className="shrink-0">
                <TableHeader table={table} />
            </div>

            {/* Cuerpo principal de la tabla - área desplazable */}
            {/* Se muestran los posibles estados en los que se encuentra el dashboard */}
            <div className="flex-1 overflow-auto no-scrollbar">
                {isLoading ? (
                    // Estado de carga
                    <DataLoading label={tipoDato} />
                ) : error ? (
                    // Estado de error con opción de reintentar
                    <DataError
                        label={tipoDato}
                        year={actualYear}
                        isRetrying={isLoading}
                        onRetry={() => mutate()}
                        error={error}
                    />
                ) : data.length === 0 ? (
                    // Estado sin datos
                    <NoData label={tipoDato} year={actualYear} />
                ) : (
                    // Estado con datos - renderiza la tabla
                    <TableBody table={table} onView={handleView} onEdit={handleEdit} />
                )}
            </div>

            {/* Botón para añadir nueva categoría - separador visual */}
            <div className="shrink-0 border-t border-border bg-sidebar-accent px-4 py-3">
                <button
                    onClick={() => setOpenAddCategoryModal(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 select-none"
                >
                    <span className="text-lg">＋</span>
                    Añadir categoría
                </button>
            </div>

            {/* Modal para añadir nueva categoría */}
            <AddCategoryModal
                open={openAddCategoryModal}
                onCancel={() => setOpenAddCategoryModal(false)}
                onAccept={() => {
                    mutate() // Refresca los datos del dashboard después de añadir una categoría
                    setOpenAddCategoryModal(false)
                }}
                mode={mode}
            />

            {/* Modal para visualizar detalles de categoría */}
            {modalType === "view" && selectedCategory && (
                <ViewCategoryModal
                    open={modalType === "view"} // Se envía open como true para que el componente "Modal" básico (del cual está formado ViewCategoryModal) se pueda abrir
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                />
            )}

            {/* Modal para editar categoría existente */}
            {modalType === "edit" && selectedCategory && (
                <EditCategoryModal
                    open={modalType === "edit"}
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                    onAccept={() => {
                        mutate() // Refresca los datos del dashboard después de editar una categoría
                        handleCloseModal()
                    }}
                />
            )}

            {/* Pie de tabla con totales - fijo en la parte inferior */}
            <div className="shrink-0">
                {/* sticky bottom-0 z-10 - Esperando a que ocurra algún problema para aplicar este código a la clase del div */}
                <TableFooter table={table} data={isLoading ? [] : data} />
            </div>

        </div>
    )
}