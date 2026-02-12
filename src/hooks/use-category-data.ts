import { useState } from "react"
import { CategoryItem, Subcategory } from "@/src/types/category-types"
import { CategoryRow } from "@/src/types/dashboard-types"
import { getSubcategories } from "@/src/actions/get-subcategories-action"
import { getCategoryTransactions } from "@/src/actions/get-category-transactions-action"
import { MonthlyData } from "@/src/types/general-types"
import { monthNames } from "@/src/lib/utils"

export function useCategoryData(category: CategoryRow) {
    const [items, setItems] = useState<CategoryItem[]>([])
    const [loading, setLoading] = useState(false)

    const fetchCategoryData = async () => {
        setLoading(true)
        try {
            // Obtener subcategorías si la categoría las tiene habilitadas
            let subcategories: Subcategory[] = []
            if (category.withSubcategory) {
                subcategories = await getSubcategories(category.categoryId)
            }

            // Obtener transacciones de la categoría
            const transactions = await getCategoryTransactions(category.categoryId)

            // Procesar datos para crear items
            const processedItems: CategoryItem[] = []

            // Agregar subcategorías
            for (const subcat of subcategories) {
                // Calcular gastos mensuales por subcategoría
                const monthlyData: MonthlyData = {
                    enero: 0, febrero: 0, marzo: 0, abril: 0,
                    mayo: 0, junio: 0, julio: 0, agosto: 0,
                    septiembre: 0, octubre: 0, noviembre: 0, diciembre: 0
                }

                // Filtrar transacciones de esta subcategoría
                const subcatTransactions = transactions.filter(
                    t => t.subcategoryId === subcat.subcategoryId
                )

                subcatTransactions.forEach(t => {
                    const date = new Date(t.date)
                    const month = monthNames[date.getMonth()]
                    monthlyData[month] += Math.abs(Number(t.amount))
                })

                processedItems.push({
                    id: `subcat-${subcat.subcategoryId}`,
                    type: 'subcategory',
                    date: '', // Las subcategorías no tienen fecha específica
                    name: subcat.name,
                    budget: Number(subcat.budget),
                    monthlyData,
                    color: subcat.color,
                    originalSubcategory: subcat
                })
            }

            // Agregar transacciones sin subcategoría (o si no usa subcategorías)
            const transactionsToShow = category.withSubcategory
                ? transactions.filter(t => !t.subcategoryId)
                : transactions

            for (const transaction of transactionsToShow) {
                const date = new Date(transaction.date)
                const month = monthNames[date.getMonth()]
                const monthlyData: MonthlyData = {
                    enero: 0, febrero: 0, marzo: 0, abril: 0,
                    mayo: 0, junio: 0, julio: 0, agosto: 0,
                    septiembre: 0, octubre: 0, noviembre: 0, diciembre: 0
                }
                monthlyData[month] = Math.abs(Number(transaction.amount))

                processedItems.push({
                    id: `trans-${transaction.transactionId}`,
                    type: 'transaction',
                    date: transaction.date,
                    name: transaction.name,
                    budget: Number(transaction.amount),
                    monthlyData,
                    originalTransaction: transaction
                })
            }

            setItems(processedItems)
        } catch (error) {
            console.error('Error fetching category data:', error)
        } finally {
            setLoading(false)
        }
    }

    const sortItems = (order: 'asc' | 'desc') => {
        setItems(prev => [...prev].sort((a, b) => {
            if (!a.date) return 1
            if (!b.date) return -1
            const comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
            return order === 'asc' ? comparison : -comparison
        }))
    }

    return {
        items,
        loading,
        fetchCategoryData,
        sortItems
    }
}
