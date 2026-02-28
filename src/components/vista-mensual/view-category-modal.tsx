'use client'

import { Modal } from "@/src/components/ui/modal"
import { CategoryRow } from "@/src/types/dashboard-types"
import { Category, CategoryItem, Subcategory } from "@/src/types/category-types"
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
import { ViewSubcategoryModal } from "./view-subcategory-modal"
import { CloseButton } from "@/src/components/ui/close-button"
import { useLocale, useTranslations } from "next-intl"
import { useResponsive } from "@/src/hooks/use-responsive"
import { formatCurrency, formatDate, monthNames } from "@/src/lib/utils"
import { Eye, List, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"

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
    const t = useTranslations("CategoryModal")
    const tTable = useTranslations("CategoryTable")
    const tMonth = useTranslations("MonthShort")
    const tStatus = useTranslations("CommonStatus")
    const locale = useLocale()
    const { isDesktop } = useResponsive()
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
    const [expandedMobileItemId, setExpandedMobileItemId] = useState<string | null>(null)

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
                toast.success(t("transactionDeleted"))
                setDeletingId(null)
                fetchCategoryData()
                onDataChanged?.()
            }
        } catch (error) {
            console.error('Error deleting transaction:', error)
            toast.error(t("transactionDeleteError"))
        } finally {
            setIsDeleting(false)
        }
    }

    // Alterna el orden de clasificación de las transacciones
    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        sortItems(sortOrder === 'asc' ? 'desc' : 'asc')
    }

    const toggleMobileDetails = (itemId: string) => {
        setExpandedMobileItemId(prev => prev === itemId ? null : itemId)
    }

    const getTransactionMonthlyRows = (item: CategoryItem) => {
        const activeRows = monthNames
            .map((month) => ({ month, amount: item.monthlyData[month] ?? 0 }))
            .filter((row) => row.amount > 0)

        if (activeRows.length > 0) return activeRows

        if (item.originalTransaction) {
            const date = new Date(item.originalTransaction.date)
            const month = monthNames[Number.isNaN(date.getTime()) ? 0 : date.getMonth()]
            return [{ month, amount: Math.abs(Number(item.originalTransaction.amount) || 0) }]
        }

        return []
    }

    const renderMobileDetail = (item: CategoryItem) => {
        if (expandedMobileItemId !== item.id) return null

        if (item.type === "subcategory") {
            const monthlyRows = monthNames.map((month) => ({ month, amount: item.monthlyData[month] ?? 0 }))

            return (
                <div className="rounded-lg bg-muted/30 p-2">
                    <div className="grid grid-cols-2 gap-1.5">
                        {monthlyRows.map(({ month, amount }) => (
                            <div
                                key={`${item.id}-${month}`}
                                className={`flex items-center justify-between rounded-md px-2 py-1 text-xs font-medium ${amount > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}
                            >
                                <span>{tMonth(month)}</span>
                                <span>{formatCurrency(amount, { locale })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        const transactionRows = getTransactionMonthlyRows(item)

        if (transactionRows.length === 0) return null

        return (
            <div className="rounded-lg bg-muted/30 p-2">
                {transactionRows.map(({ month, amount }) => (
                    <div
                        key={`${item.id}-${month}`}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold bg-amber-100 text-amber-800"
                    >
                        <span>{tMonth(month)}</span>
                        <span>{formatCurrency(amount, { locale, currency: item.originalTransaction?.currency })}</span>
                    </div>
                ))}
            </div>
        )
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
            <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b shrink-0 gap-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    {/* Título */}
                    <h2 className="text-lg sm:text-2xl font-semibold flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl">{category.icon}</span>
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
                        className="w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm h-8 sm:h-9"
                        defaultCategoryId={category.categoryId}
                        subcategories={subcategories}
                    />

                    {/* Botón de crear subcategoría (solo si withSubcategory es true) */}
                    {category.withSubcategory && (
                        <button
                            onClick={() => setOpenAddSubcategoryModal(true)}
                            className="w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm h-8 sm:h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition select-none"
                        >
                            {t("createSubcategory")}
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
                        <p className="text-gray-500">{tStatus("loadingShort")}</p>
                    </div>
                ) : items.length === 0 ? (
                    /* Estado Vacío */
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">{t("empty")}</p>
                    </div>
                ) : isDesktop ? (
                    /* Desktop (≥1536px): tabla completa de 16 columnas */
                    <div>
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
                ) : (
                    /* Móvil/Tablet (<1536px): lista de cards sin scroll horizontal */
                    <div className="space-y-1 px-4 py-2">
                        {items.map((item) => {
                            const yearTotal = Object.values(item.monthlyData).reduce((sum, val) => sum + val, 0)
                            const isDetailOpen = expandedMobileItemId === item.id
                            return (
                                <div key={item.id} className="space-y-1">
                                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                        {/* Color dot (subcategorías) */}
                                        {item.color && (
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                        )}

                                        {/* Nombre y fecha */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className="text-sm font-medium text-gray-700 truncate" title={item.name}>{item.name}</span>
                                                {item.type === 'subcategory' && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full shrink-0">Sub</span>
                                                )}
                                            </div>
                                            {item.type === 'transaction' && (
                                                <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                                            )}
                                        </div>

                                        {/* Total + botones de acción */}
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            {yearTotal > 0 && (
                                                <span className="text-sm font-semibold text-gray-900 mr-1">
                                                    {formatCurrency(yearTotal, { locale })}
                                                </span>
                                            )}

                                            {item.type === 'subcategory' && item.originalSubcategory && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => toggleMobileDetails(item.id)}
                                                        title={isDetailOpen ? tTable("hideDetail") : tTable("viewDetail")}
                                                        aria-expanded={isDetailOpen}
                                                    >
                                                        <List className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => setViewingSubcategory(item.originalSubcategory!)}
                                                        title={tTable("viewSubcategoryTransactions")}
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => setEditingSubcategory(item.originalSubcategory!)}
                                                        title={tTable("editSubcategory")}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                </>
                                            )}

                                            {item.type === 'transaction' && item.originalTransaction && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => toggleMobileDetails(item.id)}
                                                        title={isDetailOpen ? tTable("hideDetail") : tTable("viewDetail")}
                                                        aria-expanded={isDetailOpen}
                                                    >
                                                        <List className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => setEditingTransaction(item.originalTransaction!)}
                                                        title={tTable("edit")}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => setDeletingId(item.originalTransaction!.transactionId)}
                                                        title={tTable("delete")}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {renderMobileDetail(item)}
                                </div>
                            )
                        })}
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
