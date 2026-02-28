'use client'

import { Transaction } from "@/src/types/transaction-types"
import { formatCurrency, formatDate, monthNames } from "@/src/lib/utils"
import { List, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useLocale, useTranslations } from "next-intl"
import { useResponsive } from "@/src/hooks/use-responsive"
import { useState } from "react"

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
 * En móvil (<768px): 2 columnas (nombre+fecha / monto). En tablet/desktop: 3 columnas.
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
    const t = useTranslations("CategoryTable")
    const tMonth = useTranslations("MonthShort")
    const tStatus = useTranslations("CommonStatus")
    const locale = useLocale()
    const { isMobile } = useResponsive()
    const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null)

    const mobileGridStyle: React.CSSProperties = { gridTemplateColumns: '1fr 90px' }

    const toggleDetails = (transactionId: string) => {
        setExpandedTransactionId(prev => prev === transactionId ? null : transactionId)
    }

    const getTransactionMonthlyRows = (transaction: Transaction) => {
        const date = new Date(transaction.date)
        const fallbackMonth = monthNames[Number.isNaN(date.getTime()) ? 0 : date.getMonth()]
        return [{ month: fallbackMonth, amount: Math.abs(transaction.amount) }]
    }

    if (loading) {
        /* Estado de Carga */
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">{tStatus("loadingShort")}</p>
            </div>
        )
    }

    if (transactions.length === 0) {
        /* Estado Vacío */
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">{t("emptySubcategory")}</p>
            </div>
        )
    }

    /* Contenido de la Tabla */
    return (
        <div className="min-w-0">
            {/* Header */}
            {isMobile ? (
                /* Móvil: 2 columnas (nombre / monto) */
                <div
                    className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2 border-b grid gap-2 text-sm text-gray-400 font-medium"
                    style={mobileGridStyle}
                >
                    <div>{t("name")}</div>
                    <div className="text-center">{t("amount")}</div>
                </div>
            ) : (
                /* Tablet/Desktop: 3 columnas (fecha / nombre / monto) */
                <div
                    className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b grid gap-2 text-sm text-gray-400 font-medium"
                    style={gridStyle}
                >
                    {/* Fecha - con ordenación */}
                    <div className="flex items-center justify-center relative group">
                        <button onClick={onToggleSort} className="hover:text-gray-600 flex items-center gap-1">
                            {t("date")}
                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        </button>
                        <div onMouseDown={(e) => onStartResize(0, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                            <div className="w-1 h-full bg-blue-200"></div>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div className="flex items-center justify-start relative group">
                        {t("name")}
                        <div onMouseDown={(e) => onStartResize(1, e)} className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 opacity-0 group-hover:opacity-100 flex justify-center">
                            <div className="w-1 h-full bg-blue-200"></div>
                        </div>
                    </div>

                    {/* Monto - no redimensionable */}
                    <div className="flex items-center justify-center">
                        {t("amount")}
                    </div>
                </div>
            )}

            {/* Rows */}
            <div className="space-y-1 px-4 py-2">
                {transactions.map((transaction) => {
                    const isDetailOpen = expandedTransactionId === transaction.transactionId
                    const transactionRows = getTransactionMonthlyRows(transaction)

                    return (
                        <div key={transaction.transactionId} className="space-y-1">
                            {isMobile ? (
                                /* Móvil: nombre+fecha en col 1, monto en col 2 */
                                <div
                                    className="grid gap-2 items-center hover:bg-gray-50 rounded-lg p-2 transition-colors text-sm group"
                                    style={mobileGridStyle}
                                >
                                    {/* Nombre + fecha + botones */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-medium text-gray-700 truncate" title={transaction.name}>{transaction.name}</span>
                                                <div className="flex items-center gap-0.5 ml-auto shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); toggleDetails(transaction.transactionId) }}
                                                        title={isDetailOpen ? t("hideDetail") : t("viewDetail")}
                                                        aria-expanded={isDetailOpen}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <List className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); onEditTransaction(transaction) }}
                                                        title={t("edit")}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 text-primary" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); onDeleteTransaction(transaction.transactionId) }}
                                                        title={t("delete")}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                                        </div>
                                    </div>

                                    {/* Monto */}
                                    <div className="text-center py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 truncate">
                                        {Math.abs(transaction.amount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ) : (
                                /* Tablet/Desktop: 3 columnas */
                                <div
                                    className="grid gap-2 items-center hover:bg-gray-50 rounded-lg p-2 transition-colors text-sm group"
                                    style={gridStyle}
                                >
                                    {/* Fecha */}
                                    <div className="text-gray-500 text-xs truncate text-center">
                                        {formatDate(transaction.date)}
                                    </div>

                                    {/* Nombre con botones de acción */}
                                    <div className="flex items-center justify-start gap-2 font-medium text-gray-700 min-w-0 pr-2">
                                        <span className="truncate" title={transaction.name}>{transaction.name}</span>

                                        {/* Botones de acción - visibles solo en hover de la fila */}
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleDetails(transaction.transactionId)
                                                }}
                                                title={isDetailOpen ? t("hideDetail") : t("viewDetail")}
                                                aria-expanded={isDetailOpen}
                                                className="h-6 w-6 p-0"
                                            >
                                                <List className="h-3.5 w-3.5 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onEditTransaction(transaction)
                                                }}
                                                title={t("edit")}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Pencil className="h-3.5 w-3.5 text-primary" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDeleteTransaction(transaction.transactionId)
                                                }}
                                                title={t("delete")}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Monto */}
                                    <div className="text-center py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 truncate">
                                        {Math.abs(transaction.amount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            )}

                            {isDetailOpen && (
                                <div className="rounded-lg bg-muted/30 p-2">
                                    {transactionRows.map(({ month, amount }) => (
                                        <div
                                            key={`${transaction.transactionId}-${month}`}
                                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold bg-amber-100 text-amber-800"
                                        >
                                            <span>{tMonth(month)}</span>
                                            <span>{formatCurrency(amount, { locale, currency: transaction.currency })}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
