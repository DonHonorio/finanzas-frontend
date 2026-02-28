'use client'

import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/src/components/ui/modal'
import { CategoryRow } from '@/src/types/dashboard-types'
import { formatCurrency, months } from '@/src/lib/utils'
import { getCellColor } from '@/src/helpers/dashboard-helpers'

type Props = {
    open: boolean
    category: CategoryRow
    onCancel: () => void
}

// Modal que muestra el desglose de los 12 meses de una categoría (para móvil)
export function MobileDetailModal({ open, category, onCancel }: Props) {
    const t = useTranslations('Dashboard')
    const tMonth = useTranslations('MonthShort')

    return (
        <Modal open={open} onCancel={onCancel} className="w-[90vw] max-w-sm">

            {/* Cabecera */}
            <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-border">
                <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                />
                <span className="text-lg leading-none">{category.icon}</span>
                <h2 className="flex-1 font-bold text-gray-900 truncate">{category.name}</h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition shrink-0"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Título de sección */}
            <p className="px-5 pt-3 text-xs text-gray-500 font-medium">{t('monthlyBreakdown')}</p>

            {/* Grid de 12 meses */}
            <div className="px-5 pb-5 pt-2 flex flex-col gap-1.5">
                {months.map(m => (
                    <div
                        key={m}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${getCellColor(category.months[m], category.budget, category.type === 'expense')}`}
                    >
                        <span className="text-gray-600 font-medium">{tMonth(m)}</span>
                        <span className="font-semibold">{formatCurrency(category.months[m])}</span>
                    </div>
                ))}
            </div>

        </Modal>
    )
}
