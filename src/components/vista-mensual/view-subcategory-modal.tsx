'use client'

import { Modal } from "@/src/components/ui/modal"
import { Subcategory } from "@/src/types/category-types"
import { useEffect, useState } from "react"
import { getAccounts } from "@/src/data-layer/accounts"
import { getCategories } from "@/src/data-layer/categories"
import { Account } from "@/src/types/account-types"
import { AddTransactionButton } from "@/src/components/ui/add-transaction-button"
import { Transaction } from "@/src/types/transaction-types"
import { EditTransactionModal } from "./edit-transaction-modal"
import { DeleteTransactionModal } from "@/src/components/ui/delete-transaction-modal"
import { ColumnConfig } from "@/src/types/general-types"
import { formatCurrency } from "@/src/lib/utils"
import { Category } from "@/src/types/category-types"
import { useSubcategoryTransactions } from "@/src/hooks/use-subcategory-transactions"
import { useColumnResize } from "@/src/hooks/use-column-resize"
import { useDeleteTransaction } from "@/src/hooks/use-delete-transaction"
import { SubcategoryTransactionsTable } from "./subcategory-transactions-table"
import { CloseButton } from "@/src/components/ui/close-button"
import { useTranslations } from "next-intl"

type Props = {
    open: boolean
    subcategory: Subcategory & { categoryId: number }  // Subcategoría con ID de categoría padre
    categoryType: 'expense' | 'income'
    onCancel: () => void
    onTransactionChanged?: () => void
    subcategories?: Subcategory[]
}

// Configuración de columnas: ancho inicial y mínimo para cada columna
const COLUMNS_SETUP: ColumnConfig[] = [
    { initial: 10, min: 5 },     // 0: Fecha
    { initial: 60, min: 20 },    // 1: Nombre
    { initial: 20, min: 10 }     // 2: Monto
]

export function ViewSubcategoryModal({ open, subcategory, categoryType, onCancel, onTransactionChanged, subcategories }: Props) {
    const t = useTranslations("SubcategoryModal")
    // Estado para el orden de las transacciones (ascendente/descendente)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    
    // Hooks personalizados
    const { transactions, loading, fetchTransactions } = useSubcategoryTransactions()
    const { colWidths, tableContainerRef, startResize } = useColumnResize(COLUMNS_SETUP)
    const { deletingId, isDeleting, setDeletingId, handleDelete: deleteTransactionHandler } = useDeleteTransaction()

    // Datos necesarios para el modal de creación/edición
    const [accounts, setAccounts] = useState<Account[]>([])
    const [allCategories, setAllCategories] = useState<Category[]>([])

    // Estado para edición
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    // Cargar datos necesarios al abrir el modal o cambiar el orden de las transacciones
    useEffect(() => {
        if (open) {
            getAccounts().then(setAccounts)
            getCategories().then(setAllCategories)
            fetchTransactions(subcategory.categoryId, subcategory.subcategoryId, sortOrder)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, subcategory.subcategoryId, sortOrder])

    // Alterna el orden de clasificación de las transacciones
    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    }

    // Estilo dinámico para el grid de la tabla basado en los anchos de columna
    const gridStyle = {
        gridTemplateColumns: colWidths.map(w => `${w}%`).join(' ')
    }

    // Calcular el total de la subcategoría
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            className="w-[50%] h-[80%] rounded-2xl overflow-hidden flex flex-col"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b shrink-0">
                <div className="flex items-center gap-10">
                    {/* Título con color de la subcategoría */}
                    <h2 className="text-2xl font-semibold flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: subcategory.color }}
                        />
                        {subcategory.name} ({transactions.length})
                    </h2>

                    {/* Botón para añadir transacción - pre-selecciona categoría/subcategoría */}
                    <AddTransactionButton
                        accounts={accounts}
                        categories={allCategories}
                        mode={categoryType === 'expense' ? 'expenses' : 'incomes'}
                        onTransactionAdded={() => {
                            fetchTransactions(subcategory.categoryId, subcategory.subcategoryId, sortOrder)
                            onTransactionChanged?.()
                        }}
                        variant="default"
                        className="w-auto px-4 py-2 text-sm h-9"
                        defaultCategoryId={subcategory.categoryId}
                        defaultSubcategoryId={subcategory.subcategoryId}
                        subcategories={subcategories}
                    />
                </div>

                {/* Botón de Cerrar */}
                <CloseButton onClick={onCancel} />
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white relative min-h-[400px]" ref={tableContainerRef}>
                <SubcategoryTransactionsTable
                    loading={loading}
                    transactions={transactions}
                    gridStyle={gridStyle}
                    sortOrder={sortOrder}
                    onToggleSort={toggleSort}
                    onStartResize={startResize}
                    onEditTransaction={setEditingTransaction}
                    onDeleteTransaction={setDeletingId}
                />
            </div>

            {/* FOOTER con Total */}
            {transactions.length > 0 && (
                <div className="px-6 py-4 border-t shrink-0 flex items-center justify-end gap-8">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-medium">{t("total")}</span>
                        <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>
                </div>
            )}

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
                        fetchTransactions(subcategory.categoryId, subcategory.subcategoryId, sortOrder)
                        onTransactionChanged?.()
                    }}
                    mode={categoryType === 'expense' ? 'expenses' : 'incomes'}
                    subcategories={subcategories}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            <DeleteTransactionModal
                isOpen={!!deletingId}
                isDeleting={isDeleting}
                onCancel={() => setDeletingId(null)}
                onConfirm={() => deleteTransactionHandler(deletingId, subcategory.categoryId, () => {
                    fetchTransactions(subcategory.categoryId, subcategory.subcategoryId, sortOrder)
                    onTransactionChanged?.()
                })}
            />
        </Modal>
    )
}
