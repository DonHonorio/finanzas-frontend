'use client'

import { useMemo, useState } from 'react'
import {
    ColumnDef, getCoreRowModel,
    useReactTable
} from '@tanstack/react-table'
import { CategoryRow, Month } from '@/src/types/dashboard-types'
import { TableBody } from './table-body'
import { TableFooter } from './table-footer'
import { TableHeader } from './table-header'
import { AddCategoryModal } from './add-category-modal'
import { EditCategoryModal } from './edit-category-button'
import { ViewCategoryModal } from './view-category-modal'
import useSWR from 'swr'

export const months: Month[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(value)
}

export const columnWidths: Record<string, string> = {
    category: '13%',
    budget: '5%',
    enero: '6%',
    febrero: '6%',
    marzo: '6%',
    abril: '6%',
    mayo: '6%',
    junio: '6%',
    julio: '6%',
    agosto: '6%',
    septiembre: '6%',
    octubre: '6%',
    noviembre: '6%',
    diciembre: '6%',
}

export const getCellColor = (value: number, budget: number, isExpense: boolean) => {
    if (value === 0) return "bg-muted/30"
    if (budget === 0) return "bg-secondary/30" // Light yellow

    if (isExpense) {
        if (value > budget) return "bg-accent/40 text-foreground" // Medium yellow for over budget
        return "bg-secondary/30 text-foreground" // Light yellow for within budget
    }

    return "bg-accent/40 text-foreground" // Medium yellow for income
}

const fetcher = (url: string) => fetch(url).then(res => res.json()).then(data => data.categories)

export function Dashboard({ mode }: { mode: "expenses" | "incomes" }) {
    const [openModal, setOpenModal] = useState(false)
    
    const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null)
    const [modalType, setModalType] = useState<"view" | "edit" | null>(null)

    const { data = [], isLoading } = useSWR<CategoryRow[]>(`/api/dashboard/${mode}`, fetcher, {
        keepPreviousData: true, // ✅ mantiene tabla anterior mientras carga la nueva
    })

    const handleView = (category: CategoryRow) => {
        setSelectedCategory(category)
        setModalType("view")
    }

    const handleEdit = (category: CategoryRow) => {
        setSelectedCategory(category)
        setModalType("edit")
    }

    const handleCloseModal = () => {
        setModalType(null)
        setSelectedCategory(null)
    }

    const columns = useMemo<ColumnDef<CategoryRow>[]>(() => [
        {
            accessorKey: 'category',
            header: 'CATEGORÍAS',
            meta: {
                align: 'center'
            }
        },
        {
            accessorKey: 'budget',
            header: 'PRESUPUESTO',
            cell: info => formatCurrency(info.getValue<number>()),
        },
        ...months.map(month => ({
            id: month,
            header: month.toUpperCase(),
            accessorFn: row => row.months[month],
            cell: info => formatCurrency(info.getValue<number>()),
        } as ColumnDef<CategoryRow>)),
    ], [])

    const table = useReactTable({
        data: data ?? [], // Si no hay data aún, pasamos [
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false
    })

    return (
        <div className="h-full flex flex-col border border-border rounded-lg overflow-hidden">

            {/* HEADER */}
            <div className="shrink-0">
                <TableHeader table={table} />
            </div>

            {/* BODY (scrollable) */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="p-10 text-center text-muted-foreground">Cargando {mode}...</div>
                ) : (
                    <TableBody table={table} onView={handleView} onEdit={handleEdit} />
                )}
            </div>

            {/* BOTÓN SEPARADOR */}
            <div className="shrink-0 border-t border-border bg-sidebar-accent px-4 py-3">
                <button
                    onClick={() => setOpenModal(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 select-none"
                >
                    <span className="text-lg">＋</span>
                    Añadir categoría
                </button>
            </div>

            {/* MODAL */}
            <AddCategoryModal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onAccept={() => {
                    setOpenModal(false)
                    // aquí meterás luego el submit
                }}
            />

            {modalType === "view" && selectedCategory && (
                <ViewCategoryModal
                    open={modalType === "view"}
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                />
            )}

            {modalType === "edit" && selectedCategory && (
                <EditCategoryModal
                    open={modalType === "edit"}
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                    onAccept={() => {
                        // lógica de guardar
                        handleCloseModal()
                    }}
                />
            )}

            {/* FOOTER (fixed abajo) */}
            <div className="shrink-0 sticky bottom-0 z-10">
                <TableFooter table={table} data={isLoading ? [] : data} />
            </div>

        </div>
    )
}

