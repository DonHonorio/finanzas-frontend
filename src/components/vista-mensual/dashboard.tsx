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
import { EditCategoryModal } from './edit-category-modal'
import { ViewCategoryModal } from './view-category-modal'
import { MobileCategoryView } from './mobile-category-view'
import { useDashboardData } from '@/src/hooks/use-dashboard-data'
import { useResponsive } from '@/src/hooks/use-responsive'
import { formatCurrency, formatCompact, months } from '@/src/lib/utils'
import { DataLoading } from '../ui/data-loading'
import { DataError } from '../ui/data-error'
import { NoData } from '../ui/no-data'
import { useLocale, useTranslations } from 'next-intl'

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
export function Dashboard({
    mode,
    actualYear,
    // Identificador de sesión/usuario para segmentar caché del dashboard.
    userCacheKey
}: {
    mode: "expenses" | "incomes"
    actualYear: number
    userCacheKey: string
}) {
    const t = useTranslations("Dashboard")
    const tMonth = useTranslations("MonthShort")
    const locale = useLocale()

    // Srive para mostrar el tipo de dato en la UI
    const tipoDato = mode === "expenses" ? t("expenses") : t("incomes")

    // Estados para gestionar los modales de vista/edición de categorías
    // Para abrir un modal en una categoría específica
    const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null)
    const [modalType, setModalType] = useState<"view" | "edit" | null>(null)

    // Hook personalizado para obtener datos del dashboard con SWR
    // Incluye mutación para reintentar peticiones en caso de error
    const { data = [], isLoading, error, mutate } = useDashboardData(mode, actualYear, userCacheKey)

    // Detecta el breakpoint actual (con debounce) para adaptar la vista
    const { isMobile, isTablet } = useResponsive()

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
    }, [data, mode, isLoading, tipoDato])

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
     * En modo tablet (isTablet) usa formatCompact para que los valores quepan en columnas estrechas
     */
    const columns = useMemo<ColumnDef<CategoryRow>[]>(() => [
        {
            accessorKey: categoryColumnTitle, // key de la columna
            header: t("categories"), // Título que ve el usuario
            meta: {
                align: 'center' // estilo aplicado
            }
        },
        {
            accessorKey: 'budget',
            header: t("budget"),
            // Formatea el valor numérico como moneda
            cell: info => isTablet
                ? formatCompact(info.getValue<number>())
                : formatCurrency(info.getValue<number>(), { locale }),
        },
        // Genera columnas dinámicas para cada mes
        ...months.map(month => ({
            id: month, // 'enero', 'febrero'...
            header: tMonth(month), // poniendo en mayúscula el título de columnas
            // Función para acceder al valor del mes en el objeto months, es decir -> busca un accessorKey en las claves del objeto months del array de categories
            accessorFn: row => row.months[month],
            cell: info => isTablet
                ? formatCompact(info.getValue<number>())
                : formatCurrency(info.getValue<number>(), { locale }),
        } as ColumnDef<CategoryRow>)),
    ], [t, tMonth, isTablet, locale])

    /**
     * Instancia de react-table que maneja la lógica de la tabla
     * Se pasa data directamente, useReactTable maneja el estado vacío internamente
     */
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: data, // useReactTable maneja data vacía internamente
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false
    })

    return (
        <div className="h-full flex flex-col border border-border rounded-lg overflow-hidden">

            {/* Vista de tarjetas para móvil (<768px) — sustituye completamente a la tabla */}
            {isMobile ? (
                <>
                    {isLoading ? (
                        <DataLoading label={tipoDato} />
                    ) : error ? (
                        <DataError
                            label={tipoDato}
                            year={actualYear}
                            isRetrying={isLoading}
                            onRetry={() => mutate()}
                            error={error}
                        />
                    ) : data.length === 0 ? (
                        <NoData label={tipoDato} year={actualYear} />
                    ) : (
                        <MobileCategoryView data={data} mode={mode} mutate={mutate} />
                    )}
                </>
            ) : (
                <>
                    {/* Cabecera de la tabla - fija en la parte superior */}
                    {/* compact=true en tablet reduce padding y tamaño de fuente */}
                    <div className="shrink-0">
                        <TableHeader table={table} compact={isTablet} />
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
                            <TableBody table={table} onView={handleView} onEdit={handleEdit} compact={isTablet} />
                        )}
                    </div>

                    {/* Pie de tabla con totales - fijo en la parte inferior */}
                    <div className="shrink-0">
                        {/* sticky bottom-0 z-10 - Esperando a que ocurra algún problema para aplicar este código a la clase del div */}
                        <TableFooter table={table} data={isLoading ? [] : data} compact={isTablet} />
                    </div>

                    {/* Modal para visualizar detalles de categoría */}
                    {modalType === "view" && selectedCategory && (
                        <ViewCategoryModal
                            open={modalType === "view"} // Se envía open como true para que el componente "Modal" básico (del cual está formado ViewCategoryModal) se pueda abrir
                            category={selectedCategory}
                            onCancel={handleCloseModal}
                            onDataChanged={mutate}
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
                </>
            )}

        </div>
    )
}
