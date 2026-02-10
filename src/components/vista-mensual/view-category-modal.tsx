'use client'

import { Modal } from "@/src/components/ui/modal"
import { CategoryRow } from "@/src/types/dashboard-types"
import { Category } from "@/src/types/category-types"
import { useEffect, useState, useRef } from "react"
import { getAccounts } from "@/src/actions/get-accounts-action"
import { getCategories } from "@/src/actions/get-categories-action"
import { Account } from "@/src/types/account-types"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import { Transaction } from "@/src/types/transaction-types"
import { EditTransactionModal } from "./edit-transaction-modal"
import deleteTransaction from "@/src/actions/delete-transaction-action"
import { toast } from "react-toastify"
import { CategoryTableHeader } from "../vista-category/category-table-header"
import { CategoryTableRows } from "../vista-category/category-table-rows"
import { DeleteTransactionModal } from "@/src/components/ui/delete-transaction-modal"
import { useCategoryData } from "@/src/hooks/use-category-data"
import { ColumnConfig } from "@/src/types/general-types"

type Props = {
    open: boolean
    category: CategoryRow
    onCancel: () => void
}

// Configuración en PORCENTAJES (suma aproximada < 90% para compensar el gap-2 y paddings)
const COLUMNS_SETUP: ColumnConfig[] = [
    { initial: 4, min: 3 },     // 0: Fecha
    { initial: 19, min: 8 },   // 1: Nombre
    { initial: 6, min: 4 },     // 2: Presupuesto
    ...Array(12).fill({ initial: 5, min: 2 }), // 3-14: Meses (4.5 * 12 = 54)
    { initial: 6, min: 3 }      // 15: Total
]
// Suma total: 6 + 18 + 6 + 54 + 6 = 90%

export function ViewCategoryModal({ open, category, onCancel }: Props) {
    const { items, loading, fetchCategoryData, sortItems } = useCategoryData(category)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [colWidths, setColWidths] = useState<number[]>(COLUMNS_SETUP.map(c => c.initial))
    const resizingRef = useRef<{ index: number, startX: number, startWidth: number, otherWidthsSum: number } | null>(null)
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const [accounts, setAccounts] = useState<Account[]>([])
    const [allCategories, setAllCategories] = useState<Category[]>([])
    
    // Estado para edición y eliminación
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (open) {
            getAccounts().then(setAccounts)
            getCategories().then(setAllCategories)
        }
        if (open && category.categoryId) {
            fetchCategoryData()
        }
    }, [open, category.categoryId])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingRef.current || !tableContainerRef.current) return
            
            const { index, startX, startWidth, otherWidthsSum } = resizingRef.current
            const containerWidth = tableContainerRef.current.clientWidth
            
            // Calculamos el ancho del contenido real restando el padding horizontal (px-6 = 24px * 2 = 48px)
            const contentWidth = containerWidth - 48
            
            // Convertir diferencia de píxeles a porcentaje relativo al contenido
            const diffPixel = e.clientX - startX
            const diffPercent = (diffPixel / contentWidth) * 100
            
            const minWidth = COLUMNS_SETUP[index]?.min ?? 2
            
            // Cálculo del límite máximo
            // Restamos el espacio ocupado por los gaps (15 gaps de 0.5rem/8px) convertido a porcentaje
            const gapsPx = 15 * 8
            const gapsPercent = (gapsPx / contentWidth) * 100
            
            // El nuevo ancho no debe hacer que la suma total supere el 100% (menos gaps y un pequeño margen de seguridad)
            const maxAllowedTotal = 100 - gapsPercent - 0.1
            const maxWidth = Math.max(minWidth, maxAllowedTotal - otherWidthsSum)
            
            const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + diffPercent))

            setColWidths(prev => {
                const next = [...prev]
                next[index] = newWidth
                return next
            })
        }

        const handleMouseUp = () => {
             if (resizingRef.current) {
                resizingRef.current = null
                document.body.style.cursor = ''
             }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const startResize = (index: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Sumar el ancho de todas las columnas EXCEPTO la que estamos redimensionando
        const otherWidthsSum = colWidths.reduce((sum, w, i) => i === index ? sum : sum + w, 0)
        
        resizingRef.current = {
            index,
            startX: e.clientX,
            startWidth: colWidths[index],
            otherWidthsSum
        }
        document.body.style.cursor = 'col-resize'
    }

    const handleDelete = async () => {
        if (!deletingId) return
        
        setIsDeleting(true)
        try {
            const formData = new FormData()
            formData.append('transactionId', deletingId)
            formData.append('categoryId', category.categoryId.toString())
            
            const result = await deleteTransaction({ errors: [], success: '' }, formData)
            
            if (result?.errors && result.errors.length > 0) {
                toast.error(result.errors[0])
            } else {
                toast.success('Transacción eliminada correctamente')
                setDeletingId(null)
                fetchCategoryData()
            }
        } catch (error) {
            console.error('Error deleting transaction:', error)
            toast.error('Error al eliminar la transacción')
        } finally {
            setIsDeleting(false)
        }
    }

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        sortItems(sortOrder === 'asc' ? 'desc' : 'asc')
    }

    const gridStyle = {
        gridTemplateColumns: colWidths.map(w => `${w}%`).join(' ')
    }

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            className="w-[90vw] h-[85vh] rounded-2xl overflow-hidden flex flex-col relative"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b shrink-0">
                <div className="flex items-center gap-10">
                    {/* Título */}
                    <h2 className="text-2xl font-semibold flex items-center gap-3">
                        <span className="text-3xl">{category.icon}</span>
                        {category.name} (x{items.length})
                    </h2>
                    
                    <AddTransactionButton
                        accounts={accounts}
                        categories={allCategories}
                        mode={category.type === 'expense' ? 'expenses' : 'incomes'}
                        onTransactionAdded={fetchCategoryData}
                        variant="default"
                        className="w-auto px-4 py-2 text-sm h-9"
                        defaultCategoryId={category.categoryId}
                    />
                </div>

                {/* Botón de Cerrar */}
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                    ×
                </button>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white relative" ref={tableContainerRef}>
                {loading ? (
                    /* Estado de Carga */
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Cargando...</p>
                    </div>
                ) : items.length === 0 ? (
                    /* Estado Vacío */
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No hay transacciones ni subcategorías</p>
                    </div>
                ) : (
                    /* Contenido de la Tabla */
                    <div className="min-w-fit">
                        <CategoryTableHeader 
                            gridStyle={gridStyle}
                            sortOrder={sortOrder}
                            onToggleSort={toggleSort}
                            onStartResize={startResize}
                        />
                        
                        <CategoryTableRows 
                            items={items}
                            gridStyle={gridStyle}
                            onEditTransaction={setEditingTransaction}
                            onDeleteTransaction={setDeletingId}
                        />
                    </div>
                )}
            </div>

            {/* Modal de Edición */}
            {editingTransaction && (
                <EditTransactionModal
                    open={true}
                    transaction={editingTransaction}
                    accounts={accounts}
                    categories={allCategories}
                    onCancel={() => setEditingTransaction(null)}
                    onAccept={() => {
                        setEditingTransaction(null)
                        fetchCategoryData()
                    }}
                    mode={category.type === 'expense' ? 'expenses' : 'incomes'}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            <DeleteTransactionModal
                isOpen={!!deletingId}
                isDeleting={isDeleting}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleDelete}
            />
        </Modal>
    )
}
