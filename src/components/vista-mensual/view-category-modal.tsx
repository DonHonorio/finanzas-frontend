'use client'

import { Modal } from "@/src/components/ui/modal"
import { CategoryRow } from "@/src/types/dashboard-types"
import { Category } from "@/src/types/category-types"
import { useEffect, useState } from "react"
import { getAccounts } from "@/src/data-layer/accounts"
import { getCategories } from "@/src/data-layer/categories"
import { Account } from "@/src/types/account-types"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import { Transaction } from "@/src/types/transaction-types"
import { EditTransactionModal } from "./edit-transaction-modal"
import { deleteTransaction } from "@/src/data-layer/transactions"
import { toast } from "react-toastify"
import { CategoryTableHeader } from "../vista-category/category-table-header"
import { CategoryTableRows } from "../vista-category/category-table-rows"
import { DeleteTransactionModal } from "@/src/components/ui/delete-transaction-modal"
import { useCategoryData } from "@/src/hooks/use-category-data"
import { ColumnConfig } from "@/src/types/general-types"
import { AddSubcategoryModal } from "./add-subcategory-modal"
import { useColumnResize } from "@/src/hooks/use-column-resize"
import { EditSubcategoryModal } from "./edit-subcategory-modal"
import { Subcategory } from "@/src/types/category-types"
import { ViewSubcategoryModal } from "./view-subcategory-modal"
import { CloseButton } from "@/src/components/ui/close-button"

type Props = {
    open: boolean
    category: CategoryRow
    onCancel: () => void
    onDataChanged?: () => void
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

export function ViewCategoryModal({ open, category, onCancel, onDataChanged }: Props) {
    const { items, loading, fetchCategoryData, sortItems } = useCategoryData(category)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const { colWidths, tableContainerRef, startResize } = useColumnResize(COLUMNS_SETUP)

    const [accounts, setAccounts] = useState<Account[]>([])
    const [allCategories, setAllCategories] = useState<Category[]>([])
    
    // Estado para edición y eliminación
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    
    // Estado para subcategorías
    const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false)
    // sirve para mostrar el modal de edición de subcategoría al hacer click en el icono de lápiz de una subcategoría, se le pasa la subcategoría que se quiere editar
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
    // sirve para mostrar el modal vista de subcategoría al hacer click en el icono de ojo de una subcategoría, se le pasa la subcategoría que se quiere ver
    const [viewingSubcategory, setViewingSubcategory] = useState<Subcategory | null>(null)

    // Extraer subcategorías de items para pasarlas al formulario
    const subcategories = items
        .filter(item => item.type === 'subcategory' && item.originalSubcategory)
        .map(item => item.originalSubcategory!)

    useEffect(() => {
        if (open) {
            getAccounts().then(setAccounts)
            getCategories().then(setAllCategories)
        }
        if (open && category.categoryId) {
            fetchCategoryData()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, category.categoryId])

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
                onDataChanged?.()
            }
        } catch (error) {
            console.error('Error deleting transaction:', error)
            toast.error('Error al eliminar la transacción')
        } finally {
            setIsDeleting(false)
        }
    }

    // Alterna el orden de clasificación de las transacciones
    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        sortItems(sortOrder === 'asc' ? 'desc' : 'asc')
    }

    // Estilo dinámico para el grid de la tabla basado en los anchos de columna
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
                        onTransactionAdded={() => {
                            fetchCategoryData()
                            onDataChanged?.()
                        }}
                        variant="default"
                        className="w-auto px-4 py-2 text-sm h-9"
                        defaultCategoryId={category.categoryId}
                        subcategories={subcategories}
                    />
                    
                    {/* Botón de crear subcategoría (solo si withSubcategory es true) */}
                    {category.withSubcategory && (
                        <button
                            onClick={() => setOpenAddSubcategoryModal(true)}
                            className="w-auto px-4 py-2 text-sm h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition select-none"
                        >
                            + Crear Subcategoría
                        </button>
                    )}
                </div>

                {/* Botón de Cerrar */}
                <CloseButton onClick={onCancel} />
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
                            onEditSubcategory={setEditingSubcategory}
                            onViewSubcategory={setViewingSubcategory}
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
                        onDataChanged?.()
                    }}
                    mode={category.type === 'expense' ? 'expenses' : 'incomes'}
                    subcategories={subcategories}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            <DeleteTransactionModal
                isOpen={!!deletingId}
                isDeleting={isDeleting}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleDelete}
            />
            
            {/* Modal de Añadir Subcategoría */}
            <AddSubcategoryModal
                open={openAddSubcategoryModal}
                categoryId={category.categoryId}
                onCancel={() => setOpenAddSubcategoryModal(false)}
                onAccept={() => {
                    setOpenAddSubcategoryModal(false)
                    fetchCategoryData()
                    onDataChanged?.()
                }}
            />
            
            {/* Modal de Editar Subcategoría */}
            {editingSubcategory && (
                <EditSubcategoryModal
                    open={true}
                    subcategory={editingSubcategory}
                    onCancel={() => setEditingSubcategory(null)}
                    onAccept={() => {
                        setEditingSubcategory(null)
                        fetchCategoryData()
                        onDataChanged?.()
                    }}
                />
            )}
            
            {/* Modal de Ver Subcategoría */}
            {viewingSubcategory && (
                <ViewSubcategoryModal
                    open={true}
                    subcategory={{ ...viewingSubcategory, categoryId: category.categoryId }}
                    categoryType={category.type}
                    onCancel={() => setViewingSubcategory(null)}
                    onTransactionChanged={() => {
                        fetchCategoryData()
                        onDataChanged?.()
                    }}
                    subcategories={subcategories}
                />
            )}
        </Modal>
    )
}
