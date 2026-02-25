import { useState } from 'react'
import { Transaction } from '@/src/types/transaction-types'
import { getSubcategoryTransactions } from '@/src/data-layer/transactions'

/**
 * Hook para manejar la obtención de transacciones de una subcategoría
 */
export function useSubcategoryTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)

    /**
     * Obtiene las transacciones de una subcategoría y las ordena por fecha
     */
    const fetchTransactions = async (
        categoryId: number | undefined,
        subcategoryId: number | undefined,
        sortOrder: 'asc' | 'desc' = 'desc'
    ) => {
        if (!categoryId || !subcategoryId) return

        setLoading(true)
        try {
            const data = await getSubcategoryTransactions(categoryId, subcategoryId)
            // Ordenar por fecha según sortOrder actual
            const sorted = data.sort((a, b) => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
            })
            setTransactions(sorted)
        } catch (error) {
            console.error('Error fetching subcategory transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        transactions,
        loading,
        fetchTransactions,
        setTransactions
    }
}
