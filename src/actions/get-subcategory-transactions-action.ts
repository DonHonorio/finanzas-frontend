"use server"

import { getToken } from "../auth/token"
import { Transaction } from "../types/transaction-types"

// Server action para obtener transacciones de una subcategoría específica
export async function getSubcategoryTransactions(categoryId: number, subcategoryId: number): Promise<Transaction[]> {
    const token = await getToken()

    // Endpoint con doble anidamiento: GET /categories/{categoryId}/subcategories/{subcategoryId}/transactions
    const url = `${process.env.API_URL}/categories/${categoryId}/subcategories/${subcategoryId}/transactions`

    if (!token) return []

    try {
        const req = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!req.ok) {
            console.error("Error fetching subcategory transactions:", await req.text())
            return []
        }

        const data = await req.json()
        return data.transactions || [] // API devuelve { transactions: [...] }
    } catch (error) {
        console.error("Error in getSubcategoryTransactions action:", error)
        return []
    }
}