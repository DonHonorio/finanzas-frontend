import { Transaction } from "@/src/types/transaction-types"
import { formatDate } from "@/src/lib/utils"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"

type SubcategoryTransactionsTableProps = {
    loading: boolean
    transactions: Transaction[]
    gridStyle: React.CSSProperties
    sortOrder: 'asc' | 'desc'
    onToggleSort: () => void
    onStartResize: (index: number, e: React.MouseEvent) => void
    onEditTransaction: (transaction: Transaction) => void
    onDeleteTransaction: (transactionId: string) => void
}

/**
 * Componente que muestra la tabla de transacciones de una subcategoría
 * Incluye estados de carga, vacío y tabla con datos
 */
export function SubcategoryTransactionsTable({
    loading,
    transactions,
    gridStyle,
    sortOrder,
    onToggleSort,
    onStartResize,
    onEditTransaction,
    onDeleteTransaction
}: SubcategoryTransactionsTableProps) {
    if (loading) {
        /* Estado de Carga */
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Cargando...</p>
            </div>
        )
    }

    if (transactions.length === 0) {
        /* Estado Vacío */
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No hay transacciones en esta subcategoría</p>
            </div>
        )
    }

    /* Contenido de la Tabla */
    return (
        <div className="min-w-fit">
            {/* Header */}
            <div
                className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b grid gap-2 text-sm text-gray-400 font-medium"
                style={gridStyle}
            >
                {/* Fecha - con ordenación */}
                <div className="flex items-center justify-center relative group">
                    <button onClick={onToggleSort} className="hover:text-gray-600 flex items-center gap-1">
                        FECHA
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    </button>
                    <div onMouseDown={(e) => onStartResize(0, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                        <div className="w-1 h-full bg-blue-200"></div>
                    </div>
                </div>

                {/* Nombre */}
                <div className="flex items-center justify-start relative group">
                    NOMBRE
                    <div onMouseDown={(e) => onStartResize(1, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                        <div className="w-1 h-full bg-blue-200"></div>
                    </div>
                </div>

                {/* Monto - no redimensionable */}
                <div className="flex items-center justify-center">
                    MONTO
                </div>
            </div>

            {/* Rows */}
            <div className="space-y-1 px-5 py-2">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.transactionId}
                        className="grid gap-2 items-center hover:bg-gray-50 rounded-lg p-2 transition-colors text-sm group"
                        style={gridStyle}
                    >
                        {/* Fecha */}
                        <div className="text-gray-500 text-xs truncate text-center">
                            {formatDate(transaction.date)}
                        </div>

                        {/* Nombre con botones de acción */}
                        <div className="flex items-center justify-start gap-2 font-medium text-gray-700 truncate pr-2">
                            <span className="truncate" title={transaction.name}>{transaction.name}</span>

                            {/* Botones de acción - visibles solo en hover de la fila */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEditTransaction(transaction)
                                    }}
                                    title="Editar"
                                    className="h-7 w-7 p-0"
                                >
                                    <Pencil className="h-4 w-4 text-primary" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDeleteTransaction(transaction.transactionId)
                                    }}
                                    title="Eliminar"
                                    className="h-7 w-7 p-0"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>

                        {/* Monto */}
                        <div className="text-center py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 truncate">
                            {Math.abs(transaction.amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
