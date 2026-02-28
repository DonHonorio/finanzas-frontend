'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryRow } from '@/src/types/dashboard-types'
import { MobileCategoryCard } from './mobile-category-card'
import { MobileDetailModal } from './mobile-detail-modal'
import { ViewCategoryModal } from './view-category-modal'
import { EditCategoryModal } from './edit-category-modal'
import { formatCurrency, months } from '@/src/lib/utils'

type Props = {
    data: CategoryRow[]
    mode: 'expenses' | 'incomes'
    mutate: () => void
}

// Suma todos los meses para obtener el total anual de todas las categorías
function grandTotal(data: CategoryRow[]): number {
    return data.reduce((sum, row) =>
        sum + months.reduce((s, m) => s + (row.months[m] || 0), 0), 0
    )
}

// Vista de tarjetas para pantallas móviles (<768px)
// Gestiona los mismos modales de view/edit que el dashboard de escritorio
export function MobileCategoryView({ data, mode, mutate }: Props) {
    const t = useTranslations('Dashboard')

    const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null)
    const [modalType, setModalType] = useState<'view' | 'edit' | 'detail' | null>(null)

    const handleCloseModal = () => {
        setModalType(null)
        setSelectedCategory(null)
    }

    return (
        <div className="flex flex-col h-full">

            {/* Lista de tarjetas desplazable */}
            <div className="flex-1 overflow-auto no-scrollbar px-3 py-3 flex flex-col gap-3">
                {data.map(row => (
                    <MobileCategoryCard
                        key={row.categoryId}
                        row={row}
                        onView={cat => { setSelectedCategory(cat); setModalType('view') }}
                        onEdit={cat => { setSelectedCategory(cat); setModalType('edit') }}
                        onViewDetails={cat => { setSelectedCategory(cat); setModalType('detail') }}
                    />
                ))}
            </div>

            {/* Footer con el total anual global — sticky al fondo */}
            <div className="shrink-0 border-t border-border bg-sidebar-accent px-4 py-3 flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-600">{t('yearTotal')}</span>
                <span className="text-gray-900">{formatCurrency(grandTotal(data))}</span>
            </div>

            {/* Modal: desglose mensual de una categoría */}
            {modalType === 'detail' && selectedCategory && (
                <MobileDetailModal
                    open
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                />
            )}

            {/* Modal: visualizar categoría completa (igual que en desktop) */}
            {modalType === 'view' && selectedCategory && (
                <ViewCategoryModal
                    open
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                    onDataChanged={mutate}
                />
            )}

            {/* Modal: editar categoría (igual que en desktop) */}
            {modalType === 'edit' && selectedCategory && (
                <EditCategoryModal
                    open
                    category={selectedCategory}
                    onCancel={handleCloseModal}
                    onAccept={() => { mutate(); handleCloseModal() }}
                />
            )}
        </div>
    )
}
