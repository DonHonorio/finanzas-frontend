import { formatCurrency, formatDate, monthNames } from "@/src/lib/utils"
import { CategoryItem } from "@/src/types/category-types"
import { Transaction } from "@/src/types/transaction-types"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"

type CategoryTableRowsProps = {
    items: CategoryItem[]
    gridStyle: React.CSSProperties
    onEditTransaction: (transaction: Transaction) => void
    onDeleteTransaction: (transactionId: string) => void
}

export function CategoryTableRows({ 
    items, 
    gridStyle, 
    onEditTransaction, 
    onDeleteTransaction 
}: CategoryTableRowsProps) {
    const calculateYearTotal = (monthlyData: CategoryItem['monthlyData']) => {
        return Object.values(monthlyData).reduce((sum, val) => sum + val, 0)
    }

    return (
        <div className="space-y-1 px-5 py-2">
            {items.map((item) => {
                const yearTotal = calculateYearTotal(item.monthlyData)
                return (
                    <div
                        key={item.id}
                        className="grid gap-2 items-center hover:bg-gray-50 rounded-lg p-2 transition-colors text-sm group"
                        style={gridStyle}
                    >
                        {/* Fecha */}
                        <div className="text-gray-500 text-xs truncate text-center">
                            {formatDate(item.date)}
                        </div>

                        {/* Nombre */}
                        <div className="flex items-center justify-start gap-2 font-medium text-gray-700 truncate pr-2">
                            {item.color && (
                                <div
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                            )}
                            <span className="truncate" title={item.name}>{item.name}</span>
                            {item.type === 'subcategory' && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full shrink-0">
                                    Sub
                                </span>
                            )}
                            
                            {/* Botones de acción (visibles en hover) */}
                            {item.type === 'transaction' && item.originalTransaction && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={(e) => { 
                                            e.stopPropagation()
                                            onEditTransaction(item.originalTransaction!)
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
                                            onDeleteTransaction(item.originalTransaction!.transactionId)
                                        }}
                                        title="Eliminar"
                                        className="h-7 w-7 p-0"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Presupuesto */}
                        <div className="text-center font-medium truncate">
                            {item.type === 'subcategory' && item.budget > 0 ? (
                                <span className="text-gray-900">{formatCurrency(item.budget)}</span>
                            ) : (
                                <span className="text-gray-300"></span>
                            )}
                        </div>

                        {/* Months */}
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
                                        ? amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : '0,00'
                                    }
                                </div>
                            )
                        })}

                        {/* Total */}
                        <div className="text-center font-bold text-gray-900 truncate">
                            {yearTotal > 0 && formatCurrency(yearTotal)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
