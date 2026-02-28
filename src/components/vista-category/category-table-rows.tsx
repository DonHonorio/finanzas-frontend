'use client'

import { formatCurrency, formatDate, monthNames } from "@/src/lib/utils"
import { CategoryItem, Subcategory } from "@/src/types/category-types"
import { Transaction } from "@/src/types/transaction-types"
import { Eye, List, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

type CategoryTableRowsProps = {
    items: CategoryItem[]  // Array unificado: puede contener subcategorías o transacciones
    gridStyle: React.CSSProperties  // Anchos de columna dinámicos
    onEditTransaction: (transaction: Transaction) => void
    onDeleteTransaction: (transactionId: string) => void
    onEditSubcategory: (subcategory: Subcategory) => void
    onViewSubcategory?: (subcategory: Subcategory) => void
}

export function CategoryTableRows({ 
    items, 
    gridStyle, 
    onEditTransaction, 
    onDeleteTransaction,
    onEditSubcategory,
    onViewSubcategory
}: CategoryTableRowsProps) {
    const t = useTranslations("CategoryTable")
    const tMonth = useTranslations("MonthShort")
    const locale = useLocale()
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

    const calculateYearTotal = (monthlyData: CategoryItem['monthlyData']) => {
        return Object.values(monthlyData).reduce((sum, val) => sum + val, 0)
    }

    const toggleDetails = (itemId: string) => {
        setExpandedItemId(prev => prev === itemId ? null : itemId)
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

    return (
        <div className="space-y-1 px-5 py-2">
            {items.map((item) => {
                const yearTotal = calculateYearTotal(item.monthlyData)
                const isDetailOpen = expandedItemId === item.id
                const monthlyRows = monthNames.map((month) => ({ month, amount: item.monthlyData[month] ?? 0 }))
                const transactionRows = item.type === "transaction" ? getTransactionMonthlyRows(item) : []

                return (
                    <div key={item.id} className="space-y-1">
                        <div
                            className="grid gap-2 items-center hover:bg-gray-50 rounded-lg p-2 transition-colors text-sm group"
                            style={gridStyle}
                        >
                            {/* Fecha - solo relevante para transacciones */}
                            <div className="text-gray-500 text-xs truncate text-center">
                                {formatDate(item.date)}
                            </div>

                            {/* Nombre con indicadores visuales */}
                            <div className="flex items-center justify-start gap-2 font-medium text-gray-700 truncate pr-2">
                                {item.color && (
                                    <div
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                )}
                                <span className="truncate" title={item.name}>{item.name}</span>
                                
                                {/* Badge identificador para subcategorías */}
                                {item.type === 'subcategory' && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full shrink-0">
                                        {t("subBadge")}
                                    </span>
                                )}
                                
                                {/* Botones de acción - aparecen en hover según el tipo de item */}
                                
                                {/* Para SUBCATEGORÍAS: detalle, ver y editar */}
                                {item.type === 'subcategory' && item.originalSubcategory && (
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleDetails(item.id)
                                            }}
                                            title={isDetailOpen ? t("hideDetail") : t("viewDetail")}
                                            aria-expanded={isDetailOpen}
                                            className="h-6 w-6 p-0"
                                        >
                                            <List className="h-3.5 w-3.5 text-primary" />
                                        </Button>
                                        {onViewSubcategory && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={(e) => { 
                                                    e.stopPropagation()
                                                    onViewSubcategory(item.originalSubcategory!)
                                                }}
                                                title={t("viewSubcategoryTransactions")}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Eye className="h-3.5 w-3.5 text-primary" />
                                            </Button>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={(e) => { 
                                                e.stopPropagation()
                                                onEditSubcategory(item.originalSubcategory!)
                                            }}
                                            title={t("editSubcategory")}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-primary" />
                                        </Button>
                                    </div>
                                )}
                                
                                {/* Para TRANSACCIONES: detalle, editar y eliminar */}
                                {item.type === 'transaction' && item.originalTransaction && (
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleDetails(item.id)
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
                                                onEditTransaction(item.originalTransaction!)
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
                                                onDeleteTransaction(item.originalTransaction!.transactionId)
                                            }}
                                            title={t("delete")}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Presupuesto - solo visible para subcategorías con presupuesto */}
                            <div className="text-center font-medium truncate">
                                {item.type === 'subcategory' && item.budget > 0 ? (
                                    <span className="text-gray-900">{formatCurrency(item.budget)}</span>
                                ) : (
                                    <span className="text-gray-300"></span>
                                )}
                            </div>

                            {/* Columnas de meses (12) - con color diferenciado si hay actividad */}
                            {monthNames.map(month => {
                                const amount = item.monthlyData[month]
                                const isActive = amount > 0
                                return (
                                    <div
                                        key={month}
                                        className={`
                                            text-center py-1.5 rounded-md text-xs font-medium transition-colors truncate
                                            ${isActive
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 text-transparent'
                                            }
                                        `}
                                    >
                                        {isActive 
                                            ? amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : (0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        }
                                    </div>
                                )
                            })}

                            {/* Total anual */}
                            <div className="text-center font-bold text-gray-900 truncate">
                                {yearTotal > 0 && formatCurrency(yearTotal)}
                            </div>
                        </div>

                        {isDetailOpen && item.type === "subcategory" && (
                            <div className="rounded-lg bg-muted/30 p-2">
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
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
                        )}

                        {isDetailOpen && item.type === "transaction" && transactionRows.length > 0 && (
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
                        )}
                    </div>
                )
            })}
        </div>
    )
}
