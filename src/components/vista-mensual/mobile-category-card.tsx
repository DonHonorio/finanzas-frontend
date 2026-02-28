'use client'

import { Eye, Edit2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CategoryRow, Month } from '@/src/types/dashboard-types'
import { Button } from '@/src/components/ui/button'
import { formatCurrency } from '@/src/lib/utils'
import { months } from '@/src/lib/utils'
import { getCellColor } from '@/src/helpers/dashboard-helpers'

type Props = {
    row: CategoryRow
    onView: (category: CategoryRow) => void
    onEdit: (category: CategoryRow) => void
    onViewDetails: (category: CategoryRow) => void
}

// Devuelve los 3 meses con mayor actividad (valor absoluto) de la categoría
function topMonths(row: CategoryRow): Month[] {
    return months
        .filter(m => row.months[m] !== 0)
        .sort((a, b) => Math.abs(row.months[b]) - Math.abs(row.months[a]))
        .slice(0, 3)
}

// Suma todos los meses para obtener el total anual de la categoría
function yearTotal(row: CategoryRow): number {
    return months.reduce((sum, m) => sum + (row.months[m] || 0), 0)
}

export function MobileCategoryCard({ row, onView, onEdit, onViewDetails }: Props) {
    const t = useTranslations('Dashboard')
    const tMonth = useTranslations('MonthShort')
    const active = topMonths(row)

    return (
        <div className="bg-white rounded-xl border border-border p-4 flex flex-col gap-3 shadow-sm">

            {/* Fila superior: color + icono + nombre + botones */}
            <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                />
                <span className="text-lg leading-none">{row.icon}</span>
                <span className="font-semibold text-gray-900 flex-1 truncate">{row.name}</span>
                <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onView(row)}>
                        <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                        <Edit2 className="h-4 w-4 text-primary" />
                    </Button>
                </div>
            </div>

            {/* Fila media: presupuesto y total anual */}
            <div className="flex gap-3 text-sm">
                <div className="flex-1 bg-muted/40 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500 mb-0.5">{t('budget')}</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(row.budget)}</p>
                </div>
                <div className="flex-1 bg-secondary/30 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500 mb-0.5">{t('yearTotal')}</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(yearTotal(row))}</p>
                </div>
            </div>

            {/* Fila inferior: 3 meses más activos */}
            {active.length > 0 && (
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400">{t('activeMonths')}</p>
                    <div className="flex gap-2">
                        {active.map(m => (
                            <div
                                key={m}
                                className={`flex-1 rounded-lg px-2 py-1.5 text-center text-xs font-medium ${getCellColor(row.months[m], row.budget, row.type === 'expense')}`}
                            >
                                <p className="text-gray-500">{tMonth(m)}</p>
                                <p className="font-semibold">{formatCurrency(row.months[m])}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Botón ver detalles */}
            <button
                onClick={() => onViewDetails(row)}
                className="w-full text-sm text-primary font-medium border border-primary/30 rounded-lg py-2 hover:bg-primary/5 transition-colors"
            >
                {t('viewDetails')}
            </button>
        </div>
    )
}
